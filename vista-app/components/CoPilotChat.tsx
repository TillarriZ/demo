"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Card, { CardBody } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

type Message = {
  id: string;
  sender: "ai" | "user";
  text: string;
  type?: "report" | "question" | "link";
  reportData?: { strengths: string[]; improvements: string[] };
  questionData?: { question: string; answer: string };
  linkData?: { href: string; label: string };
  timestamp: Date;
};

const B777_REPORT = {
  strengths: [
    "Отличная коммуникация в экипаже (CRM) — чёткие доклады, взаимный контроль",
    "Высокое качество выполнения процедур FO preflight flow и before start",
    "Хорошая работа с CDU (legs, engine pages), корректная настройка навигации",
    "Уверенное управление системой при отказе — без лишнего стресса",
    "Соблюдение чек-листов и проверок перед взлётом и посадкой",
    "Правильная работа с TCAS, погодным радаром, индикаторами",
  ],
  improvements: [
    "Рекомендуется усилить тренировку ручной посадки в сложных метеоусловиях (B777 IOE требует 2 фактических автопосадки в первых 100 часах, но ручной режим тоже важен)",
    "Внимание к управлению рабочей нагрузкой при быстрой смене сценариев — иногда запаздывание с переключением внимания между дисплеями",
    "Закрепление процедур по ECAM/EICAS при множественных отказах — рекомендуется дополнительная сессия в тренажёре",
    "Улучшить краткость и структурированность радиообмена в загруженном пространстве",
    "Консолидация: 100 часов линейных полётов в течение 120 дней после завершения подготовки — важно не растягивать срок",
  ],
};

const DAILY_QUESTION = {
  question: "Какой минимальный уровень кислорода в маске должен быть проверен во время preflight flow второго пилота на B777?",
  answer: "100%. Кислород тестируется до 100% (Oxygen tested to 100 percent) в рамках FO's Preflight Flow. Это стандартная процедура перед вылетом.",
};

function ReportModal({
  data,
  onClose,
}: {
  data: { strengths: string[]; improvements: string[] };
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
          <h2 className="text-lg font-bold text-slate-800">
            Отчёт по результатам тренажёрной проверки B777 (второй пилот)
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Закрыть ×
          </Button>
        </div>
        <div className="p-6 overflow-y-auto sidebar-scroll flex-1 space-y-6">
          <section>
            <h3 className="font-semibold text-slate-800 mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              Сильные стороны
            </h3>
            <ul className="space-y-1.5 text-sm text-slate-700">
              {data.strengths.map((s, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-slate-400">•</span>
                  {s}
                </li>
              ))}
            </ul>
          </section>
          <section>
            <h3 className="font-semibold text-slate-800 mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              Моменты, на которые важно обратить внимание
            </h3>
            <ul className="space-y-1.5 text-sm text-slate-700">
              {data.improvements.map((s, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-slate-400">•</span>
                  {s}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}

export default function CoPilotChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [step, setStep] = useState<"init" | "wiki_waiting" | "waiting_yes" | "report_sent" | "waiting_mode" | "quiz_sent">("init");
  const [reportOpen, setReportOpen] = useState(false);
  const [revealedQuestions, setRevealedQuestions] = useState<Set<string>>(new Set());
  const [reportDataForModal, setReportDataForModal] = useState(B777_REPORT);
  const searchParams = useSearchParams();
  const fromWikiHints = searchParams.get("from") === "wiki-hints";
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(() => {
    if (step !== "init" || messages.length > 0) return;
    if (fromWikiHints) {
      // Переход из Wiki: через 1 сек показываем сценарий «да/нет»
      const t = setTimeout(() => {
        setMessages((m) => {
          if (m.length > 0) return m;
          return [
            {
              id: "wiki-1",
              sender: "ai" as const,
              text: "Тебе нужна помощь по ситуации? найти в документации? Ответь: да/нет",
              timestamp: new Date(),
            },
          ];
        });
        setStep("wiki_waiting");
      }, 1000);
      return () => clearTimeout(t);
    }
    // Прямой заход в Employee CoPilot: сообщение про тренажёр через 2 секунды
    const t = setTimeout(() => {
      setMessages((m) => {
        if (m.length > 0) return m;
        return [
          {
            id: "1",
            sender: "ai" as const,
            text: "На прошлой неделе ты успешно прошёл тренажёр. Поздравляю! В системе появилась информация о результатах. Я могу проанализировать для тебя и сделать отчёт по сильным сторонам и по моментам, которые желательно подтянуть. Сделать?",
            timestamp: new Date(),
          },
        ];
      });
      setStep("waiting_yes");
    }, 2000);
    return () => clearTimeout(t);
  }, [step, messages.length, fromWikiHints]);

  useEffect(() => scrollToBottom(), [messages]);

  const sendMessage = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: "user",
      text: trimmed,
      timestamp: new Date(),
    };
    setMessages((m) => [...m, userMsg]);
    setInput("");

    if (step === "wiki_waiting") {
      if (/^да\.?\s*$/i.test(trimmed)) {
        const linkMsg: Message = {
          id: `ai-${Date.now()}`,
          sender: "ai",
          text: "Перейди в Поиск информации",
          type: "link",
          linkData: { href: "/copilot/search", label: "Поиск информации" },
          timestamp: new Date(),
        };
        setTimeout(() => setMessages((m) => [...m, linkMsg]), 500);
        setStep("init");
      } else if (/^нет\.?\s*$/i.test(trimmed)) {
        const simulatorMsg: Message = {
          id: `ai-${Date.now()}`,
          sender: "ai",
          text: "Тогда рекомендую пройти тренажёр по процедурам и сценариям — это поможет закрепить навыки и подготовиться к нестандартным ситуациям. Результаты тренажёра потом появятся здесь, и я смогу подготовить для тебя персональный разбор.",
          timestamp: new Date(),
        };
        setTimeout(() => setMessages((m) => [...m, simulatorMsg]), 500);
        setStep("init");
      } else {
        const aiReply: Message = {
          id: `ai-${Date.now()}`,
          sender: "ai",
          text: "Ответь, пожалуйста, «да» или «нет»: нужна ли помощь по ситуации или поиск в документации?",
          timestamp: new Date(),
        };
        setTimeout(() => setMessages((m) => [...m, aiReply]), 400);
      }
      return;
    }

    if (step === "waiting_yes" && /^да\.?\s*$/i.test(trimmed)) {
      const reportMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: "📋 Отчёт по результатам тренажёрной проверки B777 — нажми, чтобы открыть",
        type: "report",
        reportData: B777_REPORT,
        timestamp: new Date(),
      };
      setTimeout(() => {
        setMessages((m) => [...m, reportMsg]);
        setStep("report_sent");
      }, 600);
      return;
    }

    if (step === "waiting_mode" && /каждый день|ежедневно|ежедн/i.test(trimmed)) {
      const quizMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: "Принял. Сегодня первый вопрос.",
        type: "question",
        questionData: DAILY_QUESTION,
        timestamp: new Date(),
      };
      setTimeout(() => {
        setMessages((m) => [...m, quizMsg]);
        setStep("quiz_sent");
      }, 500);
      return;
    }

    if (step === "waiting_yes") {
      const aiReply: Message = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: "Напиши «Да», если хочешь получить отчёт.",
        timestamp: new Date(),
      };
      setTimeout(() => setMessages((m) => [...m, aiReply]), 400);
    }

    if (step === "waiting_mode") {
      const aiReply: Message = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: "Могу присылать один вопрос в день. Напиши «каждый день», чтобы получать ежедневные вопросы.",
        timestamp: new Date(),
      };
      setTimeout(() => setMessages((m) => [...m, aiReply]), 400);
    }
  };

  const onReportClosed = () => {
    setReportOpen(false);
    if (step === "report_sent") {
      const followUp: Message = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: "Могу подготовить короткий тест из вопросов и ответов и присылать в день по одному вопросу. Либо напиши в каком режиме хочешь получать.",
        timestamp: new Date(),
      };
      setMessages((m) => [...m, followUp]);
      setStep("waiting_mode");
    }
  };

  const openReport = (data: { strengths: string[]; improvements: string[] }) => {
    setReportOpen(true);
    setReportDataForModal(data);
  };

  return (
    <>
      <div className="space-y-3">
        <h2 className="text-base font-semibold text-slate-800">Быстрый чат с AI</h2>
        <Card>
          <CardBody className="p-0">
            <div className="h-[360px] overflow-y-auto p-4 space-y-4 sidebar-scroll">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-xl px-4 py-3 ${
                      msg.sender === "user"
                        ? "bg-[var(--accent)] text-white"
                        : "bg-slate-100 text-slate-800"
                    }`}
                  >
                    {msg.type === "link" && msg.linkData ? (
                      <p className="text-sm whitespace-pre-wrap">
                        {msg.text}{" "}
                        <Link
                          href={msg.linkData.href}
                          className="text-[var(--accent)] font-medium underline hover:no-underline"
                        >
                          {msg.linkData.label}
                        </Link>
                      </p>
                    ) : msg.type === "report" && msg.reportData ? (
                      <button
                        onClick={() => openReport(msg.reportData!)}
                        className="text-left underline decoration-dotted hover:decoration-solid"
                      >
                        {msg.text}
                      </button>
                    ) : msg.type === "question" && msg.questionData ? (
                      <div className="space-y-2">
                        <p className="font-medium">{msg.text}</p>
                        <div className="rounded-lg border border-slate-200 bg-white p-3 text-slate-700 text-sm">
                          <p className="font-medium text-slate-800 mb-1">Вопрос:</p>
                          <p>{msg.questionData.question}</p>
                          <button
                            onClick={() =>
                              setRevealedQuestions((s) => new Set(s).add(msg.id))
                            }
                            className="mt-2 text-[var(--accent)] hover:underline text-xs font-medium"
                          >
                            {revealedQuestions.has(msg.id)
                              ? "Правильный ответ:"
                              : "Показать ответ"}
                          </button>
                          {revealedQuestions.has(msg.id) && (
                            <p className="mt-1 text-slate-600">
                              {msg.questionData.answer}
                            </p>
                          )}
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div className="border-t border-slate-200 p-3 flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
                placeholder="Напишите сообщение..."
                className="flex-1"
              />
              <Button onClick={sendMessage} disabled={!input.trim()}>
                Отправить
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>

      {reportOpen && (
        <ReportModal
          data={reportDataForModal}
          onClose={onReportClosed}
        />
      )}
    </>
  );
}
