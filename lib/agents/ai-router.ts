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

    // Enhanced retry mechanism with exponential backoff
    const maxRetries = 3;
    const baseDelay = 1000; // 1 second base delay
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const { content, usage } = await callOpenRouter(model, systemPrompt, userPrompt, {
                fallbacks: FALLBACK_MODELS.filter(m => m !== model)
            });

            // Try to parse JSON if the agent expects it
            try {
                return JSON.parse(content);
            } catch (e) {
                // If not JSON, return as text (useful for chat or loose synthesis)
                return content;
            }

        } catch (error) {
            console.error(`[AI Router] Attempt ${attempt}/${maxRetries} failed with model ${model}:`, error);
            
            // If this is the last attempt, try emergency fallback
            if (attempt === maxRetries) {
                console.log(`[AI Router] All retries failed. Attempting emergency fallback...`);
                
                // Try the cheapest, most reliable models as final fallback
                const emergencyModels = [
                    'liquid/lfm-2-8b-a1b',    // $0.01/M - Super cheap
                    'mistralai/mistral-7b-instruct', // Free tier often available
                    'huggingfaceh4/zephyr-7b-beta'   // Another free option
                ];
                
                for (const emergencyModel of emergencyModels) {
                    try {
                        console.log(`[AI Router] Emergency fallback trying: ${emergencyModel}`);
                        const { content } = await callOpenRouter(emergencyModel, systemPrompt, userPrompt, {
                            temperature: 0.1, // Lower temperature for more reliable output
                            max_tokens: 2048  // Smaller token limit for reliability
                        });
                        try { return JSON.parse(content); } catch { return content; }
                    } catch (emergencyError) {
                        console.error(`[AI Router] Emergency model ${emergencyModel} also failed:`, emergencyError);
                        continue;
                    }
                }
                
                // If all models fail, return a structured error response
                return {
                    error: "AI_SERVICE_UNAVAILABLE",
                    message: "All AI models are currently unavailable. Please try again later.",
                    fallbackResponse: generateFallbackResponse(agentKey, userPrompt)
                };
            }
            
            // Wait before retry with exponential backoff
            const delay = baseDelay * Math.pow(2, attempt - 1);
            console.log(`[AI Router] Retrying in ${delay}ms...`);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }

    throw new Error('AI service completely unavailable after all retries');
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
