"use client";

import { useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";

const RADAR_LABELS = [
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

// Значения 0–10 по 12 направлениям: красная до 4, оранжевая до 6, синяя до 8
const radarRed = [2, 1, 3, 2, 1, 3, 2, 2, 1, 3, 2, 2];
const radarOrange = [4, 5, 3, 4, 5, 4, 5, 4, 3, 5, 4, 5];
const radarBlue = [6, 7, 5, 6, 7, 6, 7, 6, 5, 7, 6, 7];

// Тренд за 7 лет 4 мес: высокая → спад → выравнивание → плато → спад
const trendYears = [2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025];
const trendValues = [7.5, 6.5, 6, 7, 7, 7, 6.5, 5.5];

// Обучение: % успешности по программам, сертификация, допуски
const trainingData = [
  { label: "Тип ВС B-777", value: 98 },
  { label: "CRM", value: 100 },
  { label: "MCC", value: 95 },
  { label: "Сертификация ATPL", value: 92 },
  { label: "ВЛЭК 1 кл.", value: 100 },
  { label: "Англ. ICAO 4", value: 88 },
  { label: "Допуск ИПП", value: 94 },
  { label: "Опасные грузы", value: 96 },
];

// Периоды работы второго пилота B777
type AudioPeriod =
  | "Брифинг"
  | "Подготовка кабины"
  | "Взлёт"
  | "Набор высоты"
  | "Посадка"
  | "Завершение рейса / чек-лист"
  | "Дебрифинг"
  | "Тренажёр"
  | "Тренинг по обучению";

export type AudioAnomalyDetails = {
  deviationType: "Построение предложений" | "Интонации" | "Скорость речи";
  period: AudioPeriod;
  hypotheses: string[];
  comparisonData: string[];
  recommendations: string[];
};

// Детали по каждой аномалии (индекс = позиция в сетке)
const audioAnomalyDetails: Record<number, AudioAnomalyDetails> = {
  3: {
    deviationType: "Интонации",
    period: "Подготовка кабины",
    hypotheses: [
      "Накануне — ночной рейс (прилёт 03:45), сон 4.5 ч.",
      "Снижение тонуса голоса, монотонность — возможная связь с усталостью",
      "Показатель «Усталость» по психотестированию: 6.2/10 (выше нормы)",
    ],
    comparisonData: [
      "Базовая запись того же периода 2 недели назад — норма",
      "Сравнение с типовым паттерном при достаточном отдыхе (>7 ч сна)",
      "Нагрузка при получении допуска: 12 рейсов за 14 дней",
    ],
    recommendations: [
      "Увеличить межрейсовый отдых после ночных секторов",
      "Краткий чек-лист перед подготовкой кабины — восстановление фокуса",
      "При повторении — консультация по режиму сна и усталости",
    ],
  },
  8: {
    deviationType: "Построение предложений",
    period: "Набор высоты",
    hypotheses: [
      "Маленький перерыв между рейсами (8 ч) — недостаточное восстановление",
      "Фрагментированная речь, пропуски в стандартных фразах",
      "Связь с нагрузкой: 3 ночных рейса подряд в предыдущие сутки",
    ],
    comparisonData: [
      "Показатели психологического тестирования: внимание 5.8/10",
      "Сравнение с CRM-протоколом «Читай- backs» — отклонение от эталона",
      "Данные планирования: перерыв 8 ч между DHD и следующим рейсом",
    ],
    recommendations: [
      "Напомнить о достаточном межрейсовом отдыхе (min 12 ч для ночных)",
      "Повторение CRM-модуля по коммуникации в критических фазах",
      "Рассмотреть ротацию при накопленной нагрузке",
    ],
  },
  13: {
    deviationType: "Интонации",
    period: "Посадка",
    hypotheses: [
      "Перед сессией — прохождение медкомиссии (стресс-фактор)",
      "Повышенная напряжённость в голосе, учащение пауз",
      "Период совпал с истечением допуска и процедурой продления",
    ],
    comparisonData: [
      "Сравнение с записями посадок в стабильный период — норма",
      "Нагрузка при получении допуска: подготовка к проверке, медосмотр",
      "Психотестирование: стресс 5.5/10 за неделю до сессии",
    ],
    recommendations: [
      "Избегать планирования критических фаз сразу после медкомиссии",
      "Краткий брифинг с КВС при известных стресс-факторах",
      "При необходимости — разбор с психологом по управлению стрессом",
    ],
  },
  20: {
    deviationType: "Построение предложений",
    period: "Взлёт",
    hypotheses: [
      "Сжатый временной интервал между брифингом и вылетом",
      "Фрагментированные доклады при выполнении взлётного чек-листа",
      "Показатель «Недооценка ситуации» по радару: 4.2/10",
    ],
    comparisonData: [
      "Сравнение с эталонными записями взлёта — отклонение в структуре фраз",
      "Перерыв между рейсами: 10 ч (ночной сектор перед этим)",
      "Психотестирование: внимание 6.1/10",
    ],
    recommendations: [
      "Заложить буферное время между брифингом и вылетом при ночных секторах",
      "Повторение процедур взлётного чек-листа с акцентом на чёткость докладов",
      "При повторении — разбор с инструктором",
    ],
  },
  21: {
    deviationType: "Скорость речи",
    period: "Набор высоты",
    hypotheses: [
      "Ускоренный темп речи (≈180 сл/мин при норме 120–140) — возможная реакция на повышение рабочей нагрузки при переходе в крейсер",
      "Накануне — короткий перерыв между рейсами (9 ч), сон 5 ч — связь с усталостью и компенсаторным «торопливым» темпом",
      "Показатель «Стресс» по психотестированию: 5.4/10; нагрузка при получении допуска: 4 проверки за 2 месяца",
    ],
    comparisonData: [
      "Сравнение с эталонной скоростью речи для фаз набора высоты (120–140 сл/мин) — превышение на 28%",
      "Базовая запись того же периода при достаточном отдыхе — норма",
      "Медицинский осмотр пройден за 3 дня до сессии — без замечаний; связь с адаптацией после медкомиссии",
    ],
    recommendations: [
      "Тренировка осознанного темпа речи в критических фазах (набор, заход) — напоминание «говори медленнее» в брифинге",
      "Увеличить межрейсовый отдых при накопленной нагрузке и после медкомиссии",
      "При повторении — разбор с инструктором и при необходимости консультация по техникам саморегуляции",
    ],
  },
  26: {
    deviationType: "Интонации",
    period: "Брифинг",
    hypotheses: [
      "Ранний вылет (06:15) — возможный недостаток сна",
      "Сниженная энергетика голоса в начале брифинга",
      "Сравнение с дневными брифингами — выраженное отличие",
    ],
    comparisonData: [
      "Запись брифинга при вылете 14:00 — норма",
      "Фактический сон: 5.5 ч (по данным приложения)",
      "Психотестирование: усталость 5.9/10",
    ],
    recommendations: [
      "Рекомендовать ранний отбой при ранних вылетах",
      "Краткая «разминка» коммуникации перед брифингом",
      "При систематических отклонениях — оценка режима сна",
    ],
  },
  32: {
    deviationType: "Построение предложений",
    period: "Завершение рейса / чек-лист",
    hypotheses: [
      "Третий сектор за день — накопленная усталость",
      "Пропуски в стандартных фразах чек-листа после посадки",
      "Связь с длительностью смены: 11 ч 40 мин",
    ],
    comparisonData: [
      "Сравнение с первым сектором того же дня — норма",
      "Данные по нагрузке: 3 сектора, 2 промежуточных посадки",
      "Психотестирование: усталость 6.5/10",
    ],
    recommendations: [
      "Усилить взаимный контроль в чек-листе при многосекторных сменах",
      "Использовать письменный чек-лист для минимизации пропусков",
      "При планировании — учитывать накопленную нагрузку к концу смены",
    ],
  },
  33: {
    deviationType: "Построение предложений",
    period: "Посадка",
    hypotheses: [
      "Второй сектор, короткий перерыв между рейсами (55 мин) — неполное восстановление фокуса",
      "Неточности в докладе при заходе, пропуск одного пункта в чек-листе",
      "Показатель «Внимание» по психотестированию: 5.6/10",
    ],
    comparisonData: [
      "Сравнение с эталонной последовательностью докладов при заходе — отклонение",
      "Данные планирования: 2 рейса в тот день, перерыв 55 мин",
      "Медицинский осмотр пройден за неделю — без замечаний",
    ],
    recommendations: [
      "Увеличить минимальный перерыв между секторами при многорейсовых сменах",
      "Повторение процедур доклада при заходе — чек-лист по памяти",
      "При повторении — разбор с КВС по взаимному контролю в критических фазах",
    ],
  },
  35: {
    deviationType: "Интонации",
    period: "Дебрифинг",
    hypotheses: [
      "Конец смены с тремя секторами — накопленная усталость к вечеру",
      "Снижение модуляции голоса, «плоская» интонация при обсуждении полёта",
      "Перерыв между вторым и третьим сектором — 1 ч 20 мин (сжатый график)",
    ],
    comparisonData: [
      "Сравнение с дебрифингами после 1–2 секторов — норма",
      "Длительность смены: 10 ч 50 мин, прилёт 22:35",
      "Психотестирование: усталость 6.3/10 в конце дня",
    ],
    recommendations: [
      "Учитывать многосекторность при планировании качества дебрифинга",
      "Краткий структурированный чек-лист для вечернего разбора",
      "При повторении — пересмотр распределения секторов в смене",
    ],
  },
  40: {
    deviationType: "Интонации",
    period: "Тренинг по обучению",
    hypotheses: [
      "Отработка нового модуля CRM — адаптация к материалу",
      "Повышенная осторожность в формулировках, неуверенность в интонации",
      "Первый раз в роли стажёра на тренинге",
    ],
    comparisonData: [
      "Сравнение с записями опытных инструкторов — типичный паттерн новичка",
      "Оценка тренера: «требуется практика презентации»",
      "Психотестирование: стресс 5.2/10 (новая роль)",
    ],
    recommendations: [
      "Дополнительные сессии по презентации и ведению брифингов",
      "Парная работа с опытным инструктором на тренингах",
      "Обратная связь после каждого тренинга — накопление опыта",
    ],
  },
};

// Аудио: состояние по записям — норма (true) / аномалия (false) по сессиям
const audioSessions = [
  true, true, true, false, true, true, true, true, false, true, true, true,
  true, false, true, true, true, true, true, true, false, false, true, true,
  true, true, false, true, true, true, true, true, true, false, true, false,
  true, true, true, true, false, true, true, true, true, true, true, true,
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

export function RadarChart() {
  const size = 400;
  const cx = size / 2;
  const cy = size / 2;
  const maxR = size / 2 - 56;
  const scale = 10;

  return (
    <div className="overflow-x-auto">
      <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-[400px] mx-auto" style={{ minWidth: 320 }}>
        {/* Сетка: 5 колец (0, 2, 4, 6, 8, 10) */}
        {[0, 2, 4, 6, 8, 10].map((v) => {
          const r = (v / scale) * maxR;
          return (
            <circle
              key={v}
              cx={cx}
              cy={cy}
              r={r}
              fill="none"
              stroke="var(--border)"
              strokeWidth="0.5"
            />
          );
        })}
        {/* 12 осей */}
        {RADAR_LABELS.map((_, i) => {
          const angle = (i * 360) / 12;
          const end = polarToXY(cx, cy, maxR, angle);
          return (
            <line
              key={i}
              x1={cx}
              y1={cy}
              x2={end.x}
              y2={end.y}
              stroke="var(--border)"
              strokeWidth="0.5"
            />
          );
        })}
        {/* Подписи направлений (снаружи) */}
        {RADAR_LABELS.map((label, i) => {
          const angle = (i * 360) / 12;
          const r = maxR + 28;
          const p = polarToXY(cx, cy, r, angle);
          return (
            <text
              key={i}
              x={p.x}
              y={p.y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-slate-600"
              style={{ fontSize: 10 }}
            >
              {label.length > 20 ? label.slice(0, 19) + "…" : label}
            </text>
          );
        })}
        {/* Три кривые */}
        <path
          d={radarPath(radarRed, cx, cy, maxR, scale)}
          fill="none"
          stroke="#dc2626"
          strokeWidth="1.5"
          opacity={0.9}
        />
        <path
          d={radarPath(radarOrange, cx, cy, maxR, scale)}
          fill="none"
          stroke="var(--risk-orange)"
          strokeWidth="1.5"
          opacity={0.9}
        />
        <path
          d={radarPath(radarBlue, cx, cy, maxR, scale)}
          fill="none"
          stroke="#2563eb"
          strokeWidth="1.5"
          opacity={0.9}
        />
      </svg>
      <div className="flex flex-wrap justify-center gap-4 mt-2 text-xs">
        <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-red-600 rounded" /> Ошибки, нарушения, серьёзные отклонения</span>
        <span className="flex items-center gap-1"><span className="w-3 h-0.5 rounded" style={{ background: "var(--risk-orange)" }} /> Дневные рейсы</span>
        <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-blue-600 rounded" /> Ночные рейсы</span>
      </div>
    </div>
  );
}

export function TrendChart() {
  const width = 400;
  const height = 200;
  const padding = { top: 16, right: 16, bottom: 28, left: 32 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;
  const yMin = 0;
  const yMax = 10;
  const yOptimalMin = 4;
  const yOptimalMax = 8;

  const xScale = (i: number) => padding.left + (i / (trendYears.length - 1)) * chartW;
  const yScale = (v: number) => padding.top + chartH - ((v - yMin) / (yMax - yMin)) * chartH;

  const pathPoints = trendValues.map((v, i) => `${i === 0 ? "M" : "L"} ${xScale(i)} ${yScale(v)}`).join(" ");
  const zoneY1 = yScale(yOptimalMax);
  const zoneY2 = yScale(yOptimalMin);

  return (
    <div className="overflow-x-auto">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full" style={{ minWidth: 300 }}>
        {/* Зона оптимального порога 4–8 */}
        <rect
          x={padding.left}
          y={zoneY1}
          width={chartW}
          height={zoneY2 - zoneY1}
          fill="var(--accent-light)"
          opacity={0.5}
        />
        {/* Горизонтальные линии сетки */}
        {[0, 2, 4, 6, 8, 10].map((v) => (
          <line
            key={v}
            x1={padding.left}
            y1={yScale(v)}
            x2={padding.left + chartW}
            y2={yScale(v)}
            stroke="var(--border)"
            strokeWidth="0.5"
            strokeDasharray="4,2"
          />
        ))}
        {/* Метки по оси Y */}
        {[0, 4, 8, 10].map((v) => (
          <text key={v} x={padding.left - 6} y={yScale(v)} textAnchor="end" dominantBaseline="middle" className="fill-slate-500 text-xs">{v}</text>
        ))}
        {/* Метки по оси X — годы */}
        {trendYears.map((y, i) => (
          <text key={y} x={xScale(i)} y={height - 8} textAnchor="middle" className="fill-slate-500 text-xs">{y}</text>
        ))}
        {/* Кривая тренда */}
        <path d={pathPoints} fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        {trendValues.map((v, i) => (
          <circle key={i} cx={xScale(i)} cy={yScale(v)} r="3" fill="var(--accent)" />
        ))}
        {/* Подпись зоны */}
        <text x={padding.left + chartW - 4} y={zoneY1 + 10} textAnchor="end" className="fill-slate-500 text-[10px]">оптимум 4–8</text>
      </svg>
    </div>
  );
}

/** Столбчатый график: опущен ниже для читаемости % над столбцами; подписи под столбцами вынесены отдельно */
export function TrainingBarChart() {
  const width = 400;
  const svgHeight = 200;
  const padding = { top: 44, right: 12, bottom: 16, left: 42 };
  const chartW = width - padding.left - padding.right;
  const chartH = svgHeight - padding.top - padding.bottom;
  const maxVal = 100;
  const barW = Math.min(28, (chartW / trainingData.length) * 0.85);
  const gap = (chartW - trainingData.length * barW) / (trainingData.length + 1);

  const yScale = (v: number) => padding.top + chartH - (v / maxVal) * chartH;

  return (
    <div className="overflow-x-auto max-w-[400px] mx-auto">
      <svg viewBox={`0 0 ${width} ${svgHeight}`} className="w-full" style={{ minWidth: 320 }}>
        {[0, 25, 50, 75, 100].map((v) => (
          <line key={v} x1={padding.left} y1={yScale(v)} x2={padding.left + chartW} y2={yScale(v)} stroke="var(--border)" strokeWidth="0.5" strokeDasharray="3,2" />
        ))}
        {[0, 50, 100].map((v) => (
          <text key={v} x={padding.left - 4} y={yScale(v)} textAnchor="end" dominantBaseline="middle" className="fill-slate-500" style={{ fontSize: 10 }}>{v}%</text>
        ))}
        {trainingData.map((d, i) => {
          const x = padding.left + gap + i * (barW + gap);
          const h = (d.value / maxVal) * chartH;
          const y = padding.top + chartH - h;
          const isGreen = d.value >= 90;
          const isOrange = d.value >= 70 && d.value < 90;
          return (
            <g key={d.label}>
              <rect x={x} y={y} width={barW} height={h} fill={isGreen ? "var(--accent)" : isOrange ? "var(--risk-orange)" : "#dc2626"} rx={2} />
              <text x={x + barW / 2} y={y - 6} textAnchor="middle" className="fill-slate-700 font-medium" style={{ fontSize: 10 }}>{d.value}%</text>
            </g>
          );
        })}
      </svg>
      <div className="flex justify-center gap-1 mt-2 px-0 flex-wrap">
        {trainingData.map((d) => (
          <span key={d.label} className="text-[9px] text-slate-600 text-center leading-tight" style={{ width: barW + gap, maxWidth: 52 }}>
            {d.label}
          </span>
        ))}
      </div>
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-2 text-[10px] text-slate-600">
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-[var(--accent)]" /> ≥90%</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-[var(--risk-orange)]" /> 70–89%</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-red-600" /> &lt;70%</span>
      </div>
    </div>
  );
}

/** Модальное окно с деталями отклонения по аудио */
function AudioAnomalyModal({
  details,
  sessionIndex,
  onClose,
}: {
  details: AudioAnomalyDetails;
  sessionIndex: number;
  onClose: () => void;
}) {
  const row = Math.floor(sessionIndex / 12) + 1;
  const col = (sessionIndex % 12) + 1;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-xl max-w-lg w-full mx-4 max-h-[85vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-4 py-3 border-b border-slate-200 flex justify-between items-center">
          <h3 className="text-base font-semibold text-slate-800">
            Отклонение в записи — сессия {row}×{col}
          </h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            ×
          </Button>
        </div>
        <div className="p-4 overflow-y-auto sidebar-scroll space-y-4 text-sm">
          <div>
            <p className="font-medium text-slate-700 mb-0.5">Тип отклонения</p>
            <p className="text-slate-600">{details.deviationType}</p>
          </div>
          <div>
            <p className="font-medium text-slate-700 mb-0.5">Период работы (второй пилот B777)</p>
            <p className="text-slate-600">{details.period}</p>
          </div>
          <div>
            <p className="font-medium text-slate-700 mb-1">Гипотезы</p>
            <ul className="list-disc list-inside text-slate-600 space-y-0.5">
              {details.hypotheses.map((h, i) => (
                <li key={i}>{h}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-medium text-slate-700 mb-1">Сравнение с данными</p>
            <ul className="list-disc list-inside text-slate-600 space-y-0.5">
              {details.comparisonData.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-medium text-slate-700 mb-1">Рекомендации</p>
            <ul className="list-disc list-inside text-slate-600 space-y-0.5">
              {details.recommendations.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

/** График по аудио: красные квадратики кликабельны — показывают детали отклонений */
export function AudioStateChart() {
  const [selectedAnomaly, setSelectedAnomaly] = useState<number | null>(null);
  const cellSize = 11;
  const cols = 12;
  const rows = Math.ceil(audioSessions.length / cols);
  const width = cols * cellSize + 44;
  const height = rows * cellSize + 28;

  return (
    <div className="overflow-x-auto max-w-[400px]">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full" style={{ minWidth: 200 }}>
        {audioSessions.map((normal, i) => {
          const col = i % cols;
          const row = Math.floor(i / cols);
          const x = 36 + col * cellSize;
          const y = 10 + row * cellSize;
          const isAnomaly = !normal;
          const details = audioAnomalyDetails[i];
          const isClickable = isAnomaly && details;

          return (
            <g key={i}>
              <rect
                x={x}
                y={y}
                width={cellSize - 1}
                height={cellSize - 1}
                rx={1}
                fill={normal ? "var(--accent)" : "#dc2626"}
                stroke={normal ? "var(--green-dark)" : "#b91c1c"}
                strokeWidth="0.5"
                className={isClickable ? "cursor-pointer hover:opacity-90" : undefined}
                onClick={isClickable ? () => setSelectedAnomaly(i) : undefined}
              />
              {isClickable && (
                <title>Нажмите для просмотра деталей отклонения</title>
              )}
            </g>
          );
        })}
        <text x={3} y={height / 2} textAnchor="middle" dominantBaseline="middle" className="fill-slate-500" style={{ fontSize: 7 }} transform={`rotate(-90 3 ${height / 2})`}>
          Записи
        </text>
        <text x={36 + (cols * cellSize) / 2} y={height - 4} textAnchor="middle" className="fill-slate-500" style={{ fontSize: 7 }}>
          Сессии — время
        </text>
      </svg>
      <div className="flex flex-wrap justify-center gap-2 mt-1 text-[10px] text-slate-600">
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-[var(--accent)]" /> Норма</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-red-600" /> Аномалии — нажмите для деталей</span>
      </div>
      {selectedAnomaly !== null && audioAnomalyDetails[selectedAnomaly] && (
        <AudioAnomalyModal
          details={audioAnomalyDetails[selectedAnomaly]}
          sessionIndex={selectedAnomaly}
          onClose={() => setSelectedAnomaly(null)}
        />
      )}
    </div>
  );
}

export function TrajectoryConclusion() {
  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-white)] p-4 text-sm text-slate-700">
        <h4 className="font-semibold text-slate-800 mb-2">Заключение</h4>
        <p className="mb-2">
          Радар инцидентов и причин показывает умеренные значения по ошибкам и нарушениям (красная кривая в пределах 1–3).
          Проявления в дневных рейсах (оранжевая) и ночных (синяя) укладываются в ожидаемый диапазон; по направлениям «Усталость»
          и «Физиологические факторы» ночные показатели выше — рекомендуется контроль режима отдыха.
        </p>
        <p className="mb-2">
          Обучение: высокий % успешности по программам и допускам; сертификация и ВЛЭК пройдены. По аудиоанализу записей
          большинство сессий в норме, отдельные эпизоды с проявлениями отклонений — целесообразен разбор с психологом/супервизором.
        </p>
        <p>
          Тренд профессиональной надёжности за 7 лет 4 мес.: после начального высокого уровня — кратковременное снижение с последующим
          выходом в зону оптимума (4–8) и стабилизацией. В последний период наблюдается снижение показателя; целесообразна детализация
          причин и при необходимости корректирующие мероприятия (обучение, нагрузка, ротация).
        </p>
      </div>
      <Link
        href="/copilot/trends"
        className="block p-4 rounded-lg border-2 border-[var(--accent)] bg-[var(--accent-light)] text-center font-medium text-slate-800 hover:bg-[var(--green-pale)] transition-colors"
      >
        Изучить показатели и возможные риски →
      </Link>
    </div>
  );
}
