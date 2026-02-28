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
            response_format: { type: 'json_object' },
        });

        const text = completion.choices[0]?.message?.content || '';
        try {
            return JSON.parse(text);
        } catch (e) {
            // Try to extract JSON
            const jsonMatch = text.match(/{[\s\S]*}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }
            throw new Error('Invalid JSON response from DeepSeek');
        }
    } catch (error) {
        console.error('Error calling DeepSeek API:', error);
        throw error;
    }
}
