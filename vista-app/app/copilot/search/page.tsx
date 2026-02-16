"use client";

import { useState } from "react";
import Link from "next/link";
import Card, { CardBody } from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

const DEFAULT_QUERY = "Кризисная ситуация - пассажиру плохо на борту";
export const SEARCH_HISTORY_KEY = "copilot-search-history";

export type SearchResultRef = { title: string; point: string; href: string };
export type SearchResult = { summary: string; references: SearchResultRef[] };
export type SearchHistoryItem = { id: string; query: string; result: SearchResult; date: string };

// Имитация результата поиска по запросу о пассажире
const MOCK_SEARCH_RESULT: SearchResult = {
  summary:
    "Обеспечьте приток свежего воздуха, при необходимости подайте кислород. Определите наличие медработника среди пассажиров; при ухудшении состояния объявите санитарную тревогу и свяжитесь с диспетчером. Действуйте по бортовой инструкции по оказанию первой помощи и информируйте командира.",
  references: [
    { title: "Инструкция по действиям экипажа при заболевании пассажира на борту", point: "п. 4.2 — действия при ухудшении состояния", href: "#" },
    { title: "Руководство по лётной эксплуатации (РЛЭ)", point: "раздел «Медицинская помощь», п. 12.3", href: "#" },
    { title: "Бортовая инструкция по оказанию первой помощи", point: "п. 2.1 — алгоритм при жалобах на самочувствие", href: "#" },
  ],
};

function saveToHistory(query: string, result: SearchResult) {
  try {
    const raw = typeof window !== "undefined" ? localStorage.getItem(SEARCH_HISTORY_KEY) : null;
    let list: SearchHistoryItem[] = raw ? JSON.parse(raw) : [];
    const queryNorm = query.trim();
    list = list.filter((it) => it.query.trim() !== queryNorm);
    const item: SearchHistoryItem = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      query,
      result,
      date: new Date().toISOString(),
    };
    list.unshift(item);
    if (typeof window !== "undefined") localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(list));
  } catch {
    // ignore
  }
}

export default function CoPilotSearchPage() {
  const [query, setQuery] = useState(DEFAULT_QUERY);
  const [result, setResult] = useState<SearchResult | null>(null);

  const handleSearch = () => {
    setResult(MOCK_SEARCH_RESULT);
    saveToHistory(query, MOCK_SEARCH_RESULT);
  };

  return (
    <div className="space-y-6">
      <Link href="/copilot" className="text-sm text-[var(--accent)] hover:underline">
        ← Employee CoPilot
      </Link>
      <h1 className="text-xl font-bold text-slate-800">Поиск информации</h1>

      <Card>
        <CardBody>
          <p className="text-slate-600 text-sm mb-4">
            «Что делать прямо сейчас», «Где найти правило, инструкцию, технологию операции»,
            «Как действовать при сбое, конфликте и аварии».
          </p>
          <Input
            label="Запрос"
            placeholder="Введите вопрос или ключевые слова..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="max-w-md"
          />
          <Button className="mt-3" onClick={handleSearch}>
            Искать
          </Button>
        </CardBody>
      </Card>

      {result && (
        <Card accent>
          <CardBody>
            <div className="flex items-center justify-between gap-2 mb-2">
              <h2 className="text-sm font-semibold text-slate-700">Результат поиска</h2>
              <Button variant="ghost" size="sm" onClick={() => setResult(null)}>
                Свернуть
              </Button>
            </div>
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
          </CardBody>
        </Card>
      )}

      <div className="space-y-4">
        <h2 className="text-sm font-semibold text-slate-700">Документация</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardBody>
              <span className="font-medium text-slate-800">Инструкции</span>
              <p className="text-sm text-slate-600 mt-1">
                Пошаговые инструкции по процессам.
              </p>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <span className="font-medium text-slate-800">Правила и регламенты</span>
              <p className="text-sm text-slate-600 mt-1">
                Внутренние правила и стандарты.
              </p>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <span className="font-medium text-slate-800">Технологии операций</span>
              <p className="text-sm text-slate-600 mt-1">
                Описание технологий и процедур.
              </p>
            </CardBody>
          </Card>
        </div>
        <Link href="/copilot/search/history">
          <Card className="hover:border-[var(--accent)] transition-colors cursor-pointer">
            <CardBody>
              <span className="font-medium text-slate-800">История запросов</span>
              <p className="text-sm text-slate-600 mt-1">
                Ранее выполненные поиски и сохранённые ответы.
              </p>
            </CardBody>
          </Card>
        </Link>
      </div>
    </div>
  );
}
