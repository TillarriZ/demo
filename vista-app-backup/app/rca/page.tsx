"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Button, Card, CardBody, CardHeader, Input, Badge } from "@/components/ui";

type Criticality = "high" | "medium" | "low";

const incidents: { title: string; tags: string[]; criticality: Criticality }[] = [
  { title: "Простой", tags: ["Audit", "RCA", "NCR"], criticality: "medium" },
  { title: "Задержка", tags: ["Ground Ops"], criticality: "low" },
  { title: "Авария", tags: ["HSE"], criticality: "high" },
  { title: "Повреждение", tags: ["Safety"], criticality: "high" },
  { title: "Конфликт", tags: ["Safety"], criticality: "medium" },
  { title: "Неверное решение", tags: ["Ground Ops"], criticality: "medium" },
  { title: "Ошибка", tags: ["HSE"], criticality: "high" },
  { title: "Простой", tags: ["ESG"], criticality: "low" },
  { title: "Задержка", tags: ["Safety"], criticality: "low" },
];

const criticalityLabel: Record<Criticality, string> = {
  high: "Высокий",
  medium: "Средний",
  low: "Низкий",
};

const criticalityVariant: Record<Criticality, "risk-high" | "risk-medium" | "risk-low"> = {
  high: "risk-high",
  medium: "risk-medium",
  low: "risk-low",
};

export default function RCAPage() {
  const [criticalityFilter, setCriticalityFilter] = useState<Criticality | "all">("all");
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analysisDone, setAnalysisDone] = useState(false);

  const filtered = useMemo(() => {
    if (criticalityFilter === "all") return incidents;
    return incidents.filter((i) => i.criticality === criticalityFilter);
  }, [criticalityFilter]);

  const startAnalysis = () => {
    setAnalysisLoading(true);
    setAnalysisDone(false);
    setTimeout(() => {
      setAnalysisLoading(false);
      setAnalysisDone(true);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-slate-800">Root Cause Analysis</h1>
      <div className="flex flex-wrap items-end gap-4 p-4 bg-slate-100 rounded-lg">
        <Input
          label="Название"
          placeholder="Аналитика"
          className="w-40"
        />
        <Input
          label="Тэги"
          placeholder="Audit, NCR..."
          className="w-48"
        />
        <Button
          onClick={startAnalysis}
          loading={analysisLoading}
          size="md"
        >
          Начать анализ
        </Button>
        {analysisDone && (
          <span className="text-sm text-[var(--accent)] font-medium">Готово</span>
        )}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="overflow-hidden">
            <div className="border-b border-slate-200 px-4 py-2 flex gap-4">
              <button type="button" className="text-sm text-slate-600 hover:text-slate-900">
                Анализ Human Factor
              </button>
              <button
                type="button"
                className="text-sm font-medium text-[var(--accent)] border-b-2 border-[var(--accent)]"
              >
                Root Cause Анализ
              </button>
            </div>
            <div className="p-3 border-b border-slate-100 flex flex-wrap items-center gap-2">
              <span className="text-xs font-medium text-slate-500">Критичность:</span>
              {(["all", "high", "medium", "low"] as const).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setCriticalityFilter(f)}
                  className={`px-3 py-1 rounded text-xs font-medium ${
                    criticalityFilter === f
                      ? "bg-[var(--accent)] text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {f === "all" ? "Все" : criticalityLabel[f]}
                </button>
              ))}
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="text-left p-3 font-medium text-slate-700">Заголовок</th>
                  <th className="text-left p-3 font-medium text-slate-700">Критичность</th>
                  <th className="text-left p-3 font-medium text-slate-700">Тэги</th>
                  <th className="w-20" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((inc, i) => (
                  <tr key={i} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="p-3">{inc.title}</td>
                    <td className="p-3">
                      <Badge variant={criticalityVariant[inc.criticality]}>
                        {criticalityLabel[inc.criticality]}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <span className="inline-flex flex-wrap gap-1">
                        {inc.tags.map((t) => (
                          <Badge key={t} variant="default">{t}</Badge>
                        ))}
                      </span>
                    </td>
                    <td className="p-2">
                      <span className="text-[var(--accent)]">✓</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-center gap-1 p-2 border-t border-slate-200">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  className={`w-8 h-8 rounded text-sm min-h-[32px] ${
                    n === 2 ? "bg-[var(--accent)] text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </Card>
        </div>
        <div className="space-y-4">
          <Card accent>
            <CardBody>
              <div className="flex gap-2 text-amber-600 mb-2">⚠ Важно</div>
              <p className="text-sm text-slate-600 mb-4">
                Для определения причинно-следственных связей полезны: смены, нагрузка, доступность
                инструкций, эскалации, «горячие фиксы», изменения условий до события, профили
                сотрудников, история заданий.
              </p>
              <div className="space-y-2">
                <Link href="#" className="text-[var(--accent)] font-medium text-sm block hover:underline">
                  Загрузить данные
                </Link>
                <Link href="#" className="text-[var(--accent)] font-medium text-sm block hover:underline">
                  Начать анализ
                </Link>
              </div>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <h3 className="font-semibold text-slate-800 text-sm mb-2">Действия</h3>
              <div className="space-y-2">
                <Button variant="secondary" size="sm" className="w-full justify-center">
                  Назначить ответственного
                </Button>
                <Button variant="secondary" size="sm" className="w-full justify-center">
                  Добавить корректирующие мероприятия
                </Button>
                <Link href="/digital-twin">
                  <Button variant="ghost" size="sm" className="w-full justify-center">
                    Связать сценарий → Digital Twin
                  </Button>
                </Link>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
