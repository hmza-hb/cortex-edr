// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PROMPT BUILDER — Final prompt assembly
// Combines system prompt segments, compressed context,
// managed memory, and user question into an optimized
// prompt ready for the AI router.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import type { ChatIntent } from './intent-classifier';
import type { ManagedMemory } from './memory-manager';
import { formatMemoryForPrompt } from './memory-manager';
import { TOOLS_SYSTEM_PROMPT } from './tools';

import {
    BASE_SYSTEM_PROMPT,
    HALLUCINATION_GUARD,
    VULNERABILITY_INSTRUCTIONS,
    FIX_GUIDANCE_INSTRUCTIONS,
    REPO_OVERVIEW_INSTRUCTIONS,
    ARCHITECTURE_INSTRUCTIONS,
    GREETING_INSTRUCTIONS,
    FOUNDER_CONTEXT,
    PRODUCT_CONTEXT,
    GROUND_TRUTH_GUARDS,
} from './system-prompt';

// ── Intent → System prompt segment mapping ──────────

function getIntentInstructions(intent: ChatIntent): string {
    switch (intent) {
        case 'vulnerability_detail':
            return VULNERABILITY_INSTRUCTIONS;
        case 'fix_guidance':
            return FIX_GUIDANCE_INSTRUCTIONS;
        case 'repo_overview':
            return REPO_OVERVIEW_INSTRUCTIONS;
        case 'architecture_advice':
            return ARCHITECTURE_INSTRUCTIONS;
        case 'greeting':
            return GREETING_INSTRUCTIONS;
        case 'founder_info':
            return FOUNDER_CONTEXT;
        case 'product_question':
            return PRODUCT_CONTEXT;
        case 'security_education':
            return ''; // General knowledge — no extra instructions needed
        case 'followup':
            return ''; // Follow-ups use whatever instructions were for the previous intent
        default:
            return '';
    }
}

// ── Should include hallucination guard? ─────────────

function shouldIncludeHallucinationGuard(intent: ChatIntent): boolean {
    // Only include for intents that reference scan data
    return [
        'vulnerability_detail',
        'fix_guidance',
        'repo_overview',
        'architecture_advice',
        'followup',
    ].includes(intent);
}

// ── Build system prompt ─────────────────────────────

export function buildSystemPrompt(intent: ChatIntent): string {
    let prompt = BASE_SYSTEM_PROMPT + '\n' + GROUND_TRUTH_GUARDS;

    if (shouldIncludeHallucinationGuard(intent)) {
        prompt += HALLUCINATION_GUARD;
    }

    const instructions = getIntentInstructions(intent);
    if (instructions) {
        prompt += instructions;
    }

    // Always append tool calling instructions
    prompt += '\n' + TOOLS_SYSTEM_PROMPT;

    return prompt;
}

// ── Build user prompt ───────────────────────────────

export function buildUserPrompt(params: {
    intent: ChatIntent;
    compressedContext: string;
    memory: ManagedMemory;
    message: string;
}): string {
    const { intent, compressedContext, memory, message } = params;
    const { summaryBlock, historyBlock } = formatMemoryForPrompt(memory);

    const parts: string[] = [];

    // 1. Scan context (only if available)
    if (compressedContext) {
        parts.push(`<SCAN_CONTEXT>\n${compressedContext}\n</SCAN_CONTEXT>`);
    }

    // 2. Conversation summary (only if available)
    if (summaryBlock) {
        parts.push(summaryBlock);
    }

    // 3. Recent conversation history (only if available)
    if (historyBlock) {
        parts.push(`<RECENT_MESSAGES>\n${historyBlock}\n</RECENT_MESSAGES>`);
    }

    // 4. User's current message
    parts.push(message);

    return parts.join('\n\n');
}

// ── Full prompt assembly (convenience) ──────────────

export interface AssembledPrompt {
    systemPrompt: string;
    userPrompt: string;
    intent: ChatIntent;
    tokenEstimate: {
        system: number;
        user: number;
        total: number;
    };
}

export function buildPrompt(params: {
    intent: ChatIntent;
    compressedContext: string;
    memory: ManagedMemory;
    message: string;
}): AssembledPrompt {
    const systemPrompt = buildSystemPrompt(params.intent);
    const userPrompt = buildUserPrompt(params);

    const systemTokens = Math.ceil(systemPrompt.length / 4);
    const userTokens = Math.ceil(userPrompt.length / 4);

    return {
        systemPrompt,
        userPrompt,
        intent: params.intent,
        tokenEstimate: {
            system: systemTokens,
            user: userTokens,
            total: systemTokens + userTokens,
        },
    };
}
