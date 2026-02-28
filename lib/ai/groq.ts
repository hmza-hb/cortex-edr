import OpenAI from 'openai';

const API_KEY = process.env.GROQ_API_KEY || '';
const client = new OpenAI({
    apiKey: API_KEY,
    baseURL: 'https://api.groq.com/openai/v1',
});

export async function askGroq(prompt: string, model: string = 'llama3-8b-8192') {
    if (!API_KEY) {
        throw new Error('GROQ_API_KEY is not defined in environment variables');
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
        console.error('Error calling Groq API:', error);
        throw error;
    }
}
