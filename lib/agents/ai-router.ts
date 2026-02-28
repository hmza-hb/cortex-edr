import { callOpenRouter } from '@/lib/openrouter/client';
import { OPENROUTER_MODELS, FALLBACK_MODELS } from './openrouter-config';
import { AILogger } from './ai-logger';
import { askGemini } from '@/lib/ai/gemini';
import { askGroq } from '@/lib/ai/groq';
import { askDeepSeek } from '@/lib/ai/deepseek';

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

    // Multi-provider fallback chain
    const providers = [
        {
            name: 'OpenRouter',
            func: async () => {
                const { content, usage } = await callOpenRouter(model, systemPrompt, userPrompt, {
                    fallbacks: FALLBACK_MODELS.filter(m => m !== model)
                });
                return content;
            }
        },
        {
            name: 'Gemini',
            func: async () => {
                const fullPrompt = `${systemPrompt}\n\n${userPrompt}`;
                return await askGemini(fullPrompt, 'gemini-1.5-flash');
            }
        },
        {
            name: 'Groq',
            func: async () => {
                const fullPrompt = `${systemPrompt}\n\n${userPrompt}`;
                return await askGroq(fullPrompt, 'llama3-8b-8192');
            }
        },
        {
            name: 'DeepSeek',
            func: async () => {
                const fullPrompt = `${systemPrompt}\n\n${userPrompt}`;
                return await askDeepSeek(fullPrompt, 'deepseek-chat');
            }
        }
    ];

    for (const provider of providers) {
        try {
            console.log(`[AI Router] Trying provider: ${provider.name}`);
            const result = await provider.func();
            // Try the best free, reliable models as emergency fallback
            const emergencyModels = [
                'microsoft/wizardlm-2-8x22b',    // Better quality free model
                'mistralai/mistral-7b-instruct', // Free tier often available
                'liquid/lfm-2-8b-a1b'           // Super cheap as last resort
            ]; 
            // Try to parse JSON if the agent expects it
            try {
                return JSON.parse(result);
            } catch (e) {
                // If not JSON, return as text (useful for chat or loose synthesis)
                return result;
            }
        } catch (error) {
            console.error(`[AI Router] Provider ${provider.name} failed:`, error);
            continue; // Try next provider
        }
    }

    // If all providers fail, return structured error
    console.error(`[AI Router] All providers failed`);
    return {
        error: "AI_SERVICE_UNAVAILABLE",
        message: "All AI providers are currently unavailable. Please try again later.",
        fallbackResponse: generateFallbackResponse(agentKey, userPrompt)
    };
}

// Generate basic fallback responses for critical agents
function generateFallbackResponse(agentKey: string, userPrompt: string): any {
    switch (agentKey) {
        case 'recon':
            return {
                techStack: { framework: "Unknown", language: "Unknown", runtime: "Unknown" },
                complexity: "medium",
                quality: "unknown",
                summary: "AI analysis unavailable - manual review recommended"
            };
        case 'security':
            return {
                vulnerabilities: [],
                criticalIssues: [],
                recommendations: ["Manual security review recommended due to AI service unavailability"]
            };
        case 'architecture':
            return {
                patterns: [],
                issues: [],
                score: 50,
                note: "AI architectural analysis unavailable - manual review recommended"
            };
        default:
            return {
                status: "unavailable",
                message: "AI analysis temporarily unavailable"
            };
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
