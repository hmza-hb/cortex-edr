import OpenAI from 'openai';

const apiKey = process.env.OPENAI_API_KEY || '';
const openai = new OpenAI({
  apiKey: apiKey,
});

export async function askOpenAI(prompt: string, model: string = "gpt-4o-mini") {
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not defined in environment variables');
  }

  try {
    const response = await openai.chat.completions.create({
      model: model,
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.1,
    });

    const text = response.choices[0].message.content || '{}';

    try {
      return JSON.parse(text);
    } catch (e) {
      console.error('Failed to parse OpenAI response as JSON:', text);
      // Fallback: try to extract JSON from the text if it's wrapped in backticks
      const jsonMatch = text.match(/```json\n?([\s\S]*?)\n?```/) || text.match(/{[\s\S]*}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[1] || jsonMatch[0]);
      }
      throw new Error('Invalid JSON response from OpenAI');
    }
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    throw error;
  }
}

// Helper to provide context to OpenAI
export function formatFileContext(files: Record<string, string>) {
  return Object.entries(files)
    .map(([path, content]) => `FILE: ${path}\n\`\`\`\n${content}\n\`\`\``)
    .join('\n\n');
}
