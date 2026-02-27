import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { supabaseService } from '@/lib/supabase/service';
import { buildMegaContext } from '@/lib/chat/mega-context';
import { callAI } from '@/lib/agents/ai-router';

async function ensureThread(params: {
    userId: string;
    threadId?: string | null;
    scanId?: string | null;
    title?: string | null;
}): Promise<{ threadId: string } | { error: string; status: number }> {
    const { userId, threadId, scanId, title } = params;
    if (threadId) return { threadId };

    const { data: thread, error } = await supabaseService
        .from('chat_threads')
        .insert({
            user_id: userId,
            title: title || null,
            last_scan_id: scanId || null
        })
        .select('id')
        .single();

    if (error || !thread) {
        return { error: 'Failed to create chat thread', status: 500 };
    }

    return { threadId: thread.id };
}

export async function GET(req: NextRequest) {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const url = new URL(req.url);
    const threadId = url.searchParams.get('threadId');
    const scanId = url.searchParams.get('scanId');
    const planTier = (url.searchParams.get('planTier') || 'vibe_coder').toLowerCase();
    const email = url.searchParams.get('email') || undefined;
    const name = url.searchParams.get('name') || undefined;

    try {
        const { data: threads } = await supabaseService
            .from('chat_threads')
            .select('id, title, last_scan_id, created_at, updated_at')
            .eq('user_id', userId)
            .order('updated_at', { ascending: false })
            .limit(25);

        const resolvedThreadId = threadId || threads?.[0]?.id || null;

        const { data: messages } = resolvedThreadId
            ? await supabaseService
                .from('chat_messages')
                .select('id, role, content, attachments, metadata, created_at')
                .eq('thread_id', resolvedThreadId)
                .eq('user_id', userId)
                .order('created_at', { ascending: true })
                .limit(200)
            : { data: [] };

        const mega = await buildMegaContext({ userId, email, name, scanId });

        return NextResponse.json({
            planTier,
            threadId: resolvedThreadId,
            threads: threads || [],
            messages: messages || [],
            megaContext: mega
        });
    } catch (error) {
        console.error('[Chat GET Error]:', error);
        return NextResponse.json({ error: 'Failed to load chat context' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();

    const message = typeof body?.message === 'string' ? body.message : '';
    const threadId = typeof body?.threadId === 'string' ? body.threadId : null;
    const scanId = typeof body?.scanId === 'string' ? body.scanId : null;
    const planTier = (typeof body?.planTier === 'string' ? body.planTier : 'vibe_coder').toLowerCase();
    const email = typeof body?.email === 'string' ? body.email : undefined;
    const name = typeof body?.name === 'string' ? body.name : undefined;
    const attachments = Array.isArray(body?.attachments) ? body.attachments : [];

    if (!message && attachments.length === 0) {
        return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    try {
        const mega = await buildMegaContext({ userId, email, name, scanId });
        const threadTitle = mega?.stats?.lastScan?.repo_url
            ? `Cortex: ${mega.stats.lastScan.repo_url.split('/').slice(-2).join('/')}`
            : 'Cortex Chat';

        const ensured = await ensureThread({ userId, threadId, scanId, title: threadTitle });
        if ('error' in ensured) {
            return NextResponse.json({ error: ensured.error }, { status: ensured.status });
        }

        const resolvedThreadId = ensured.threadId;

        const { data: recentMessages } = await supabaseService
            .from('chat_messages')
            .select('role, content')
            .eq('thread_id', resolvedThreadId)
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(14);

        const history = (recentMessages || []).reverse();

        const { error: insertUserError } = await supabaseService
            .from('chat_messages')
            .insert({
                thread_id: resolvedThreadId,
                user_id: userId,
                role: 'user',
                content: message,
                attachments: attachments.length ? attachments : null
            });

        if (insertUserError) {
            console.error('[Chat] Failed to store user message:', insertUserError);
        }

        const systemPrompt = `You are Cortex.

You are a deeply personal advisor to the developer.

You can answer:
- Technical (security, architecture, debugging)
- Strategic (priorities, roadmaps)
- Business (positioning, launch, pricing)
- Emotional support (overwhelm, confidence, accountability)

Rules:
- Be precise. If you are unsure, ask a clarifying question.
- Do not invent repo details.
- Use the provided context. If something is missing, say so.
- Keep a professional tone (no emojis unless the user uses them).
`;

        const contextBlock = JSON.stringify(mega);
        const historyBlock = history
            .map(m => `${m.role.toUpperCase()}: ${m.content}`)
            .join('\n');

        const userPrompt = `MEGA_CONTEXT_JSON:\n${contextBlock}\n\nRECENT_CONVERSATION:\n${historyBlock || '(none)'}\n\nNEW_MESSAGE:\n${message}`;

        const aiResult = await callAI(planTier, 'synthesis', systemPrompt, userPrompt, { scanId: scanId || undefined });

        if (aiResult && typeof aiResult === 'object' && aiResult.error === 'AI_SERVICE_UNAVAILABLE') {
            return NextResponse.json(
                {
                    error: 'AI_SERVICE_UNAVAILABLE',
                    message: aiResult.message || 'AI service temporarily unavailable',
                    fallbackResponse: aiResult.fallbackResponse || null,
                    threadId: resolvedThreadId,
                    megaContext: mega
                },
                { status: 503 }
            );
        }

        const assistantText = typeof aiResult === 'string'
            ? aiResult
            : aiResult?.content
                ? String(aiResult.content)
                : JSON.stringify(aiResult);

        const { data: assistantRow, error: insertAssistantError } = await supabaseService
            .from('chat_messages')
            .insert({
                thread_id: resolvedThreadId,
                user_id: userId,
                role: 'assistant',
                content: assistantText,
                metadata: { modelRouting: 'ai-router' }
            })
            .select('id, role, content, attachments, metadata, created_at')
            .single();

        if (insertAssistantError) {
            console.error('[Chat] Failed to store assistant message:', insertAssistantError);
        }

        return NextResponse.json({
            threadId: resolvedThreadId,
            megaContext: mega,
            response: assistantText,
            assistantMessage: assistantRow || null
        });
    } catch (error) {
        console.error('[Chat POST Error]:', error);
        const msg = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json(
            {
                error: 'CHAT_REQUEST_FAILED',
                message: 'Failed to process intelligence request',
                details: msg
            },
            { status: 500 }
        );
    }
}
