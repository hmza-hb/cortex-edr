import OpenAI from 'openai';

const API_KEY = process.env.DEEPSEEK_API_KEY || '';
const client = new OpenAI({
    apiKey: API_KEY,
    baseURL: 'https://api.deepseek.com/v1',
});

export async function askDeepSeek(prompt: string, model: string = 'deepseek-chat') {
    if (!API_KEY) {
        throw new Error('DEEPSEEK_API_KEY is not defined in environment variables');
    }

    try {
        const completion = await client.chat.completions.create({
            model,
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.1,
            max_tokens: 4096,
        });

        return completion.choices[0]?.message?.content || '';
    } catch (error) {
        console.error('Error calling DeepSeek API:', error);
        throw error;
    }
}
