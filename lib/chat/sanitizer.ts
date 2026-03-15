/**
 * Utility to strip internal XML tags and prompt templates from AI responses 
 * before they reach the user or database.
 */
export function sanitizeAIResponse(text: string): string {
    if (!text) return "";

    let clean = text;

    // 1. Strip patterns that should NEVER reach the user
    const patterns = [
        /<thinking>[\s\S]*?<\/thinking>/gi,     // Closed thinking blocks
        /<thinking>[\s\S]*$/gi,               // Trailing open thinking block
        /<tool_call>[\s\S]*?<\/tool_call>/gi,   // Closed tool calls
        /<tool_call>[\s\S]*$/gi,               // Trailing open tool calls
        /<RECENT_MESSAGES>[\s\S]*?<\/RECENT_MESSAGES>/gi, // Memory template tags
        /<\/RECENT_MESSAGES>/gi,               // Lingering closing tags
        /<RECENT_MESSAGES>/gi,                // Lingering opening tags
        /<SCAN_CONTEXT>[\s\S]*?<\/SCAN_CONTEXT>/gi,     // Context template tags
        /<\/SCAN_CONTEXT>/gi,
        /<SCAN_CONTEXT>/gi,
        /\[Turn \d+:[^\]]*\]/gi,               // [Turn N: Action] labels if they leak
    ];

    for (const pattern of patterns) {
        clean = clean.replace(pattern, "");
    }

    // 2. Final cleanup
    return clean.trim();
}
