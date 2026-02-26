export async function getEmbedding(text: string): Promise<number[]> {
    const API_KEY = process.env.OPENROUTER_API_KEY;

    // We'll use a reliable embedding model available on OpenRouter
    // Alternatively, if OpenRouter doesn't support embeddings directly in your region,
    // we can use a direct OpenAI or HuggingFace call.
    // For now, let's assume OpenRouter's support for OpenAI embedding paths.

    try {
        const response = await fetch('https://openrouter.ai/api/v1/embeddings', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'openai/text-embedding-3-small',
                input: text.replace(/\n/g, ' ')
            })
        });

        if (!response.ok) {
            throw new Error(`Embedding API error: ${response.statusText}`);
        }

        const data = await response.json();
        return data.data[0].embedding;
    } catch (error) {
        console.error('[Embeddings] Error:', error);
        throw error;
    }
}

export async function getEmbeddingsBatch(texts: string[]): Promise<number[][]> {
    const API_KEY = process.env.OPENROUTER_API_KEY;

    try {
        const response = await fetch('https://openrouter.ai/api/v1/embeddings', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'openai/text-embedding-3-small',
                input: texts.map(t => t.replace(/\n/g, ' '))
            })
        });

        if (!response.ok) {
            throw new Error(`Embedding Batch API error: ${response.statusText}`);
        }

        const data = await response.json();
        return data.data.map((item: any) => item.embedding);
    } catch (error) {
        console.error('[Embeddings Batch] Error:', error);
        throw error;
    }
}
