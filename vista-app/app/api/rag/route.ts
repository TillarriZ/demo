import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, context } = body as { query?: string; context?: string };
    if (!query || typeof query !== "string") {
      return NextResponse.json({ error: "Требуется поле query" }, { status: 400 });
    }
    // Заглушка для RAG: поиск по инструкциям/документации
    return NextResponse.json({
      results: [
        { snippet: "Инструкция по действиям при сбое...", source: "wiki/sop-001", score: 0.92 },
        { snippet: "Правило эскалации конфликтов...", source: "wiki/procedures", score: 0.87 },
      ],
      answer: `По запросу «${query.slice(0, 30)}» найдены релевантные инструкции. RAG-поиск — в разработке.`,
    });
  } catch {
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
