// app/api/suggest-messages/route.ts

import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY!,
  baseURL: "https://openrouter.ai/api/v1",
});

export const runtime = 'edge';

export async function POST() {
  try {
    const systemPrompt = {
      role: 'system' as const,
      content: `
You are a creative assistant helping users write short, anonymous messages on a platform called "GhostWhisper".

Your goal is to make the recipient smile, feel valued, or inspired.

Messages should be:
- Friendly, kind, playful, or emotional
- Always anonymous and under 30 words
- Never include personal info, insults, or anything inappropriate

Reply with only the message content. One suggestion per request.
      `.trim(),
    };

    const [res1, res2, res3] = await Promise.all([
      openai.chat.completions.create({ model: 'gpt-3.5-turbo', stream: false, messages: [systemPrompt] }),
      openai.chat.completions.create({ model: 'gpt-3.5-turbo', stream: false, messages: [systemPrompt] }),
      openai.chat.completions.create({ model: 'gpt-3.5-turbo', stream: false, messages: [systemPrompt] }),
    ]);

    const messages = [
      res1.choices[0].message?.content?.trim() || '',
      res2.choices[0].message?.content?.trim() || '',
      res3.choices[0].message?.content?.trim() || '',
    ];

    return new Response(JSON.stringify({ messages }), {
      headers: {
        'Content-Type': 'application/json',
      },
    });

  } catch (error) {
    console.error('API error:', error);
    return new Response(JSON.stringify({ error: 'Failed to generate messages.' }), { status: 500 });
  }
}
