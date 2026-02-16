"use client";

import Card, { CardBody } from "@/components/ui/Card";

const nodeStyle = "fill-[var(--card)] stroke-[var(--accent)] stroke-[1.5]";
const nodeStyleEvent = "fill-amber-50 stroke-amber-600 stroke-[1.5]";
const edgeStyle = "stroke-slate-400 stroke-[1] fill-none";
const edgeStyleDiff = "stroke-red-500 stroke-[1.5] stroke-dasharray-4 fill-none";

/** Нормативный граф: узлы (задачи, условия, процессы), рёбра (ожидаемые зависимости, взаимодействия, пересечения, повторения) */
function NormativeGraph() {
  const w = 380;
  const h = 220;
  const nodes = [
    { id: "A", label: "Задача 1", x: 60, y: 50 },
    { id: "B", label: "Условие", x: 180, y: 50 },
    { id: "C", label: "Процесс 2", x: 300, y: 50 },
    { id: "D", label: "Процесс 3", x: 180, y: 120 },
    { id: "E", label: "Задача 4", x: 60, y: 180 },
    { id: "F", label: "Условие", x: 300, y: 180 },
  ];
  const edges = [
    { from: "A", to: "B", label: "зависимость" },
    { from: "B", to: "C", label: "взаимодействие" },
    { from: "B", to: "D", label: "пересечение" },
    { from: "D", to: "E", label: "повторение" },
    { from: "D", to: "F", label: "зависимость" },
    { from: "E", to: "A", label: "ожидаемая связь" },
  ];
  const getPos = (id: string) => nodes.find((n) => n.id === id)!;

  return (
    <div className="overflow-x-auto">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ minHeight: 200 }}>
        {edges.map((e, i) => {
          const a = getPos(e.from);
          const b = getPos(e.to);
          const midX = (a.x + b.x) / 2;
          const midY = (a.y + b.y) / 2;
          return (
            <g key={i}>
              <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} className={edgeStyle} />
              <text x={midX} y={midY - 4} textAnchor="middle" className="fill-slate-500 text-[8px]">{e.label}</text>
            </g>
          );
        })}
        {nodes.map((n) => (
          <g key={n.id}>
            <circle cx={n.x} cy={n.y} r={22} className={nodeStyle} />
            <text x={n.x} y={n.y} textAnchor="middle" dominantBaseline="middle" className="fill-slate-700 text-[9px]">{n.label}</text>
          </g>
        ))}
      </svg>
      <p className="text-xs text-slate-500 mt-1">Узлы: задачи, условия, процессы. Рёбра: ожидаемые зависимости, взаимодействия, пересечения, повторения.</p>
    </div>
  );
}

/** Событийный граф: отличия от нормативного (не так, как должно быть) */
function EventGraph() {
  const w = 380;
  const h = 220;
  const nodes = [
    { id: "A", label: "Задача 1", x: 60, y: 50, norm: true },
    { id: "B", label: "Условие", x: 180, y: 50, norm: true },
    { id: "C", label: "Процесс 2", x: 300, y: 50, norm: false },
    { id: "D", label: "Процесс 3", x: 180, y: 120, norm: false },
    { id: "E", label: "Задача 4", x: 60, y: 180, norm: true },
    { id: "F", label: "Отклонение", x: 300, y: 180, norm: false },
  ];
  const edges = [
    { from: "A", to: "B", diff: false },
    { from: "B", to: "C", diff: true },
    { from: "B", to: "D", diff: true },
    { from: "D", to: "E", diff: false },
    { from: "D", to: "F", diff: true },
  ];
  const getPos = (id: string) => nodes.find((n) => n.id === id)!;

  return (
    <div className="overflow-x-auto">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ minHeight: 200 }}>
        {edges.map((e, i) => {
          const a = getPos(e.from);
          const b = getPos(e.to);
          const midX = (a.x + b.x) / 2;
          const midY = (a.y + b.y) / 2;
          return (
            <g key={i}>
              <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} className={e.diff ? edgeStyleDiff : edgeStyle} />
              {e.diff && <text x={midX} y={midY - 4} textAnchor="middle" className="fill-red-600 text-[8px]">не по норме</text>}
            </g>
          );
        })}
        {nodes.map((n) => (
          <g key={n.id}>
            <circle cx={n.x} cy={n.y} r={22} className={n.norm ? nodeStyle : nodeStyleEvent} />
            <text x={n.x} y={n.y} textAnchor="middle" dominantBaseline="middle" className="fill-slate-700 text-[9px]">{n.label}</text>
          </g>
        ))}
      </svg>
      <p className="text-xs text-slate-500 mt-1">Отражены только отличия от нормативного графа (узлы/рёбра с отклонениями выделены).</p>
    </div>
  );
}

/** Граф взаимодействий: узлы (службы, должности), рёбра (зависимости, пересечения, взаимодействия, отсутствие взаимодействий) */
function InteractionGraph() {
  const w = 380;
  const h = 200;
  const nodes = [
    { id: "S1", label: "Служба полётов", x: 80, y: 50 },
    { id: "S2", label: "Лётная служба", x: 280, y: 50 },
    { id: "S3", label: "УВД", x: 50, y: 120 },
    { id: "S4", label: "Тех. служба", x: 180, y: 120 },
    { id: "S5", label: "Безопасность", x: 310, y: 120 },
    { id: "R1", label: "КВС", x: 120, y: 180 },
    { id: "R2", label: "Второй пилот", x: 260, y: 180 },
  ];
  const edges = [
    { from: "S1", to: "S2", label: "взаимодействие" },
    { from: "S1", to: "S3", label: "зависимость" },
    { from: "S2", to: "S4", label: "пересечение" },
    { from: "S4", to: "S5", label: "взаимодействие" },
    { from: "S3", to: "R1", label: "нет взаимодействия" },
    { from: "R1", to: "R2", label: "взаимодействие" },
  ];
  const getPos = (id: string) => nodes.find((n) => n.id === id)!;

  return (
    <div className="overflow-x-auto">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ minHeight: 180 }}>
        {edges.map((e, i) => {
          const a = getPos(e.from);
          const b = getPos(e.to);
          const midX = (a.x + b.x) / 2;
          const midY = (a.y + b.y) / 2;
          const isMissing = e.label === "нет взаимодействия";
          return (
            <g key={i}>
              <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} className={isMissing ? "stroke-amber-500 stroke-dasharray-2 stroke-[1]" : edgeStyle} />
              <text x={midX} y={midY - 4} textAnchor="middle" className="fill-slate-500 text-[8px]">{e.label}</text>
            </g>
          );
        })}
        {nodes.map((n) => (
          <g key={n.id}>
            <rect x={n.x - 38} y={n.y - 12} width={76} height={24} rx={4} className={nodeStyle} />
            <text x={n.x} y={n.y} textAnchor="middle" dominantBaseline="middle" className="fill-slate-700 text-[8px]">{n.label}</text>
          </g>
        ))}
      </svg>
      <p className="text-xs text-slate-500 mt-1">Узлы: службы, должности. Рёбра: зависимости, пересечения, взаимодействия, отсутствие взаимодействий.</p>
    </div>
  );
}

/** Граф компонентов HF: узлы (компоненты HF, факторы, отклонения, аномалии), рёбра (вызывает, нарушает, блокирует, связывает) */
function HFComponentsGraph() {
  const w = 380;
  const h = 220;
  const nodes = [
    { id: "H1", label: "Усталость", x: 70, y: 50 },
    { id: "H2", label: "Стресс", x: 190, y: 50 },
    { id: "H3", label: "Отклонение", x: 310, y: 50 },
    { id: "H4", label: "Фактор риска", x: 130, y: 120 },
    { id: "H5", label: "Аномалия", x: 250, y: 120 },
    { id: "H6", label: "Компонент HF", x: 190, y: 190 },
  ];
  const edges = [
    { from: "H1", to: "H2", label: "вызывает" },
    { from: "H2", to: "H3", label: "нарушает" },
    { from: "H1", to: "H4", label: "связывает" },
    { from: "H4", to: "H5", label: "блокирует" },
    { from: "H3", to: "H5", label: "вызывает" },
    { from: "H4", to: "H6", label: "связывает" },
    { from: "H5", to: "H6", label: "нарушает" },
  ];
  const getPos = (id: string) => nodes.find((n) => n.id === id)!;

  return (
    <div className="overflow-x-auto">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ minHeight: 200 }}>
        {edges.map((e, i) => {
          const a = getPos(e.from);
          const b = getPos(e.to);
          const midX = (a.x + b.x) / 2;
          const midY = (a.y + b.y) / 2;
          return (
            <g key={i}>
              <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} className={edgeStyle} />
              <text x={midX} y={midY - 4} textAnchor="middle" className="fill-slate-500 text-[8px]">{e.label}</text>
            </g>
          );
        })}
        {nodes.map((n) => (
          <g key={n.id}>
            <circle cx={n.x} cy={n.y} r={24} className={nodeStyle} />
            <text x={n.x} y={n.y} textAnchor="middle" dominantBaseline="middle" className="fill-slate-700 text-[9px]">{n.label}</text>
          </g>
        ))}
      </svg>
      <p className="text-xs text-slate-500 mt-1">Узлы: компоненты HF, факторы, отклонения, аномалии. Рёбра: вызывает, нарушает, блокирует, связывает.</p>
    </div>
  );
}

export function GraphViewsSection() {
  return (
    <div className="space-y-6">
      <Card>
        <CardBody>
          <h3 className="font-medium text-slate-800 mb-3">Нормативный граф</h3>
          <NormativeGraph />
        </CardBody>
      </Card>
      <Card>
        <CardBody>
          <h3 className="font-medium text-slate-800 mb-3">Событийный граф</h3>
          <EventGraph />
        </CardBody>
      </Card>
      <Card>
        <CardBody>
          <h3 className="font-medium text-slate-800 mb-3">Граф взаимодействий</h3>
          <InteractionGraph />
        </CardBody>
      </Card>
      <Card>
        <CardBody>
          <h3 className="font-medium text-slate-800 mb-3">Граф компонентов Human Factor</h3>
          <HFComponentsGraph />
        </CardBody>
      </Card>
    </div>
  );
}
