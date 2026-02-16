"use client";

import { useState } from "react";
import Link from "next/link";
import Card, { CardBody } from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

const TOPICS = [
  "Безопасность полётов",
  "Условия на перроне / наземное обслуживание",
  "Рабочая среда и эргономика",
  "Документация и процедуры",
  "Техническое состояние ВС",
  "Другое",
];

export default function VoluntaryNewPage() {
  const [topic, setTopic] = useState(TOPICS[0]);
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [sent, setSent] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files;
    if (!selected?.length) return;
    setFiles((prev) => [...prev, ...Array.from(selected)]);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  if (sent) {
    return (
      <div className="space-y-6">
        <Link href="/copilot/voluntary" className="text-sm text-[var(--accent)] hover:underline">
          ← Добровольные сообщения
        </Link>
        <Card accent>
          <CardBody>
            <h2 className="font-semibold text-slate-800 mb-2">Сообщение отправлено</h2>
            <p className="text-slate-600 text-sm mb-4">
              Ваше сообщение принято. Ответ будет направлен в течение установленного срока.
            </p>
            <Link href="/copilot/voluntary">
              <Button variant="secondary">Вернуться к разделу</Button>
            </Link>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link href="/copilot/voluntary" className="text-sm text-[var(--accent)] hover:underline">
        ← Добровольные сообщения
      </Link>
      <h1 className="text-xl font-bold text-slate-800">Отправить сообщение</h1>
      <Card>
        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Тема</label>
              <select
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
              >
                {TOPICS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Сообщение</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Опишите ситуацию или предложение..."
                rows={5}
                required
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent resize-y"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Прикрепить файл или фото
              </label>
              <input
                type="file"
                multiple
                accept="image/*,.pdf,.doc,.docx"
                onChange={handleFileChange}
                className="block w-full text-sm text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-[var(--accent)] file:text-white file:cursor-pointer hover:file:opacity-90"
              />
              {files.length > 0 && (
                <ul className="mt-2 space-y-1">
                  {files.map((f, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
                      <span className="truncate">{f.name}</span>
                      <button
                        type="button"
                        onClick={() => removeFile(i)}
                        className="text-[var(--risk-red)] hover:underline shrink-0"
                      >
                        удалить
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <Button type="submit">Отправить</Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
