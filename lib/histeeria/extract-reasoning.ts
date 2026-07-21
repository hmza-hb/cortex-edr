export type ChatMessage = { role: 'system' | 'user' | 'assistant'; content: string };

const OPEN_THINK = ['<', 'think', '>'].join('');
const CLOSE_THINK = ['<', '/think', '>'].join('');
const THINK_BLOCK = new RegExp(OPEN_THINK + '[\\s\\S]*?' + CLOSE_THINK, 'gi');

export function buildMessages(systemPrompt: string, userPrompt: string): ChatMessage[] {
    return [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
    ];
}

/** Pull chain-of-thought / scratchpad text out of a raw model response. */
export function extractReasoning(
    rawOutput: string,
    apiReasoning?: string | null
): { reasoning: string | null; decision: string } {
    const reasoningParts: string[] = [];

    if (apiReasoning?.trim()) {
        reasoningParts.push(apiReasoning.trim());
    }

    let decision = rawOutput || '';

    const patterns = [
        THINK_BLOCK,
        /<thinking>[\s\S]*?<\/thinking>/gi,
    ];

    for (const regex of patterns) {
        const matches = decision.match(regex);
        if (matches) {
            for (const match of matches) {
                const inner = match
                    .replace(/^<(?:think|redacted_thinking|thinking)>/i, '')
                    .replace(/<\/(?:think|thinking)>$/i, '')
                    .trim();
                if (inner) reasoningParts.push(inner);
            }
            decision = decision.replace(regex, '');
        }
    }

    decision = decision.trim();

    return {
        reasoning: reasoningParts.length > 0 ? reasoningParts.join('\n\n---\n\n') : null,
        decision,
    };
}

export function tryParseDecision(decision: string): unknown {
    if (!decision) return decision;

    let clean = decision.trim();
    const fenced = clean.match(/```json\s*([\s\S]*?)\s*```/i) || clean.match(/```\s*([\s\S]*?)\s*```/i);
    if (fenced) clean = fenced[1].trim();

    try {
        return JSON.parse(clean);
    } catch {
        return decision;
    }
}
