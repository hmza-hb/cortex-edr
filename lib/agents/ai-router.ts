import { callOpenRouter } from '@/lib/openrouter/client';
import { OPENROUTER_MODELS, FALLBACK_MODELS } from './openrouter-config';
import { AILogger } from './ai-logger';

export async function callAI(
    userPlan: string,
    agentKey: string,
    systemPrompt: string,
    userPrompt: string,
    options: { scanId?: string } = {}
): Promise<any> {
    // Normalize plan key
    const plan = userPlan.toLowerCase();

    // Get primary model for this plan and agent
    const tierModels = OPENROUTER_MODELS[plan] || OPENROUTER_MODELS.vibe_coder;
    const model = tierModels[agentKey] || tierModels.recon;

    console.log(`[AI Router] Plan: ${plan}, Agent: ${agentKey}, Using Model: ${model}`);

    try {
        const { content, usage } = await callOpenRouter(model, systemPrompt, userPrompt, {
            fallbacks: FALLBACK_MODELS.filter(m => m !== model)
        });

        // Log usage if scanId is provided
        // Usage tracking will be handled by the caller or a unified logger instance

        // Try to parse JSON if the agent expects it
        try {
            return JSON.parse(content);
        } catch (e) {
            // If not JSON, return as text (useful for chat or loose synthesis)
            return content;
        }

    } catch (error) {
        console.error(`[AI Router] Critical failure with model ${model}:`, error);

        // Critical Fallback to a super cheap/reliable model if primary and OpenRouter fallbacks fail
        if (plan !== 'vibe_coder') {
            const emergencyModel = OPENROUTER_MODELS.vibe_coder[agentKey] || 'liquid/lfm-2-8b-a1b';
            console.log(`[AI Router] Attempting emergency fallback to: ${emergencyModel}`);
            const { content } = await callOpenRouter(emergencyModel, systemPrompt, userPrompt);
            try { return JSON.parse(content); } catch { return content; }
        }

        throw error;
    }
}

/**
 * Very rough cost calculation helper for logging
 * Rates are per 1M tokens as of OpenRouter latest docs
 */
function calculateCost(model: string, usage: { prompt_tokens: number, completion_tokens: number }): number {
    const rates: Record<string, { in: number, out: number }> = {
        'liquid/lfm-2-8b-a1b': { in: 0.01, out: 0.02 },
        'qwen/qwq-32b-preview': { in: 0.20, out: 0.40 },
        'deepseek/deepseek-r1': { in: 0.55, out: 0.55 },
        'qwen/qwen-2.5-72b': { in: 0.40, out: 0.40 },
        'anthropic/claude-3.5-haiku': { in: 1.00, out: 5.00 },
        'minimax/minimax-m2': { in: 0.25, out: 1.00 },
    };

    const rate = rates[model] || { in: 0.50, out: 0.50 };
    const cost = (usage.prompt_tokens / 1000000 * rate.in) + (usage.completion_tokens / 1000000 * rate.out);
    return cost;
}
