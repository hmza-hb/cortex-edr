import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { supabaseService } from '@/lib/supabase/service';
import { orchestrate } from '@/lib/chat/orchestrate';
import { callAI } from '@/lib/agents/ai-router';

function deriveThreadTitle(params: { message: string }) {
    const cleaned = (params.message || '').trim().replace(/\s+/g, ' ');
    if (!cleaned) return 'Cortex Chat';
    return cleaned.length > 56 ? `${cleaned.slice(0, 56)}…` : cleaned;
}

export async function POST(req: NextRequest) {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();

    const threadId = typeof body?.threadId === 'string' ? body.threadId : '';
    const messageId = typeof body?.messageId === 'string' ? body.messageId : '';
    const action = body?.action === 'edit' || body?.action === 'retry' ? body.action : null;
    const content = typeof body?.content === 'string' ? body.content : undefined;

    if (!threadId || !messageId || !action) {
        return NextResponse.json({ error: 'Bad Request', message: 'threadId, messageId, action are required' }, { status: 400 });
    }

    if (action === 'edit' && !content?.trim()) {
        return NextResponse.json({ error: 'Bad Request', message: 'content is required for edit' }, { status: 400 });
    }

    const { data: thread, error: threadErr } = await supabaseService
        .from('chat_threads')
        .select('id, user_id, last_scan_id, title')
        .eq('id', threadId)
        .eq('user_id', userId)
        .single();

    if (threadErr || !thread) {
        return NextResponse.json({ error: 'Not Found', message: 'Thread not found' }, { status: 404 });
    }

    const { data: target, error: targetErr } = await supabaseService
        .from('chat_messages')
        .select('id, role, content, created_at')
        .eq('id', messageId)
        .eq('thread_id', threadId)
        .eq('user_id', userId)
        .single();

    if (targetErr || !target) {
        return NextResponse.json({ error: 'Not Found', message: 'Message not found' }, { status: 404 });
    }

    if (target.role !== 'user') {
        return NextResponse.json({ error: 'BAD_TARGET', message: 'Only user messages can be edited/retried' }, { status: 400 });
    }

    const editedText = action === 'edit' ? (content || '').trim() : undefined;

    try {
        if (action === 'edit' && editedText && editedText !== target.content) {
            const { error: updateErr } = await supabaseService
                .from('chat_messages')
                .update({ content: editedText })
                .eq('id', messageId)
                .eq('thread_id', threadId)
                .eq('user_id', userId);
            if (updateErr) {
                return NextResponse.json({ error: 'UPDATE_FAILED', message: 'Failed to update message' }, { status: 500 });
            }
        }

        const { error: deleteErr } = await supabaseService
            .from('chat_messages')
            .delete()
            .eq('thread_id', threadId)
            .eq('user_id', userId)
            .gt('created_at', target.created_at);

        if (deleteErr) {
            return NextResponse.json({ error: 'DELETE_FAILED', message: 'Failed to truncate messages' }, { status: 500 });
        }

        const { data: allMessages, error: msgsErr } = await supabaseService
            .from('chat_messages')
            .select('id, role, content, attachments, metadata, created_at')
            .eq('thread_id', threadId)
            .eq('user_id', userId)
            .order('created_at', { ascending: true })
            .limit(200);

        if (msgsErr) {
            return NextResponse.json({ error: 'LOAD_FAILED', message: 'Failed to load messages' }, { status: 500 });
        }

        // Build conversation history for orchestration
        const history = (allMessages || [])
            .filter((m) => m.role === 'user' || m.role === 'assistant')
            .map((m) => ({ role: m.role, content: m.content }));

        // The message to re-process is the edited text or original target content
        const replayMessage = editedText || target.content;

        // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        // ORCHESTRATION ENGINE — intelligent prompt assembly
        // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        const orchestrated = await orchestrate({
            userId,
            message: replayMessage,
            scanId: thread.last_scan_id ? String(thread.last_scan_id) : null,
            history,
        });

        console.log(`[Chat Replay] Orchestrated — Intent: ${orchestrated.debug.intent} | Tokens: ~${orchestrated.debug.tokenEstimate.total}`);

        const aiResult = await callAI(
            'vibe_coder',
            'synthesis',
            orchestrated.systemPrompt,
            orchestrated.userPrompt,
            { scanId: thread.last_scan_id ? String(thread.last_scan_id) : undefined }
        );

        if (aiResult && typeof aiResult === 'object' && aiResult.error === 'AI_SERVICE_UNAVAILABLE') {
            return NextResponse.json(
                {
                    error: 'AI_SERVICE_UNAVAILABLE',
                    message: aiResult.message || 'Cortex AI service temporarily unavailable',
                    threadId,
                    messages: allMessages || []
                },
                { status: 503 }
            );
        }

        const assistantText = typeof aiResult === 'string'
            ? aiResult
            : aiResult?.content
                ? String(aiResult.content)
                : JSON.stringify(aiResult);

        const { error: insertAssistantError } = await supabaseService
            .from('chat_messages')
            .insert({
                thread_id: threadId,
                user_id: userId,
                role: 'assistant',
                content: assistantText,
                metadata: {
                    modelRouting: 'ai-router',
                    replayedFromMessageId: messageId,
                    action,
                    orchestration: {
                        intent: orchestrated.debug.intent,
                        confidence: orchestrated.debug.confidence,
                        tokenEstimate: orchestrated.debug.tokenEstimate.total,
                    }
                }
            });

        if (insertAssistantError) {
            return NextResponse.json({ error: 'INSERT_FAILED', message: 'Failed to store assistant message' }, { status: 500 });
        }

        const { data: finalMessages } = await supabaseService
            .from('chat_messages')
            .select('id, role, content, attachments, metadata, created_at')
            .eq('thread_id', threadId)
            .eq('user_id', userId)
            .order('created_at', { ascending: true })
            .limit(200);

        const { data: firstUser } = await supabaseService
            .from('chat_messages')
            .select('id, content, created_at')
            .eq('thread_id', threadId)
            .eq('user_id', userId)
            .eq('role', 'user')
            .order('created_at', { ascending: true })
            .limit(1)
            .maybeSingle();

        const isFirstUserMessage = firstUser?.id && firstUser.id === messageId;
        if (isFirstUserMessage && editedText) {
            const title = deriveThreadTitle({ message: editedText });
            await supabaseService
                .from('chat_threads')
                .update({ title })
                .eq('id', threadId)
                .eq('user_id', userId);
        }

        return NextResponse.json({ threadId, messages: finalMessages || [] });
    } catch (e) {
        const msg = e instanceof Error ? e.message : 'Unknown error';
        return NextResponse.json({ error: 'REPLAY_FAILED', message: 'Failed to replay message', details: msg }, { status: 500 });
    }
}
