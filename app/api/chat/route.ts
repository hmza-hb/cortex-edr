import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { supabaseService } from '@/lib/supabase/service';
import { orchestrate } from '@/lib/chat/orchestrate';
import { callAI } from '@/lib/agents/ai-router';
import { executeToolCall } from '@/lib/chat/tools';
import type { ChatIntent } from '@/lib/chat/intent-classifier';

function getLoopBudget(intent: ChatIntent): number {
    switch (intent) {
        case 'vulnerability_detail':
        case 'fix_guidance':
            return 7;
        case 'architecture_advice':
            return 5;
        case 'repo_overview':
            return 4;
        case 'security_education':
        case 'followup':
            return 3;
        default:
            return 2;
    }
}

function deriveThreadTitle(params: { message: string; repoUrl?: string | null }) {
    const cleaned = (params.message || "").trim().replace(/\s+/g, " ");
    if (cleaned) {
        const words = cleaned.split(' ').filter(Boolean);
        const title = words.slice(0, 4).join(' ');
        return title || 'Cortex Chat';
    }
    if (params.repoUrl) return `Cortex: ${params.repoUrl.split('/').slice(-2).join('/')}`;
    return "Cortex Chat";
}

function isValidUuid(value: string) {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

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
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const userId = (session.user as any).id;

    const url = new URL(req.url);
    const threadId = url.searchParams.get('threadId');
    const planTier = (url.searchParams.get('planTier') || 'vibe_coder').toLowerCase();

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

        return NextResponse.json({
            planTier,
            threadId: resolvedThreadId,
            threads: threads || [],
            messages: messages || [],
        });
    } catch (error) {
        console.error('[Chat GET Error]:', error);
        return NextResponse.json({ error: 'Failed to load chat context' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const userId = (session.user as any).id;
    const sessionUserEmail = session.user.email;
    const sessionUserName = session.user.name;

    const body = await req.json();

    const message = typeof body?.message === 'string' ? body.message : '';
    const rawThreadId = typeof body?.threadId === 'string' ? body.threadId : null;
    const threadId = rawThreadId && isValidUuid(rawThreadId) ? rawThreadId : null;
    const scanId = body?.scanId || null;
    const planTier = (body?.planTier || body?.plan || 'vibe_coder').toLowerCase();
    const email = body?.email || sessionUserEmail || undefined;
    const name = typeof body?.name === 'string' ? body.name : sessionUserName || undefined;
    const attachments = Array.isArray(body?.attachments) ? body.attachments : [];

    if (!message && attachments.length === 0) {
        return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    try {
        // Derive thread title from the first message
        const computedTitle = deriveThreadTitle({ message, repoUrl: null });

        const ensured = await ensureThread({ userId, threadId, scanId, title: computedTitle });
        if ('error' in ensured) {
            return NextResponse.json({ error: ensured.error }, { status: ensured.status });
        }

        const resolvedThreadId = ensured.threadId;

        if (!threadId) {
            const { error: updateTitleError } = await supabaseService
                .from('chat_threads')
                .update({ title: computedTitle })
                .eq('id', resolvedThreadId)
                .eq('user_id', userId);
            if (updateTitleError) {
                console.error('[Chat] Failed to update thread title:', updateTitleError);
            }
        }

        // Fetch recent message history
        const { data: recentMessages } = await supabaseService
            .from('chat_messages')
            .select('role, content')
            .eq('thread_id', resolvedThreadId)
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(30);

        const history = (recentMessages || []).reverse();

        // Store user message
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

        // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        // ORCHESTRATION ENGINE — intelligent prompt assembly
        // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        const orchestrated = await orchestrate({
            userId,
            message,
            scanId,
            history,
            email,
            name,
        });

        console.log(`[Chat] Orchestrated — Intent: ${orchestrated.debug.intent} | Tokens: ~${orchestrated.debug.tokenEstimate.total}`);

        let aiResult: any = null;
        let cumulativeText = "";
        let toolLoops = 0;
        let currentSystemPrompt = orchestrated.systemPrompt;
        let currentUserPrompt = orchestrated.userPrompt;
        const toolCache = new Map<string, string>();
        const MAX_TOOL_LOOPS = getLoopBudget(orchestrated.debug.intent as ChatIntent);

        while (toolLoops < MAX_TOOL_LOOPS) {
            aiResult = await callAI(
                planTier,
                'synthesis',
                currentSystemPrompt,
                currentUserPrompt,
                {
                    scanId: scanId || undefined,
                    threadId: resolvedThreadId,
                    userId: userId
                }
            );

            if (aiResult && typeof aiResult === 'object' && aiResult.error === 'AI_SERVICE_UNAVAILABLE') {
                return NextResponse.json(
                    {
                        error: 'AI_SERVICE_UNAVAILABLE',
                        message: aiResult.message || 'AI service temporarily unavailable',
                        fallbackResponse: aiResult.fallbackResponse || null,
                        threadId: resolvedThreadId,
                        threadTitle: computedTitle,
                    },
                    { status: 503 }
                );
            }

            const assistantTurnText = typeof aiResult === 'string'
                ? aiResult
                : aiResult?.content
                    ? String(aiResult.content)
                    : JSON.stringify(aiResult);

            cumulativeText += (cumulativeText ? "\n\n" : "") + assistantTurnText;

            // Check if AI called a tool
            const toolCallMatch = assistantTurnText.match(/<tool_call>([\s\S]*?)<\/tool_call>/i);
            if (toolCallMatch) {
                console.log(`[Chat] Tool Called (Loop ${toolLoops + 1}):`, toolCallMatch[0].trim());
                toolLoops++;

                // Execute tool with caching
                const repoUrl = orchestrated.repoUrl || "";
                const safeScanId = scanId || "";
                const toolCallKey = toolCallMatch[0].trim();

                let toolResult = "";
                if (toolCache.has(toolCallKey)) {
                    console.log(`[Chat] Tool Cache Hit:`, toolCallKey);
                    toolResult = toolCache.get(toolCallKey)!;
                } else {
                    toolResult = await executeToolCall(toolCallMatch[0], safeScanId, repoUrl);
                    toolCache.set(toolCallKey, toolResult);
                }

                console.log(`[Chat] Tool Result:`, toolResult.trim());

                // Append the AI's partial stream and the tool result to the prompt
                currentUserPrompt += `\n\nAssistant:\n${assistantTurnText}\n\nSystem:\n${toolResult}\n\nPlease continue your response:`;
            } else {
                // No tool called (or finished), loop is done!
                break;
            }
        }

        const assistantText = cumulativeText;

        const { data: assistantRow, error: insertAssistantError } = await supabaseService
            .from('chat_messages')
            .insert({
                thread_id: resolvedThreadId,
                user_id: userId,
                role: 'assistant',
                content: assistantText,
                metadata: {
                    modelRouting: 'ai-router',
                    orchestration: {
                        intent: orchestrated.debug.intent,
                        confidence: orchestrated.debug.confidence,
                        tokenEstimate: orchestrated.debug.tokenEstimate.total,
                    }
                }
            })
            .select('id, role, content, attachments, metadata, created_at')
            .single();

        if (insertAssistantError) {
            console.error('[Chat] Failed to store assistant message:', insertAssistantError);
        }

        return NextResponse.json({
            threadId: resolvedThreadId,
            threadTitle: computedTitle,
            response: assistantText,
            assistantMessage: assistantRow || null,
            orchestration: orchestrated.debug,
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
