"use client";

import { useState } from "react";
import Link from "next/link";
import Card, { CardBody } from "@/components/ui/Card";
import Button from "@/components/ui/Button";

const INDUSTRIES = ["Авиация", "Транспорт", "Промышленность", "Энергетика", "Другое"];
const COMPANY_SIZES = ["До 100", "100–500", "500–1000", "Более 1000"];
const DOC_OPTIONS = ["Минимальная", "Базовая", "Расширенная", "Полная"];
const FREQ_OPTIONS = ["1", "2", "3–4", "5 и более"];
const INCIDENT_TYPES = [
  "Неверные решения",
  "Невнимательность",
  "Пробел знаний",
  "Слабое взаимодействие",
  "Самонадеянность",
  "Давление на исполнителя",
  "Стресс/усталость",
  "Ошибки исполнения",
  "Нарушения процедур",
  "Инциденты безопасности",
  "Комплексные",
];
const COST_OPTIONS = ["Неизвестно", "До 100 тыс.", "100–500 тыс.", "500 тыс.–1 млн", "Более 1 млн"];

const UPLOAD_CATEGORIES = [
  "Документы о компании",
  "Стандарты",
  "Технологии работ",
  "Регламенты работ",
  "Должностные инструкции",
  "Другие документы",
];

const SLIDER_FACTORS_LEFT = [
  "Коммуникации",
  "Уровень знаний персонала",
  "Командная работа",
  "Наличие ресурсов",
  "Наличие напористости (персонал)",
  "Осведомленность персонала",
];
const SLIDER_FACTORS_RIGHT = [
  "Наличие самонадеянности (персонал)",
  "Факторы отвлечения",
  "Факторы усталости",
  "Факторы давления",
  "Факторы стресса",
  "Наличие неформальных норм",
];

export default function CalculatorCostPage() {
  const [industry, setIndustry] = useState("");
  const [companySize, setCompanySize] = useState("");
  const [docLevel, setDocLevel] = useState("");
  const [briefingFreq, setBriefingFreq] = useState("");
  const [trainingFreq, setTrainingFreq] = useState("");
  const [incidentsPerYear, setIncidentsPerYear] = useState("");
  const [incidentsPerMonth, setIncidentsPerMonth] = useState("");
  const [incidentTypes, setIncidentTypes] = useState("");
  const [avgCost, setAvgCost] = useState("");
  const [repetitionsPerQuarter, setRepetitionsPerQuarter] = useState("");
  const [hasRiskPlan, setHasRiskPlan] = useState<"yes" | "no">("no");
  const [hasVoluntaryReports, setHasVoluntaryReports] = useState<"yes" | "no">("no");
  const [planExecution, setPlanExecution] = useState(50);

  const [sliderValues, setSliderValues] = useState<Record<string, number>>({});
  const setSlider = (key: string, v: number) => setSliderValues((p) => ({ ...p, [key]: v }));

  const [analysisName, setAnalysisName] = useState("Аналитика");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [uploadedByCategory, setUploadedByCategory] = useState<Record<string, File[]>>({});
  const [expectedResults, setExpectedResults] = useState("");
  const [calculated, setCalculated] = useState(false);
  const [resultOpen, setResultOpen] = useState(false);

  const addFile = (category: string, list: FileList | null) => {
    if (!list?.length) return;
    setUploadedByCategory((p) => ({ ...p, [category]: [...(p[category] || []), ...Array.from(list)] }));
  };
  const removeFile = (category: string, i: number) => {
    setUploadedByCategory((p) => ({ ...p, [category]: (p[category] || []).filter((_, idx) => idx !== i) }));
  };

  const runCalculation = () => setCalculated(true);
  const showResult = () => setResultOpen(true);

  return (
    <div className="space-y-6">
      <Link href="/calculator" className="text-sm text-[var(--accent)] hover:underline">
        ← HF-Calculator
      </Link>
      <h1 className="text-xl font-bold text-slate-800">Расчёт стоимости</h1>

      <Card>
        <CardBody className="space-y-8">
          {/* Блок 1 — как 31: параметры компании и инцидентов */}
          <div>
            <h2 className="text-lg font-semibold text-slate-800 mb-1">Оцените систему Human Factor в компании</h2>
            <p className="text-slate-600 text-sm mb-4">Получите оценку финансовых потерь и план действий без интеграций.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Отрасль</label>
                <select value={industry} onChange={(e) => setIndustry(e.target.value)} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--accent)]">
                  <option value="">Выберите отрасль</option>
                  {INDUSTRIES.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Размер компании</label>
                <select value={companySize} onChange={(e) => setCompanySize(e.target.value)} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--accent)]">
                  <option value="">Выберите размер</option>
                  {COMPANY_SIZES.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Документация</label>
                <select value={docLevel} onChange={(e) => setDocLevel(e.target.value)} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--accent)]">
                  <option value="">Выберите</option>
                  {DOC_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Периодичность обучения сотрудников в год</label>
                <select value={trainingFreq} onChange={(e) => setTrainingFreq(e.target.value)} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--accent)]">
                  <option value="">Выберите</option>
                  {FREQ_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Периодичность инструктажей в месяц</label>
                <select value={briefingFreq} onChange={(e) => setBriefingFreq(e.target.value)} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--accent)]">
                  <option value="">Выберите</option>
                  {FREQ_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Количество инцидентов за год</label>
                <select value={incidentsPerYear} onChange={(e) => setIncidentsPerYear(e.target.value)} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--accent)]">
                  <option value="">Выберите</option>
                  <option value="0-5">0–5</option>
                  <option value="6-20">6–20</option>
                  <option value="21-50">21–50</option>
                  <option value="50+">50+</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Типы инцидентов</label>
                <select value={incidentTypes} onChange={(e) => setIncidentTypes(e.target.value)} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--accent)]">
                  <option value="">Выберите типы</option>
                  {INCIDENT_TYPES.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Число инцидентов в месяц</label>
                <select value={incidentsPerMonth} onChange={(e) => setIncidentsPerMonth(e.target.value)} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--accent)]">
                  <option value="">Выберите</option>
                  <option value="0">0</option>
                  <option value="1-2">1–2</option>
                  <option value="3-5">3–5</option>
                  <option value="5+">5+</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Средняя стоимость инцидента</label>
                <select value={avgCost} onChange={(e) => setAvgCost(e.target.value)} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--accent)]">
                  <option value="">Выберите стоимость</option>
                  {COST_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Число повторений одного инцидента (квартал)</label>
                <select value={repetitionsPerQuarter} onChange={(e) => setRepetitionsPerQuarter(e.target.value)} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--accent)]">
                  <option value="">Выберите</option>
                  <option value="0">0</option>
                  <option value="1-3">1–3</option>
                  <option value="4-10">4–10</option>
                  <option value="10+">10+</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">План мероприятий по управлению рисками</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="riskPlan" checked={hasRiskPlan === "yes"} onChange={() => setHasRiskPlan("yes")} className="text-[var(--accent)]" />
                    <span>Есть</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="riskPlan" checked={hasRiskPlan === "no"} onChange={() => setHasRiskPlan("no")} className="text-[var(--accent)]" />
                    <span>Нет</span>
                  </label>
                </div>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Наличие системы добровольных сообщений</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="voluntary" checked={hasVoluntaryReports === "yes"} onChange={() => setHasVoluntaryReports("yes")} className="text-[var(--accent)]" />
                    <span>Есть</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="voluntary" checked={hasVoluntaryReports === "no"} onChange={() => setHasVoluntaryReports("no")} className="text-[var(--accent)]" />
                    <span>Нет</span>
                  </label>
                </div>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Выполнение плана мероприятий по предупреждению инцидентов — {planExecution}%</label>
                <input type="range" min={0} max={100} value={planExecution} onChange={(e) => setPlanExecution(Number(e.target.value))} className="w-full h-2 rounded-lg appearance-none bg-slate-200 accent-[var(--accent)]" />
              </div>
            </div>
          </div>

          {/* Блок 2 — как 32: 10-балльные шкалы */}
          <div className="pt-6 border-t border-[var(--border)]">
            <h2 className="text-lg font-semibold text-slate-800 mb-1">Оцените систему Human Factor в компании</h2>
            <p className="text-slate-600 text-sm mb-4">Оцените каждый пункт по 10-балльной шкале.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {SLIDER_FACTORS_LEFT.map((f) => (
                <div key={f}>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{f} — {sliderValues[f] ?? 5}</label>
                  <input type="range" min={1} max={10} value={sliderValues[f] ?? 5} onChange={(e) => setSlider(f, Number(e.target.value))} className="w-full h-2 rounded-lg bg-slate-200 accent-[var(--accent)]" />
                </div>
              ))}
              {SLIDER_FACTORS_RIGHT.map((f) => (
                <div key={f}>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{f} — {sliderValues[f] ?? 5}</label>
                  <input type="range" min={1} max={10} value={sliderValues[f] ?? 5} onChange={(e) => setSlider(f, Number(e.target.value))} className="w-full h-2 rounded-lg bg-slate-200 accent-[var(--accent)]" />
                </div>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <label className="text-sm text-slate-700">Укажите email для отправки отчёта</label>
              <input type="email" placeholder="Email" className="border border-slate-300 rounded-lg px-3 py-2 text-sm w-48 focus:ring-2 focus:ring-[var(--accent)]" />
            </div>
          </div>

          {/* Блок 3 — как 4.1: название, тэги, загрузка по категориям */}
          <div className="pt-6 border-t border-[var(--border)]">
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-0.5">Название</label>
                <input type="text" value={analysisName} onChange={(e) => setAnalysisName(e.target.value)} className="border border-slate-300 rounded-lg px-3 py-2 text-sm w-40 focus:ring-2 focus:ring-[var(--accent)]" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-0.5">Тэги</label>
                <div className="flex flex-wrap items-center gap-1 border border-slate-300 rounded-lg px-2 py-1.5 min-w-[160px]">
                  {tags.map((t) => (
                    <span key={t} className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 text-xs px-2 py-0.5 rounded">
                      {t}
                      <button type="button" onClick={() => setTags((p) => p.filter((x) => x !== t))} className="text-slate-400 hover:text-slate-600">×</button>
                    </span>
                  ))}
                  <input type="text" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); if (tagInput.trim()) setTags((p) => [...p, tagInput.trim()]); setTagInput(""); } }} placeholder="+ тэг" className="flex-1 min-w-0 border-0 py-0.5 text-sm focus:ring-0" />
                </div>
              </div>
            </div>
            <p className="text-slate-600 text-sm mb-2">Чем шире охват и детальнее ответы, тем точнее анализ противоречий и формирование гипотез, рекомендации. Даже черновики и выборочные выгрузки лучше, чем отсутствие данных.</p>
            <p className="text-slate-500 text-xs mb-4">Disclaimer: Персональные сведения обрабатываются по согласованным правилам доступа и хранения. Желательно предоставлять обезличенные данные — прогноз будет возможен.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {UPLOAD_CATEGORIES.map((cat) => (
                <div key={cat} className="border-2 border-dashed border-slate-300 rounded-lg p-4">
                  <p className="text-sm font-medium text-slate-700 mb-2">{cat}</p>
                  <label className="block cursor-pointer text-center py-6 px-2 bg-slate-50 rounded border border-slate-200 hover:bg-slate-100">
                    <span className="text-slate-500 text-sm">Перенесите файлы или нажмите для загрузки</span>
                    <input type="file" multiple className="hidden" accept=".pdf,.doc,.docx,.xls,.xlsx" onChange={(e) => addFile(cat, e.target.files)} />
                  </label>
                  {(uploadedByCategory[cat] || []).length > 0 && (
                    <ul className="mt-2 space-y-1">
                      {(uploadedByCategory[cat] || []).map((f, i) => (
                        <li key={i} className="flex items-center gap-2 text-xs text-slate-600">
                          <span className="text-[var(--accent)]">✓</span>
                          <span className="truncate">{f.name}</span>
                          <button type="button" onClick={() => removeFile(cat, i)} className="text-red-500 shrink-0">×</button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <label className="text-sm text-slate-700">Ожидаемые результаты на выходе</label>
              <select value={expectedResults} onChange={(e) => setExpectedResults(e.target.value)} className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--accent)]">
                <option value="">Выберите ожидаемые результаты</option>
                <option value="full">Полный отчёт Human Factor</option>
                <option value="cost">Оценка стоимости потерь</option>
                <option value="risks">Карта рисков</option>
                <option value="recommendations">Рекомендации</option>
              </select>
            </div>
            <p className="text-slate-600 text-sm mt-4 mb-2">Предлагаем ответить ещё на некоторые вопросы. На основе этих данных мы сопоставим «как должно быть» и «как есть», найдем аномалии и предложим более точные рекомендации.</p>
            <Link href="/calculator/cost/extra">
              <Button variant="secondary" size="sm">Доп. инфо</Button>
            </Link>
          </div>

          <div className="flex flex-wrap gap-3 pt-2 border-t border-[var(--border)]">
            <Button onClick={runCalculation}>Запустить расчёт</Button>
            {calculated && <Button variant="secondary" onClick={showResult}>Результат</Button>}
          </div>
        </CardBody>
      </Card>

      {resultOpen && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setResultOpen(false)} aria-hidden />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-lg max-h-[90vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
              <CardBody>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-slate-800">Результаты расчёта</h2>
                  <button type="button" onClick={() => setResultOpen(false)} className="text-slate-400 hover:text-slate-600 text-xl leading-none" aria-label="Закрыть">×</button>
                </div>
                <div className="space-y-4 text-sm">
                  <div>
                    <h3 className="font-medium text-slate-800 mb-1">Приблизительная оценка вероятности</h3>
                    <ul className="text-slate-700 space-y-1 list-disc list-inside">
                      <li>Ошибки в рамках процесса: 12–18%</li>
                      <li>Неверные решения при отклонениях: 8–14%</li>
                      <li>Повторяющиеся инциденты: 5–9%</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-medium text-slate-800 mb-1">Приблизительная финансовая оценка и возможные потери</h3>
                    <p className="text-slate-700">Оценка потерь при реализации рисков HF: от 2,4 до 5,8 млн руб. в год.</p>
                  </div>
                  <div className="pl-3 border-l-2 border-[var(--accent)]">
                    <h3 className="font-medium text-slate-800 mb-1">Почему такие выводы</h3>
                    <p className="text-slate-700 mb-2">Оценки на основе введённых данных и загруженной документации. Для причинно-следственной связи по инцидентам — раздел RCA.</p>
                    <Link href="/rca"><Button size="sm">Перейти в раздел RCA</Button></Link>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-[var(--border)]">
                  <Button variant="secondary" onClick={() => setResultOpen(false)}>Закрыть</Button>
                </div>
              </CardBody>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
