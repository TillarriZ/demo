"use client";

import Link from "next/link";

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

// Аудио: состояние по записям — норма (true) / аномалия (false) по сессиям (добавлены две строки)
const audioSessions = [
  true, true, true, false, true, true, true, true, false, true, true, true,
  true, false, true, true, true, true, true, true, false, true, true, true,
  true, true, false, true, true, true, true, true, true, false, true, true,
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

/** График по аудио: уменьшен, текст «Сессии — время» мельче, две дополнительные строки записей */
export function AudioStateChart() {
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
          return (
            <rect
              key={i}
              x={x}
              y={y}
              width={cellSize - 1}
              height={cellSize - 1}
              rx={1}
              fill={normal ? "var(--accent)" : "#dc2626"}
              stroke={normal ? "var(--green-dark)" : "#b91c1c"}
              strokeWidth="0.5"
            />
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
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-red-600" /> Аномалии</span>
      </div>
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
