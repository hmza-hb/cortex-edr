import { GoogleGenerativeAI, GenerationConfig } from '@google/generative-ai';

const API_KEY = process.env.GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(API_KEY);

const DEFAULT_CONFIG: GenerationConfig = {
    temperature: 0.1, // Low temperature for more deterministic/structured output
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "application/json",
};

export async function askGemini(prompt: string, model: string = "gemini-1.5-flash") {
    if (!API_KEY) {
        throw new Error('GEMINI_API_KEY is not defined in environment variables');
    }

    const generativeModel = genAI.getGenerativeModel({ model });

    try {
        const result = await generativeModel.generateContent({
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            generationConfig: DEFAULT_CONFIG,
        });

        const response = await result.response;
        const text = response.text();

        try {
            return JSON.parse(text);
        } catch (e) {
            console.error('Failed to parse Gemini response as JSON:', text);
            // Fallback: try to extract JSON from the text if it's wrapped in backticks
            const jsonMatch = text.match(/```json\n?([\s\S]*?)\n?```/) || text.match(/{[\s\S]*}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[1] || jsonMatch[0]);
            }
            throw new Error('Invalid JSON response from Gemini');
        }
    } catch (error) {
        console.error('Error calling Gemini API:', error);
        throw error;
    }
}

// Helper to provide context to Gemini
export function formatFileContext(files: Record<string, string>) {
    return Object.entries(files)
        .map(([path, content]) => `FILE: ${path}\n\`\`\`\n${content}\n\`\`\``)
        .join('\n\n');
}
