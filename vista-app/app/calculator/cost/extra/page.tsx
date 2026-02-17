"use client";

import { useState } from "react";
import Link from "next/link";
import Card, { CardBody } from "@/components/ui/Card";
import Button from "@/components/ui/Button";

const selectClass =
  "w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--accent)] focus:border-[var(--accent)] outline-none bg-white";

export default function CalculatorCostExtraPage() {
  const [q1, setQ1] = useState("");
  const [q2, setQ2] = useState("");
  const [q3, setQ3] = useState("");
  const [q4, setQ4] = useState("");
  const [q5, setQ5] = useState("");
  const [comments, setComments] = useState("");

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
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Как часто пересматриваются регламенты и инструкции?
            </label>
            <select className={selectClass} value={q1} onChange={(e) => setQ1(e.target.value)}>
              <option value="">Выберите</option>
              <option value="yearly">Раз в год</option>
              <option value="halfyear">Раз в полгода</option>
              <option value="quarterly">Раз в квартал</option>
              <option value="on_change">По мере изменений</option>
              <option value="rarely">Редко</option>
              <option value="never">Не пересматриваются</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Есть ли практика разбора инцидентов (разбор полётов, разбор смен)?
            </label>
            <select className={selectClass} value={q2} onChange={(e) => setQ2(e.target.value)}>
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
          <h2 className="text-sm font-semibold text-slate-700">Опросник 2: Ресурсы и нагрузка</h2>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Средняя загрузка персонала в пиковые периоды
            </label>
            <select className={selectClass} value={q3} onChange={(e) => setQ3(e.target.value)}>
              <option value="">Выберите</option>
              <option value="0-50">0–50%</option>
              <option value="51-70">51–70%</option>
              <option value="71-90">71–90%</option>
              <option value="91-100">91–100%</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Наличие резерва на критичных участках</label>
            <select className={selectClass} value={q4} onChange={(e) => setQ4(e.target.value)}>
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
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Проводятся ли оценки уровня стресса/усталости?
            </label>
            <select className={selectClass} value={q5} onChange={(e) => setQ5(e.target.value)}>
              <option value="">Выберите</option>
              <option value="regular">Регулярно</option>
              <option value="sometimes">Эпизодически</option>
              <option value="no">Нет</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Дополнительные комментарии (риски, узкие места)
            </label>
            <select className={selectClass} value={comments} onChange={(e) => setComments(e.target.value)}>
              <option value="">Выберите или оставьте пустым</option>
              <option value="high_risk">Высокие риски на ключевых участках</option>
              <option value="bottlenecks">Есть узкие места по персоналу</option>
              <option value="training_gaps">Дефицит обучения и инструктажей</option>
              <option value="none">Существенных замечаний нет</option>
              <option value="other">Другое (уточню отдельно)</option>
            </select>
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
