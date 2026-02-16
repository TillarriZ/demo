"use client";

import { useState } from "react";
import Link from "next/link";
import Card, { CardBody } from "@/components/ui/Card";

type Message = {
  id: string;
  subject: string;
  sentAt: string; // ISO date
  sentTime: string;
  body: string;
  responseAt: string | null;
  responseTime: string | null;
  response: string | null;
};

const MOCK_MESSAGES: Message[] = [
  {
    id: "1",
    subject: "Условия на перроне",
    sentAt: "2025-02-10",
    sentTime: "14:32",
    body: "При высадке пассажиров в зоне 12 освещение было недостаточным, часть трапа в тени. Прошу рассмотреть возможность дополнительной подсветки.",
    responseAt: "2025-02-11",
    responseTime: "10:15",
    response:
      "Сообщение принято. Заявка передана в службу эксплуатации. Ожидаемый срок — до конца месяца. Благодарим за сигнал.",
  },
  {
    id: "2",
    subject: "Другое",
    sentAt: "2025-02-05",
    sentTime: "09:18",
    body: "Задержка вылета из-за поздней подачи бортового питания — повторяется третий раз за месяц на рейсах в а/п Домодедово.",
    responseAt: "2025-02-06",
    responseTime: "16:00",
    response:
      "Зафиксировано. Служба организации наземного обслуживания проведёт разбор с подрядчиком. Результаты сообщим дополнительно.",
  },
  {
    id: "3",
    subject: "Безопасность",
    sentAt: "2025-01-28",
    sentTime: "18:45",
    body: "Обнаружен незакреплённый предмет в багажном отсеке при предполётном осмотре. Устранено до вылета.",
    responseAt: "2025-01-29",
    responseTime: "11:20",
    response: "Спасибо за оперативное сообщение. Инцидент внесён в отчёт. Рекомендации по креплению доведены до смены.",
  },
];

function formatDate(iso: string) {
  const d = new Date(iso + "T12:00:00");
  return d.toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" });
}

export default function VoluntaryHistoryPage() {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <Link href="/copilot/voluntary" className="text-sm text-[var(--accent)] hover:underline">
        ← Добровольные сообщения
      </Link>
      <h1 className="text-xl font-bold text-slate-800">История сообщений</h1>
      <p className="text-slate-600 text-sm">
        Ранее отправленные сообщения и ответы на них.
      </p>
      <div className="space-y-2">
        {MOCK_MESSAGES.map((msg) => {
          const isOpen = openId === msg.id;
          return (
            <Card key={msg.id}>
              <button
                type="button"
                onClick={() => setOpenId(isOpen ? null : msg.id)}
                className="w-full text-left px-6 py-4 flex items-center justify-between gap-2 hover:bg-slate-50/50 transition-colors rounded-t-xl"
              >
                <span className="font-medium text-slate-800">{msg.subject}</span>
                <span className="text-slate-500 text-sm">
                  {formatDate(msg.sentAt)}, {msg.sentTime}
                </span>
                <span className={`shrink-0 text-xs text-slate-500 transition-transform ${isOpen ? "rotate-180" : ""}`}>
                  ▼
                </span>
              </button>
              {isOpen && (
                <CardBody className="pt-0 border-t border-[var(--border)] space-y-4">
                  <div>
                    <p className="text-xs font-medium text-slate-500 mb-1">Отправлено</p>
                    <p className="text-slate-600 text-sm">
                      {formatDate(msg.sentAt)} в {msg.sentTime}
                    </p>
                    <p className="text-slate-700 mt-2 whitespace-pre-wrap">{msg.body}</p>
                  </div>
                  {msg.response && (
                    <div className="pl-3 border-l-2 border-[var(--accent)]">
                      <p className="text-xs font-medium text-slate-500 mb-1">Ответ</p>
                      <p className="text-slate-600 text-sm">
                        {msg.responseAt && msg.responseTime
                          ? `${formatDate(msg.responseAt)} в ${msg.responseTime}`
                          : "—"}
                      </p>
                      <p className="text-slate-700 mt-2 whitespace-pre-wrap">{msg.response}</p>
                    </div>
                  )}
                </CardBody>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
