"use client";

import { useState } from "react";
import Card, { CardBody, CardHeader } from "@/components/ui/Card";
import RiskMatrix from "@/components/RiskMatrix";
import ReliabilityTrendsChart from "@/app/copilot/trends/ReliabilityTrendsChart";

// Радар «Инциденты и причины» для Аналитики: 12 осей, 7 кривых по подразделениям (разные диапазоны)
const ANALYTICS_RADAR_LABELS = [
  "Невнимательность",
  "Недостаток знаний",
  "Недостаток ресурсов",
  "Стресс",
  "Пробел в командном взаимодействии",
  "Самонадеянность",
  "Привычка/Автоматизм",
  "Недооценка ситуации",
  "Давление со стороны",
  "Усталость",
  "Недопонимание",
  "Физиологические факторы",
];

function polarToXY(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function radarPath(values: number[], cx: number, cy: number, maxR: number, scale: number) {
  return values
    .map((v, i) => {
      const angle = (i * 360) / 12;
      const r = (v / scale) * maxR;
      return polarToXY(cx, cy, r, angle);
    })
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`)
    .join(" ") + " Z";
}

// Летная служба: показатели не более 6, по усталости (индекс 9) могут быть 8. Остальные кривые — в разных диапазонах.
const ANALYTICS_RADAR_SERIES: { key: string; label: string; color: string; values: number[] }[] = [
  { key: "flight", label: "Летная служба", color: "#dc2626", values: [4, 3, 5, 4, 3, 6, 4, 5, 3, 8, 4, 5] },
  { key: "ground", label: "Наземное обслуживание", color: "var(--risk-orange)", values: [5, 6, 4, 5, 6, 4, 5, 4, 6, 5, 5, 4] },
  { key: "cabin", label: "Бортпроводники", color: "#2563eb", values: [6, 5, 6, 7, 6, 5, 6, 6, 5, 7, 6, 6] },
  { key: "maint", label: "Техническое обслуживание", color: "var(--accent)", values: [3, 4, 6, 3, 4, 5, 4, 3, 4, 4, 5, 4] },
  { key: "dispatch", label: "Диспетчеризация", color: "#7c3aed", values: [5, 5, 4, 6, 5, 5, 6, 5, 5, 6, 5, 5] },
  { key: "office", label: "Офисный блок", color: "#0d9488", values: [2, 3, 2, 3, 2, 3, 2, 2, 3, 2, 2, 3] },
  { key: "mgmt", label: "Менеджмент", color: "#475569", values: [4, 4, 4, 5, 4, 4, 5, 4, 4, 5, 4, 4] },
];

function AnalyticsRadarChart() {
  const [selected, setSelected] = useState<Set<string>>(() => new Set(ANALYTICS_RADAR_SERIES.map((s) => s.key)));
  const size = 400;
  const cx = size / 2;
  const cy = size / 2;
  const maxR = size / 2 - 56;
  const scale = 10;

  const toggle = (key: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  return (
    <div className="overflow-x-auto">
      <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-[400px] mx-auto" style={{ minWidth: 320 }}>
        {[0, 2, 4, 6, 8, 10].map((v) => {
          const r = (v / scale) * maxR;
          return (
            <circle key={v} cx={cx} cy={cy} r={r} fill="none" stroke="var(--border)" strokeWidth="0.5" />
          );
        })}
        {ANALYTICS_RADAR_LABELS.map((_, i) => {
          const angle = (i * 360) / 12;
          const end = polarToXY(cx, cy, maxR, angle);
          return (
            <line key={i} x1={cx} y1={cy} x2={end.x} y2={end.y} stroke="var(--border)" strokeWidth="0.5" />
          );
        })}
        {ANALYTICS_RADAR_LABELS.map((label, i) => {
          const angle = (i * 360) / 12;
          const r = maxR + 28;
          const p = polarToXY(cx, cy, r, angle);
          return (
            <text key={i} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="middle" className="fill-slate-600" style={{ fontSize: 10 }}>
              {label.length > 20 ? label.slice(0, 19) + "…" : label}
            </text>
          );
        })}
        {ANALYTICS_RADAR_SERIES.map((s) => {
          const visible = selected.has(s.key);
          return (
            <path
              key={s.key}
              d={radarPath(s.values, cx, cy, maxR, scale)}
              fill="none"
              stroke={s.color}
              strokeWidth="1.5"
              opacity={visible ? 0.9 : 0.2}
              style={{ transition: "opacity 0.2s ease" }}
            />
          );
        })}
      </svg>
      <p className="text-xs text-slate-500 mt-3 mb-2 text-center">Нажмите на подразделение, чтобы выделить или скрыть кривую:</p>
      <div className="flex flex-wrap justify-center gap-x-3 gap-y-2 text-xs">
        {ANALYTICS_RADAR_SERIES.map((s) => {
          const isSelected = selected.has(s.key);
          return (
            <button
              key={s.key}
              type="button"
              onClick={() => toggle(s.key)}
              className={`
                flex items-center gap-1.5 rounded-md px-2 py-1 transition-colors
                ${isSelected ? "bg-slate-100 text-slate-800 font-medium" : "text-slate-400 hover:text-slate-600"}
              `}
            >
              <span className="w-3 h-0.5 rounded shrink-0" style={{ background: s.color }} />
              {s.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

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

export default function AnalyticsPage() {
  const [fatal, setFatal] = useState(true);
  const [nonFatal, setNonFatal] = useState(true);
  const [land, setLand] = useState(true);
  const [water, setWater] = useState(true);

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
                <RiskMatrix maxWidth="320px" />
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Радар «Инциденты и причины» — под Профессиональной надёжностью, над Событиями по фазе полёта */}
        <Card>
          <CardHeader className="py-2">
            <h2 className="font-semibold text-slate-800 text-sm">Радар «Инциденты и причины» по подразделениям</h2>
          </CardHeader>
          <CardBody className="pt-0">
            <AnalyticsRadarChart />
          </CardBody>
        </Card>

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
              <div className="mt-4 pt-3 border-t border-slate-200">
                <h3 className="text-xs font-semibold text-slate-700 mb-2">Причины и гипотезы по количеству событий по фазам</h3>
                <ul className="space-y-2 text-[11px] text-slate-600">
                  <li><strong className="text-slate-700">Наземная (67).</strong> Меньше событий за счёт контролируемой среды и времени на проверки. Гипотеза: рост возможен при дефиците персонала наземного обслуживания, нарушении процедур заправки/загрузки и передаче смены.</li>
                  <li><strong className="text-slate-700">Взлёт (446).</strong> Высокая концентрация событий из‑за перехода от наземных к лётным процедурам, давления по времени и плотности операций. Гипотезы: усталость экипажа, ошибки в чек-листах, недопонимание с диспетчерской службой, отказы при разгоне/отрыве.</li>
                  <li><strong className="text-slate-700">Набор высоты (242).</strong> Умеренный уровень: режим стабилизируется. Возможные причины: ошибки в навигации/эшелонировании, сбои связи с УВД, остаточный стресс после взлёта.</li>
                  <li><strong className="text-slate-700">Маршрут (966).</strong> Наибольшее число событий — длительная фаза, накопление усталости, монотония, возможные технические и метеофакторы. Гипотезы: LOC-I, отклонения от маршрута, ошибки диспетчера, усталость, неверные решения в нестандартных ситуациях.</li>
                  <li><strong className="text-slate-700">Заход (380).</strong> Второй пик: высокая рабочая нагрузка, точность захода, взаимодействие с землёй. Причины: давление времени, ошибки при чтении подходов, сбои коммуникации экипаж–УВД, погодные условия.</li>
                  <li><strong className="text-slate-700">Посадка (13).</strong> Мало событий в выборке за счёт короткой длительности фазы и фокуса экипажа. Гипотеза: часть инцидентов классифицируется как «Заход» или «Прочее».</li>
                  <li><strong className="text-slate-700">Прочее (124).</strong> События вне стандартных фаз (руление, ожидание, неклассифицированные). Гипотеза: улучшение классификации и учёта по фазам снизит долю «Прочее» и уточнит распределение.</li>
                </ul>
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

        {/* Пояснения к радару «Инциденты и причины» — после пояснений к матрице рисков */}
        <Card>
          <CardHeader className="py-2">
            <h2 className="font-semibold text-slate-800 text-sm">Пояснения к радару «Инциденты и причины» по подразделениям</h2>
          </CardHeader>
          <CardBody className="pt-0">
            <div className="text-[11px] text-slate-600 space-y-2">
              <p><strong className="text-slate-700">Назначение радара.</strong> График показывает оценки по 12 факторам Human Factor (невнимательность, недостаток знаний, стресс, усталость и др.) для семи подразделений. По оси от центра до края — шкала 0–10: чем дальше точка от центра, тем выше проявление фактора. Кривые можно включать и отключать по клику на легенде.</p>
              <p><strong className="text-slate-700">Подразделения.</strong> <strong className="text-slate-700">Летная служба</strong> — показатели не более 6 по всем факторам, кроме «Усталость» (допустимо до 8). <strong className="text-slate-700">Наземное обслуживание</strong> и <strong className="text-slate-700">Бортпроводники</strong> — средние и повышенные значения в своих диапазонах. <strong className="text-slate-700">Техническое обслуживание</strong>, <strong className="text-slate-700">Диспетчеризация</strong>, <strong className="text-slate-700">Офисный блок</strong>, <strong className="text-slate-700">Менеджмент</strong> — распределены по разным диапазонам для сравнения.</p>
              <p><strong className="text-slate-700">Использование.</strong> Сопоставление кривых помогает выявить подразделения с высокими значениями по усталости, стрессу или недопониманию и приоритизировать меры (обучение, режим труда и отдыха, коммуникации). Данные согласованы с Реестром рисков и трендами проф. надёжности в разделе Employee CoPilot.</p>
            </div>
          </CardBody>
        </Card>
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
