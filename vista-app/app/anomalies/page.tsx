"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Card, { CardBody, CardHeader } from "@/components/ui/Card";

type LogKind = "risk" | "attention" | "error" | "conflict" | "violation" | "norm" | "buffer" | "nuance" | "pressure" | "tech" | "software" | "late";

const SHIFT_DATES_2026 = ["01.01.2026", "02.01.2026", "03.01.2026", "04.01.2026", "05.01.2026", "06.01.2026", "07.01.2026", "08.01.2026", "09.01.2026", "10.01.2026", "11.01.2026", "12.01.2026", "13.01.2026", "14.01.2026", "15.01.2026", "16.01.2026", "17.01.2026", "18.01.2026", "19.01.2026", "20.01.2026"];

const STREAM_ROWS: {
  id: string;
  date: string;
  start: string;
  break: string;
  log: string;
  logKind: LogKind;
  info: string;
  employeeId: string;
  name: string;
}[] = [
  { id: "01927453", date: SHIFT_DATES_2026[0], start: "12:02:53", break: "1 long 5 short", log: "3 зоны риска", logKind: "risk", info: "Доп. анализ", employeeId: "363893", name: "Иванов И.И." },
  { id: "4632412", date: SHIFT_DATES_2026[1], start: "14:33:16", break: "1 long 4 short", log: "1 снижение", logKind: "risk", info: "Обр. внимания", employeeId: "363893", name: "Иванов И.И." },
  { id: "26575234", date: SHIFT_DATES_2026[2], start: "12:02:53", break: "0 long 8 short", log: "3 раза 1 ошибка", logKind: "error", info: "Нужен отпуск", employeeId: "4832412", name: "Петров П.П." },
  { id: "05308972", date: SHIFT_DATES_2026[3], start: "12:02:53", break: "1 long 5 short", log: "1 Норма", logKind: "norm", info: "Проф. прогноз", employeeId: "363893", name: "Иванов И.И." },
  { id: "0146745", date: SHIFT_DATES_2026[4], start: "12:02:53", break: "1 long 3 short", log: "1 Норма", logKind: "norm", info: "Проф. прогноз", employeeId: "24965494", name: "Сидоров С.С." },
  { id: "01235346", date: SHIFT_DATES_2026[5], start: "12:02:53", break: "0 long 10 short", log: "1 Внимание", logKind: "attention", info: "Команда", employeeId: "363893", name: "Иванов И.И." },
  { id: "01097852", date: SHIFT_DATES_2026[6], start: "12:02:53", break: "0 long 12 short", log: "1 Software", logKind: "software", info: "Обр. внимание", employeeId: "10483409", name: "Козлов К.К." },
  { id: "0235433", date: SHIFT_DATES_2026[7], start: "12:02:53", break: "1 long 2 short", log: "1 Техника", logKind: "tech", info: "Команда", employeeId: "363893", name: "Иванов И.И." },
  { id: "56753896", date: SHIFT_DATES_2026[8], start: "12:02:53", break: "1 long 6 short", log: "1 Норма", logKind: "norm", info: "Проф. прогноз", employeeId: "3465434", name: "Новиков Н.Н." },
  { id: "0203424", date: SHIFT_DATES_2026[9], start: "12:02:53", break: "1 long 5 short", log: "1 Конфликт", logKind: "conflict", info: "Команда", employeeId: "363893", name: "Иванов И.И." },
  { id: "01099028", date: SHIFT_DATES_2026[10], start: "12:02:53", break: "0 long 0 short", log: "1 Нарушение", logKind: "violation", info: "Проф. прогноз", employeeId: "4832412", name: "Петров П.П." },
  { id: "363893", date: SHIFT_DATES_2026[11], start: "12:02:53", break: "0 long 3 short", log: "1 Норма", logKind: "norm", info: "RCA - сводка", employeeId: "363893", name: "Иванов И.И." },
  { id: "24965494", date: SHIFT_DATES_2026[12], start: "12:02:53", break: "2 long 2 short", log: "1 Давление", logKind: "pressure", info: "Проф. прогноз", employeeId: "24965494", name: "Сидоров С.С." },
  { id: "10483409", date: SHIFT_DATES_2026[13], start: "12:02:53", break: "1 long 0 short", log: "1 Норма", logKind: "norm", info: "Мед. осмотр", employeeId: "10483409", name: "Козлов К.К." },
  { id: "3465434", date: SHIFT_DATES_2026[14], start: "12:02:53", break: "1 long 2 short", log: "1 Буфер", logKind: "buffer", info: "Команда", employeeId: "3465434", name: "Новиков Н.Н." },
  { id: "5001001", date: SHIFT_DATES_2026[15], start: "06:15:00", break: "1 long 2 short", log: "Опоздание", logKind: "late", info: "Обр. внимание", employeeId: "5001001", name: "Волков А.С." },
  { id: "5001002", date: SHIFT_DATES_2026[16], start: "06:22:00", break: "0 long 1 short", log: "1 Норма", logKind: "norm", info: "Проф. прогноз", employeeId: "5001002", name: "Морозов Д.В." },
  { id: "5001003", date: SHIFT_DATES_2026[17], start: "14:08:00", break: "1 long 4 short", log: "Опоздание", logKind: "late", info: "Команда", employeeId: "5001002", name: "Морозов Д.В." },
  { id: "88112233", date: SHIFT_DATES_2026[18], start: "08:00:00", break: "1 long 3 short", log: "1 Норма", logKind: "norm", info: "—", employeeId: "5001001", name: "Волков А.С." },
  { id: "88112234", date: SHIFT_DATES_2026[19], start: "07:55:00", break: "0 long 2 short", log: "1 Внимание", logKind: "attention", info: "Доп. анализ", employeeId: "5001002", name: "Морозов Д.В." },
];

type EmployeeProfile = {
  name: string;
  position: string;
  department: string;
  manager: string;
  permits: string[];
  certificates: string[];
  achievementsLastYear: string[];
  errorsLastYear: string[];
  workloadLast3Days: { date: string; task: string; hours: number; status: string }[];
};

const EMPLOYEE_PROFILES: Record<string, EmployeeProfile> = {
  "363893": {
    name: "Иванов Иван Иванович",
    position: "Senior Manager",
    department: "Департамент X",
    manager: "Петров П.П.",
    permits: ["Допуск А — до 31.12.2025", "Допуск Б — до 30.06.2025", "СОУТ — до 01.01.2026"],
    certificates: ["Сертификат N-12345 — до 15.08.2025", "АТТ — до 20.09.2025", "Переподготовка — до 10.10.2025"],
    achievementsLastYear: ["Управление командой (Q2)", "Кризисные ситуации (Q3)", "Работа в команде (Q4)", "Внедрение процедур (Q1)"],
    errorsLastYear: ["10.05.2024 — отклонение от SOP", "24.07.2024 — конфликт с подрядчиком", "15.08.2024 — нарушение сроков отчёта"],
    workloadLast3Days: [
      { date: "День 1", task: "Task 1.1", hours: 6, status: "Выполнена" },
      { date: "День 1", task: "Task 2.1", hours: 2, status: "В процессе" },
      { date: "День 2", task: "Task 1.1", hours: 4, status: "Выполнена" },
      { date: "День 2", task: "Task 3.1", hours: 5, status: "Ожидает" },
      { date: "День 3", task: "Task 2.1", hours: 3, status: "В процессе" },
    ],
  },
  "4832412": {
    name: "Петров Пётр Петрович",
    position: "Специалист по планированию",
    department: "Департамент Y",
    manager: "Сидоров С.С.",
    permits: ["Допуск В — до 30.09.2025", "СОУТ — до 01.01.2026"],
    certificates: ["Сертификат N-22334 — до 01.11.2025"],
    achievementsLastYear: ["Оптимизация процессов (Q2)", "Обучение стажёров (Q4)"],
    errorsLastYear: ["12.06.2024 — опоздание на брифинг", "01.09.2024 — ошибка в отчёте"],
    workloadLast3Days: [
      { date: "День 1", task: "Планирование смен", hours: 8, status: "Выполнена" },
      { date: "День 2", task: "Отчётность", hours: 4, status: "Выполнена" },
      { date: "День 3", task: "Согласования", hours: 5, status: "В процессе" },
    ],
  },
  "24965494": {
    name: "Сидоров Сидор Сидорович",
    position: "Руководитель направления",
    department: "Департамент X",
    manager: "Иванов И.И.",
    permits: ["Допуск А — до 31.12.2025", "Допуск Б — до 30.06.2025"],
    certificates: ["Сертификат N-33445 — до 20.12.2025", "АТТ — до 15.10.2025"],
    achievementsLastYear: ["Запуск проекта (Q1)", "Управление рисками (Q3)"],
    errorsLastYear: ["05.04.2024 — задержка поставки"],
    workloadLast3Days: [
      { date: "День 1", task: "Совещания", hours: 3, status: "Выполнена" },
      { date: "День 2", task: "Контроль задач", hours: 6, status: "Выполнена" },
      { date: "День 3", task: "Планирование", hours: 4, status: "В процессе" },
    ],
  },
  "10483409": {
    name: "Козлов Константин Константинович",
    position: "Технический специалист",
    department: "IT / Техподдержка",
    manager: "Новиков Н.Н.",
    permits: ["Допуск по электробезопасности — до 01.08.2025"],
    certificates: ["Сертификат IT — до 01.12.2025"],
    achievementsLastYear: ["Внедрение системы (Q2)", "Обучение пользователей (Q4)"],
    errorsLastYear: ["20.08.2024 — сбой в отчёте"],
    workloadLast3Days: [
      { date: "День 1", task: "Поддержка", hours: 7, status: "Выполнена" },
      { date: "День 2", task: "Доработки", hours: 6, status: "Выполнена" },
      { date: "День 3", task: "Тестирование", hours: 4, status: "В процессе" },
    ],
  },
  "3465434": {
    name: "Новиков Николай Николаевич",
    position: "Руководитель IT",
    department: "IT / Техподдержка",
    manager: "Иванов И.И.",
    permits: ["Допуск А — до 31.12.2025", "СОУТ — до 01.01.2026"],
    certificates: ["Сертификат N-44556 — до 10.11.2025", "АТТ — до 05.09.2025"],
    achievementsLastYear: ["Запуск платформы (Q1)", "Масштабирование (Q3)", "Обучение команды (Q4)"],
    errorsLastYear: [],
    workloadLast3Days: [
      { date: "День 1", task: "Управление", hours: 8, status: "Выполнена" },
      { date: "День 2", task: "Стратегия", hours: 5, status: "Выполнена" },
      { date: "День 3", task: "Согласования", hours: 6, status: "В процессе" },
    ],
  },
  "5001001": {
    name: "Волков Алексей Сергеевич",
    position: "КВС",
    department: "Лётная служба",
    manager: "Сидоров С.С.",
    permits: ["Допуск на ВС типа A320 — до 31.12.2025", "СОУТ — до 01.01.2026", "Медкомиссия — до 15.06.2025"],
    certificates: ["Свидетельство КВС N-55001 — до 20.10.2025", "АТТ A320 — до 01.09.2025", "CRM — до 12.11.2025"],
    achievementsLastYear: ["Безопасные полёты (Q1–Q4)", "Наставничество второго пилота (Q3)"],
    errorsLastYear: ["11.02.2024 — опоздание на предполётный брифинг"],
    workloadLast3Days: [
      { date: "День 1", task: "Рейс VRZ–SSK", hours: 4, status: "Выполнена" },
      { date: "День 1", task: "Подготовка", hours: 2, status: "Выполнена" },
      { date: "День 2", task: "Рейс SSK–VRZ", hours: 4, status: "Выполнена" },
      { date: "День 3", task: "Симулятор", hours: 3, status: "В процессе" },
    ],
  },
  "5001002": {
    name: "Морозов Дмитрий Владимирович",
    position: "Второй пилот",
    department: "Лётная служба",
    manager: "Волков А.С.",
    permits: ["Допуск на ВС типа A320 — до 30.06.2025", "СОУТ — до 01.01.2026"],
    certificates: ["Свидетельство коммерческого пилота N-55002 — до 05.08.2025", "CRM — до 12.11.2025"],
    achievementsLastYear: ["Налёт по программе (Q2)", "Сдача экзамена на тип (Q1)"],
    errorsLastYear: ["14.03.2024 — опоздание на смену", "08.07.2024 — задержка отчёта"],
    workloadLast3Days: [
      { date: "День 1", task: "Рейс VRZ–SSK", hours: 4, status: "Выполнена" },
      { date: "День 2", task: "Рейс SSK–VRZ", hours: 4, status: "Выполнена" },
      { date: "День 3", task: "Теория", hours: 2, status: "В процессе" },
    ],
  },
};

const EARLY_WARNING_ITEMS: { id: string; label: string; date: string; time: string; desc: string }[] = [
  { id: "delay", label: "Delay", date: "10.02.2025", time: "14:33", desc: "Задержка рейса SY-2407 из-за нехватки диспетчеров ATC в пиковом окне." },
  { id: "exec", label: "Exec Error", date: "10.02.2025", time: "11:02", desc: "Ошибка при выполнении процедуры регистрации багажа (сбой в системе)." },
  { id: "conflict", label: "Conflict", date: "09.02.2025", time: "16:45", desc: "Конфликт при согласовании слота между службой полётов и УВД." },
  { id: "deadline", label: "Deadline Miss", date: "09.02.2025", time: "09:00", desc: "Пропущен срок подачи отчёта по инциденту №BBB." },
  { id: "sop", label: "SOP Violation", date: "08.02.2025", time: "07:22", desc: "Отклонение от SOP при смене диспетчера (передача без чек-листа)." },
  { id: "overload", label: "Overload", date: "10.02.2025", time: "06:00–10:00", desc: "Перегрузка сектора УВД в утреннем пике, время реакции +45%." },
];

const AI_BOT_MESSAGES = [
  "Анализ «причина → следствие» по ошибке сотрудника ФИО готов",
  "Анализ «причина → следствие» по ошибке сотрудника ФИО готов",
  "Анализ «причина → следствие» по ошибке сотрудника ФИО готов",
];

function logCellClass(logKind: LogKind): string {
  switch (logKind) {
    case "risk":
    case "attention":
    case "error":
    case "late":
      return "bg-amber-100 text-amber-900";
    case "conflict":
    case "violation":
      return "bg-red-100 text-red-900";
    default:
      return "bg-white text-slate-700";
  }
}

export default function AnomaliesPage() {
  const [search, setSearch] = useState("");
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);
  const [earlyWarningOpen, setEarlyWarningOpen] = useState<string | null>(null);
  const [aiBotOpen, setAiBotOpen] = useState(false);
  const [aiChatMessages, setAiChatMessages] = useState<{ role: "user" | "bot"; text: string }[]>([]);
  const [aiChatInput, setAiChatInput] = useState("");

  const filteredRows = useMemo(() => {
    if (!search.trim()) return STREAM_ROWS;
    const q = search.toLowerCase();
    return STREAM_ROWS.filter(
      (r) =>
        r.id.toLowerCase().includes(q) ||
        r.date.toLowerCase().includes(q) ||
        r.employeeId.toLowerCase().includes(q) ||
        r.log.toLowerCase().includes(q) ||
        r.info.toLowerCase().includes(q) ||
        r.name.toLowerCase().includes(q)
    );
  }, [search]);

  const profile = selectedEmployeeId ? EMPLOYEE_PROFILES[selectedEmployeeId] ?? null : null;

  return (
    <div className="space-y-6">
      {/* CTO/CPO: Early Warning и AI-Бот перенесены влево над Аналитикой; Data Stream и профили расширены; окно профиля всегда активно с пустым состоянием; добавлены пилоты, лог «Опоздание», подсказка и время обновления для user-friendly вида */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Левая колонка: Early Warning → AI-Бот → Аналитика → Root-Cause */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          <Card accent className="overflow-visible">
            <CardHeader>
              <h2 className="font-semibold text-slate-800 text-sm flex items-center gap-2">
                <svg className="w-5 h-5 text-amber-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                Early Warning
              </h2>
            </CardHeader>
            <CardBody>
              <ul className="space-y-1">
                {EARLY_WARNING_ITEMS.map((item) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => setEarlyWarningOpen(earlyWarningOpen === item.id ? null : item.id)}
                      className="flex items-center gap-2 text-xs text-slate-700 py-1.5 px-2 rounded hover:bg-slate-100 w-full text-left"
                    >
                      <svg className="w-4 h-4 text-amber-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                      <span>{item.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
              {earlyWarningOpen && (() => {
                const item = EARLY_WARNING_ITEMS.find((i) => i.id === earlyWarningOpen);
                if (!item) return null;
                return (
                  <div className="mt-3 p-3 rounded-lg bg-slate-50 border border-slate-200 text-left">
                    <p className="text-[10px] text-slate-500">Дата: {item.date} · Время: {item.time}</p>
                    <p className="text-xs text-slate-700 mt-1">{item.desc}</p>
                    <button type="button" onClick={() => setEarlyWarningOpen(null)} className="mt-2 text-[10px] text-[var(--accent)] hover:underline">Закрыть</button>
                  </div>
                );
              })()}
            </CardBody>
          </Card>
          <Card>
            <CardHeader>
              <h2 className="font-semibold text-slate-800 text-sm flex items-center gap-2">
                <svg className="w-5 h-5 text-slate-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                AI-Бот
              </h2>
            </CardHeader>
            <CardBody className="space-y-2">
              {AI_BOT_MESSAGES.map((msg, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setAiBotOpen(true)}
                  className="w-full p-3 rounded-lg bg-slate-100 border border-slate-200 text-left text-xs text-slate-700 hover:bg-slate-200 transition-colors"
                >
                  <p className="font-medium text-slate-500 text-[10px] mb-0.5">AI-Бот</p>
                  <p>{msg}</p>
                </button>
              ))}
            </CardBody>
          </Card>
          <Card>
            <CardHeader>
              <h2 className="font-semibold text-slate-800 text-sm">Аналитика</h2>
            </CardHeader>
            <CardBody className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Смена</span>
                <span className="font-medium text-slate-800">4730</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Офис</span>
                <span className="font-medium text-slate-800">372</span>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-500">Укомплектованность</span>
                  <span className="font-medium text-slate-800">85%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
                  <div className="h-full w-[85%] bg-[var(--accent)] rounded-full" />
                </div>
              </div>
              <div className="pt-2">
                <p className="text-slate-500 text-xs mb-2">ТОП-3 зоны Риска</p>
                <div className="flex flex-wrap gap-2">
                  <Link href="/analytics" className="px-2 py-1 rounded bg-amber-50 text-amber-800 text-xs font-medium hover:bg-amber-100">
                    1 К4Г4
                  </Link>
                  <Link href="/analytics" className="px-2 py-1 rounded bg-amber-50 text-amber-800 text-xs font-medium hover:bg-amber-100">
                    2 К3Г5
                  </Link>
                  <Link href="/analytics" className="px-2 py-1 rounded bg-amber-50 text-amber-800 text-xs font-medium hover:bg-amber-100">
                    3 К4Г2
                  </Link>
                </div>
              </div>
            </CardBody>
          </Card>
          <Card>
            <CardHeader>
              <h2 className="font-semibold text-slate-800 text-sm flex items-center gap-2">
                <svg className="w-5 h-5 text-slate-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
                Root-Cause Ассистент
              </h2>
            </CardHeader>
            <CardBody className="space-y-2">
              {[1, 2].map((i) => (
                <Link
                  key={i}
                  href="/rca#results"
                  className="block p-2 rounded-lg bg-slate-100 border border-slate-200 text-xs text-slate-700 hover:bg-slate-200 transition-colors"
                >
                  <span className="font-medium text-slate-600">Анализ</span> «причина → следствие» по нарушению SOP NXXX готов
                </Link>
              ))}
              <Link href="/digital-twin" className="block mt-2 text-[var(--accent)] text-xs font-medium hover:underline">
                Digital Twin & Strategic Simulator
              </Link>
            </CardBody>
          </Card>
        </div>

        {/* Расширенная основная зона: Data Stream + окно профиля (низ на одном уровне с Root-Cause Ассистент) */}
        <div className="lg:col-span-9 flex flex-col gap-4 min-h-0">
          <Card className="overflow-hidden flex-shrink-0 border-2 border-slate-200">
            <CardHeader className="flex flex-row items-center justify-between gap-4 flex-wrap">
              <h2 className="font-semibold text-slate-800">Data Stream</h2>
              <div className="flex items-center gap-3 flex-wrap">
                <input
                  type="search"
                  placeholder="Поиск по ID, дате, логам, доп. инфо..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="border border-slate-300 rounded-lg px-3 py-1.5 text-sm w-56 focus:ring-2 focus:ring-[var(--accent)]"
                />
                <span className="text-slate-400 text-xs">Обновлено: только что</span>
              </div>
            </CardHeader>
            <div className="overflow-x-auto max-h-[420px] overflow-y-auto border-t border-slate-200">
              <table className="w-full text-xs table-fixed">
                <colgroup>
                  <col style={{ width: "12%" }} />
                  <col style={{ width: "14%" }} />
                  <col style={{ width: "14%" }} />
                  <col style={{ width: "18%" }} />
                  <col style={{ width: "26%" }} />
                  <col style={{ width: "16%" }} />
                </colgroup>
                <thead className="bg-slate-50 border-b border-slate-200 sticky top-0">
                  <tr>
                    <th className="text-left py-1.5 pl-4 pr-2 font-medium text-slate-700">ID</th>
                    <th className="text-left py-1.5 px-2 font-medium text-slate-700">Дата</th>
                    <th className="text-left py-1.5 px-2 font-medium text-slate-700">Начало</th>
                    <th className="text-left py-1.5 px-2 font-medium text-slate-700">Перерыв</th>
                    <th className="text-left py-1.5 px-2 font-medium text-slate-700">Логи</th>
                    <th className="text-left py-1.5 pl-2 pr-4 font-medium text-slate-700">Доп. инфо</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRows.map((r) => (
                    <tr
                      key={r.id}
                      onClick={() => { setSelectedRowId(r.id); setSelectedEmployeeId(r.employeeId); }}
                      className={`border-b border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors ${selectedRowId === r.id ? "bg-[var(--accent-light)]" : ""}`}
                    >
                      <td className="py-1.5 pl-4 pr-2">
                        <span className="font-mono text-[var(--accent)] text-slate-700">{r.id}</span>
                      </td>
                      <td className="py-1.5 px-2 text-slate-600">{r.date}</td>
                      <td className="py-1.5 px-2 text-slate-600">{r.start}</td>
                      <td className="py-1.5 px-2 text-slate-600">{r.break}</td>
                      <td className="py-1.5 px-2">
                        <span className={`px-1.5 py-0.5 rounded text-[11px] ${logCellClass(r.logKind)}`}>{r.log}</span>
                      </td>
                      <td className="py-1.5 pl-2 pr-4 text-slate-600">{r.info}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Профиль: низ на одном уровне с блоком Root-Cause Ассистент */}
          <Card className={`flex-1 min-h-[200px] flex flex-col overflow-hidden ${profile ? "border-l-4 border-l-[var(--accent)]" : ""}`}>
            <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
              <h2 className="font-semibold text-slate-800">Профиль сотрудника</h2>
              {profile && (
                <button
                  type="button"
                  onClick={() => { setSelectedRowId(null); setSelectedEmployeeId(null); }}
                  className="text-slate-400 hover:text-slate-600 text-sm"
                  aria-label="Сбросить выбор"
                >
                  ✕ Сбросить
                </button>
              )}
            </CardHeader>
            <CardBody className="pt-0 min-h-0 overflow-y-auto">
              {profile ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-1 text-sm border-b border-slate-200 pb-3">
                    <span className="text-slate-500">ФИО</span>
                    <span className="col-span-2 sm:col-span-3 font-medium text-slate-800">{profile.name}</span>
                    <span className="text-slate-500">Должность</span>
                    <span className="col-span-2 sm:col-span-3 text-slate-700">{profile.position}</span>
                    <span className="text-slate-500">Подразделение</span>
                    <span className="col-span-2 sm:col-span-3 text-slate-700">{profile.department}</span>
                    <span className="text-slate-500">Руководитель</span>
                    <span className="col-span-2 sm:col-span-3 text-slate-700">{profile.manager}</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <section>
                      <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Допуски</h3>
                      <ul className="text-slate-700 text-sm space-y-1">
                        {profile.permits.map((p, i) => (
                          <li key={i}>{p}</li>
                        ))}
                      </ul>
                    </section>
                    <section>
                      <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Сертификаты</h3>
                      <ul className="text-slate-700 text-sm space-y-1">
                        {profile.certificates.map((c, i) => (
                          <li key={i}>{c}</li>
                        ))}
                      </ul>
                    </section>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <section>
                      <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Достижения за последний год</h3>
                      <ul className="text-slate-700 text-sm space-y-1">
                        {profile.achievementsLastYear.length ? profile.achievementsLastYear.map((a, i) => (
                          <li key={i}>{a}</li>
                        )) : <li className="text-slate-400">—</li>}
                      </ul>
                    </section>
                    <section>
                      <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Ошибки за последний год</h3>
                      <ul className="text-slate-700 text-sm space-y-1">
                        {profile.errorsLastYear.length ? profile.errorsLastYear.map((e, i) => (
                          <li key={i} className="text-red-700/90">{e}</li>
                        )) : <li className="text-slate-400">—</li>}
                      </ul>
                    </section>
                  </div>
                  <section>
                    <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Нагрузка по задачам за последние трое суток</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-slate-200 text-slate-500">
                            <th className="text-left py-1.5 font-medium">Период</th>
                            <th className="text-left py-1.5 font-medium">Задача</th>
                            <th className="text-left py-1.5 font-medium">Часы</th>
                            <th className="text-left py-1.5 font-medium">Статус</th>
                          </tr>
                        </thead>
                        <tbody className="text-slate-700">
                          {profile.workloadLast3Days.map((w, i) => (
                            <tr key={i} className="border-b border-slate-100">
                              <td className="py-1.5">{w.date}</td>
                              <td className="py-1.5">{w.task}</td>
                              <td className="py-1.5">{w.hours} ч</td>
                              <td className="py-1.5">{w.status}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </section>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center text-slate-400">
                  <p className="text-sm mb-1">Выберите запись в таблице Data Stream</p>
                  <p className="text-xs">Клик по строке или ID откроет профиль сотрудника</p>
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Модальное окно переписки с AI-ботом */}
      {aiBotOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={() => setAiBotOpen(false)}>
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-3 border-b border-slate-200">
              <h3 className="font-semibold text-slate-800 text-sm">Переписка с AI-ботом</h3>
              <button type="button" onClick={() => setAiBotOpen(false)} className="text-slate-400 hover:text-slate-600 text-lg">×</button>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-2 min-h-[200px]">
              {aiChatMessages.length === 0 && (
                <p className="text-xs text-slate-500">Напишите сообщение боту. Анализ «причина → следствие» по ошибке сотрудника готов к выдаче.</p>
              )}
              {aiChatMessages.map((m, i) => (
                <div key={i} className={`text-xs p-2 rounded-lg ${m.role === "user" ? "bg-[var(--accent-light)] ml-4" : "bg-slate-100 mr-4"}`}>
                  {m.role === "bot" && <span className="font-medium text-slate-500">AI-Бот: </span>}
                  {m.text}
                </div>
              ))}
            </div>
            <div className="p-3 border-t border-slate-200 flex gap-2">
              <input
                type="text"
                value={aiChatInput}
                onChange={(e) => setAiChatInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    if (aiChatInput.trim()) {
                      setAiChatMessages((prev) => [...prev, { role: "user", text: aiChatInput.trim() }]);
                      setAiChatMessages((prev) => [...prev, { role: "bot", text: "Принято. Анализ «причина → следствие» доступен в разделе RCA." }]);
                      setAiChatInput("");
                    }
                  }
                }}
                placeholder="Введите сообщение..."
                className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm"
              />
              <button
                type="button"
                onClick={() => {
                  if (aiChatInput.trim()) {
                    setAiChatMessages((prev) => [...prev, { role: "user", text: aiChatInput.trim() }]);
                    setAiChatMessages((prev) => [...prev, { role: "bot", text: "Принято. Анализ «причина → следствие» доступен в разделе RCA." }]);
                    setAiChatInput("");
                  }
                }}
                className="px-3 py-2 rounded-lg bg-[var(--accent)] text-white text-sm font-medium"
              >
                Отправить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
