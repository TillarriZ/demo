import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message } = body as { message?: string };
    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Требуется поле message" }, { status: 400 });
    }
    // Заглушка для интеграции с AI-ботом (LLM/RAG)
    return NextResponse.json({
      reply: `Ответ на: «${message.slice(0, 50)}...». Интеграция с AI-ботом — в разработке.`,
    });
  } catch {
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
