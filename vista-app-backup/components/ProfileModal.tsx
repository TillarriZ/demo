"use client";

import { useState, useCallback } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

const MOCK_BP = ["Обеспечение полётов", "Техобслуживание", "Наземная обработка", "Безопасность", "Качество"];
const MOCK_RISKS = ["Р-001 Перегруз", "Р-002 Усталость", "Р-003 Недостаток компетенций", "Р-004 Нарушение SOP", "Р-005 Конфликт"];

type MultiSelectProps = {
  label: string;
  options: string[];
  value: string[];
  onChange: (v: string[]) => void;
};

function MultiSelect({ label, options, value, onChange }: MultiSelectProps) {
  const [open, setOpen] = useState(false);
  const add = (opt: string) => {
    if (!value.includes(opt)) onChange([...value, opt]);
    setOpen(false);
  };
  const remove = (opt: string) => onChange(value.filter((x) => x !== opt));
  const available = options.filter((o) => !value.includes(o));

  return (
    <div className="space-y-1">
      <span className="block text-sm font-medium text-slate-700">{label}</span>
      <div className="flex flex-wrap gap-2 mb-1">
        {value.map((v) => (
          <span
            key={v}
            className="inline-flex items-center gap-1 px-2 py-1 rounded bg-[var(--green-pale)] text-slate-800 text-sm"
          >
            {v}
            <button type="button" onClick={() => remove(v)} className="text-slate-500 hover:text-slate-800" aria-label="Удалить">
              ×
            </button>
          </span>
        ))}
      </div>
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="w-full border border-[var(--border)] rounded-lg px-3 py-2 text-sm text-left bg-white hover:border-[var(--accent)]"
        >
          {available.length ? `Выбрать из списка (${available.length})` : "Все добавлены"}
        </button>
        {open && available.length > 0 && (
          <div className="absolute z-10 mt-1 w-full bg-white border border-[var(--border)] rounded-lg shadow-lg py-1 max-h-40 overflow-y-auto">
            {available.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => add(opt)}
                className="block w-full px-3 py-2 text-sm text-left hover:bg-[var(--green-pale)]"
              >
                {opt}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const defaultProfile = {
  fio: "Иванов Иван Иванович",
  id: "ID-7842",
  position: "Специалист по безопасности",
  businessProcesses: [] as string[],
  riskOwner: [] as string[],
  riskManagement: [] as string[],
  riskCarrier: [] as string[],
};

const defaultStats = {
  riskOwnerCount: 3,
  managesRisksCount: 7,
  riskCarrierCount: 8,
  riskRequests: 5,
  trendReliability: -2,
  historyCount: 12,
};

export default function ProfileModal({ onClose }: { onClose: () => void }) {
  const [profile, setProfile] = useState(defaultProfile);
  const stats = defaultStats;

  const set = useCallback(<K extends keyof typeof profile>(key: K, value: typeof profile[K]) => {
    setProfile((p) => ({ ...p, [key]: value }));
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden />
      <div
        className="relative bg-white rounded-xl shadow-xl border border-[var(--border)] w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-labelledby="profile-title"
      >
        <div className="sticky top-0 bg-white border-b border-[var(--border)] px-6 py-4 flex items-center justify-between">
          <h2 id="profile-title" className="text-lg font-semibold text-slate-800">
            Профиль пользователя
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded hover:bg-slate-100 text-slate-600"
            aria-label="Закрыть"
          >
            ×
          </button>
        </div>
        <div className="p-6 space-y-6">
          <Input
            label="ФИО"
            value={profile.fio}
            onChange={(e) => set("fio", e.target.value)}
          />
          <Input
            label="Номер ID"
            value={profile.id}
            onChange={(e) => set("id", e.target.value)}
          />
          <Input
            label="Позиция в компании"
            value={profile.position}
            onChange={(e) => set("position", e.target.value)}
          />
          <MultiSelect
            label="Ответственность за бизнес-процессы"
            options={MOCK_BP}
            value={profile.businessProcesses}
            onChange={(v) => set("businessProcesses", v)}
          />
          <MultiSelect
            label="Владелец рисков"
            options={MOCK_RISKS}
            value={profile.riskOwner}
            onChange={(v) => set("riskOwner", v)}
          />
          <MultiSelect
            label="Управление рисками"
            options={MOCK_RISKS}
            value={profile.riskManagement}
            onChange={(v) => set("riskManagement", v)}
          />
          <MultiSelect
            label="Носитель рисков"
            options={MOCK_RISKS}
            value={profile.riskCarrier}
            onChange={(v) => set("riskCarrier", v)}
          />

          <div className="pt-4 border-t border-[var(--border)]">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">Показатели</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="bg-[var(--bg-white)] rounded-lg p-3 border border-[var(--border)]">
                <div className="text-2xl font-bold text-[var(--accent)]">{stats.riskOwnerCount}</div>
                <div className="text-xs text-slate-500">Владелец рисков</div>
              </div>
              <div className="bg-[var(--bg-white)] rounded-lg p-3 border border-[var(--border)]">
                <div className="text-2xl font-bold text-[var(--accent)]">{stats.managesRisksCount}</div>
                <div className="text-xs text-slate-500">Управляет рисками</div>
              </div>
              <div className="bg-[var(--bg-white)] rounded-lg p-3 border border-[var(--border)]">
                <div className="text-2xl font-bold text-[var(--accent)]">{stats.riskCarrierCount}</div>
                <div className="text-xs text-slate-500">Носитель рисков</div>
              </div>
              <div className="bg-[var(--bg-white)] rounded-lg p-3 border border-[var(--border)]">
                <div className="text-2xl font-bold text-[var(--accent)]">{stats.riskRequests}</div>
                <div className="text-xs text-slate-500">Запросы по рискам</div>
              </div>
              <div className="bg-[var(--bg-white)] rounded-lg p-3 border border-[var(--border)]">
                <div className="text-2xl font-bold text-[var(--risk-orange)]">−{Math.abs(stats.trendReliability)}%</div>
                <div className="text-xs text-slate-500">Тренд проф. надёжности</div>
              </div>
              <div className="bg-[var(--bg-white)] rounded-lg p-3 border border-[var(--border)]">
                <div className="text-2xl font-bold text-[var(--accent)]">{stats.historyCount}</div>
                <div className="text-xs text-slate-500">Истории по запросам</div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={onClose}>Закрыть</Button>
            <Button>Сохранить</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
