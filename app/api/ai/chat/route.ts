import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const { message, context } = await req.json();
    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Missing 'message'" }, { status: 400 });
    }
    const apiKey = process.env.MISTRAL_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Missing MISTRAL_API_KEY" }, { status: 500 });
    }

    const system = `You are a helpful habit coach inside the MicroManager app. You can see a compact JSON context about the user's habits, entries and stats. Answer concisely and tailor advice to the data. If the user asks for actions, propose clear, small next steps. Avoid hallucinations; if data is missing, say what else you need.`;

    const userContent = [
      { role: "system", content: system },
      { role: "user", content: `USER QUESTION:\n${message}\n\nCONTEXT (JSON):\n${JSON.stringify(context ?? {}, null, 2)}` },
    ];

    const resp = await fetch("https://api.mistral.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "mistral-small-latest",
        messages: userContent,
        temperature: 0.3,
        max_tokens: 800,
      }),
    });

    if (!resp.ok) {
      const text = await resp.text();
      return NextResponse.json({ error: `Mistral error: ${text}` }, { status: 500 });
    }
    const data = await resp.json();
    const content: string = data.choices?.[0]?.message?.content ?? "";
    return NextResponse.json({ content });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Unexpected error" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: "POST only. Send { message, context } to receive a tailored AI response.",
    example: { message: "Give me a short consistency report", context: {} },
  });
}
