import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getEmbedding } from '@/lib/ai/embeddings';
import { callOpenRouter } from '@/lib/openrouter/client';
import { OPENROUTER_MODELS } from '@/lib/agents/openrouter-config';

export async function POST(req: NextRequest) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { message, scanId, planTier = 'vibe_coder' } = await req.json();

    if (!message || !scanId) {
        return NextResponse.json({ error: 'Message and scanId are required' }, { status: 400 });
    }

    try {
        // 1. Generate embedding for the question
        console.log(`[Chat] Generating embedding for query: "${message.substring(0, 50)}..."`);
        const queryEmbedding = await getEmbedding(message);

        // 2. Search for relevant code in Supabase
        // Note: The RPC match_codebase_embeddings needs to be created in Supabase first
        const { data: matches, error: matchError } = await supabase.rpc('match_codebase_embeddings', {
            query_embedding: queryEmbedding,
            match_threshold: 0.5,
            match_count: 5,
            p_scan_id: scanId
        });

        if (matchError) {
            console.error('[Chat] Vector search error:', matchError);
            // Fallback: Continue without context if vector search fails (legacy/demo mode)
        }

        const context = matches?.map((m: any) => `FILE: ${m.file_path}\nCONTENT:\n${m.content}`).join('\n\n---\n\n') || 'No direct code matches found.';

        // 3. Select model based on tier
        const model = planTier === 'vibe_coder'
            ? OPENROUTER_MODELS.vibe_coder.security
            : 'deepseek/deepseek-r1'; // Use strong reasoning for chat if available

        // 4. Synthesize answer
        const systemPrompt = `You are Cortex AI, a senior security and architecture engineer. 
You are chatting with a developer about their codebase (Scan ID: ${scanId}).
Use the provided code context to answer their question accurately.
If the code context doesn't contain the answer, say so honestly.
Focus on being efficient, accurate, and powerful in your explanations.`;

        const userPrompt = `CONTEXT FROM CODEBASE:
${context}

USER QUESTION:
${message}`;

        const { content } = await callOpenRouter(model, systemPrompt, userPrompt);

        return NextResponse.json({ response: content });

    } catch (error: any) {
        console.error('[Chat API Error]:', error);
        return NextResponse.json({ error: 'Failed to process intelligence request' }, { status: 500 });
    }
}
