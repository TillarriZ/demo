"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Card, { CardBody } from "@/components/ui/Card";

type Node = { id: string; label: string; x: number; y: number; vx: number; vy: number; r: number; color: string };
type Edge = { from: string; to: string; problem?: boolean; problemReason?: string };

const W = 500;
const H = 320;

function useForceGraph(nodesInit: Omit<Node, "x" | "y" | "vx" | "vy">[], edges: Edge[], run: boolean) {
  const [nodes, setNodes] = useState<Node[]>(() =>
    nodesInit.map((n, i) => ({
      ...n,
      x: W / 2 + (Math.random() - 0.5) * W * 0.8,
      y: H / 2 + (Math.random() - 0.5) * H * 0.8,
      vx: 0,
      vy: 0,
    }))
  );
  const raf = useRef<number>(0);

  useEffect(() => {
    if (!run) return;
    const repulsion = 800;
    const attraction = 0.02;
    const damp = 0.85;
    const maxSpeed = 4;

    const step = () => {
      setNodes((prev) => {
        const next = prev.map((n) => ({ ...n, vx: n.vx * damp, vy: n.vy * damp }));
        const byId = new Map(next.map((n) => [n.id, { ...n }]));

        next.forEach((a, i) => {
          const na = byId.get(a.id)!;
          next.forEach((b, j) => {
            if (i === j) return;
            const nb = byId.get(b.id)!;
            const dx = na.x - nb.x;
            const dy = na.y - nb.y;
            const d = Math.hypot(dx, dy) || 0.01;
            const isEdge = edges.some((e) => (e.from === a.id && e.to === b.id) || (e.from === b.id && e.to === a.id));
            if (isEdge) {
              const f = (d - 80) * attraction;
              const fx = (dx / d) * f;
              const fy = (dy / d) * f;
              na.vx -= fx;
              na.vy -= fy;
              nb.vx += fx;
              nb.vy += fy;
            } else {
              const f = repulsion / (d * d);
              const fx = (dx / d) * f;
              const fy = (dy / d) * f;
              na.vx += fx;
              na.vy += fy;
              nb.vx -= fx;
              nb.vy -= fy;
            }
          });
        });

        next.forEach((n) => {
          const nn = byId.get(n.id)!;
          nn.vx = Math.max(-maxSpeed, Math.min(maxSpeed, nn.vx));
          nn.vy = Math.max(-maxSpeed, Math.min(maxSpeed, nn.vy));
          nn.x = Math.max(20, Math.min(W - 20, nn.x + nn.vx));
          nn.y = Math.max(20, Math.min(H - 20, nn.y + nn.vy));
        });

        return next.map((n) => byId.get(n.id)!);
      });
      raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf.current);
  }, [run, edges]);

  return nodes;
}

// Нормативный: задачи, условия, процессы + много связей
const NORM_NODES: Omit<Node, "x" | "y" | "vx" | "vy">[] = [
  { id: "n1", label: "Задача 1", r: 18, color: "#0d9488" },
  { id: "n2", label: "Условие", r: 16, color: "#64748b" },
  { id: "n3", label: "Процесс 2", r: 18, color: "#0d9488" },
  { id: "n4", label: "Процесс 3", r: 16, color: "#64748b" },
  { id: "n5", label: "Задача 4", r: 14, color: "#94a3b8" },
  { id: "n6", label: "Условие", r: 14, color: "#94a3b8" },
  { id: "n7", label: "Контроль", r: 16, color: "#0d9488" },
  { id: "n8", label: "Регламент", r: 14, color: "#64748b" },
  { id: "n9", label: "Инструкция", r: 14, color: "#64748b" },
  { id: "n10", label: "Проверка", r: 14, color: "#94a3b8" },
  ...Array.from({ length: 22 }, (_, i) => ({ id: `n${i + 11}`, label: "", r: 6 + (i % 4), color: "#cbd5e1" })),
];
const normIds = NORM_NODES.map((n) => n.id);
const NORM_EDGES: Edge[] = [
  { from: "n1", to: "n2" }, { from: "n2", to: "n3", problem: true, problemReason: "Условие → Процесс 2: описание взаимосвязи противоречиво или недостаточно детализировано." },
  { from: "n2", to: "n4" }, { from: "n4", to: "n5" }, { from: "n4", to: "n6", problem: true, problemReason: "Процесс 3 → Условие: требования к переходам описаны неполно." },
  { from: "n3", to: "n7" }, { from: "n7", to: "n8" }, { from: "n8", to: "n9" }, { from: "n5", to: "n10" }, { from: "n6", to: "n10" },
  ...Array.from({ length: 38 }, (_, i) => ({ from: normIds[i % normIds.length], to: normIds[(i + 3 + (i % 5)) % normIds.length] })).filter((e) => e.from !== e.to),
];

// Событийный: те же + отличия (часть узлов другого цвета)
const EVENT_NODES = NORM_NODES.map((n, i) => ({ ...n, color: [2, 3, 5, 7, 9].includes(i) ? "#ea580c" : n.color }));
const EVENT_EDGES = NORM_EDGES;

// Взаимодействия: службы, должности
const INT_NODES: Omit<Node, "x" | "y" | "vx" | "vy">[] = [
  { id: "s1", label: "Служба полётов", r: 16, color: "#0d9488" },
  { id: "s2", label: "Лётная служба", r: 16, color: "#0d9488" },
  { id: "s3", label: "УВД", r: 14, color: "#64748b" },
  { id: "s4", label: "Тех. служба", r: 14, color: "#64748b" },
  { id: "s5", label: "Безопасность", r: 14, color: "#64748b" },
  { id: "r1", label: "КВС", r: 14, color: "#7c3aed" },
  { id: "r2", label: "Второй пилот", r: 14, color: "#7c3aed" },
  { id: "s6", label: "Диспетчеризация", r: 14, color: "#64748b" },
  { id: "s7", label: "Метео", r: 12, color: "#94a3b8" },
  { id: "s8", label: "Наземные службы", r: 12, color: "#94a3b8" },
  { id: "r3", label: "Штурман", r: 12, color: "#7c3aed" },
  ...Array.from({ length: 20 }, (_, i) => ({ id: `s${i + 9}`, label: "", r: 6 + (i % 3), color: "#cbd5e1" })),
];
const intIds = INT_NODES.map((n) => n.id);
const INT_EDGES: Edge[] = [
  { from: "s1", to: "s2" }, { from: "s1", to: "s3", problem: true, problemReason: "Связь Служба полётов — УВД: частые сбои коммуникации, нехватка слотов." },
  { from: "s2", to: "s4" }, { from: "s4", to: "s5" }, { from: "s3", to: "r1", problem: true, problemReason: "Передача от УВД к КВС: задержки в доведении разрешений, риск ошибок при смене диспетчера." },
  { from: "r1", to: "r2" }, { from: "s1", to: "s6" }, { from: "s6", to: "s7" }, { from: "s6", to: "s8", problem: true, problemReason: "Диспетчеризация — наземные службы: расссинхрон по статусам заправки и посадки." },
  { from: "s2", to: "r3" }, { from: "r1", to: "s7" }, { from: "s5", to: "s8" },
  ...Array.from({ length: 42 }, (_, i) => ({ from: intIds[i % intIds.length], to: intIds[(i + 4 + (i % 4)) % intIds.length] })).filter((e) => e.from !== e.to),
];

// HF компоненты — как на 9, 10, 11
const HF_NODES: Omit<Node, "x" | "y" | "vx" | "vy">[] = [
  { id: "hf1", label: "Осведомленность", r: 22, color: "#0d9488" },
  { id: "hf2", label: "Пробел в знаниях", r: 24, color: "#dc2626" },
  { id: "hf3", label: "Давление", r: 18, color: "#dc2626" },
  { id: "hf4", label: "Отвлекающие факторы", r: 18, color: "#dc2626" },
  { id: "hf5", label: "Нехватка ресурсов", r: 16, color: "#ea580c" },
  { id: "hf6", label: "Усталость", r: 16, color: "#ea580c" },
  { id: "hf7", label: "Мисс-коннект", r: 14, color: "#ea580c" },
  { id: "hf8", label: "Стресс", r: 14, color: "#ea580c" },
  { id: "hf9", label: "Невнимательность", r: 16, color: "#dc2626" },
  { id: "hf10", label: "Самонадеянность", r: 14, color: "#ea580c" },
  { id: "hf11", label: "Взаимодействие", r: 14, color: "#0d9488" },
  ...Array.from({ length: 28 }, (_, i) => ({ id: `hf${i + 12}`, label: "", r: 6 + (i % 4), color: i % 3 === 0 ? "#86efac" : "#cbd5e1" })),
];
const hfIds = HF_NODES.map((n) => n.id);
const HF_EDGES: Edge[] = [
  { from: "hf1", to: "hf2", problem: true, problemReason: "Осведомлённость → Пробел в знаниях: недостаточное обучение по процедурам, риск ошибок." },
  { from: "hf2", to: "hf3" }, { from: "hf2", to: "hf4", problem: true, problemReason: "Пробел в знаниях → Отвлекающие факторы: рост инцидентов при высокой нагрузке." },
  { from: "hf3", to: "hf5" }, { from: "hf4", to: "hf6" }, { from: "hf5", to: "hf7" }, { from: "hf6", to: "hf8" }, { from: "hf7", to: "hf8" },
  { from: "hf2", to: "hf9", problem: true, problemReason: "Пробел в знаниях → Невнимательность: повторяющиеся нарушения при смене задач." },
  { from: "hf9", to: "hf10" }, { from: "hf3", to: "hf10" }, { from: "hf1", to: "hf11" }, { from: "hf11", to: "hf4" },
  ...Array.from({ length: 52 }, (_, i) => ({ from: hfIds[i % hfIds.length], to: hfIds[(i + 5 + (i % 6)) % hfIds.length] })).filter((e) => e.from !== e.to),
];

const PEOPLE_BY_NODE_INT: Record<string, string[]> = {
  s1: ["Иванов И.И.", "Петров П.П.", "Сидоров С.С."],
  s2: ["Волков А.С.", "Морозов Д.В."],
  s3: ["Козлов К.К.", "Новиков Н.Н."],
  s4: ["Смирнов С.С.", "Кузнецов К.К."],
  s5: ["Попов П.П.", "Соколов С.С."],
  r1: ["Волков А.С."],
  r2: ["Морозов Д.В."],
  s6: ["Иванов И.И.", "Петров П.П."],
  s7: ["Лебедев Л.Л.", "Новиков Н.Н."],
  s8: ["Сидоров С.С.", "Козлов К.К."],
  r3: ["Виноградов В.В."],
  ...Object.fromEntries(Array.from({ length: 20 }, (_, i) => [`s${i + 9}`, ["Сотрудник " + (i + 1)]])),
};
const PEOPLE_BY_NODE_HF: Record<string, string[]> = {
  hf1: ["Иванов И.И.", "Волков А.С."],
  hf2: ["Петров П.П.", "Морозов Д.В."],
  hf3: ["Сидоров С.С.", "Иванов И.И."],
  hf4: ["Козлов К.К.", "Петров П.П."],
  hf5: ["Новиков Н.Н.", "Сидоров С.С."],
  hf6: ["Морозов Д.В.", "Петров П.П."],
  hf7: ["Волков А.С.", "Морозов Д.В."],
  hf8: ["Козлов К.К.", "Новиков Н.Н."],
  hf9: ["Петров П.П."],
  hf10: ["Сидоров С.С."],
  hf11: ["Иванов И.И.", "Петров П.П."],
  ...Object.fromEntries(Array.from({ length: 28 }, (_, i) => [`hf${i + 12}`, ["Сотрудник HF " + (i + 1)]])),
};

function AnimatedGraph({
  nodesInit,
  edges,
  title,
  desc,
  peopleByNode,
  showNormativeRedText,
}: {
  nodesInit: Omit<Node, "x" | "y" | "vx" | "vy">[];
  edges: Edge[];
  title: string;
  desc: string;
  peopleByNode?: Record<string, string[]>;
  showNormativeRedText?: boolean;
}) {
  const [run, setRun] = useState(true);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const nodes = useForceGraph(nodesInit, edges, run);

  const connectedSet = useMemo(() => {
    if (!selectedNodeId) return new Set<string>();
    const set = new Set<string>([selectedNodeId]);
    edges.forEach((e) => {
      if (e.from === selectedNodeId || e.to === selectedNodeId) {
        set.add(e.from);
        set.add(e.to);
      }
    });
    return set;
  }, [selectedNodeId, edges]);

  const selectedEdges = useMemo(() => {
    if (!selectedNodeId) return new Set<string>();
    const set = new Set<string>();
    edges.forEach((e, i) => {
      if (e.from === selectedNodeId || e.to === selectedNodeId) set.add(`${e.from}-${e.to}-${i}`);
    });
    return set;
  }, [selectedNodeId, edges]);

  const problemReasonsForNode = useMemo(() => {
    if (!selectedNodeId) return [];
    const reasons: string[] = [];
    edges.forEach((e) => {
      if (e.problem && e.problemReason && (e.from === selectedNodeId || e.to === selectedNodeId)) {
        reasons.push(e.problemReason);
      }
    });
    return reasons;
  }, [selectedNodeId, edges]);

  const hasProblemEdge = useMemo(() => {
    if (!selectedNodeId) return false;
    return edges.some((e) => e.problem && (e.from === selectedNodeId || e.to === selectedNodeId));
  }, [selectedNodeId, edges]);

  const handleNodeClick = (n: Node) => {
    const isBig = n.r >= 14 || !!n.label;
    if (!isBig) return;
    setSelectedNodeId((prev) => (prev === n.id ? null : n.id));
  };

  const selectedNode = selectedNodeId ? nodes.find((n) => n.id === selectedNodeId) : null;
  const neighborLabels = useMemo(() => {
    if (!selectedNodeId) return [];
    const labels: string[] = [];
    const added = new Set<string>();
    edges.forEach((e) => {
      const other = e.from === selectedNodeId ? e.to : e.to === selectedNodeId ? e.from : null;
      if (other && !added.has(other)) {
        added.add(other);
        const node = nodesInit.find((n) => n.id === other);
        labels.push(node?.label || other);
      }
    });
    return labels;
  }, [selectedNodeId, edges, nodesInit]);

  const peopleForNode = selectedNodeId && peopleByNode ? peopleByNode[selectedNodeId] : undefined;

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-medium text-slate-800">{title}</h3>
        <button type="button" onClick={() => setRun((r) => !r)} className="text-xs text-[var(--accent)] hover:underline">
          {run ? "Приостановить" : "Запустить"}
        </button>
      </div>
      {selectedNode && (
        <div className="mb-2 p-2 rounded-lg bg-slate-100 border border-slate-200 text-sm">
          <div className="font-medium text-slate-800">Узел: {selectedNode.label || selectedNode.id}</div>
          <div className="text-slate-600 mt-0.5">Связанные: {neighborLabels.length ? neighborLabels.join(", ") : "—"}</div>
          {peopleForNode && peopleForNode.length > 0 && (
            <div className="text-slate-700 mt-1">
              Люди с данным признаком: {peopleForNode.join(", ")}
            </div>
          )}
          {hasProblemEdge && problemReasonsForNode.length > 0 && !showNormativeRedText && (
            <div className="mt-1 p-1.5 rounded bg-amber-50 border border-amber-200 text-xs text-slate-700">
              <span className="font-semibold">На что обратить внимание:</span> {problemReasonsForNode.join(" ")}
            </div>
          )}
          {showNormativeRedText && hasProblemEdge && (
            <div className="mt-1 p-1.5 rounded bg-amber-50 border border-amber-200 text-xs text-slate-700">
              {problemReasonsForNode.length > 0 ? <><span className="font-semibold">На что обратить внимание:</span> {problemReasonsForNode.join(" ")}<br /></> : null}
              Процессы по данному узлу описаны противоречиво или недостаточно.
            </div>
          )}
          <button type="button" onClick={() => setSelectedNodeId(null)} className="mt-1 text-xs text-[var(--accent)] hover:underline">
            Закрыть
          </button>
        </div>
      )}
      <div className="overflow-hidden rounded-lg border border-[var(--border)] bg-slate-50/50">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ minHeight: 280 }}>
          {edges.map((e, i) => {
            const a = nodes.find((n) => n.id === e.from);
            const b = nodes.find((n) => n.id === e.to);
            if (!a || !b) return null;
            const isHighlight = selectedEdges.has(`${e.from}-${e.to}-${i}`);
            const isProblem = e.problem;
            const strokeColor = isProblem ? "#dc2626" : isHighlight ? "#0d9488" : "#cbd5e1";
            const strokeW = isProblem ? 2 : isHighlight ? 2.5 : 1;
            return (
              <line
                key={i}
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke={strokeColor}
                strokeWidth={strokeW}
                className="transition-all duration-150"
                opacity={!selectedNodeId ? 1 : isHighlight || isProblem ? 1 : 0.35}
              />
            );
          })}
          {nodes.map((n) => {
            const isSelected = n.id === selectedNodeId;
            const isConnected = connectedSet.has(n.id);
            const isDimmed = selectedNodeId && !connectedSet.has(n.id);
            const isClickable = n.r >= 14 || !!n.label;
            const r = isSelected ? n.r * 1.25 : n.r;
            return (
              <g key={n.id} onClick={() => handleNodeClick(n)} style={{ cursor: isClickable ? "pointer" : "default" }}>
                <circle
                  cx={n.x}
                  cy={n.y}
                  r={r}
                  fill={n.color}
                  stroke={isSelected ? "#0f766e" : "#475569"}
                  strokeWidth={isSelected ? 2.5 : 1}
                  className="transition-all duration-150"
                  style={{
                    filter: isSelected ? "drop-shadow(0 0 6px rgba(13,148,136,.5))" : "drop-shadow(0 1px 2px rgba(0,0,0,.1))",
                    opacity: isDimmed ? 0.4 : 1,
                  }}
                />
                {n.label && (
                  <text
                    x={n.x}
                    y={n.y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="fill-white text-[10px] font-medium pointer-events-none"
                    style={{ textShadow: "0 0 2px #000" }}
                  >
                    {n.label.length > 18 ? n.label.slice(0, 17) + "…" : n.label}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>
      <p className="text-xs text-slate-500 mt-1">{desc}</p>
    </div>
  );
}

export function AnimatedGraphViewsSection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardBody>
          <AnimatedGraph
            nodesInit={NORM_NODES}
            edges={NORM_EDGES}
            title="Нормативный граф"
            desc="Узлы: задачи, условия, процессы. Красные рёбра — противоречия или недостаточность описания. При клике на узел с красным ребром: пояснение."
            showNormativeRedText
          />
        </CardBody>
      </Card>
      <Card>
        <CardBody>
          <AnimatedGraph
            nodesInit={EVENT_NODES}
            edges={EVENT_EDGES}
            title="Событийный граф"
            desc="Отличия от нормативного. При клике на узел с красным ребром — на что обратить внимание."
          />
        </CardBody>
      </Card>
      <Card>
        <CardBody>
          <AnimatedGraph
            nodesInit={INT_NODES}
            edges={INT_EDGES}
            title="Граф взаимодействий"
            desc="Узлы: службы, должности. Рёбра: зависимости; красные — на которые стоит обратить внимание. Клик по узлу: люди с данным признаком."
            peopleByNode={PEOPLE_BY_NODE_INT}
          />
        </CardBody>
      </Card>
      <Card>
        <CardBody>
          <AnimatedGraph
            nodesInit={HF_NODES}
            edges={HF_EDGES}
            title="Граф компонентов Human Factor"
            desc="Узлы: компоненты HF, факторы, отклонения. Красные рёбра — проблемные. Клик по узлу: люди, подпадающие под признаки."
            peopleByNode={PEOPLE_BY_NODE_HF}
          />
        </CardBody>
      </Card>
    </div>
  );
}
