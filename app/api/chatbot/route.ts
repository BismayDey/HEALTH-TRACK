import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 },
      );
    }

    const systemMessage = {
      role: 'system',
      content: `You are HealthAI, a friendly and supportive personal health assistant.
      Provide **brief and to-the-point** responses (1-3 sentences max).
      Your job is to give **concise** health tips, self-care advice, and encourage users to seek medical attention when needed.
      Be **warm, empathetic, and informative**, but avoid medical diagnoses or excessive details.`,
    };

    const openRouterResponse = await fetch(
      `https://openrouter.ai/api/v1/chat/completions`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'google/gemma-3-12b-it:free',
          messages: [systemMessage, { role: 'user', content: message }],
          max_tokens: 60, // Limits response length
        }),
      },
    );

    if (!openRouterResponse.ok) {
      throw new Error(`OpenRouter API Error: ${openRouterResponse.statusText}`);
    }

    const data = await openRouterResponse.json();
    const reply =
      data.choices?.[0]?.message?.content ||
      "I'm here to help! Can you tell me more about your concern?";

    return NextResponse.json({ reply });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 },
    );
  }
}
