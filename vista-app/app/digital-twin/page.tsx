"use client";

import { useState } from "react";
import Link from "next/link";
import Card, { CardBody, CardHeader } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import ReliabilityTrendsChart from "@/app/copilot/trends/ReliabilityTrendsChart";
import AnomaliesSignalsSankey from "./AnomaliesSignalsSankey";
import RiskMatrix from "@/components/RiskMatrix";

type Panel = "hf" | "simulator" | "monitor" | null;

// Параметры Human Factor оптимизации (по лучшим практикам RMS в авиации)
const HF_PARAM_OPTIONS = {
  distance: [
    { value: "min", label: "Минимальная" },
    { value: "low", label: "Низкая" },
    { value: "medium", label: "Средняя" },
    { value: "high", label: "Высокая" },
  ],
  timeBetweenTasks: [
    { value: "0-5", label: "0–5 мин" },
    { value: "5-15", label: "5–15 мин" },
    { value: "15-30", label: "15–30 мин" },
    { value: "30+", label: "30+ мин" },
  ],
  workloadLevel: [
    { value: "low", label: "Низкая" },
    { value: "medium", label: "Средняя" },
    { value: "high", label: "Высокая" },
    { value: "peak", label: "Пиковая" },
  ],
  crewIntersection: [
    { value: "none", label: "Без пересечений" },
    { value: "minimal", label: "Минимальное" },
    { value: "moderate", label: "Умеренное" },
    { value: "high", label: "Частое" },
  ],
  compatibility: [
    { value: "strict", label: "Строгая (по квалификации)" },
    { value: "preferred", label: "Предпочтительные пары" },
    { value: "flexible", label: "Гибкая" },
    { value: "any", label: "Любая" },
  ],
  executionTime: [
    { value: "tight", label: "Жёсткие окна" },
    { value: "normal", label: "Норма" },
    { value: "buffer", label: "С буфером" },
    { value: "flex", label: "Гибкие окна" },
  ],
  delays: [
    { value: "none", label: "Не учитывать" },
    { value: "low", label: "Низкий риск" },
    { value: "medium", label: "Средний риск" },
    { value: "high", label: "Высокий риск" },
  ],
  resourceAvailability: [
    { value: "current", label: "Текущая укомплектованность" },
    { value: "with_reserve", label: "С учётом резерва" },
    { value: "planned", label: "Плановые отпуска/больничные" },
    { value: "min_staff", label: "Минимальный состав" },
  ],
} as const;

const PRIMARY_CRITERIA = [
  { id: "distance", label: "Расстояние" },
  { id: "timeBetweenTasks", label: "Время между задачами" },
  { id: "workloadLevel", label: "Уровень нагрузки" },
  { id: "crewIntersection", label: "Пересечение с экипажем" },
  { id: "compatibility", label: "Совместимость" },
  { id: "executionTime", label: "Время для выполнения" },
  { id: "delays", label: "Задержки" },
  { id: "resourceAvailability", label: "Наличие ресурсов" },
] as const;

type ScenarioResult = {
  id: number;
  name: string;
  coveragePercent: number;
  scheduleCompliancePercent: number;
  cost: number;
  budgetStatus: "within" | "under" | "over";
  additionalResourcesNeeded: boolean;
  additionalResourcesCost: number;
  delayPropagationRisk: string;
  regulatoryCompliance: string;
  reserveCoverage: string;
  /** Шаги для реализации сценария */
  implementationSteps: string[];
};

// Сотрудник: имя, локация, статус готовности
type AssignedStaff = { name: string; location: string; readiness: "Готов" | "В пути" | "Занят" | "Не готов" | "—" };

// Задача с детализацией по сотрудникам и альтернативам
type TaskDetail = {
  id: string;
  name: string;
  resource: string;
  status: string;
  slot: string;
  assigned: AssignedStaff[];
  alternatives: AssignedStaff[];
};

const SAMPLE_TASKS: TaskDetail[] = [
  {
    id: "T1",
    name: "Брифинг экипажа SY-2407",
    resource: "Экипаж 12",
    status: "Назначено",
    slot: "06:00–06:30",
    assigned: [
      { name: "Иванов А.П. (КВС)", location: "Брифинг-зал 2", readiness: "Готов" },
      { name: "Петрова Е.С. (ВП)", location: "Брифинг-зал 2", readiness: "Готов" },
      { name: "Сидоров М.И. (Штурман)", location: "Брифинг-зал 2", readiness: "В пути" },
    ],
    alternatives: [
      { name: "Козлов В.Н. (КВС)", location: "Перрон 3", readiness: "Готов" },
      { name: "Новикова О.Л. (ВП)", location: "Офис экипажей", readiness: "Готов" },
    ],
  },
  {
    id: "T2",
    name: "Подготовка ВС B-777",
    resource: "Наземная бригада A",
    status: "В работе",
    slot: "06:15–07:00",
    assigned: [
      { name: "Груздев Д.В.", location: "Перрон 1, стойка 12", readiness: "Готов" },
      { name: "Волкова Т.А.", location: "Перрон 1, стойка 12", readiness: "Готов" },
      { name: "Морозов К.С.", location: "Склад ЗИП", readiness: "В пути" },
    ],
    alternatives: [
      { name: "Белов А.И.", location: "Перрон 2", readiness: "Готов" },
      { name: "Соколова Н.П.", location: "Наземная база", readiness: "Занят" },
    ],
  },
  {
    id: "T3",
    name: "Заправка",
    resource: "—",
    status: "Ожидание",
    slot: "06:45–07:15",
    assigned: [{ name: "—", location: "—", readiness: "—" }],
    alternatives: [
      { name: "Топливная бригада 1 (Федоров, Кузнецов)", location: "Топливная база", readiness: "Занят" },
      { name: "Топливная бригада 2 (Орлова, Лебедев)", location: "Перрон 5", readiness: "Готов" },
    ],
  },
  {
    id: "T4",
    name: "Погрузка багажа",
    resource: "Наземная бригада B",
    status: "Назначено",
    slot: "06:30–07:00",
    assigned: [
      { name: "Киселёв Р.О.", location: "Конвейер багажа, зона B", readiness: "Готов" },
      { name: "Павлова И.Г.", location: "Конвейер багажа, зона B", readiness: "В пути" },
    ],
    alternatives: [
      { name: "Андреев С.М.", location: "Зона выдачи", readiness: "Готов" },
      { name: "Михайлова Л.К.", location: "Склад ручной клади", readiness: "Готов" },
    ],
  },
  {
    id: "T5",
    name: "ATC-слот вылета",
    resource: "Диспетчерская смена 1",
    status: "Назначено",
    slot: "07:00–07:30",
    assigned: [
      { name: "Диспетчер вылета: Смирнов П.А.", location: "Башня УВД, сектор вылетов", readiness: "Готов" },
      { name: "Координатор слотов: Егорова В.Д.", location: "Башня УВД, пульт 4", readiness: "Готов" },
    ],
    alternatives: [
      { name: "Диспетчер: Романов И.С.", location: "Башня УВД, сектор вылетов", readiness: "Готов" },
      { name: "Координатор: Калинина М.В.", location: "Резервная смена", readiness: "В пути" },
    ],
  },
  {
    id: "T6",
    name: "Обслуживание рейса SY-2408",
    resource: "—",
    status: "Не распределено",
    slot: "08:00–09:00",
    assigned: [{ name: "—", location: "—", readiness: "—" }],
    alternatives: [
      { name: "Наземная бригада A (после T2)", location: "Перрон 1", readiness: "Готов" },
      { name: "Наземная бригада C", location: "Перрон 4", readiness: "Готов" },
      { name: "Резервная бригада", location: "База", readiness: "Не готов" },
    ],
  },
];

export default function DigitalTwinPage() {
  const [panel, setPanel] = useState<Panel>(null);
  const [simInput, setSimInput] = useState({ process: "", change: "", budget: "" });
  const [simResult, setSimResult] = useState<{ risk: string; cost: string; corrections: string[] } | null>(null);
  const [rmsScenarios, setRmsScenarios] = useState<string[]>([]);

  // Human Factor оптимизация: настройки и сценарии
  const [hfSettingsOpen, setHfSettingsOpen] = useState(false);
  const [hfParams, setHfParams] = useState({
    distance: "medium",
    timeBetweenTasks: "15-30",
    workloadLevel: "medium",
    crewIntersection: "moderate",
    compatibility: "preferred",
    executionTime: "normal",
    delays: "medium",
    resourceAvailability: "current",
  });
  const [primaryCriterion, setPrimaryCriterion] = useState<string>("resourceAvailability");
  const [scenariosLoading, setScenariosLoading] = useState(false);
  const [scenarios, setScenarios] = useState<ScenarioResult[] | null>(null);
  const [selectedScenario, setSelectedScenario] = useState<ScenarioResult | null>(null);
  const [personnelBudget, setPersonnelBudget] = useState(280000);
  const [selectedTask, setSelectedTask] = useState<TaskDetail | null>(null);

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-slate-800">Digital Twin & Strategic Simulator</h1>
      <p className="text-slate-600 text-sm">
        Выберите раздел для работы с Human Factor оптимизацией, симулятором или монитором.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          type="button"
          onClick={() => setPanel(panel === "hf" ? null : "hf")}
          className={`text-left rounded-xl border-2 px-5 py-4 transition-colors ${
            panel === "hf" ? "border-[var(--accent)] bg-[var(--accent-light)]" : "border-slate-200 hover:border-slate-300 bg-white"
          }`}
        >
          <span className="font-semibold text-slate-800">Human Factor оптимизация</span>
        </button>
        <button
          type="button"
          onClick={() => setPanel(panel === "simulator" ? null : "simulator")}
          className={`text-left rounded-xl border-2 px-5 py-4 transition-colors ${
            panel === "simulator" ? "border-amber-500 bg-amber-50" : "border-slate-200 hover:border-slate-300 bg-white"
          }`}
        >
          <span className="font-semibold text-slate-800">Стратегический симулятор</span>
        </button>
        <button
          type="button"
          onClick={() => setPanel(panel === "monitor" ? null : "monitor")}
          className={`text-left rounded-xl border-2 px-5 py-4 transition-colors ${
            panel === "monitor" ? "border-slate-500 bg-slate-50" : "border-slate-200 hover:border-slate-300 bg-white"
          }`}
        >
          <span className="font-semibold text-slate-800">Монитор</span>
        </button>
      </div>

      {panel === "hf" && (
        <Card className="border-l-4 border-l-[var(--accent)]">
          <CardHeader className="flex flex-row items-center justify-between">
            <h2 className="font-semibold text-slate-800">Human Factor оптимизация</h2>
            <div className="flex items-center gap-2">
              <Button variant="secondary" size="sm" onClick={() => setHfSettingsOpen(true)}>
                Настройки модуля
              </Button>
              <button type="button" onClick={() => setPanel(null)} className="text-slate-400 hover:text-slate-600 text-sm">Свернуть</button>
            </div>
          </CardHeader>
          <CardBody className="pt-0 space-y-6">
            <p className="text-sm text-slate-600">
              AI-модуль разрабатывает сценарии для RMS (распределение ресурсов) на основе данных по Human Factor. Ниже — базовая часть распределения задач (по лучшим практикам RMS в авиации).
            </p>

            {/* Базовая часть: распределение задач (RMS-стиль) */}
            <div className="rounded-xl border border-slate-200 overflow-hidden bg-white">
              <div className="px-4 py-2 bg-slate-100 border-b border-slate-200 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-800">Распределение задач — текущее состояние</h3>
                <span className="text-xs text-slate-500">Источник: интеграция с RMS / Flight Info</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="text-left py-2.5 px-3 font-medium text-slate-600">Задача</th>
                      <th className="text-left py-2.5 px-3 font-medium text-slate-600">Временное окно</th>
                      <th className="text-left py-2.5 px-3 font-medium text-slate-600">Назначенный ресурс</th>
                      <th className="text-left py-2.5 px-3 font-medium text-slate-600">Статус</th>
                    </tr>
                  </thead>
                  <tbody>
                    {SAMPLE_TASKS.map((t) => (
                      <tr
                        key={t.id}
                        onClick={() => setSelectedTask(t)}
                        className="border-b border-slate-100 hover:bg-slate-50/50 cursor-pointer transition-colors"
                      >
                        <td className="py-2 px-3 text-slate-800">{t.name}</td>
                        <td className="py-2 px-3 text-slate-600">{t.slot}</td>
                        <td className="py-2 px-3 text-slate-700">{t.resource}</td>
                        <td className="py-2 px-3">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                              t.status === "Назначено" ? "bg-emerald-100 text-emerald-800" :
                              t.status === "В работе" ? "bg-amber-100 text-amber-800" :
                              t.status === "Ожидание" ? "bg-slate-100 text-slate-700" :
                              "bg-red-50 text-red-700"
                            }`}
                          >
                            {t.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 space-y-1">
                <p>Покрытие задач ресурсами: 4 из 6 (67%). Цель сценариев — повысить покрытие и соответствие расписанию при заданных ограничениях.</p>
                <p className="text-slate-400">Клик по строке задачи — детали: назначенные сотрудники, локация, статус готовности и альтернативные варианты.</p>
              </div>
            </div>

            {/* Модальное окно: детали задачи — сотрудники, локация, готовность, альтернативы */}
            {selectedTask && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={() => setSelectedTask(null)}>
                <div
                  className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-slate-200"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
                    <h3 className="text-lg font-semibold text-slate-800">{selectedTask.name}</h3>
                    <button type="button" onClick={() => setSelectedTask(null)} className="p-1 rounded hover:bg-slate-100 text-slate-500" aria-label="Закрыть">✕</button>
                  </div>
                  <div className="p-6 space-y-5">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="text-slate-500">Временное окно</span>
                        <span className="font-medium text-slate-800">{selectedTask.slot}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="text-slate-500">Статус</span>
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                            selectedTask.status === "Назначено" ? "bg-emerald-100 text-emerald-800" :
                            selectedTask.status === "В работе" ? "bg-amber-100 text-amber-800" :
                            selectedTask.status === "Ожидание" ? "bg-slate-100 text-slate-700" :
                            "bg-red-50 text-red-700"
                          }`}
                        >
                          {selectedTask.status}
                        </span>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-slate-800 mb-2">Назначенные сотрудники</h4>
                      <div className="rounded-lg border border-slate-200 overflow-hidden">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                              <th className="text-left py-2 px-3 font-medium text-slate-600">Сотрудник</th>
                              <th className="text-left py-2 px-3 font-medium text-slate-600">Локация</th>
                              <th className="text-left py-2 px-3 font-medium text-slate-600">Готовность</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedTask.assigned.map((s, i) => (
                              <tr key={i} className="border-b border-slate-100 last:border-0">
                                <td className="py-2 px-3 text-slate-800">{s.name}</td>
                                <td className="py-2 px-3 text-slate-600">{s.location}</td>
                                <td className="py-2 px-3">
                                  <span
                                    className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                                      s.readiness === "Готов" ? "bg-emerald-100 text-emerald-800" :
                                      s.readiness === "В пути" ? "bg-amber-100 text-amber-800" :
                                      s.readiness === "Занят" ? "bg-slate-100 text-slate-700" :
                                      s.readiness === "Не готов" ? "bg-red-50 text-red-700" :
                                      "text-slate-400"
                                    }`}
                                  >
                                    {s.readiness}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-slate-800 mb-2">Альтернативные варианты по сотрудникам</h4>
                      <p className="text-xs text-slate-500 mb-2">Возможные замены при необходимости перераспределения</p>
                      <div className="rounded-lg border border-slate-200 overflow-hidden">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                              <th className="text-left py-2 px-3 font-medium text-slate-600">Сотрудник / бригада</th>
                              <th className="text-left py-2 px-3 font-medium text-slate-600">Локация</th>
                              <th className="text-left py-2 px-3 font-medium text-slate-600">Готовность</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedTask.alternatives.map((s, i) => (
                              <tr key={i} className="border-b border-slate-100 last:border-0">
                                <td className="py-2 px-3 text-slate-800">{s.name}</td>
                                <td className="py-2 px-3 text-slate-600">{s.location}</td>
                                <td className="py-2 px-3">
                                  <span
                                    className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                                      s.readiness === "Готов" ? "bg-emerald-100 text-emerald-800" :
                                      s.readiness === "В пути" ? "bg-amber-100 text-amber-800" :
                                      s.readiness === "Занят" ? "bg-slate-100 text-slate-700" :
                                      s.readiness === "Не готов" ? "bg-red-50 text-red-700" :
                                      "text-slate-400"
                                    }`}
                                  >
                                    {s.readiness}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                  <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 rounded-b-2xl">
                    <Button variant="secondary" onClick={() => setSelectedTask(null)}>Закрыть</Button>
                  </div>
                </div>
              </div>
            )}

            {/* Запуск разработки сценариев */}
            <div className="flex flex-wrap items-center gap-3">
              <Button
                disabled={scenariosLoading}
                onClick={async () => {
                  setScenariosLoading(true);
                  setScenarios(null);
                  await new Promise((r) => setTimeout(r, 1800));
                  setScenarios([
                    {
                      id: 1,
                      name: "Минимизация расстояний",
                      coveragePercent: 92,
                      scheduleCompliancePercent: 88,
                      cost: 265000,
                      budgetStatus: "within",
                      additionalResourcesNeeded: false,
                      additionalResourcesCost: 0,
                      delayPropagationRisk: "Низкий",
                      regulatoryCompliance: "100%",
                      reserveCoverage: "Достаточный",
                      implementationSteps: [
                        "Перераспределить наземные бригады по зонам так, чтобы минимизировать переходы между объектами.",
                        "Закрепить за бригадой A сектор 1 (перрон 1–3), за бригадой B — сектор 2 (перрон 4–6).",
                        "Внести изменения в RMS: обновить зоны обслуживания и приоритеты назначения по расстоянию.",
                        "Провести брифинг с руководителями смен о новых зонах ответственности.",
                      ],
                    },
                    {
                      id: 2,
                      name: "Баланс нагрузки и совместимости",
                      coveragePercent: 95,
                      scheduleCompliancePercent: 91,
                      cost: 278000,
                      budgetStatus: "within",
                      additionalResourcesNeeded: false,
                      additionalResourcesCost: 0,
                      delayPropagationRisk: "Низкий",
                      regulatoryCompliance: "100%",
                      reserveCoverage: "Достаточный",
                      implementationSteps: [
                        "Загрузить в модуль HF матрицу совместимости экипажей (предпочтительные пары и ограничения).",
                        "Настроить веса «нагрузка» и «совместимость» в алгоритме распределения в RMS.",
                        "Ввести лимиты непрерывной работы без перерыва (не более 4 ч в пиковой нагрузке).",
                        "Запустить пересчёт расписания на следующую неделю и согласовать с профсоюзом/кадровой службой.",
                      ],
                    },
                    {
                      id: 3,
                      name: "Максимальное покрытие расписания",
                      coveragePercent: 98,
                      scheduleCompliancePercent: 96,
                      cost: 312000,
                      budgetStatus: "over",
                      additionalResourcesNeeded: true,
                      additionalResourcesCost: 32000,
                      delayPropagationRisk: "Средний",
                      regulatoryCompliance: "100%",
                      reserveCoverage: "Расширенный",
                      implementationSteps: [
                        "Утвердить привлечение дополнительных ресурсов: +2 диспетчера ATC в окне 06:00–10:00, +1 наземная бригада 11:00–14:00.",
                        "Оформить смены/подмены или привлечение внешнего персонала; заложить бюджет 32 000 в текущий период.",
                        "Обновить слоты в Flight Information System и синхронизировать с RMS.",
                        "Назначить ответственного за мониторинг выполнения сценария и отчёт по покрытию рейсов.",
                      ],
                    },
                    {
                      id: 4,
                      name: "Экономия бюджета",
                      coveragePercent: 85,
                      scheduleCompliancePercent: 82,
                      cost: 242000,
                      budgetStatus: "under",
                      additionalResourcesNeeded: false,
                      additionalResourcesCost: 0,
                      delayPropagationRisk: "Средний",
                      regulatoryCompliance: "100%",
                      reserveCoverage: "Минимальный",
                      implementationSteps: [
                        "Сократить резервные слоты в окнах с низкой вероятностью сбоев (по данным за последние 3 месяца).",
                        "Объединить части задач наземного обслуживания в совмещённые смены при соблюдении ТК и норм отдыха.",
                        "Закрепить в RMS приоритет «минимизация стоимости» и пересчитать раскладку на месяц.",
                        "Усилить контроль соблюдения расписания и готовности к эскалации при сбоях (дежурный менеджер).",
                      ],
                    },
                    {
                      id: 5,
                      name: "Минимизация пересечений экипажа",
                      coveragePercent: 90,
                      scheduleCompliancePercent: 87,
                      cost: 271000,
                      budgetStatus: "within",
                      additionalResourcesNeeded: false,
                      additionalResourcesCost: 0,
                      delayPropagationRisk: "Низкий",
                      regulatoryCompliance: "100%",
                      reserveCoverage: "Достаточный",
                      implementationSteps: [
                        "Включить в настройках RMS ограничение на частую смену состава экипажа в одной смене.",
                        "Сформировать стабильные мини-бригады (unit crewing) для рейсов SY-24xx на период не менее 2 недель.",
                        "Внести в систему предпочтения экипажей по составу (если есть согласованные пары).",
                        "Провести оценку риска распространения задержек после внедрения и при необходимости скорректировать резерв.",
                      ],
                    },
                  ]);
                  setScenariosLoading(false);
                }}
              >
                {scenariosLoading ? "Разработка сценариев…" : "Запустить разработку сценариев"}
              </Button>
              {scenarios && (
                <span className="text-sm text-slate-500">Получено сценариев: {scenarios.length}</span>
              )}
            </div>

            {/* Результаты: 5 сценариев */}
            {scenarios && scenarios.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-800">Сценарии распределения ресурсов</h3>
                <p className="text-xs text-slate-500">Нажмите на плашку сценария, чтобы открыть детали и шаги по реализации.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {scenarios.slice(0, 5).map((s) => (
                    <button
                      type="button"
                      key={s.id}
                      onClick={() => setSelectedScenario(s)}
                      className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-md hover:border-[var(--accent)] transition-all text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2"
                    >
                      <h4 className="font-medium text-slate-800 mb-3">{s.name}</h4>
                      <dl className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <dt className="text-slate-500">Покрытие задач ресурсом</dt>
                          <dd className="font-semibold text-slate-800">{s.coveragePercent}%</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-slate-500">Соответствие расписанию</dt>
                          <dd className="font-semibold text-slate-800">{s.scheduleCompliancePercent}%</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-slate-500">Стоимость</dt>
                          <dd className="font-semibold">
                            {s.cost.toLocaleString("ru-RU")}{" "}
                            <span
                              className={
                                s.cost <= personnelBudget && s.cost >= personnelBudget * 0.9
                                  ? "text-emerald-600"
                                  : s.cost > personnelBudget
                                    ? "text-amber-600"
                                    : "text-slate-600"
                              }
                            >
                              ({s.cost > personnelBudget ? "свыше бюджета" : s.cost < personnelBudget * 0.9 ? "ниже бюджета" : "в пределах бюджета"})
                            </span>
                          </dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-slate-500">Доп. ресурс</dt>
                          <dd className="font-medium">
                            {s.additionalResourcesNeeded ? `Да, ${s.additionalResourcesCost.toLocaleString("ru-RU")}` : "Не требуется"}
                          </dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-slate-500">Риск распространения задержек</dt>
                          <dd className="text-slate-700">{s.delayPropagationRisk}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-slate-500">Соответствие нормативам</dt>
                          <dd className="text-slate-700">{s.regulatoryCompliance}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-slate-500">Резерв экипажа/персонала</dt>
                          <dd className="text-slate-700">{s.reserveCoverage}</dd>
                        </div>
                      </dl>
                      <p className="mt-3 text-xs text-[var(--accent)] font-medium">Подробнее →</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Окно с деталями сценария и шагами реализации */}
            {selectedScenario && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={() => setSelectedScenario(null)}>
                <div
                  className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-slate-200"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
                    <h3 className="text-lg font-semibold text-slate-800">{selectedScenario.name}</h3>
                    <button type="button" onClick={() => setSelectedScenario(null)} className="p-1 rounded hover:bg-slate-100 text-slate-500" aria-label="Закрыть">✕</button>
                  </div>
                  <div className="p-6 space-y-5">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="text-slate-500">Покрытие задач</span>
                        <span className="font-semibold text-slate-800">{selectedScenario.coveragePercent}%</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="text-slate-500">Соответствие расписанию</span>
                        <span className="font-semibold text-slate-800">{selectedScenario.scheduleCompliancePercent}%</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="text-slate-500">Стоимость</span>
                        <span className="font-semibold">{selectedScenario.cost.toLocaleString("ru-RU")} ₽</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="text-slate-500">Доп. ресурс</span>
                        <span className="font-medium">{selectedScenario.additionalResourcesNeeded ? `Да, ${selectedScenario.additionalResourcesCost.toLocaleString("ru-RU")} ₽` : "Не требуется"}</span>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-slate-800 mb-3">Что необходимо сделать для реализации сценария</h4>
                      <ol className="space-y-2 list-decimal list-inside text-sm text-slate-700">
                        {selectedScenario.implementationSteps.map((step, i) => (
                          <li key={i} className="pl-1">{step}</li>
                        ))}
                      </ol>
                    </div>
                  </div>
                  <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 rounded-b-2xl">
                    <Button variant="secondary" onClick={() => setSelectedScenario(null)}>Закрыть</Button>
                  </div>
                </div>
              </div>
            )}
          </CardBody>
        </Card>
      )}

      {/* Окно настроек Human Factor оптимизации */}
      {hfSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={() => setHfSettingsOpen(false)}>
          <div
            className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-800">Настройки модуля Human Factor оптимизация</h3>
              <button type="button" onClick={() => setHfSettingsOpen(false)} className="p-1 rounded hover:bg-slate-100 text-slate-500">✕</button>
            </div>
            <div className="p-6 space-y-6">
              <p className="text-sm text-slate-600">
                Задайте параметры и выберите главный критерий для построения сценариев распределения ресурсов (по лучшим практикам RMS в авиации).
              </p>

              {/* Параметры — выпадающие списки */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-xs font-medium text-slate-500">Расстояние</span>
                  <select
                    value={hfParams.distance}
                    onChange={(e) => setHfParams((p) => ({ ...p, distance: e.target.value }))}
                    className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-800"
                  >
                    {HF_PARAM_OPTIONS.distance.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="text-xs font-medium text-slate-500">Время между задачами</span>
                  <select
                    value={hfParams.timeBetweenTasks}
                    onChange={(e) => setHfParams((p) => ({ ...p, timeBetweenTasks: e.target.value }))}
                    className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-800"
                  >
                    {HF_PARAM_OPTIONS.timeBetweenTasks.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="text-xs font-medium text-slate-500">Уровень нагрузки</span>
                  <select
                    value={hfParams.workloadLevel}
                    onChange={(e) => setHfParams((p) => ({ ...p, workloadLevel: e.target.value }))}
                    className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-800"
                  >
                    {HF_PARAM_OPTIONS.workloadLevel.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="text-xs font-medium text-slate-500">Пересечение с экипажем</span>
                  <select
                    value={hfParams.crewIntersection}
                    onChange={(e) => setHfParams((p) => ({ ...p, crewIntersection: e.target.value }))}
                    className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-800"
                  >
                    {HF_PARAM_OPTIONS.crewIntersection.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="text-xs font-medium text-slate-500">Совместимость</span>
                  <select
                    value={hfParams.compatibility}
                    onChange={(e) => setHfParams((p) => ({ ...p, compatibility: e.target.value }))}
                    className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-800"
                  >
                    {HF_PARAM_OPTIONS.compatibility.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="text-xs font-medium text-slate-500">Время для выполнения</span>
                  <select
                    value={hfParams.executionTime}
                    onChange={(e) => setHfParams((p) => ({ ...p, executionTime: e.target.value }))}
                    className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-800"
                  >
                    {HF_PARAM_OPTIONS.executionTime.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="text-xs font-medium text-slate-500">Задержки</span>
                  <select
                    value={hfParams.delays}
                    onChange={(e) => setHfParams((p) => ({ ...p, delays: e.target.value }))}
                    className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-800"
                  >
                    {HF_PARAM_OPTIONS.delays.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="text-xs font-medium text-slate-500">Наличие ресурсов</span>
                  <select
                    value={hfParams.resourceAvailability}
                    onChange={(e) => setHfParams((p) => ({ ...p, resourceAvailability: e.target.value }))}
                    className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-800"
                  >
                    {HF_PARAM_OPTIONS.resourceAvailability.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </label>
              </div>

              {/* Колесико/ввод: бюджет персонала */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <label className="block">
                  <span className="text-xs font-medium text-slate-500">Бюджет персонала (для сравнения со сценариями)</span>
                  <div className="mt-1 flex items-center gap-2">
                    <input
                      type="number"
                      min={100000}
                      max={500000}
                      step={10000}
                      value={personnelBudget}
                      onChange={(e) => setPersonnelBudget(Number(e.target.value) || 280000)}
                      className="w-32 border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-800 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <span className="text-slate-500 text-sm">₽</span>
                    <input
                      type="range"
                      min={100000}
                      max={500000}
                      step={10000}
                      value={personnelBudget}
                      onChange={(e) => setPersonnelBudget(Number(e.target.value))}
                      className="flex-1 max-w-[200px] h-2 rounded-lg appearance-none bg-slate-200 accent-[var(--accent)]"
                    />
                  </div>
                </label>
              </div>

              {/* Главный критерий для сценариев */}
              <div>
                <span className="text-xs font-medium text-slate-500 block mb-2">Главный критерий для создания сценариев</span>
                <div className="flex flex-wrap gap-2">
                  {PRIMARY_CRITERIA.map((c) => (
                    <label
                      key={c.id}
                      className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border cursor-pointer text-sm transition-colors ${
                        primaryCriterion === c.id
                          ? "border-[var(--accent)] bg-[var(--accent-light)] text-slate-800"
                          : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="primaryCriterion"
                        value={c.id}
                        checked={primaryCriterion === c.id}
                        onChange={() => setPrimaryCriterion(c.id)}
                        className="sr-only"
                      />
                      {c.label}
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="secondary" onClick={() => setHfSettingsOpen(false)}>Закрыть</Button>
                <Button onClick={() => { setHfSettingsOpen(false); }}>Применить и закрыть</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {panel === "simulator" && (
        <Card className="border-l-4 border-l-amber-500">
          <CardHeader className="flex flex-row items-center justify-between">
            <h2 className="font-semibold text-slate-800">Стратегический симулятор</h2>
            <button type="button" onClick={() => setPanel(null)} className="text-slate-400 hover:text-slate-600 text-sm">Свернуть</button>
          </CardHeader>
          <CardBody className="pt-0">
            <p className="text-sm text-slate-600 mb-4">Внесите данные для изменения процессов (цифровой двойник). Получите оценку рисков, расходов и предложения по корректировкам.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="block">
                  <span className="text-xs font-medium text-slate-500">Бизнес-процесс</span>
                  <select
                    value={simInput.process}
                    onChange={(e) => setSimInput((s) => ({ ...s, process: e.target.value }))}
                    className="mt-0.5 w-full border border-slate-300 rounded px-3 py-2 text-sm text-slate-800"
                  >
                    <option value="">Выберите процесс</option>
                    <option value="Наземное обслуживание">Наземное обслуживание</option>
                    <option value="Управление воздушным движением">Управление воздушным движением</option>
                    <option value="Оперативное управление полетами">Оперативное управление полетами</option>
                    <option value="Планирование экипажей">Планирование экипажей</option>
                    <option value="Техническое обслуживание ВС">Техническое обслуживание ВС</option>
                    <option value="Обслуживание пассажиров">Обслуживание пассажиров</option>
                    <option value="Обработка багажа">Обработка багажа</option>
                  </select>
                </label>
                <label className="block">
                  <span className="text-xs font-medium text-slate-500">Предлагаемое изменение</span>
                  <textarea
                    placeholder="Опишите предлагаемые изменения процесса (цели, шаги, участники)..."
                    value={simInput.change}
                    onChange={(e) => setSimInput((s) => ({ ...s, change: e.target.value }))}
                    rows={5}
                    className="mt-0.5 w-full border border-slate-300 rounded px-3 py-2 text-sm text-slate-800 resize-y min-h-[100px]"
                  />
                </label>
                <label className="block">
                  <span className="text-xs font-medium text-slate-500">Бюджет</span>
                  <select
                    value={simInput.budget}
                    onChange={(e) => setSimInput((s) => ({ ...s, budget: e.target.value }))}
                    className="mt-0.5 w-full border border-slate-300 rounded px-3 py-2 text-sm text-slate-800"
                  >
                    <option value="">Выберите диапазон</option>
                    <option value="до 25 000">до 25 000</option>
                    <option value="25 000 – 50 000">25 000 – 50 000</option>
                    <option value="50 000 – 100 000">50 000 – 100 000</option>
                    <option value="100 000 – 250 000">100 000 – 250 000</option>
                    <option value="250 000 – 500 000">250 000 – 500 000</option>
                    <option value="свыше 500 000">свыше 500 000</option>
                  </select>
                </label>
                <Button
                  onClick={() =>
                    setSimResult({
                      risk: "Умеренный (остаточный риск 28%)",
                      cost: "47 000 (в пределах выбранного бюджета)",
                      corrections: [
                        "Ввести буфер 5 мин между окончанием загрузки и заправкой",
                        "Добавить 1 FTE на пиковые окна для снижения перегрузки",
                      ],
                    })
                  }
                >
                  Рассчитать риски и расходы
                </Button>
              </div>
              {simResult && (
                <div className="p-4 rounded-lg bg-amber-50 border border-amber-200 text-sm space-y-2">
                  <p><span className="font-medium text-slate-700">Оценка риска:</span> {simResult.risk}</p>
                  <p><span className="font-medium text-slate-700">Вероятные расходы:</span> {simResult.cost}</p>
                  <p className="font-medium text-slate-700 mt-2">Предложение по корректировкам:</p>
                  <ul className="list-disc list-inside text-slate-600">
                    {simResult.corrections.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </CardBody>
        </Card>
      )}

      {panel === "monitor" && (
        <Card className="border-l-4 border-l-slate-500">
          <CardHeader className="flex flex-row items-center justify-between">
            <h2 className="font-semibold text-slate-800">Монитор для топ-менеджмента</h2>
            <button type="button" onClick={() => setPanel(null)} className="text-slate-400 hover:text-slate-600 text-sm">Свернуть</button>
          </CardHeader>
          <CardBody className="pt-0 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-semibold text-slate-700 mb-2">Матрица рисков</h3>
                <RiskMatrix maxWidth="280px" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-700 mb-2">Показатели Human Factor (%)</h3>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    { label: "Внешние факторы", val: 34 },
                    { label: "Осведомлённость", val: 72 },
                    { label: "Давление со стороны", val: 58 },
                    { label: "Командная работа", val: 81 },
                    { label: "Самонадеянность", val: 29 },
                    { label: "Пробелы в знаниях", val: 41 },
                    { label: "Недостаток информации", val: 38 },
                    { label: "Неверные решения", val: 22 },
                    { label: "«Слепые зоны» культуры", val: 45 },
                    { label: "Добровольные сообщения", val: 67 },
                    { label: "Стресс", val: 78 },
                    { label: "Усталость", val: 65 },
                    { label: "Коммуникация", val: 43 },
                    { label: "Соблюдение процедур", val: 82 },
                  ].map((item, i) => (
                    <div key={i} className="p-2 rounded bg-[#f6f6f6] flex justify-between border border-[#e6e6e6]">
                      <span className="text-slate-600 truncate mr-1">{item.label}</span>
                      <span className="font-semibold text-slate-800 shrink-0">{item.val}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-700 mb-2">Тренды проф. надёжности</h3>
              <p className="text-xs text-slate-600 mb-3">По компании: ↑2% · Диспетчерская служба: ↓1% · Наземное обслуживание: → · Лётная служба: ↑1%</p>
              <ReliabilityTrendsChart fullWidth />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-700 mb-2">Аномалии и сигналы</h3>
              <p className="text-xs text-slate-600 mb-3">Связь сигналов и аномалий с компонентами Human Factor</p>
              <AnomaliesSignalsSankey />
            </div>
            <div className="p-4 rounded-lg bg-[#f6f6f6] border border-[#e6e6e6]">
              <h3 className="text-sm font-semibold text-slate-800 mb-2">Финансовые показатели по HF</h3>
              <ul className="text-xs text-slate-700 space-y-1">
                <li>• Стоимость повторяющихся инцидентов: 127 000</li>
                <li>• Ошибки и неверные решения: 89 000</li>
                <li>• Задержки: 340 000</li>
                <li>• Ремонты и потери: 56 000</li>
              </ul>
            </div>
            <Link href="/analytics">
              <Button variant="secondary">Открыть полный дашборд</Button>
            </Link>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
