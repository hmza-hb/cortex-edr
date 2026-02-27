interface OpenRouterMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

interface OpenRouterResponse {
    id: string;
    choices: Array<{
        message: {
            role: string;
            content: string;
        };
        finish_reason: string;
    }>;
    usage?: {
        prompt_tokens: number;
        completion_tokens: number;
        total_tokens: number;
    };
}

export async function callOpenRouter(
    model: string,
    systemPrompt: string,
    userPrompt: string,
    options: {
        temperature?: number;
        max_tokens?: number;
        fallbacks?: string[];
    } = {}
): Promise<{ content: string; usage?: OpenRouterResponse['usage'] }> {
    const API_KEY = process.env.OPENROUTER_API_KEY;

    const referer = process.env.NEXT_PUBLIC_APP_URL || 'https://cortex-edr.com';

    if (!API_KEY) {
        throw new Error('OPENROUTER_API_KEY is not defined in environment variables');
    }

    const messages: OpenRouterMessage[] = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
    ];

    // Enhanced error handling with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'HTTP-Referer': referer, // Required by OpenRouter
                'X-Title': 'CortexEDR',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model,
                messages,
                temperature: options.temperature ?? 0.3,
                max_tokens: options.max_tokens ?? 4096,
                ...(options.fallbacks && { fallbacks: options.fallbacks }),
                // Note: keep request body OpenAI-compatible; retries are handled client-side
            }),
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            console.error('[OpenRouter Client] Error:', error);
            
            // Handle specific error cases
            if (response.status === 429) {
                throw new Error(`Rate limit exceeded. Please try again later. ${error.error?.message || ''}`);
            } else if (response.status === 401) {
                throw new Error('Invalid API key. Please check your OPENROUTER_API_KEY.');
            } else if (response.status >= 500) {
                throw new Error('OpenRouter service temporarily unavailable. Please try again.');
            } else {
                throw new Error(`OpenRouter API error: ${error.error?.message || response.statusText}`);
            }
        }

        const data: OpenRouterResponse = await response.json();

        if (!data.choices?.[0]?.message?.content) {
            console.error('[OpenRouter Client] Invalid response structure:', data);
            throw new Error('Invalid response structure from OpenRouter');
        }

        // Log usage for monitoring
        if (data.usage) {
            console.log(`[OpenRouter Usage] Model: ${model}, Tokens: ${data.usage.total_tokens}, Cost: $${calculateCost(model, data.usage).toFixed(4)}`);
        }

        return {
            content: data.choices[0].message.content,
            usage: data.usage
        };
    } catch (error) {
        clearTimeout(timeoutId);
        
        if (error instanceof Error && error.name === 'AbortError') {
            throw new Error('Request timeout. AI service is taking too long to respond.');
        }
        
        console.error('[OpenRouter Client] Fetch Error:', error);
        throw error;
    }
}

// Enhanced cost calculation
function calculateCost(model: string, usage: { prompt_tokens: number, completion_tokens: number }): number {
    const rates: Record<string, { in: number, out: number }> = {
        'liquid/lfm-2-8b-a1b': { in: 0.01, out: 0.02 },
        'mistralai/mistral-7b-instruct': { in: 0.05, out: 0.10 }, // Often free tier
        'huggingfaceh4/zephyr-7b-beta': { in: 0.05, out: 0.10 }, // Free tier
        'microsoft/wizardlm-2-8x22b': { in: 0.10, out: 0.20 },
        'openchat/openchat-7b': { in: 0.05, out: 0.10 },
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
