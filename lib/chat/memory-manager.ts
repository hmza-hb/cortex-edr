// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MEMORY MANAGER — Conversation memory optimization
// Two-tier approach: sliding window for recent messages
// + compact summary for older conversation history.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const SLIDING_WINDOW_SIZE = 10; // last N messages sent verbatim
const MAX_SUMMARY_LENGTH = 300; // chars for conversation summary

export interface ManagedMemory {
    conversationSummary: string | null;    // compressed older history
    recentMessages: Array<{ role: string; content: string }>;  // last N messages verbatim
}

/**
 * Builds managed memory from full conversation history.
 * Recent messages are kept verbatim; older messages are
 * compressed into a single summary string.
 */
export function manageMemory(
    history: Array<{ role: string; content: string }>,
    existingSummary?: string | null
): ManagedMemory {
    if (history.length === 0) {
        return { conversationSummary: null, recentMessages: [] };
    }

    // If history fits within the window, no summarization needed
    if (history.length <= SLIDING_WINDOW_SIZE) {
        return {
            conversationSummary: existingSummary || null,
            recentMessages: history,
        };
    }

    // Split: older messages → summary, recent messages → verbatim
    const olderMessages = history.slice(0, history.length - SLIDING_WINDOW_SIZE);
    const recentMessages = history.slice(history.length - SLIDING_WINDOW_SIZE);

    // Build a compact summary of older messages
    const newSummary = buildConversationSummary(olderMessages, existingSummary);

    return {
        conversationSummary: newSummary,
        recentMessages,
    };
}

/**
 * Builds a compact summary of older conversation messages.
 * This is a heuristic approach — not LLM-based — to avoid
 * extra API calls. It extracts the key topics discussed.
 */
function buildConversationSummary(
    olderMessages: Array<{ role: string; content: string }>,
    existingSummary?: string | null
): string {
    const parts: string[] = [];

    if (existingSummary) {
        parts.push(existingSummary);
    }

    // Extract user topics from older messages
    const userMessages = olderMessages.filter(m => m.role === 'user');
    const assistantMessages = olderMessages.filter(m => m.role === 'assistant');

    if (userMessages.length > 0) {
        const topics = userMessages
            .map(m => extractTopic(m.content))
            .filter(Boolean);

        if (topics.length > 0) {
            parts.push(`User asked about: ${topics.join('; ')}`);
        }
    }

    // Extract key facts from assistant responses
    if (assistantMessages.length > 0) {
        const lastAssistant = assistantMessages[assistantMessages.length - 1];
        const keyFact = extractKeyFact(lastAssistant.content);
        if (keyFact) {
            parts.push(`Last discussed: ${keyFact}`);
        }
    }

    const combined = parts.join('. ');
    return combined.length > MAX_SUMMARY_LENGTH
        ? combined.slice(0, MAX_SUMMARY_LENGTH - 3) + '...'
        : combined;
}

/**
 * Extracts a short topic description from a user message.
 */
function extractTopic(message: string): string {
    const cleaned = message.trim().replace(/\s+/g, ' ');

    // If it's short enough, use it directly
    if (cleaned.length <= 60) {
        return cleaned;
    }

    // Take the first sentence or first 60 chars
    const firstSentence = cleaned.match(/^[^.!?]+[.!?]/);
    if (firstSentence && firstSentence[0].length <= 80) {
        return firstSentence[0].trim();
    }

    return cleaned.slice(0, 57) + '...';
}

/**
 * Extracts the key fact/conclusion from an assistant response.
 */
function extractKeyFact(message: string): string {
    const cleaned = message.trim().replace(/\s+/g, ' ');

    // Try to find a concluding statement
    const conclusions = cleaned.match(/(?:in summary|to summarize|the main|the key|most important|you should|I recommend)[^.!?]*[.!?]/i);
    if (conclusions) {
        return truncate(conclusions[0], 100);
    }

    // Otherwise, take the first sentence
    const firstSentence = cleaned.match(/^[^.!?]+[.!?]/);
    if (firstSentence) {
        return truncate(firstSentence[0], 100);
    }

    return truncate(cleaned, 80);
}

function truncate(text: string, max: number): string {
    if (text.length <= max) return text;
    return text.slice(0, max - 3) + '...';
}

/**
 * Formats managed memory into text blocks for prompt injection.
 */
export function formatMemoryForPrompt(memory: ManagedMemory): {
    summaryBlock: string;
    historyBlock: string;
} {
    const summaryBlock = memory.conversationSummary
        ? `<CONVERSATION_SUMMARY>\n${memory.conversationSummary}\n</CONVERSATION_SUMMARY>`
        : '';

    const historyBlock = memory.recentMessages.length > 0
        ? memory.recentMessages
            .map(m => `${m.role.toUpperCase()}: ${m.content}`)
            .join('\n')
        : '';

    return { summaryBlock, historyBlock };
}
