"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Card, { CardBody } from "@/components/ui/Card";
import {
  SEARCH_HISTORY_KEY,
  type SearchHistoryItem,
  type SearchResultRef,
} from "../page";

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString("ru-RU", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function ResultBlock({ result }: { result: { summary: string; references: SearchResultRef[] } }) {
  return (
    <>
      <p className="text-slate-700 text-sm mb-4">{result.summary}</p>
      <p className="text-xs font-medium text-slate-600 mb-2">Инструкции и разделы:</p>
      <ul className="space-y-2">
        {result.references.map((ref, i) => (
          <li key={i}>
            <Link
              href={ref.href}
              className="text-sm text-[var(--accent)] hover:underline flex flex-col sm:flex-row sm:items-baseline gap-0.5 sm:gap-2"
            >
              <span className="font-medium">{ref.title}</span>
              <span className="text-slate-500 text-xs sm:text-sm">— {ref.point}</span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}

export default function SearchHistoryPage() {
  const [items, setItems] = useState<SearchHistoryItem[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(SEARCH_HISTORY_KEY);
      setItems(raw ? JSON.parse(raw) : []);
    } catch {
      setItems([]);
    }
  }, []);

  return (
    <div className="space-y-6">
      <Link href="/copilot/search" className="text-sm text-[var(--accent)] hover:underline">
        ← Поиск информации
      </Link>
      <h1 className="text-xl font-bold text-slate-800">История запросов</h1>
      <p className="text-slate-600 text-sm">
        Ранее выполненные поисковые запросы и сохранённые ответы. Откройте запись, чтобы увидеть результат.
      </p>
      {items.length === 0 ? (
        <Card>
          <CardBody>
            <p className="text-slate-600 text-sm">Пока нет сохранённых запросов. Выполните поиск на странице «Поиск информации».</p>
          </CardBody>
        </Card>
      ) : (
        <div className="space-y-2">
          {items.map((item) => {
            const isOpen = openId === item.id;
            return (
              <Card key={item.id}>
                <button
                  type="button"
                  onClick={() => setOpenId(isOpen ? null : item.id)}
                  className="w-full text-left px-6 py-4 flex items-center justify-between gap-2 hover:bg-slate-50/50 transition-colors rounded-t-xl"
                >
                  <span className="font-medium text-slate-800 line-clamp-1">{item.query}</span>
                  <span className="text-slate-500 text-sm shrink-0 ml-2">{formatDate(item.date)}</span>
                  <span className={`shrink-0 text-xs text-slate-500 transition-transform ${isOpen ? "rotate-180" : ""}`}>
                    ▼
                  </span>
                </button>
                {isOpen && (
                  <CardBody className="pt-0 border-t border-[var(--border)]">
                    <ResultBlock result={item.result} />
                  </CardBody>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
