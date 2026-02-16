"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Card, { CardBody } from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { AnimatedGraphViewsSection } from "./AnimatedGraphs";

const MAIN_PROCESSES = [
  "Предполётная подготовка (preflight)",
  "Чек-лист перед запуском двигателей",
  "Запуск и руление (taxi)",
  "Проверка перед взлётом (before takeoff)",
  "Взлёт (takeoff)",
  "Набор высоты (climb)",
  "Круиз (cruise)",
  "Снижение (descent)",
  "Заход на посадку (approach)",
  "Посадка (landing)",
  "Пробег и руление после посадки",
  "Послеполётная проверка (post-flight)",
  "Нештатные процедуры (QRH)",
  "Аварийные процедуры (memory items)",
  "Управление ресурсами экипажа (CRM)",
  "Другое",
];

const RESPONSIBLE_SERVICES = [
  "Служба производства полётов",
  "Лётная служба",
  "Служба летной эксплуатации",
  "Служба наземного обслуживания",
  "Служба УВД / Диспетчеризация",
  "Техническая служба (ТОиР)",
  "Служба безопасности полётов",
  "Служба подготовки лётного состава",
  "Служба качества",
  "Служба управления рисками",
  "Другое",
];

export default function CalculatorGraphsPage() {
  const router = useRouter();
  const [openBuild, setOpenBuild] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [normProcess, setNormProcess] = useState(MAIN_PROCESSES[0]);
  const [normService, setNormService] = useState(RESPONSIBLE_SERVICES[0]);
  const [normServicesCount, setNormServicesCount] = useState("3");

  const goToResult = () => router.push("/calculator/graphs/result");

  return (
    <div className="space-y-6">
      <Link href="/calculator" className="text-sm text-[var(--accent)] hover:underline">
        ← HF-Calculator
      </Link>
      <h1 className="text-xl font-bold text-slate-800">Графы</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card
          className="cursor-pointer hover:border-[var(--accent)] transition-colors"
          onClick={() => setOpenBuild((v) => !v)}
        >
          <CardBody className="flex items-center justify-between">
            <span className="font-medium text-slate-800">Построить графы</span>
            <span className={`text-slate-500 transition-transform ${openBuild ? "rotate-180" : ""}`}>▼</span>
          </CardBody>
        </Card>
        <Card
          className="cursor-pointer hover:border-[var(--accent)] transition-colors"
          onClick={() => setOpenView((v) => !v)}
        >
          <CardBody className="flex items-center justify-between">
            <span className="font-medium text-slate-800">Посмотреть графы</span>
            <span className={`text-slate-500 transition-transform ${openView ? "rotate-180" : ""}`}>▼</span>
          </CardBody>
        </Card>
      </div>

      {openBuild && (
        <Card>
          <CardBody>
            <h2 className="text-sm font-semibold text-slate-700 mb-4">Построить граф</h2>

            <div className="mb-8 pb-6 border-b border-[var(--border)]">
              <h3 className="font-medium text-slate-800 mb-3">Нормативный граф</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Основной процесс</label>
                  <select
                    value={normProcess}
                    onChange={(e) => setNormProcess(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                  >
                    {MAIN_PROCESSES.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Ответственная служба</label>
                  <select
                    value={normService}
                    onChange={(e) => setNormService(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                  >
                    {RESPONSIBLE_SERVICES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Input
                    label="Количество задействованных служб"
                    type="number"
                    min={1}
                    value={normServicesCount}
                    onChange={(e) => setNormServicesCount(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Загрузить документацию</label>
                  <div className="flex items-center gap-2 flex-wrap">
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx"
                      className="block flex-1 min-w-[140px] text-sm text-slate-600 file:mr-2 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-sm file:bg-slate-100 file:text-slate-700"
                    />
                    <Button type="button" variant="secondary" size="sm">Integration</Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-8 pb-6 border-b border-[var(--border)]">
              <h3 className="font-medium text-slate-800 mb-3">Событийный граф</h3>
              <p className="text-slate-600 text-sm mb-2">Загрузите данные по реальному исполнению (логи задач) или интеграция с программами.</p>
              <div className="flex items-center gap-2 flex-wrap">
                <input type="file" multiple accept=".csv,.xlsx,.json,.xml" className="block flex-1 min-w-[140px] text-sm text-slate-600 file:mr-2 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-sm file:bg-slate-100 file:text-slate-700" />
                <Button type="button" variant="secondary" size="sm">Integration</Button>
              </div>
            </div>

            <div className="mb-8 pb-6 border-b border-[var(--border)]">
              <h3 className="font-medium text-slate-800 mb-3">Граф взаимодействий</h3>
              <p className="text-slate-600 text-sm mb-2">Загрузите данные по реальному исполнению (логи задач) или интеграция с программами.</p>
              <div className="flex items-center gap-2 flex-wrap">
                <input type="file" multiple accept=".csv,.xlsx,.json,.xml" className="block flex-1 min-w-[140px] text-sm text-slate-600 file:mr-2 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-sm file:bg-slate-100 file:text-slate-700" />
                <Button type="button" variant="secondary" size="sm">Integration</Button>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-slate-800 mb-3">Граф компонентов Human Factor</h3>
              <p className="text-slate-600 text-sm mb-2">Загрузите данные по реальному исполнению (логи задач) или интеграция с программами.</p>
              <div className="flex items-center gap-2 flex-wrap">
                <input type="file" multiple accept=".csv,.xlsx,.json,.xml" className="block flex-1 min-w-[140px] text-sm text-slate-600 file:mr-2 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-sm file:bg-slate-100 file:text-slate-700" />
                <Button type="button" variant="secondary" size="sm">Integration</Button>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button onClick={goToResult}>Построить выбранные графы</Button>
            </div>
          </CardBody>
        </Card>
      )}

      {openView && (
        <div>
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <h2 className="text-sm font-semibold text-slate-700">Посмотреть графы</h2>
            <Link href="/calculator/graphs/result">
              <Button variant="secondary" size="sm">Перейти к результатам и дашборду</Button>
            </Link>
          </div>
          <AnimatedGraphViewsSection />
        </div>
      )}
    </div>
  );
}
