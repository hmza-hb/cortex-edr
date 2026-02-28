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
            throw new Error('Invalid JSON response from Groq');
        }
    } catch (error) {
        console.error('Error calling Groq API:', error);
        throw error;
    }
}
