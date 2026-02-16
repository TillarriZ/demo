"use client";

import React from "react";
import Link from "next/link";
import Card, { CardBody, CardHeader } from "@/components/ui/Card";

const EVENTS_BY_YEAR = [391, 415, 252, 236];
const FATALITIES_BY_YEAR = [391, 415, 252, 236];
const GROUND_FATALITIES_BY_YEAR = [13, 2, 2, 18];
const YEARS = ["2018", "2020", "2021", "2022"];

const BY_COUNTRY = [
  { name: "США", count: 2095 },
  { name: "Бразилия", count: 274 },
  { name: "Канада", count: 226 },
  { name: "Мексика", count: 128 },
  { name: "Россия", count: 98 },
  { name: "Франция", count: 85 },
];
const BY_CONTINENT = [
  { name: "Северная Америка", count: 2949 },
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
  { name: "Сельхоз", count: 170 },
];

const BY_ICAO = [
  { cat: "UNK", count: 502 },
  { cat: "LOC-I", count: 459 },
  { cat: "SCF-PP", count: 421 },
  { cat: "ARC", count: 408 },
  { cat: "RE", count: 343 },
  { cat: "SCF-NP", count: 174 },
  { cat: "OTHR", count: 164 },
  { cat: "FUEL", count: 140 },
];

const INCIDENT_ROWS = [
  { date: "15.10.2023", type: "Cessna 208", country: "Франция", fatalities: 1, cat: "AC", icao: "UNK" },
  { date: "12.10.2023", type: "Piper PA-46", country: "США", fatalities: 2, cat: "AC", icao: "LOC-I" },
  { date: "08.10.2023", type: "Boeing 737", country: "Россия", fatalities: 0, cat: "AC", icao: "RE" },
  { date: "01.10.2023", type: "A320", country: "Германия", fatalities: 0, cat: "AC", icao: "SCF-PP" },
];

const IMPACT_LABELS = ["Незначит. (1)", "Малый (2)", "Средний (3)", "Серьёзный (4)", "Катастрофа (5)"];
const LIKELIHOOD_LABELS = ["Редко (1)", "Маловер. (2)", "Возможно (3)", "Вероятно (4)", "Часто (5)"];

function BarMini({ values, maxVal }: { values: number[]; maxVal: number }) {
  return (
    <div className="flex items-end gap-0.5 h-8">
      {values.map((v, i) => (
        <div
          key={i}
          className="flex-1 min-w-[4px] rounded-t bg-[var(--accent)]"
          style={{ height: `${Math.max(4, (v / maxVal) * 100)}%` }}
          title={`${YEARS[i]}: ${v}`}
        />
      ))}
    </div>
  );
}

export default function CalculatorGraphsResultPage() {
  const maxEvents = Math.max(...EVENTS_BY_YEAR);
  const maxPhase = Math.max(...BY_PHASE.map((p) => p.count));

  return (
    <div className="space-y-6">
      <Link href="/calculator/graphs" className="text-sm text-[var(--accent)] hover:underline">
        ← Графы
      </Link>
      <h1 className="text-xl font-bold text-slate-800">Результаты расчёта и дашборд HF</h1>
      <p className="text-slate-600 text-sm">
        Сводка по событиям, фазам полёта, категориям и карта рисков (по аналогии с HF Анализ).
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-emerald-50 border-emerald-200">
          <CardBody>
            <p className="text-2xl font-bold text-slate-800">4123</p>
            <p className="text-sm text-slate-600">События</p>
            <BarMini values={EVENTS_BY_YEAR} maxVal={maxEvents} />
            <p className="text-xs text-slate-500 mt-1">{YEARS.join(" ")}</p>
          </CardBody>
        </Card>
        <Card className="bg-emerald-100 border-emerald-300">
          <CardBody>
            <p className="text-2xl font-bold text-slate-800">2317</p>
            <p className="text-sm text-slate-600">Погибшие</p>
            <BarMini values={FATALITIES_BY_YEAR} maxVal={maxEvents} />
            <p className="text-xs text-slate-500 mt-1">{YEARS.join(" ")}</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <p className="text-2xl font-bold text-slate-800">56</p>
            <p className="text-sm text-slate-600">Наземные погибшие</p>
            <BarMini values={GROUND_FATALITIES_BY_YEAR} maxVal={20} />
            <p className="text-xs text-slate-500 mt-1">{YEARS.join(" ")}</p>
          </CardBody>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h2 className="font-semibold text-slate-800 text-sm">По стране происхождения</h2>
          </CardHeader>
          <CardBody className="pt-0">
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
          <CardBody className="pt-0">
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

      <Card>
        <CardHeader>
          <h2 className="font-semibold text-slate-800 text-sm">События по фазе полёта</h2>
        </CardHeader>
        <CardBody className="pt-0">
          <div className="flex flex-wrap items-end gap-2">
            {BY_PHASE.map((p, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <span className="text-xs font-medium text-slate-600">{p.count}</span>
                <div
                  className="w-12 rounded-t bg-[var(--accent)]"
                  style={{ height: `${Math.max(8, (p.count / maxPhase) * 120)}px` }}
                />
                <span className="text-xs text-slate-500 max-w-[60px] text-center">{p.phase}</span>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h2 className="font-semibold text-slate-800 text-sm">По категории</h2>
          </CardHeader>
          <CardBody className="pt-0">
            <ul className="space-y-2 text-sm">
              {BY_CATEGORY.map((c, i) => (
                <li key={i} className="flex justify-between items-center gap-2">
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
                <li key={i} className="flex justify-between items-center gap-2">
                  <span className="text-slate-700">{c.cat}</span>
                  <span className="font-medium text-slate-800">{c.count}</span>
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <h2 className="font-semibold text-slate-800 text-sm">Карта рисков (Impact × Likelihood)</h2>
        </CardHeader>
        <CardBody className="pt-0 overflow-x-auto">
          <div className="inline-grid grid-cols-6 gap-0.5 text-center text-xs">
            <div className="p-1 text-slate-500" />
            {LIKELIHOOD_LABELS.map((l, i) => (
              <div key={i} className="p-1 text-slate-500 font-medium">{l}</div>
            ))}
            {[1, 2, 3, 4, 5].map((imp) => (
              <React.Fragment key={imp}>
                <div className="p-1 text-slate-500 font-medium">{IMPACT_LABELS[imp - 1]}</div>
                {[1, 2, 3, 4, 5].map((lik) => {
                  const score = imp * lik;
                  const green = Math.max(0, 255 - score * 25);
                  const red = Math.min(255, score * 25);
                  return (
                    <div
                      key={`${imp}-${lik}`}
                      className="w-10 h-8 rounded flex items-center justify-center text-white font-medium"
                      style={{ backgroundColor: `rgb(${red},${green},100)` }}
                    >
                      {score}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="font-semibold text-slate-800 text-sm">Список инцидентов</h2>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="text-left p-2 font-medium text-slate-700">Дата</th>
                <th className="text-left p-2 font-medium text-slate-700">Тип ВС</th>
                <th className="text-left p-2 font-medium text-slate-700">Страна</th>
                <th className="text-left p-2 font-medium text-slate-700">Погибшие</th>
                <th className="text-left p-2 font-medium text-slate-700">Кат.</th>
                <th className="text-left p-2 font-medium text-slate-700">ICAO</th>
              </tr>
            </thead>
            <tbody>
              {INCIDENT_ROWS.map((r, i) => (
                <tr key={i} className="border-b border-slate-100">
                  <td className="p-2 text-slate-700">{r.date}</td>
                  <td className="p-2 text-slate-700">{r.type}</td>
                  <td className="p-2 text-slate-700">{r.country}</td>
                  <td className="p-2 text-slate-700">{r.fatalities}</td>
                  <td className="p-2 text-slate-700">{r.cat}</td>
                  <td className="p-2 text-slate-700">{r.icao}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <CardBody className="border-t border-slate-200 pt-2">
          <p className="text-xs text-slate-500">Всего погибших в таблице: 2317 (сводка)</p>
        </CardBody>
      </Card>
    </div>
  );
}
