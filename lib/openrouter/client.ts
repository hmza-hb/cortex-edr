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

    if (!API_KEY) {
        throw new Error('OPENROUTER_API_KEY is not defined in environment variables');
    }

    const messages: OpenRouterMessage[] = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
    ];

    try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'HTTP-Referer': 'https://cortex-edr.com', // Required by OpenRouter
                'X-Title': 'CortexEDR',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model,
                messages,
                temperature: options.temperature ?? 0.3,
                max_tokens: options.max_tokens ?? 4096,
                ...(options.fallbacks && { fallbacks: options.fallbacks })
            })
        });

        if (!response.ok) {
            const error = await response.json();
            console.error('[OpenRouter Client] Error:', error);
            throw new Error(`OpenRouter API error: ${error.error?.message || response.statusText}`);
        }

        const data: OpenRouterResponse = await response.json();

        if (!data.choices?.[0]?.message?.content) {
            throw new Error('Invalid response structure from OpenRouter');
        }

        return {
            content: data.choices[0].message.content,
            usage: data.usage
        };
    } catch (error) {
        console.error('[OpenRouter Client] Fetch Error:', error);
        throw error;
    }
}
