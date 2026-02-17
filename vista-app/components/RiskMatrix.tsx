"use client";

import { useState, useEffect } from "react";

// Цвета по score (I×L)
const RISK_MATRIX_COLORS: Record<number, string> = {
  1: "#b5d1ad", 2: "#b5d1ad", 3: "#8db881", 4: "#8db881", 5: "#79A471", 6: "#79A471",
  7: "#638e59", 8: "#638e59", 9: "#3b692f", 10: "#3b692f", 11: "#95c740", 12: "#95c740",
  13: "#E4BA6A", 14: "#E4BA6A", 15: "#E4BA6A",
  16: "#cc0000", 17: "#cc0000", 18: "#cc0000", 19: "#cc0000", 20: "#cc0000",
  21: "#990000", 22: "#990000", 23: "#990000", 24: "#990000", 25: "#990000",
};

// Отображаемые значения: левый нижний 25,20,20,16; правый верхний 1,2,2,4; обмен 15↔3 и 12↔6. Цвет по score.
const RISK_MATRIX_DISPLAY: Record<string, number> = {
  "5,1": 5, "5,2": 10, "5,3": 3, "5,4": 2, "5,5": 1,
  "4,1": 4, "4,2": 8, "4,3": 6, "4,4": 4, "4,5": 2,
  "3,1": 15, "3,2": 12, "3,3": 9, "3,4": 6, "3,5": 3,
  "2,1": 20, "2,2": 16, "2,3": 12, "2,4": 8, "2,5": 10,
  "1,1": 25, "1,2": 20, "1,3": 15, "1,4": 4, "1,5": 5,
};

// Реализованные риски по ячейке матрицы (I × L) для отображения в модальном окне.
const RISK_CELL_INFO: Record<string, { title: string; risks: string[] }> = {
  "1,1": { title: "Ячейка 25 (I=1, L=1)", risks: ["Р-001 Усталость персонала (критич.)", "Р-011 Ошибка диспетчера / УВД", "Р-016 Нарушение режима труда и отдыха", "Р-017 Несоблюдение требований безопасности"] },
  "1,2": { title: "Ячейка 20 (I=1, L=2)", risks: ["Р-002 Ошибка оператора", "Р-008 Сбой коммуникации", "Р-010 Стресс и давление сроков"] },
  "1,3": { title: "Ячейка 15 (I=1, L=3)", risks: ["Р-003 Нарушение процедур (SOP)", "Р-013 Неправильное применение инструкций"] },
  "1,4": { title: "Ячейка 4 (I=1, L=4)", risks: ["Р-007 Несоответствие документации", "Р-014 Задержка по вине персонала"] },
  "1,5": { title: "Ячейка 5 (I=1, L=5). Реализовано рисков: 4", risks: ["Р-009 Дефицит внимания / отвлечение", "Р-007 Несоответствие документации", "Р-014 Задержка по вине персонала", "Ошибки при вводе данных в системах планирования"] },
  "2,1": { title: "Ячейка 20 (I=2, L=1)", risks: ["Р-004 Недостаток компетенций", "Р-012 Нарушение регламента техобслуживания"] },
  "2,2": { title: "Ячейка 16 (I=2, L=2)", risks: ["Р-005 Перегрузка / дефицит ресурсов", "Р-018 Ошибка при приёмке/контроле"] },
  "2,3": { title: "Ячейка 12 (I=2, L=3)", risks: ["Р-006 Конфликт в коллективе"] },
  "2,4": { title: "Ячейка 8 (I=2, L=4). Реализовано рисков: 5", risks: ["Р-015 Травматизм при выполнении работ", "Р-012 Нарушение регламента техобслуживания", "Р-017 Несоблюдение требований безопасности", "Нарушение процедур при наземной обработке", "Задержка рейса по вине персонала"] },
  "2,5": { title: "Ячейка 10 (I=2, L=5). Реализовано рисков: 6", risks: ["Единичные отклонения в офисном блоке", "Р-008 Сбой в передаче информации", "Р-013 Неправильное применение инструкций", "Р-009 Дефицит внимания при контроле", "Ошибочная маршрутизация или документация", "Создание помех другим операциям"] },
  "3,1": { title: "Ячейка 15 (I=3, L=1)", risks: ["Р-008 Сбой коммуникации между службами", "Ошибки при вводе данных в системах планирования"] },
  "3,2": { title: "Ячейка 12 (I=3, L=2)", risks: ["Усталость и нехватка персонала в диспетчерских службах"] },
  "3,3": { title: "Ячейка 9 (I=3, L=3). Реализовано рисков: 7", risks: ["Риски наземного обслуживания: квалификация, передача смены", "Давление на сокращение времени при обслуживании", "Р-005 Перегрузка / дефицит ресурсов", "Р-018 Ошибка при приёмке/контроле", "Пропуск дефекта при осмотре", "Использование несоответствующих материалов/инструмента", "Неверное решение в нестандартной ситуации"] },
  "3,4": { title: "Ячейка 6 (I=3, L=4). Реализовано рисков: 3", risks: ["Давление на сокращение времени при обслуживании", "Нарушение процедур при заправке", "Р-016 Нарушение режима труда и отдыха"] },
  "3,5": { title: "Ячейка 3 (I=3, L=5). Реализовано рисков: 2", risks: ["Рутинные сбои, единичные отклонения", "Р-009 Дефицит внимания / отвлечение"] },
  "4,1": { title: "Ячейка 4 (I=4, L=1)", risks: ["Р-013 Неправильное применение инструкций"] },
  "4,2": { title: "Ячейка 8 (I=4, L=2). Реализовано рисков: 5", risks: ["Р-018 Ошибка при приёмке/контроле", "Р-012 Нарушение регламента техобслуживания", "Ошибка при контроле качества", "Пропуск дефекта при осмотре", "Р-015 Травматизм при выполнении работ"] },
  "4,3": { title: "Ячейка 6 (I=4, L=3). Реализовано рисков: 3", risks: ["Нарушение процедур при заправке", "Р-003 Нарушение процедур (SOP)", "Р-013 Неправильное применение инструкций"] },
  "4,4": { title: "Ячейка 4 (I=4, L=4)", risks: ["Неверные решения в нестандартных ситуациях"] },
  "4,5": { title: "Ячейка 2 (I=4, L=5)", risks: ["Минимальный риск"] },
  "5,1": { title: "Ячейка 5 (I=5, L=1). Реализовано рисков: 4", risks: ["Р-001 Усталость персонала (низкая вероятность)", "Р-010 Стресс и давление сроков", "Р-016 Нарушение режима труда и отдыха", "Р-017 Несоблюдение требований безопасности"] },
  "5,2": { title: "Ячейка 10 (I=5, L=2). Реализовано рисков: 6", risks: ["Нехватка персонала ATC", "Р-011 Ошибка диспетчера / УВД", "Усталость и нехватка персонала в диспетчерских службах", "Сбой в передаче информации между службами", "Ошибки при вводе данных в системах планирования", "Р-001 Усталость персонала"] },
  "5,3": { title: "Ячейка 3 (I=5, L=3). Реализовано рисков: 2", risks: ["Усталость экипажа и диспетчеров", "Р-001 Усталость персонала"] },
  "5,4": { title: "Ячейка 2 (I=5, L=4)", risks: ["Критические комбинации (редко)"] },
  "5,5": { title: "Ячейка 1 (I=5, L=5)", risks: ["Минимальная тяжесть и вероятность"] },
};

type RiskMatrixProps = {
  className?: string;
  maxWidth?: string;
};

export default function RiskMatrix({ className = "", maxWidth = "320px" }: RiskMatrixProps) {
  const [modal, setModal] = useState<{ imp: number; lik: number; score: number; displayVal: number } | null>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setModal(null);
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  return (
    <>
      <div className={`flex flex-col gap-1 w-full ${className}`} style={{ maxWidth }}>
        <div className="flex gap-1">
          <span className="w-6 shrink-0 text-[10px] font-medium text-slate-400 flex items-center justify-center">L</span>
          <div className="grid grid-cols-5 gap-1 flex-1 min-w-0">
            {[1, 2, 3, 4, 5].map((n) => (
              <span key={n} className="flex items-center justify-center text-[10px] font-medium text-slate-600 aspect-square min-w-0">
                {n}
              </span>
            ))}
          </div>
        </div>
        <div className="flex gap-1">
          <span className="w-6 shrink-0 text-[10px] font-medium text-slate-500 flex items-center justify-center">I</span>
          <div className="grid grid-cols-5 gap-1 flex-1 min-w-0">
            {[5, 4, 3, 2, 1].map((imp) =>
              [1, 2, 3, 4, 5].map((lik) => {
                const score = imp * lik;
                const displayVal = RISK_MATRIX_DISPLAY[`${imp},${lik}`] ?? score;
                const cellKey = `${imp},${lik}`;
                const riskCount = RISK_CELL_INFO[cellKey]?.risks?.length ?? 0;
                const bg = RISK_MATRIX_COLORS[score] ?? "#e6e6e6";
                const isRed = score >= 16;
                return (
                  <button
                    key={`${imp}-${lik}`}
                    type="button"
                    onClick={() => setModal({ imp, lik, score, displayVal })}
                    className={`aspect-square min-w-[36px] min-h-[36px] rounded flex items-center justify-center text-[11px] font-semibold cursor-pointer hover:ring-2 hover:ring-offset-0.5 hover:ring-slate-400 active:scale-95 transition-transform ${isRed ? "text-white" : "text-slate-800"}`}
                    style={{ backgroundColor: bg }}
                    title={`Ячейка (I=${imp}, L=${lik}). Реализовалось рисков: ${riskCount}. Нажмите для подробностей.`}
                  >
                    {riskCount}
                  </button>
                );
              })
            )}
          </div>
        </div>
        <p className="text-[10px] text-slate-400 pl-8">L →</p>
      </div>

      {modal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setModal(null)} aria-hidden />
          <div
            className="relative bg-white rounded-xl shadow-xl border border-[var(--border)] w-full max-w-md max-h-[85vh] overflow-y-auto"
            role="dialog"
            aria-labelledby="risk-cell-title"
          >
            <div className="sticky top-0 bg-white border-b border-[var(--border)] px-4 py-3 flex items-center justify-between">
              <h2 id="risk-cell-title" className="text-base font-semibold text-slate-800">
                {RISK_CELL_INFO[`${modal.imp},${modal.lik}`]?.title ?? `Ячейка ${modal.displayVal} (I=${modal.imp}, L=${modal.lik})`}
              </h2>
              <button
                type="button"
                onClick={() => setModal(null)}
                className="p-2 rounded hover:bg-slate-100 text-slate-600"
                aria-label="Закрыть"
              >
                ×
              </button>
            </div>
            <div className="p-4">
              <p className="text-xs text-slate-500 mb-3">
                Реализованные риски, отнесённые к данной ячейке матрицы (тяжесть I × вероятность L = {modal.displayVal}).
              </p>
              <ul className="space-y-2 text-sm text-slate-700">
                {(RISK_CELL_INFO[`${modal.imp},${modal.lik}`]?.risks ?? ["Нет зафиксированных реализаций по данной ячейке."]).map((r, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-[var(--accent)] mt-0.5">•</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
