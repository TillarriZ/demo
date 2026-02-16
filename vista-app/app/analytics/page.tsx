"use client";

import { useState, useEffect } from "react";
import Card, { CardBody, CardHeader } from "@/components/ui/Card";
import ReliabilityTrendsChart from "@/app/copilot/trends/ReliabilityTrendsChart";

const YEARS = ["2022", "2023", "2024", "2025"];
const EVENTS_BY_YEAR = [252, 248, 241, 236];
const FATALITIES_BY_YEAR = [248, 245, 238, 231];
const GROUND_BY_YEAR = [18, 14, 12, 10];
const BY_COUNTRY = [
  { name: "США", count: 2095 },
  { name: "Бразилия", count: 274 },
  { name: "Канада", count: 226 },
  { name: "Мексика", count: 128 },
  { name: "Россия", count: 98 },
];
const BY_CONTINENT = [
  { name: "Северная Америка", count: 2049 },
  { name: "Европа", count: 525 },
  { name: "Южная Америка", count: 525 },
  { name: "Азия", count: 183 },
  { name: "Африка", count: 168 },
];
const BY_PHASE = [
  { phase: "Наземная", count: 67 },
  { phase: "Взлёт", count: 446 },
  { phase: "Набор высоты", count: 242 },
  { phase: "Маршрут", count: 966 },
  { phase: "Заход", count: 380 },
  { phase: "Посадка", count: 13 },
  { phase: "Прочее", count: 124 },
];
const BY_CATEGORY = [
  { name: "Частные", count: 368 },
  { name: "Неизвестно", count: 368 },
  { name: "Обучение", count: 347 },
  { name: "Нерегулярные", count: 309 },
  { name: "Executive", count: 185 },
];
const BY_ICAO = [
  { cat: "UNK", count: 459 },
  { cat: "LOC-I", count: 459 },
  { cat: "SCF-PP", count: 421 },
  { cat: "ARC", count: 408 },
  { cat: "RE", count: 343 },
  { cat: "OTHR", count: 164 },
  { cat: "SCF-NP", count: 174 },
  { cat: "FUEL", count: 140 },
];
const INCIDENTS = [
  { date: "15.10.2023", type: "Cessna 208", country: "Франция", fatalities: 1, icao: "UNK" },
  { date: "12.10.2023", type: "Piper PA-46", country: "США", fatalities: 2, icao: "LOC-I" },
  { date: "08.10.2023", type: "Boeing 737", country: "Россия", fatalities: 0, icao: "RE" },
];

const RISK_MATRIX_COLORS: Record<number, string> = {
  1: "#b5d1ad", 2: "#b5d1ad", 3: "#8db881", 4: "#8db881", 5: "#79A471", 6: "#79A471",
  7: "#638e59", 8: "#638e59", 9: "#3b692f", 10: "#3b692f", 11: "#95c740", 12: "#95c740",
  13: "#E4BA6A", 14: "#E4BA6A", 15: "#E4BA6A",
  16: "#cc0000", 17: "#cc0000", 18: "#cc0000", 19: "#cc0000", 20: "#cc0000",
  21: "#990000", 22: "#990000", 23: "#990000", 24: "#990000", 25: "#990000",
};

// Отображаемые значения: левый нижний 25,20,20,16; правый верхний 1,2,2,4; обмен 15↔3 и 12↔6. Цвет по score.
const RISK_MATRIX_DISPLAY: Record<string, number> = {
  "5,1": 5, "5,2": 10, "5,3": 3, "5,4": 2, "5,5": 1,
  "4,1": 4, "4,2": 8, "4,3": 6, "4,4": 4, "4,5": 2,
  "3,1": 15, "3,2": 12, "3,3": 9, "3,4": 6, "3,5": 3,
  "2,1": 20, "2,2": 16, "2,3": 12, "2,4": 8, "2,5": 10,
  "1,1": 25, "1,2": 20, "1,3": 15, "1,4": 4, "1,5": 5,
};

// Реализованные риски по ячейке матрицы (I × L) для отображения в модальном окне
const RISK_CELL_INFO: Record<string, { title: string; risks: string[] }> = {
  "1,1": { title: "Ячейка 25 (I=1, L=1)", risks: ["Р-001 Усталость персонала (критич.)", "Р-011 Ошибка диспетчера / УВД", "Р-016 Нарушение режима труда и отдыха", "Р-017 Несоблюдение требований безопасности"] },
  "1,2": { title: "Ячейка 20 (I=1, L=2)", risks: ["Р-002 Ошибка оператора", "Р-008 Сбой коммуникации", "Р-010 Стресс и давление сроков"] },
  "1,3": { title: "Ячейка 15 (I=1, L=3)", risks: ["Р-003 Нарушение процедур (SOP)", "Р-013 Неправильное применение инструкций"] },
  "1,4": { title: "Ячейка 4 (I=1, L=4)", risks: ["Р-007 Несоответствие документации", "Р-014 Задержка по вине персонала"] },
  "1,5": { title: "Ячейка 5 (I=1, L=5)", risks: ["Р-009 Дефицит внимания / отвлечение"] },
  "2,1": { title: "Ячейка 20 (I=2, L=1)", risks: ["Р-004 Недостаток компетенций", "Р-012 Нарушение регламента техобслуживания"] },
  "2,2": { title: "Ячейка 16 (I=2, L=2)", risks: ["Р-005 Перегрузка / дефицит ресурсов", "Р-018 Ошибка при приёмке/контроле"] },
  "2,3": { title: "Ячейка 12 (I=2, L=3)", risks: ["Р-006 Конфликт в коллективе"] },
  "2,4": { title: "Ячейка 8 (I=2, L=4)", risks: ["Р-015 Травматизм при выполнении работ"] },
  "2,5": { title: "Ячейка 10 (I=2, L=5)", risks: ["Единичные отклонения в офисном блоке"] },
  "3,1": { title: "Ячейка 15 (I=3, L=1)", risks: ["Р-008 Сбой коммуникации между службами", "Ошибки при вводе данных в системах планирования"] },
  "3,2": { title: "Ячейка 12 (I=3, L=2)", risks: ["Усталость и нехватка персонала в диспетчерских службах"] },
  "3,3": { title: "Ячейка 9 (I=3, L=3)", risks: ["Риски наземного обслуживания: квалификация, передача смены"] },
  "3,4": { title: "Ячейка 6 (I=3, L=4)", risks: ["Давление на сокращение времени при обслуживании"] },
  "3,5": { title: "Ячейка 3 (I=3, L=5)", risks: ["Рутинные сбои, единичные отклонения"] },
  "4,1": { title: "Ячейка 4 (I=4, L=1)", risks: ["Р-013 Неправильное применение инструкций"] },
  "4,2": { title: "Ячейка 8 (I=4, L=2)", risks: ["Р-018 Ошибка при приёмке/контроле"] },
  "4,3": { title: "Ячейка 6 (I=4, L=3)", risks: ["Нарушение процедур при заправке"] },
  "4,4": { title: "Ячейка 4 (I=4, L=4)", risks: ["Неверные решения в нестандартных ситуациях"] },
  "4,5": { title: "Ячейка 2 (I=4, L=5)", risks: ["Минимальный риск"] },
  "5,1": { title: "Ячейка 5 (I=5, L=1)", risks: ["Р-001 Усталость персонала (низкая вероятность)"] },
  "5,2": { title: "Ячейка 10 (I=5, L=2)", risks: ["Нехватка персонала ATC"] },
  "5,3": { title: "Ячейка 3 (I=5, L=3)", risks: ["Усталость экипажа и диспетчеров"] },
  "5,4": { title: "Ячейка 2 (I=5, L=4)", risks: ["Критические комбинации (редко)"] },
  "5,5": { title: "Ячейка 1 (I=5, L=5)", risks: ["Минимальная тяжесть и вероятность"] },
};

function AnalyticsRiskMatrix({ onCellClick }: { onCellClick: (imp: number, lik: number, score: number, displayVal: number) => void }) {
  return (
    <div className="flex flex-col gap-1 w-full max-w-[320px] mx-auto">
      {/* Подписи 1,2,3,4,5 непосредственно над каждым столбцом */}
      <div className="flex gap-1">
        <span className="w-6 shrink-0 text-[10px] font-medium text-slate-400 flex items-center justify-center">L</span>
        <div className="grid grid-cols-5 gap-1 flex-1 min-w-0">
          {[1, 2, 3, 4, 5].map((n) => (
            <span key={n} className="flex items-center justify-center text-[10px] font-medium text-slate-600 aspect-square min-w-0">
              {n}
            </span>
          ))}
        </div>
      </div>
      <div className="flex gap-1">
        <span className="w-6 shrink-0 text-[10px] font-medium text-slate-500 flex items-center justify-center">I</span>
        <div className="grid grid-cols-5 gap-1 flex-1 min-w-0">
          {[5, 4, 3, 2, 1].map((imp) =>
            [1, 2, 3, 4, 5].map((lik) => {
              const score = imp * lik;
              const displayVal = RISK_MATRIX_DISPLAY[`${imp},${lik}`] ?? score;
              const cellKey = `${imp},${lik}`;
              const riskCount = RISK_CELL_INFO[cellKey]?.risks?.length ?? 0;
              const bg = RISK_MATRIX_COLORS[score] ?? "#e6e6e6";
              const isRed = score >= 16;
              return (
                <button
                  key={`${imp}-${lik}`}
                  type="button"
                  onClick={() => onCellClick(imp, lik, score, displayVal)}
                  className={`aspect-square min-w-[36px] min-h-[36px] rounded flex items-center justify-center text-[11px] font-semibold cursor-pointer hover:ring-2 hover:ring-offset-0.5 hover:ring-slate-400 active:scale-95 transition-transform ${isRed ? "text-white" : "text-slate-800"}`}
                  style={{ backgroundColor: bg }}
                  title={`Ячейка (I=${imp}, L=${lik}). Реализовалось рисков: ${riskCount}. Нажмите для подробностей.`}
                >
                  {riskCount}
                </button>
              );
            })
          )}
        </div>
      </div>
      <p className="text-[10px] text-slate-400 pl-8">L →</p>
    </div>
  );
}

type RiskCellSelection = { imp: number; lik: number; score: number; displayVal: number } | null;

export default function AnalyticsPage() {
  const [fatal, setFatal] = useState(true);
  const [nonFatal, setNonFatal] = useState(true);
  const [land, setLand] = useState(true);
  const [water, setWater] = useState(true);
  const [riskCellModal, setRiskCellModal] = useState<RiskCellSelection>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setRiskCellModal(null);
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  const maxEv = Math.max(...EVENTS_BY_YEAR);
  const minEv = Math.min(...EVENTS_BY_YEAR);
  const rangeEv = maxEv - minEv || 1;
  const maxFat = Math.max(...FATALITIES_BY_YEAR);
  const minFat = Math.min(...FATALITIES_BY_YEAR);
  const rangeFat = maxFat - minFat || 1;
  const maxGround = Math.max(...GROUND_BY_YEAR);
  const maxPhase = Math.max(...BY_PHASE.map((p) => p.count));

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-slate-800">Аналитика</h1>
      <p className="text-slate-600 text-sm">
        Анализ и отчётность по рискам Human Factor: события, фазы полёта, категории, карта рисков.
      </p>

      {/* КПИ, затем строка: События по фазе полёта | Матрица рисков (низ матрицы = низ графика фазы), затем тренды */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Card className="bg-white border-slate-200">
            <CardBody className="py-3 flex flex-col">
              <p className="text-xl font-bold text-slate-800">977</p>
              <p className="text-xs font-medium text-slate-600">События на земле и в воздухе</p>
              <div className="flex items-end gap-1 h-[4.5rem] mt-1 shrink-0">
                {EVENTS_BY_YEAR.map((v, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center justify-end gap-0.5 min-w-0 h-full">
                    <div className="w-full rounded-t bg-[#638e59]" style={{ height: `${Math.max(8, ((v - minEv) / rangeEv) * 100)}%`, minHeight: 8 }} />
                    <span className="text-[10px] text-slate-500 flex-shrink-0">{YEARS[i]}</span>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
          <Card className="bg-white border-slate-200">
            <CardBody className="py-3 flex flex-col">
              <p className="text-xl font-bold text-slate-800">923</p>
              <p className="text-xs font-medium text-slate-600">Инциденты на земле</p>
              <div className="flex items-end gap-1 h-[4.5rem] mt-1 shrink-0">
                {FATALITIES_BY_YEAR.map((v, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center justify-end gap-0.5 min-w-0 h-full">
                    <div className="w-full rounded-t bg-[#79A471]" style={{ height: `${Math.max(8, ((v - minFat) / rangeFat) * 100)}%`, minHeight: 8 }} />
                    <span className="text-[10px] text-slate-500 flex-shrink-0">{YEARS[i]}</span>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
          <Card className="bg-white border-slate-200">
            <CardBody className="py-3 flex flex-col">
              <p className="text-xl font-bold text-slate-800">54</p>
              <p className="text-xs font-medium text-slate-600">Инциденты в воздухе</p>
              <div className="flex items-end gap-1 h-[4.5rem] mt-1 shrink-0">
                {GROUND_BY_YEAR.map((v, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center justify-end gap-0.5 min-w-0 h-full">
                    <div className="w-full rounded-t bg-[#8db881]" style={{ height: `${Math.max(8, (v / maxGround) * 100)}%`, minHeight: 8 }} />
                    <span className="text-[10px] text-slate-500 flex-shrink-0">{YEARS[i]}</span>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Профессиональная надёжность (слева) | Матрица рисков (справа, половина экрана) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          <Card className="flex flex-col min-h-0">
            <CardHeader className="py-2 flex-shrink-0">
              <h2 className="font-semibold text-slate-800 text-sm">Профессиональная надёжность: тренды</h2>
            </CardHeader>
            <CardBody className="pt-0 flex-1 min-h-0">
              <ReliabilityTrendsChart />
            </CardBody>
          </Card>
          <Card className="flex flex-col">
            <CardHeader className="py-2">
              <h2 className="font-semibold text-slate-800 text-sm">Матрица рисков</h2>
            </CardHeader>
            <CardBody className="pt-0 flex-1 flex flex-col min-h-0">
              <div className="flex-1 flex flex-col min-h-0">
                <AnalyticsRiskMatrix onCellClick={(imp, lik, score, displayVal) => setRiskCellModal({ imp, lik, score, displayVal })} />
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Модальное окно: реализованные риски по ячейке матрицы */}
        {riskCellModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50" onClick={() => setRiskCellModal(null)} aria-hidden />
            <div
              className="relative bg-white rounded-xl shadow-xl border border-[var(--border)] w-full max-w-md max-h-[85vh] overflow-y-auto"
              role="dialog"
              aria-labelledby="risk-cell-title"
            >
              <div className="sticky top-0 bg-white border-b border-[var(--border)] px-4 py-3 flex items-center justify-between">
                <h2 id="risk-cell-title" className="text-base font-semibold text-slate-800">
                  {RISK_CELL_INFO[`${riskCellModal.imp},${riskCellModal.lik}`]?.title ?? `Ячейка ${riskCellModal.displayVal} (I=${riskCellModal.imp}, L=${riskCellModal.lik})`}
                </h2>
                <button
                  type="button"
                  onClick={() => setRiskCellModal(null)}
                  className="p-2 rounded hover:bg-slate-100 text-slate-600"
                  aria-label="Закрыть"
                >
                  ×
                </button>
              </div>
              <div className="p-4">
                <p className="text-xs text-slate-500 mb-3">
                  Реализованные риски, отнесённые к данной ячейке матрицы (тяжесть I × вероятность L = {riskCellModal.displayVal}).
                </p>
                <ul className="space-y-2 text-sm text-slate-700">
                  {(RISK_CELL_INFO[`${riskCellModal.imp},${riskCellModal.lik}`]?.risks ?? ["Нет зафиксированных реализаций по данной ячейке."]).map((r, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-[var(--accent)] mt-0.5">•</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* События по фазе полёта (слева) | Пояснение к матрице рисков (справа) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <Card className="flex flex-col">
            <CardHeader className="py-2">
              <h2 className="font-semibold text-slate-800 text-sm">События по фазе полёта</h2>
            </CardHeader>
            <CardBody className="pt-0 pb-3">
              <div className="flex items-end gap-2" style={{ maxHeight: "140px" }}>
                {BY_PHASE.map((p, i) => (
                  <div key={i} className="flex-1 min-w-[56px] max-w-[72px] flex flex-col items-center gap-0.5">
                    <span className="text-[11px] font-medium text-slate-600">{p.count}</span>
                    <div className="w-full rounded-t bg-[#638e59]" style={{ height: `${Math.max(6, (p.count / maxPhase) * 80)}px` }} />
                    <span className="text-[10px] text-slate-500 text-center whitespace-nowrap">{p.phase}</span>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
          <Card className="flex flex-col">
            <CardHeader className="py-2">
              <h2 className="font-semibold text-slate-800 text-sm">Пояснение к матрице рисков</h2>
            </CardHeader>
            <CardBody className="pt-0">
              <div className="text-[11px] text-slate-600 space-y-2">
                <p><strong className="text-slate-700">Ось I (вертикаль)</strong> — влияние/тяжесть последствий риска (1 — минимальное, 5 — критическое). <strong className="text-slate-700">Ось L (горизонталь)</strong> — вероятность (1–5). Число в ячейке — количество реализовавшихся рисков в данной ячейке (I×L). Цвет ячейки — по уровню риска (1–25); красная зона требует немедленного внимания.</p>
                <p><strong className="text-slate-700">Цвета</strong> — от светлых (низкий риск) к тёмно-зелёным и красным (высокий). Красная зона (16–25) требует немедленного внимания.</p>
                <p><strong className="text-slate-700">Связь с данными по сайту.</strong> Квадраты 1–5 (левый нижний угол) соответствуют низкой тяжести и вероятности — например рутинные сбои в офисном блоке или единичные отклонения. Ячейки 6–12 (средняя зона) — типичные риски Human Factor по подразделениям: усталость и нехватка персонала в диспетчерских службах (см. Реестр рисков), сбои коммуникации между службами, ошибки при вводе данных в системах планирования. Оранжевые и высокие зелёные (12–15) — риски наземного обслуживания и летной службы (квалификация, передача смены, давление на сокращение времени). Квадраты 16–25 (правый верхний угол) — критические комбинации «высокая вероятность × тяжёлые последствия»: нехватка персонала ATC, усталость экипажа и диспетчеров, нарушение процедур при заправке, неверные решения в нестандартных ситуациях. Эти же направления отражены в Мониторе (показатели HF по подразделениям), в трендах проф. надёжности (летная служба, наземное обслуживание, диспетчерские службы, офисный блок) и в разделе RCA при анализе инцидентов.</p>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Фильтры */}
      <Card>
        <CardHeader>
          <h2 className="font-semibold text-slate-800 text-sm">Фильтры</h2>
        </CardHeader>
        <CardBody className="pt-0">
          <div className="flex flex-wrap gap-6">
            <div>
              <p className="text-xs text-slate-500 mb-1">Тип ВС</p>
              <select className="border border-slate-300 rounded px-2 py-1 text-sm">
                <option>Все</option>
                <option>Jet</option>
                <option>Piston</option>
                <option>Turboprop</option>
              </select>
            </div>
            <div className="flex gap-4">
              <label className="flex items-center gap-1 text-sm text-slate-700">
                <input type="checkbox" checked={fatal} onChange={(e) => setFatal(e.target.checked)} className="rounded" />
                Fatal
              </label>
              <label className="flex items-center gap-1 text-sm text-slate-700">
                <input type="checkbox" checked={nonFatal} onChange={(e) => setNonFatal(e.target.checked)} className="rounded" />
                Non fatal
              </label>
            </div>
            <div className="flex gap-4">
              <label className="flex items-center gap-1 text-sm text-slate-700">
                <input type="checkbox" checked={land} onChange={(e) => setLand(e.target.checked)} className="rounded" />
                Land
              </label>
              <label className="flex items-center gap-1 text-sm text-slate-700">
                <input type="checkbox" checked={water} onChange={(e) => setWater(e.target.checked)} className="rounded" />
                Water
              </label>
            </div>
            <div className="flex gap-4">
              <label className="flex items-center gap-1 text-sm text-slate-700">
                <input type="checkbox" defaultChecked className="rounded" />
                Airplane
              </label>
              <label className="flex items-center gap-1 text-sm text-slate-700">
                <input type="checkbox" defaultChecked className="rounded" />
                Helicopter
              </label>
            </div>
          </div>
        </CardBody>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h2 className="font-semibold text-slate-800 text-sm">По стране происхождения</h2>
          </CardHeader>
          <CardBody className="pt-0 max-h-48 overflow-y-auto">
            <ul className="space-y-1 text-sm">
              {BY_COUNTRY.map((c, i) => (
                <li key={i} className="flex justify-between">
                  <span className="text-slate-700">{c.name}</span>
                  <span className="font-medium text-slate-800">{c.count}</span>
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>
        <Card>
          <CardHeader>
            <h2 className="font-semibold text-slate-800 text-sm">По континенту</h2>
          </CardHeader>
          <CardBody className="pt-0 max-h-48 overflow-y-auto">
            <ul className="space-y-1 text-sm">
              {BY_CONTINENT.map((c, i) => (
                <li key={i} className="flex justify-between">
                  <span className="text-slate-700">{c.name}</span>
                  <span className="font-medium text-slate-800">{c.count}</span>
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h2 className="font-semibold text-slate-800 text-sm">По категории</h2>
          </CardHeader>
          <CardBody className="pt-0">
            <ul className="space-y-2 text-sm">
              {BY_CATEGORY.map((c, i) => (
                <li key={i} className="flex justify-between">
                  <span className="text-slate-700">{c.name}</span>
                  <span className="font-medium text-slate-800">{c.count}</span>
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>
        <Card>
          <CardHeader>
            <h2 className="font-semibold text-slate-800 text-sm">По категории ICAO</h2>
          </CardHeader>
          <CardBody className="pt-0">
            <ul className="space-y-2 text-sm">
              {BY_ICAO.map((c, i) => (
                <li key={i} className="flex justify-between">
                  <span className="text-slate-700">{c.cat}</span>
                  <span className="font-medium text-slate-800">{c.count}</span>
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>
      </div>

      {/* Таблица инцидентов */}
      <Card>
        <CardHeader>
          <h2 className="font-semibold text-slate-800 text-sm">Список инцидентов</h2>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="text-left p-2 font-medium text-slate-700">Дата</th>
                <th className="text-left p-2 font-medium text-slate-700">Тип</th>
                <th className="text-left p-2 font-medium text-slate-700">Страна</th>
                <th className="text-left p-2 font-medium text-slate-700">Погибшие</th>
                <th className="text-left p-2 font-medium text-slate-700">ICAO</th>
              </tr>
            </thead>
            <tbody>
              {INCIDENTS.map((r, i) => (
                <tr key={i} className="border-b border-slate-100">
                  <td className="p-2 text-slate-700">{r.date}</td>
                  <td className="p-2 text-slate-700">{r.type}</td>
                  <td className="p-2 text-slate-700">{r.country}</td>
                  <td className="p-2 text-slate-700">{r.fatalities}</td>
                  <td className="p-2 text-slate-700">{r.icao}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <CardBody className="border-t border-slate-200 pt-2">
          <p className="text-xs text-slate-500">Всего погибших: 2317 (сводка)</p>
        </CardBody>
      </Card>

      {/* Рекомендации */}
      <Card className="border-l-4 border-l-[var(--accent)]">
        <CardHeader>
          <h2 className="font-semibold text-slate-800 text-sm">Рекомендации по разделу Аналитика</h2>
        </CardHeader>
        <CardBody className="pt-0">
          <ul className="text-sm text-slate-700 space-y-2">
            <li>• <strong>Карта происшествий (Accident Map):</strong> добавить интерактивную карту мира с плотностью инцидентов по регионам.</li>
            <li>• <strong>Распределение рисков по группам:</strong> scatter-диаграмма «группы персонала × время» с типами (ошибки, нарушения, неверные решения) для приоритизации HF-мер.</li>
            <li>• <strong>Final report publicly released:</strong> stacked bar по годам (да/нет) для отслеживания прозрачности отчётности.</li>
            <li>• <strong>Экспорт:</strong> выгрузка в Excel/PDF и настройка алертов по порогам (события, погибшие, категория ICAO).</li>
            <li>• <strong>Связь с RCA:</strong> переход к анализу причин по клику на строку инцидента или категорию.</li>
          </ul>
        </CardBody>
      </Card>
    </div>
  );
}
