import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { scenarioId, params } = body as { scenarioId?: string; params?: Record<string, unknown> };
    if (!scenarioId) {
      return NextResponse.json({ error: "Требуется scenarioId" }, { status: 400 });
    }
    // Заглушка для симулятора what-if
    return NextResponse.json({
      scenarioId,
      kpi: { reliability: 0.85, cost: 120000, riskScore: 0.22 },
      comparison: null,
      message: "Симулятор сценариев — в разработке.",
    });
  } catch {
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
