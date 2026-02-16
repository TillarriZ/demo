import Link from "next/link";
import Card, { CardBody } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

const valueProposition = "Снижаем риски человеческого фактора и затраты на инциденты.";
const modules = [
  { href: "/rca", titleRu: "Анализ инцидента", titleEn: "Root Cause Analysis" },
  { href: "/calculator", titleRu: "Анализ системы", titleEn: "Human Factor - Calculator" },
  { href: "/copilot", titleRu: "Ассистент Сотрудника", titleEn: "Employee CoPilot" },
  { href: "/anomalies", titleRu: "Детектор аномалий", titleEn: "Real-time Anomalies Detector" },
  { href: "/digital-twin", titleRu: "Digital Twin и симулятор", titleEn: "Digital Twin & Strategy Simulator" },
];

/** Данные для дашборда рисков (позже — с API) */
const riskSummary = {
  openIncidents: 9,
  activeWarnings: 6,
  trendUp: false,
};

export default function HomePage() {
  return (
    <div className="space-y-8">
      {/* Value proposition — первый экран */}
      <p className="text-center text-lg font-medium text-[var(--accent)] border-l-4 border-[var(--accent)] pl-4 py-2 bg-[var(--accent-light)] rounded-r-lg max-w-2xl">
        {valueProposition}
      </p>

      {/* Дашборд рисков */}
      <Card accent>
        <CardBody>
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
            Панель рисков
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              href="/rca"
              className="flex items-center justify-between p-4 rounded-lg bg-slate-50 hover:bg-[var(--accent-light)] transition-colors border border-transparent hover:border-[var(--accent)]"
            >
              <span className="text-sm font-medium text-slate-700">Открытые инциденты</span>
              <span className="text-2xl font-bold text-[var(--accent)]">{riskSummary.openIncidents}</span>
            </Link>
            <Link
              href="/anomalies"
              className="flex items-center justify-between p-4 rounded-lg bg-slate-50 hover:bg-[var(--accent-light)] transition-colors border border-transparent hover:border-[var(--accent)]"
            >
              <span className="text-sm font-medium text-slate-700">Активные предупреждения</span>
              <span className="text-2xl font-bold text-[var(--risk-orange)]">{riskSummary.activeWarnings}</span>
            </Link>
            <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50">
              <span className="text-sm font-medium text-slate-700">Тренд за период</span>
              <Badge variant={riskSummary.trendUp ? "warning" : "success"}>
                {riskSummary.trendUp ? "↑ Рост" : "↓ Снижение"}
              </Badge>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Перейдите в <Link href="/rca" className="text-[var(--accent)] hover:underline">RCA</Link>,{" "}
            <Link href="/anomalies" className="text-[var(--accent)] hover:underline">Аномалии</Link> или{" "}
            <Link href="/calculator" className="text-[var(--accent)] hover:underline">Калькулятор HF</Link> для деталей.
          </p>
        </CardBody>
      </Card>

      {/* Онбординг: первые шаги */}
      <Card>
        <CardBody>
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Рекомендуем начать с
          </h2>
          <ol className="list-decimal list-inside space-y-2 text-sm text-slate-700">
            <li>
              <Link href="/rca" className="text-[var(--accent)] font-medium hover:underline">
                Загрузить данные об инцидентах
              </Link>{" "}
              и запустить Root Cause Analysis.
            </li>
            <li>
              <Link href="/calculator" className="text-[var(--accent)] font-medium hover:underline">
                Настроить граф процессов и сотрудников
              </Link>{" "}
              в Калькуляторе HF.
            </li>
            <li>
              <Link href="/digital-twin" className="text-[var(--accent)] font-medium hover:underline">
                Создать сценарии «что если»
              </Link>{" "}
              в Digital Twin.
            </li>
          </ol>
        </CardBody>
      </Card>

      {/* Ключевые метрики (бренд) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-[var(--border)] shadow-sm p-4 border-l-4 border-l-[var(--accent)]">
          <div className="text-2xl font-bold text-[var(--accent)]">5</div>
          <div className="text-xs text-slate-500">Модулей анализа</div>
        </div>
        <div className="bg-white rounded-xl border border-[var(--border)] shadow-sm p-4 border-l-4 border-l-[var(--accent)]">
          <div className="text-2xl font-bold text-[var(--accent)]">RCA</div>
          <div className="text-xs text-slate-500">Причинно-следственный анализ</div>
        </div>
        <div className="bg-white rounded-xl border border-[var(--border)] shadow-sm p-4 border-l-4 border-l-[var(--accent)]">
          <div className="text-2xl font-bold text-[var(--accent)]">24/7</div>
          <div className="text-xs text-slate-500">Детектор аномалий</div>
        </div>
        <div className="bg-white rounded-xl border border-[var(--border)] shadow-sm p-4 border-l-4 border-l-[var(--accent)]">
          <div className="text-2xl font-bold text-[var(--accent)]">What if</div>
          <div className="text-xs text-slate-500">Симулятор сценариев</div>
        </div>
      </div>

      {/* Выберите задачу */}
      <Card>
        <CardBody className="text-center max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold text-slate-800 mb-2">
            Добро пожаловать в Vista AI-Human Factor & RCA
          </h1>
          <p className="text-slate-600 mb-6">
            Для анализа и оценки состояния системы человеческого фактора вашей компании нам понадобятся
            данные о процессах, ролях, инструментах и истории инцидентов.
          </p>
          <p className="text-slate-700 font-medium mb-4">Выберите задачу</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-left">
            {modules.map((m) => (
              <Link
                key={m.href}
                href={m.href}
                className="block p-4 rounded-lg border-2 border-[var(--border)] bg-slate-50 hover:border-[var(--accent)] hover:bg-[var(--accent-light)] transition-colors"
              >
                <div className="font-medium text-slate-800">{m.titleRu}</div>
                <div className="text-sm text-slate-500 mt-1">{m.titleEn}</div>
              </Link>
            ))}
          </div>
        </CardBody>
      </Card>

      <p className="text-center text-sm text-slate-500">
        Интеллектуальный обзор деятельности компании. Выявление и прогноз рисков Human Factor.
        Предотвращение негативных последствий.
      </p>
    </div>
  );
}
