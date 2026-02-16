"use client";

import { useState } from "react";
import Link from "next/link";
import Card, { CardBody } from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function CalculatorCostExtraPage() {
  const [q1, setQ1] = useState("");
  const [q2, setQ2] = useState("");
  const [q3, setQ3] = useState("");

  return (
    <div className="space-y-6">
      <Link href="/calculator/cost" className="text-sm text-[var(--accent)] hover:underline">
        ← Расчёт стоимости
      </Link>
      <h1 className="text-xl font-bold text-slate-800">Дополнительная информация</h1>
      <p className="text-slate-600 text-sm">
        Ответьте на дополнительные вопросы для уточнения контекста. Чем полнее данные, тем точнее анализ и рекомендации.
      </p>

      <Card>
        <CardBody className="space-y-6">
          <h2 className="text-sm font-semibold text-slate-700">Опросник 1: Контекст процессов</h2>
          <Input
            label="Как часто пересматриваются регламенты и инструкции?"
            placeholder="Например: раз в год, по мере изменений"
            value={q1}
            onChange={(e) => setQ1(e.target.value)}
          />
          <Input
            label="Есть ли практика разбора инцидентов (разбор полётов, разбор смен)?"
            placeholder="Да / Нет / Частично"
            value={q2}
            onChange={(e) => setQ2(e.target.value)}
          />
        </CardBody>
      </Card>

      <Card>
        <CardBody className="space-y-6">
          <h2 className="text-sm font-semibold text-slate-700">Опросник 2: Ресурсы и нагрузка</h2>
          <Input
            label="Средняя загрузка персонала в пиковые периоды (%)"
            placeholder="0–100"
            value={q3}
            onChange={(e) => setQ3(e.target.value)}
          />
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Наличие резерва на критичных участках</label>
            <select className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--accent)]">
              <option value="">Выберите</option>
              <option value="yes">Да</option>
              <option value="no">Нет</option>
              <option value="partial">Частично</option>
            </select>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardBody className="space-y-6">
          <h2 className="text-sm font-semibold text-slate-700">Опросник 3: Человеческий фактор</h2>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Проводятся ли оценки уровня стресса/усталости?</label>
            <select className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--accent)]">
              <option value="">Выберите</option>
              <option value="regular">Регулярно</option>
              <option value="sometimes">Эпизодически</option>
              <option value="no">Нет</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Дополнительные комментарии (риски, узкие места)</label>
            <textarea placeholder="Текст..." rows={3} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--accent)]" />
          </div>
        </CardBody>
      </Card>

      <div className="flex flex-wrap gap-3">
        <Link href="/calculator/cost">
          <Button variant="secondary">Вернуться к расчёту стоимости</Button>
        </Link>
        <Button>Сохранить ответы</Button>
      </div>
    </div>
  );
}
