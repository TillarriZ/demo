"use client";

import { useState, useCallback } from "react";
import {
  Sankey,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Палитра платформы (зелёные, teal, оранжевые тона)
const SIGNAL_COLORS = [
  "#638e59", // green-main
  "#79a471", // green-light
  "#8db881", // green-lighter
  "#0d9488", // teal
  "#3b692f", // green-dark
  "#95c740", // green-bright
  "#e4ba6a", // orange-dirty
  "#ca8a04", // risk-yellow
];

// Сигналы/аномалии и их провоцирующие факторы (опасные факторы)
const SIGNAL_META: {
  name: string;
  color: string;
  provokingFactors: string[];
}[] = [
  {
    name: "Ошибка в выполнении процедуры",
    color: SIGNAL_COLORS[0],
    provokingFactors: ["Недостаток знаний", "Автоматизм", "Отвлечение", "Неясность инструкций"],
  },
  {
    name: "Снижение внимания",
    color: SIGNAL_COLORS[1],
    provokingFactors: ["Усталость", "Монотония", "Перегрузка", "Внешние отвлекающие факторы"],
  },
  {
    name: "Пропуск",
    color: SIGNAL_COLORS[2],
    provokingFactors: ["Дефицит времени", "Усталость", "Недостаток информации", "Привычка пропускать шаги"],
  },
  {
    name: "Изменение речи (голосовые)",
    color: SIGNAL_COLORS[3],
    provokingFactors: ["Стресс", "Эмоциональное напряжение", "Давление", "Конфликт"],
  },
  {
    name: "Нарушение границ (видео)",
    color: SIGNAL_COLORS[4],
    provokingFactors: ["Культурные различия", "Несоблюдение норм", "Игнорирование правил", "Групповое давление"],
  },
  {
    name: "Конфликт",
    color: SIGNAL_COLORS[5],
    provokingFactors: ["Давление сроков", "Конфликт целей", "Недостаток ресурсов", "Несогласованность ролей"],
  },
  {
    name: "Задержка в принятии решения",
    color: SIGNAL_COLORS[6],
    provokingFactors: ["Нехватка информации", "Стресс", "Давление", "Неопределённость ситуации"],
  },
  {
    name: "Неверное решение",
    color: SIGNAL_COLORS[7],
    provokingFactors: ["Пробел знаний", "Самонадеянность", "Дефицит времени", "Недооценка рисков"],
  },
];

const HF_COMPONENTS = [
  "Пробел знаний",
  "Давление",
  "Самонадеянность",
  "Нарушение во взаимодействии",
  "Нехватка информации",
  "Стресс",
  "Усталость",
  "Внешние факторы",
  "Слепые зоны культуры",
  "Несоблюдение правил",
];

const SIGNALS = SIGNAL_META.map((s) => s.name);

const NODES = [
  ...SIGNAL_META.map((s) => ({ name: s.name })),
  ...HF_COMPONENTS.map((name) => ({ name })),
];

// Ссылки с sourceIndex для раскраски
const LINKS: { source: number; target: number; value: number; sourceIndex: number }[] = [
  { source: 0, target: 8, value: 45, sourceIndex: 0 },
  { source: 0, target: 17, value: 55, sourceIndex: 0 },
  { source: 1, target: 13, value: 40, sourceIndex: 1 },
  { source: 1, target: 14, value: 60, sourceIndex: 1 },
  { source: 2, target: 14, value: 50, sourceIndex: 2 },
  { source: 2, target: 12, value: 50, sourceIndex: 2 },
  { source: 3, target: 13, value: 100, sourceIndex: 3 },
  { source: 4, target: 16, value: 60, sourceIndex: 4 },
  { source: 4, target: 17, value: 40, sourceIndex: 4 },
  { source: 5, target: 9, value: 50, sourceIndex: 5 },
  { source: 5, target: 11, value: 50, sourceIndex: 5 },
  { source: 6, target: 12, value: 35, sourceIndex: 6 },
  { source: 6, target: 13, value: 35, sourceIndex: 6 },
  { source: 6, target: 9, value: 30, sourceIndex: 6 },
  { source: 7, target: 8, value: 40, sourceIndex: 7 },
  { source: 7, target: 10, value: 30, sourceIndex: 7 },
  { source: 7, target: 12, value: 30, sourceIndex: 7 },
];

const SANKEY_DATA = { nodes: NODES, links: LINKS };

type LinkPayload = {
  source?: { name?: string };
  target?: { name?: string };
  value?: number;
  sourceIndex?: number;
};

function CustomTooltip({
  payload,
}: {
  payload?: Array<{ payload?: LinkPayload }>;
}) {
  const p = payload?.[0]?.payload;
  if (!p?.source?.name || !p?.target?.name) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-lg px-3 py-2 text-xs">
      <p className="text-slate-700 font-medium">{p.source.name}</p>
      <p className="text-slate-500">→ {p.target.name}</p>
      <p className="text-slate-600 mt-1">Связей: {p.value}</p>
    </div>
  );
}

// Кастомная отрисовка link с цветом по sourceIndex (используем тот же path, что и recharts)
function CustomLink(props: {
  sourceX: number;
  targetX: number;
  sourceY: number;
  targetY: number;
  sourceControlX: number;
  targetControlX: number;
  linkWidth: number;
  payload?: LinkPayload;
  [key: string]: unknown;
}) {
  const { sourceX, targetX, sourceY, targetY, sourceControlX, targetControlX, linkWidth, payload } = props;
  const sourceIdx = (payload?.sourceIndex ?? 0) as number;
  const strokeColor = SIGNAL_COLORS[sourceIdx] ?? "#638e59";

  const pathD = `M${sourceX},${sourceY} C${sourceControlX},${sourceY} ${targetControlX},${targetY} ${targetX},${targetY}`;

  return (
    <path
      className="recharts-sankey-link"
      d={pathD}
      fill="none"
      stroke={strokeColor}
      strokeWidth={linkWidth}
      strokeOpacity={0.7}
      style={{ cursor: "pointer" }}
    />
  );
}

// Сводка «Текущее состояние» — фиксированные значения по данным мониторинга
const SUMMARY = {
  totalSignals: 825,
  topProvoking: [
    { name: "Дефицит времени", count: 273 },
    { name: "Давление", count: 253 },
    { name: "Стресс", count: 187 },
    { name: "Усталость", count: 112 },
  ],
  topHf: [
    { name: "Пробел знаний", count: 175 },
    { name: "Нехватка информации", count: 115 },
    { name: "Нарушение во взаимодействии", count: 110 },
    { name: "Слепые зоны культуры", count: 95 },
  ],
};

export default function AnomaliesSignalsSankey() {
  const [modalLink, setModalLink] = useState<{
    signal: string;
    hfComponent: string;
    value: number;
    provokingFactors: string[];
  } | null>(null);

  const summary = SUMMARY;

  const handleLinkClick = useCallback((item: { payload?: LinkPayload }) => {
    const p = item?.payload;
    if (!p?.source?.name || !p?.target?.name) return;
    const sourceIdx =
      (typeof p.sourceIndex === "number" ? p.sourceIndex : null) ??
      SIGNAL_META.findIndex((m) => m.name === p.source?.name);
    const meta = SIGNAL_META[sourceIdx >= 0 ? sourceIdx : 0];
    setModalLink({
      signal: p.source.name,
      hfComponent: p.target.name,
      value: p.value ?? 0,
      provokingFactors: meta?.provokingFactors ?? [],
    });
  }, []);

  return (
    <div className="w-full">
      {/* Легенда: слева — сигналы, справа — компоненты */}
      <div className="flex flex-wrap justify-between gap-4 mb-3">
        <div className="flex-1 min-w-[200px]">
          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-2">Аномалии и сигналы</p>
          <div className="flex flex-wrap gap-x-3 gap-y-1.5">
            {SIGNAL_META.map((s, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <span
                  className="w-3 h-3 rounded shrink-0"
                  style={{ backgroundColor: s.color }}
                  title={s.name}
                />
                <span className="text-xs text-slate-700 truncate max-w-[180px]" title={s.name}>{s.name}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex-1 min-w-[200px]">
          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-2">HF компоненты</p>
          <div className="flex flex-wrap gap-x-3 gap-y-1.5">
            {HF_COMPONENTS.map((name, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-slate-400 shrink-0" />
                <span className="text-xs text-slate-700 truncate max-w-[160px]" title={name}>{name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* График Sankey */}
      <div className="w-full h-[380px] min-h-[300px] border border-slate-200 rounded-lg overflow-hidden bg-white">
        <ResponsiveContainer width="100%" height="100%">
          <Sankey
            data={SANKEY_DATA}
            margin={{ top: 16, right: 60, bottom: 16, left: 60 }}
            node={{
              fill: "var(--accent)",
              stroke: "none",
              strokeWidth: 0,
            }}
            link={(props) => <CustomLink {...props} payload={props.payload as LinkPayload} />}
            nodePadding={10}
            nodeWidth={10}
            onClick={handleLinkClick}
          >
            <Tooltip content={<CustomTooltip />} />
          </Sankey>
        </ResponsiveContainer>
      </div>
      <p className="text-[10px] text-slate-400 mt-1 mb-2">Нажмите на поток, чтобы увидеть детали</p>

      {/* Модальное окно при клике на поток */}
      {modalLink && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setModalLink(null)} aria-hidden />
          <div
            className="relative bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-md p-4"
            role="dialog"
            aria-labelledby="flow-modal-title"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 id="flow-modal-title" className="text-sm font-semibold text-slate-800">
                Детали потока
              </h3>
              <button
                type="button"
                onClick={() => setModalLink(null)}
                className="p-1.5 rounded hover:bg-slate-100 text-slate-500"
                aria-label="Закрыть"
              >
                ×
              </button>
            </div>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-xs font-medium text-slate-500 mb-0.5">Сигнал / аномалия</p>
                <p className="text-slate-800 font-medium">{modalLink.signal}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 mb-0.5">Отнесён к HF компоненту</p>
                <p className="text-slate-800">{modalLink.hfComponent}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 mb-0.5">Провоцирующие факторы (опасные факторы)</p>
                <ul className="list-disc list-inside text-slate-700 space-y-0.5">
                  {modalLink.provokingFactors.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
              </div>
              <p className="text-xs text-slate-500">Количество связей: {modalLink.value}</p>
            </div>
          </div>
        </div>
      )}

      {/* Сводка под графиком */}
      <div className="mt-4 p-4 rounded-lg bg-slate-50 border border-slate-200">
        <h4 className="text-xs font-semibold text-slate-700 mb-3">Текущее состояние</h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <p className="text-slate-500 mb-1">Всего сигналов и аномалий</p>
            <p className="text-lg font-bold text-slate-800">{summary.totalSignals}</p>
          </div>
          <div>
            <p className="text-slate-500 mb-1">В основном спровоцированы факторами</p>
            <ul className="text-slate-700 space-y-0.5">
              {summary.topProvoking.map((item, i) => (
                <li key={i}>
                  {item.name} — <span className="font-medium">{item.count}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-slate-500 mb-1">Отнесены к компонентам HF</p>
            <ul className="text-slate-700 space-y-0.5">
              {summary.topHf.map((item, i) => (
                <li key={i}>
                  {item.name} — <span className="font-medium">{item.count}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
