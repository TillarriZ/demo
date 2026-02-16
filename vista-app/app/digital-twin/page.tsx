"use client";

import { useState } from "react";
import Link from "next/link";
import Card, { CardBody, CardHeader } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import ReliabilityTrendsChart from "@/app/copilot/trends/ReliabilityTrendsChart";

const RISK_MATRIX_COLORS: Record<number, string> = {
  1: "#b5d1ad", 2: "#b5d1ad", 3: "#8db881", 4: "#8db881", 5: "#79A471", 6: "#79A471",
  7: "#638e59", 8: "#638e59", 9: "#3b692f", 10: "#3b692f", 11: "#95c740", 12: "#95c740",
  13: "#E4BA6A", 14: "#E4BA6A", 15: "#E4BA6A",
  16: "#cc0000", 17: "#cc0000", 18: "#cc0000", 19: "#cc0000", 20: "#cc0000",
  21: "#990000", 22: "#990000", 23: "#990000", 24: "#990000", 25: "#990000",
};

const RISK_MATRIX_DISPLAY: Record<string, number> = {
  "5,1": 5, "5,2": 10, "5,3": 3, "5,4": 2, "5,5": 1,
  "4,1": 4, "4,2": 8, "4,3": 6, "4,4": 4, "4,5": 2,
  "3,1": 15, "3,2": 12, "3,3": 9, "3,4": 6, "3,5": 3,
  "2,1": 20, "2,2": 16, "2,3": 12, "2,4": 8, "2,5": 10,
  "1,1": 25, "1,2": 20, "1,3": 15, "1,4": 4, "1,5": 5,
};

function RiskMatrixGrid({ className = "" }: { className?: string }) {
  return (
    <div className={`grid grid-cols-5 gap-0.5 ${className}`}>
      {[5, 4, 3, 2, 1].map((imp) =>
        [1, 2, 3, 4, 5].map((lik) => {
          const score = imp * lik;
          const displayVal = RISK_MATRIX_DISPLAY[`${imp},${lik}`] ?? score;
          const bg = RISK_MATRIX_COLORS[score] ?? "#e6e6e6";
          const isRed = score >= 16;
          return (
            <div key={`${imp}-${lik}`} className={`aspect-square rounded flex items-center justify-center text-[10px] font-semibold ${isRed ? "text-white" : "text-slate-800"}`} style={{ backgroundColor: bg }}>
              {displayVal}
            </div>
          );
        })
      )}
    </div>
  );
}

type Panel = "hf" | "simulator" | "monitor" | null;

export default function DigitalTwinPage() {
  const [panel, setPanel] = useState<Panel>(null);
  const [simInput, setSimInput] = useState({ process: "", change: "", budget: "" });
  const [simResult, setSimResult] = useState<{ risk: string; cost: string; corrections: string[] } | null>(null);
  const [rmsScenarios, setRmsScenarios] = useState<string[]>([]);

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
            <button type="button" onClick={() => setPanel(null)} className="text-slate-400 hover:text-slate-600 text-sm">Свернуть</button>
          </CardHeader>
          <CardBody className="pt-0">
            <p className="text-sm text-slate-600 mb-4">AI-модуль разрабатывает сценарии для RMS (распределение ресурсов) на основе данных по Human Factor.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <p className="text-xs font-semibold text-slate-500 mb-2">Входные данные HF</p>
                <ul className="text-xs text-slate-700 space-y-1">
                  <li>• Усталость по сменам: 65% (пик 15:00–18:00)</li>
                  <li>• Укомплектованность ATC: 70%</li>
                  <li>• Тренды надёжности по службам</li>
                  <li>• Инциденты за 30 дней</li>
                </ul>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <p className="text-xs font-semibold text-slate-500 mb-2">Параметры генерации</p>
                <label className="flex items-center gap-2 text-xs text-slate-700">
                  <input type="checkbox" defaultChecked className="rounded" />
                  Учитывать пиковые окна
                </label>
                <label className="flex items-center gap-2 text-xs text-slate-700 mt-1">
                  <input type="checkbox" defaultChecked className="rounded" />
                  Резерв по усталости
                </label>
              </div>
            </div>
            <Button onClick={() => setRmsScenarios([
              "Увеличить слот ATC на 2 диспетчера в окне 06:00–10:00",
              "Резерв наземного обслуживания +1 бригада 11:00–14:00",
              "Сдвиг брифинга экипажа SY-2407 на −15 мин",
            ])}>
              Сгенерировать сценарии RMS
            </Button>
            {rmsScenarios.length > 0 && (
              <div className="mt-4 p-4 rounded-lg border border-[var(--accent)] bg-[var(--accent-light)]/30">
                <p className="text-xs font-semibold text-slate-700 mb-2">Рекомендованные сценарии</p>
                <ul className="text-sm text-slate-700 space-y-1 list-disc list-inside">
                  {rmsScenarios.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardBody>
        </Card>
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
                <RiskMatrixGrid className="max-w-[280px]" />
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
