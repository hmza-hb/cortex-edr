import { Histeeria } from 'histeeria';
import { buildMessages, extractReasoning, tryParseDecision } from './extract-reasoning';

let client: Histeeria | null = null;

export function getHisteeria(): Histeeria | null {
    const apiKey = process.env.HISTEERIA_API_KEY;
    if (!apiKey) return null;

    if (!client) {
        client = new Histeeria({
            apiKey,
            debug: process.env.NODE_ENV === 'development',
        });
    }
    return client;
}

export function observeAICall(params: {
    systemPrompt: string;
    userPrompt: string;
    rawOutput: string;
    apiReasoning?: string | null;
    agentId: string;
    sessionId?: string;
    domain: 'scan' | 'chat';
    inputTokens?: number;
    outputTokens?: number;
    context?: Record<string, unknown>;
    metadata?: Record<string, unknown>;
}) {
    const h = getHisteeria();
    if (!h) return;

    const messages = buildMessages(params.systemPrompt, params.userPrompt);
    const { reasoning, decision } = extractReasoning(params.rawOutput, params.apiReasoning);
    const parsedDecision = tryParseDecision(decision);

    h.observe({
        // Histeeria evaluates judgment from input context + reasoning + final decision.
        input: {
            messages,
            context: params.context ?? null,
        },
        output: {
            decision: parsedDecision,
            raw: params.rawOutput,
        },
        agentId: params.agentId,
        sessionId: params.sessionId,
        domain: params.domain,
        inputTokens: params.inputTokens,
        outputTokens: params.outputTokens,
        metadata: {
            ...params.metadata,
            // Explicit reasoning channel — null when model did a direct JSON call.
            reasoning,
            hasReasoning: Boolean(reasoning),
            inputCharCount: params.systemPrompt.length + params.userPrompt.length,
        },
    });
}

export async function flushHisteeria() {
    const h = getHisteeria();
    if (h) await h.flush();
}
