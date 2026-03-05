import { NextRequest, NextResponse } from 'next/server';

const DEEPSEEK_API_URL = 'https://api.deepseek.com/chat/completions';

const SYSTEM_PROMPTS: Record<string, string> = {
  rewrite: 'You are a writing assistant. Rewrite the given text to be clearer and more professional while preserving the original meaning. Return ONLY the rewritten text, nothing else.',
  summarize: 'You are a writing assistant. Summarize the given text concisely in 1-3 sentences. Return ONLY the summary, nothing else.',
  grammar: 'You are a grammar checker. Fix all grammar, spelling, and punctuation errors in the given text. Return ONLY the corrected text, nothing else.',
  expand: 'You are a writing assistant. Expand the given text with more detail and context while keeping the same tone. Return ONLY the expanded text, nothing else.',
  shorten: 'You are a writing assistant. Make the given text more concise without losing key information. Return ONLY the shortened text, nothing else.',
  formal: 'You are a writing assistant. Rewrite the given text in a formal, professional tone. Return ONLY the rewritten text, nothing else.',
  casual: 'You are a writing assistant. Rewrite the given text in a casual, friendly tone. Return ONLY the rewritten text, nothing else.',
};

export async function POST(req: NextRequest) {
  try {
    const { text, action } = await req.json();

    if (!text || !action) {
      return NextResponse.json({ error: 'Missing text or action' }, { status: 400 });
    }

    const systemPrompt = SYSTEM_PROMPTS[action];
    if (!systemPrompt) {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'DeepSeek API key not configured' }, { status: 500 });
    }

    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: text },
        ],
        temperature: 0.7,
        max_tokens: 2048,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('DeepSeek API error:', errorData);
      return NextResponse.json({ error: 'AI service error' }, { status: 502 });
    }

    const data = await response.json();
    const result = data.choices?.[0]?.message?.content?.trim();

    if (!result) {
      return NextResponse.json({ error: 'No response from AI' }, { status: 502 });
    }

    return NextResponse.json({ result });
  } catch (error) {
    console.error('AI route error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
