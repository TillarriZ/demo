"use client";

import { useState, useCallback } from "react";

const years = [2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025];

const SERIES_DEFAULT: { key: string; label: string; color: string; values: number[] }[] = [
  { key: "company", label: "Общий тренд в компании", color: "#64748b", values: [6.2, 6, 5.8, 6.2, 6.3, 6.2, 6, 5.8] },
  { key: "pilots", label: "Тренд Летной службы", color: "#2563eb", values: [6.5, 6.3, 6.1, 6.5, 6.6, 6.5, 6.2, 6] },
  { key: "b777", label: "Тренд Наземного обслуживания", color: "#0d9488", values: [6.6, 6.4, 6.2, 6.6, 6.7, 6.6, 6.2, 5.9] },
  { key: "second", label: "Тренд офисного блока", color: "#ea580c", values: [6.4, 6.2, 6, 6.4, 6.5, 6.4, 6, 5.6] },
  { key: "secondB777", label: "Тренд диспетчерских служб", color: "#7c3aed", values: [6.55, 6.35, 6.1, 6.55, 6.65, 6.5, 6.1, 5.75] },
  { key: "you", label: "Тренд менеджмента", color: "var(--accent)", values: [7.5, 6.5, 6, 7, 7, 7, 6.5, 5.5] },
];

// Вариант для Employee CoPilot — Тренды компании (только подписи, данные те же)
const SERIES_COPILOT: { key: string; label: string; color: string; values: number[] }[] = [
  { key: "company", label: "Общий тренд в компании", color: "#64748b", values: [6.2, 6, 5.8, 6.2, 6.3, 6.2, 6, 5.8] },
  { key: "pilots", label: "Тренд Летной службы", color: "#2563eb", values: [6.5, 6.3, 6.1, 6.5, 6.6, 6.5, 6.2, 6] },
  { key: "b777", label: "Тренд отряда В-777", color: "#0d9488", values: [6.6, 6.4, 6.2, 6.6, 6.7, 6.6, 6.2, 5.9] },
  { key: "second", label: "Тренд вторых пилотов", color: "#ea580c", values: [6.4, 6.2, 6, 6.4, 6.5, 6.4, 6, 5.6] },
  { key: "secondB777", label: "Тренд вторых пилотов В-777", color: "#7c3aed", values: [6.55, 6.35, 6.1, 6.55, 6.65, 6.5, 6.1, 5.75] },
  { key: "you", label: "Мой тренд", color: "var(--accent)", values: [7.5, 6.5, 6, 7, 7, 7, 6.5, 5.5] },
];


const CHART_WIDTH = 520;
const CHART_HEIGHT = 260;
const PADDING = { top: 16, right: 16, bottom: 28, left: 32 };

type Props = { compact?: boolean; fullWidth?: boolean; variant?: "default" | "copilot" };

export default function ReliabilityTrendsChart({ compact = false, fullWidth = false, variant = "default" }: Props) {
  const SERIES = variant === "copilot" ? SERIES_COPILOT : SERIES_DEFAULT;
  const [selected, setSelected] = useState<Set<string>>(() => new Set(SERIES.map((s) => s.key)));
  const width = compact ? 320 : CHART_WIDTH;
  const height = compact ? 200 : CHART_HEIGHT;
  const padding = PADDING;
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;
  const yMin = 0;
  const yMax = 10;
  const yOptimalMin = 4;
  const yOptimalMax = 8;

  const toggle = useCallback((key: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  const xScale = (i: number) => padding.left + (i / (years.length - 1)) * chartW;
  const yScale = (v: number) => padding.top + chartH - ((v - yMin) / (yMax - yMin)) * chartH;
  const zoneY1 = yScale(yOptimalMax);
  const zoneY2 = yScale(yOptimalMin);

  const legendCompact = (
    <div className="flex flex-col gap-y-1.5 text-xs shrink-0">
      <p className="text-slate-500 mb-0.5 text-[10px]">Нажмите на тренд:</p>
      {SERIES.map((s) => {
        const isSelected = selected.has(s.key);
        return (
          <button
            key={s.key}
            type="button"
            onClick={() => toggle(s.key)}
            className={`
              flex items-center gap-1.5 rounded-md px-2 py-0.5 transition-colors text-left
              ${isSelected ? "bg-slate-100 text-slate-800 font-medium" : "text-slate-400 hover:text-slate-600"}
            `}
          >
            <span className="w-3 h-0.5 rounded shrink-0" style={{ background: s.color }} />
            <span className="truncate max-w-[140px]">{s.label}</span>
          </button>
        );
      })}
    </div>
  );

  const legendFullWidth = (
    <div className="w-full flex flex-wrap gap-2 text-xs">
      {SERIES.map((s) => {
        const isSelected = selected.has(s.key);
        return (
          <button
            key={s.key}
            type="button"
            onClick={() => toggle(s.key)}
            className={`
              flex items-center gap-1.5 rounded-md px-2 py-1.5 transition-colors text-left border
              ${isSelected ? "bg-slate-100 text-slate-800 font-medium border-slate-300" : "bg-[#f6f6f6] text-slate-500 border-[#e6e6e6] hover:text-slate-700"}
            `}
          >
            <span className="w-4 h-0.5 rounded shrink-0" style={{ background: s.color }} />
            {s.label}
          </button>
        );
      })}
    </div>
  );

  const chartSvg = (
    <svg
      viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
      className={
        fullWidth ? "w-full h-[280px]" : compact ? "max-w-[320px]" : "w-full"
      }
      style={compact ? { minWidth: 260 } : fullWidth ? {} : { minWidth: 320 }}
      preserveAspectRatio="xMidYMid meet"
    >
      <rect
        x={padding.left}
        y={zoneY1}
        width={chartW}
        height={zoneY2 - zoneY1}
        fill="var(--accent-light)"
        opacity={0.5}
      />
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
      {[0, 4, 8, 10].map((v) => (
        <text key={v} x={padding.left - 6} y={yScale(v)} textAnchor="end" dominantBaseline="middle" className="fill-slate-500 text-xs">{v}</text>
      ))}
      {years.map((y, i) => (
        <text key={y} x={xScale(i)} y={height - 10} textAnchor="middle" className="fill-slate-500 text-xs">{y}</text>
      ))}
      {SERIES.map((s) => {
        const visible = selected.has(s.key);
        const pathPoints = s.values.map((v, i) => `${i === 0 ? "M" : "L"} ${xScale(i)} ${yScale(v)}`).join(" ");
        const isYou = s.key === "you";
        return (
          <g key={s.key} opacity={visible ? 1 : 0.2} style={{ transition: "opacity 0.2s ease" }}>
            <path
              d={pathPoints}
              fill="none"
              stroke={s.color}
              strokeWidth={isYou ? 2.5 : 1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {s.values.map((v, i) => (
              <circle key={i} cx={xScale(i)} cy={yScale(v)} r={isYou ? 3.5 : 2.5} fill={s.color} />
            ))}
          </g>
        );
      })}
      <text x={padding.left + chartW - 4} y={zoneY1 + 10} textAnchor="end" className="fill-slate-500 text-[10px]">оптимум 4–8</text>
    </svg>
  );

  if (fullWidth) {
    return (
      <div className="w-full flex flex-nowrap items-stretch gap-4">
        <div className="flex-1 min-w-0">{chartSvg}</div>
        <div className="shrink-0 w-[280px] min-w-[260px] flex flex-col border-l border-slate-200 pl-4">
          <p className="text-[10px] text-slate-500 mb-2">Нажмите на тренд:</p>
          <div className="flex flex-col gap-1.5 text-xs">
            {SERIES.map((s) => {
              const isSelected = selected.has(s.key);
              return (
                <button
                  key={s.key}
                  type="button"
                  onClick={() => toggle(s.key)}
                  className={`
                    flex items-center gap-1.5 rounded-md px-2 py-1 transition-colors text-left break-words
                    ${isSelected ? "bg-slate-100 text-slate-800 font-medium" : "text-slate-400 hover:text-slate-600"}
                  `}
                >
                  <span className="w-3 h-0.5 rounded shrink-0 mt-0.5 self-start" style={{ background: s.color }} />
                  <span className="text-left leading-tight">{s.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  if (compact) {
    return (
      <div className="overflow-x-auto flex flex-wrap items-start gap-4">
        <div className="shrink-0">{chartSvg}</div>
        {legendCompact}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      {chartSvg}
      <p className="text-xs text-slate-500 mt-3 mb-2">Нажмите на тренд, чтобы выделить или скрыть:</p>
      <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs">
        {SERIES.map((s) => {
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
              <span className="w-4 h-0.5 rounded shrink-0" style={{ background: s.color }} />
              {s.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
