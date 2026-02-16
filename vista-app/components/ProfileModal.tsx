"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

// Бизнес-процессы: транспорт, промышленность (крупные компании)
const BUSINESS_PROCESSES = [
  "Управление полётами",
  "Наземное обслуживание ВС",
  "Техническое обслуживание и ремонт",
  "Управление грузоперевозками",
  "Безопасность полётов",
  "Управление качеством",
  "Управление персоналом",
  "Закупки и снабжение",
  "Производственные операции",
  "Логистика и складирование",
  "Управление рисками",
  "Эксплуатация подвижного состава",
  "Управление перевозками пассажиров",
  "Охрана труда и промышленная безопасность",
  "Экологический менеджмент",
  "Управление проектами",
  "Сервисное обслуживание",
  "Таможенное оформление",
  "Планирование и диспетчеризация",
];

// Владелец — подразделение или бизнес-функция (кто владеет риском)
const OWNER_UNITS = [
  "Служба безопасности полётов",
  "Техническая служба",
  "Служба наземного обслуживания",
  "Коммерческая служба",
  "Служба по качеству",
  "Производственно-технический отдел",
  "Отдел логистики",
  "Служба управления персоналом",
  "Служба закупок",
  "Служба рисков",
  "Операционный отдел",
  "Служба эксплуатации",
  "Диспетчерская служба",
  "Служба перевозок",
  "Ремонтное подразделение",
];

// Управление рисками — реестр рисков (транспорт, промышленность, RCA)
const RISKS_MANAGEMENT = [
  "Р-001 Усталость персонала",
  "Р-002 Ошибка оператора",
  "Р-003 Нарушение процедур (SOP)",
  "Р-004 Недостаток компетенций",
  "Р-005 Перегрузка / дефицит ресурсов",
  "Р-006 Конфликт в коллективе",
  "Р-007 Несоответствие документации",
  "Р-008 Сбой коммуникации",
  "Р-009 Дефицит внимания / отвлечение",
  "Р-010 Стресс и давление сроков",
  "Р-011 Ошибка диспетчера / УВД",
  "Р-012 Нарушение регламента техобслуживания",
  "Р-013 Неправильное применение инструкций",
  "Р-014 Задержка по вине персонала",
  "Р-015 Травматизм при выполнении работ",
  "Р-016 Нарушение режима труда и отдыха",
  "Р-017 Несоблюдение требований безопасности",
  "Р-018 Ошибка при приёмке/контроле",
];

// Носитель рисков — какие риски сотрудник может провоцировать по должности
const RISKS_CARRIER = [
  "Ошибка при техническом обслуживании",
  "Нарушение регламента при наземной обработке",
  "Ошибка диспетчера / оператора УВД",
  "Неправильное применение инструкций",
  "Задержка рейса/операции по вине персонала",
  "Травма при выполнении работ",
  "Ошибочная маршрутизация или документация",
  "Сбой в передаче информации",
  "Нарушение режима труда и отдыха",
  "Несоблюдение требований безопасности",
  "Ошибка при контроле качества",
  "Пропуск дефекта при осмотре",
  "Неверное решение в нестандартной ситуации",
  "Создание помех другим операциям",
  "Использование несоответствующих материалов/инструмента",
];

// Подразделения для поля «Подразделение»
const DEPARTMENTS = [
  "Служба безопасности полётов",
  "Служба производства полетов",
  "Техническая служба",
  "Служба наземного обслуживания",
  "Коммерческая служба",
  "Служба по качеству",
  "Производственно-технический отдел",
  "Отдел логистики",
  "Служба управления персоналом",
  "Подразделение управления рисками",
  "Операционный отдел",
  "Служба эксплуатации",
  "Диспетчерская служба",
  "Служба перевозок",
  "Ремонтное подразделение",
];

// Варианты позиций для поля «Подчинение» (должность руководителя)
const REPORTS_TO_POSITIONS = [
  "Начальник службы",
  "Директор департамента",
  "Начальник отдела",
  "Руководитель группы",
  "Заместитель директора",
  "Руководитель направления",
  "Генеральный директор",
  "Главный специалист",
];

type MultiSelectProps = {
  label: string;
  options: string[];
  value: string[];
  onChange: (v: string[]) => void;
  /** Кнопка «Добавить» и плюсик для выбора ещё */
  withAddButton?: boolean;
};

function MultiSelect({ label, options, value, onChange, withAddButton }: MultiSelectProps) {
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
      <div className="flex gap-1">
        <div className="relative flex-1">
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="w-full border border-[var(--border)] rounded-lg px-3 py-2 text-sm text-left bg-white hover:border-[var(--accent)] flex items-center justify-between"
          >
            <span className="truncate">
              {available.length ? "Выбрать из списка" : "Все добавлены"}
            </span>
            <span className="shrink-0 ml-2 text-slate-400">▼</span>
          </button>
          {open && (
            <>
              <div className="absolute z-20 mt-1 w-full bg-white border border-[var(--border)] rounded-lg shadow-lg py-1 max-h-48 overflow-y-auto">
                {available.length > 0 ? (
                  available.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => add(opt)}
                      className="block w-full px-3 py-2 text-sm text-left hover:bg-[var(--green-pale)]"
                    >
                      {opt}
                    </button>
                  ))
                ) : (
                  <div className="px-3 py-2 text-sm text-slate-500">Все пункты уже добавлены</div>
                )}
              </div>
              <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} aria-hidden />
            </>
          )}
        </div>
        {withAddButton && (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="shrink-0 w-10 h-[42px] flex items-center justify-center border border-[var(--border)] rounded-lg bg-white hover:border-[var(--accent)] hover:bg-[var(--green-pale)] text-slate-600"
            title="Добавить ещё"
            aria-label="Добавить ещё"
          >
            +
          </button>
        )}
      </div>
    </div>
  );
}

function SelectField({
  label,
  options,
  value,
  onChange,
  placeholder = "Выберите...",
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="space-y-1">
      <span className="block text-sm font-medium text-slate-700">{label}</span>
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="w-full border border-[var(--border)] rounded-lg px-3 py-2 text-sm text-left bg-white hover:border-[var(--accent)] flex items-center justify-between"
        >
          <span className={value ? "text-slate-800" : "text-slate-400"}>{value || placeholder}</span>
          <span className="shrink-0 ml-2 text-slate-400">▼</span>
        </button>
        {open && (
          <>
            <div className="absolute z-20 mt-1 w-full bg-white border border-[var(--border)] rounded-lg shadow-lg py-1 max-h-48 overflow-y-auto">
              {options.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => { onChange(opt); setOpen(false); }}
                  className="block w-full px-3 py-2 text-sm text-left hover:bg-[var(--green-pale)]"
                >
                  {opt}
                </button>
              ))}
            </div>
            <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} aria-hidden />
          </>
        )}
      </div>
    </div>
  );
}

const defaultProfile = {
  fio: "Иванов Иван Иванович",
  id: "ID-7842",
  position: "Второй пилот отряда B-777",
  department: "Служба производства полетов",
  reportsTo: "",
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

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

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
          <Link
            href="/copilot/profile"
            onClick={onClose}
            className="block p-3 rounded-lg bg-[var(--accent-light)] border border-[var(--accent)] text-[var(--accent)] font-medium text-sm text-center hover:bg-[var(--green-pale)]"
          >
            Открыть полный профиль: личные данные, допуски, история — Employee CoPilot →
          </Link>
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
          <SelectField
            label="Подразделение"
            options={DEPARTMENTS}
            value={profile.department}
            onChange={(v) => set("department", v)}
            placeholder="Выберите подразделение"
          />
          <SelectField
            label="Подчинение (должность руководителя)"
            options={REPORTS_TO_POSITIONS}
            value={profile.reportsTo}
            onChange={(v) => set("reportsTo", v)}
            placeholder="Выберите позицию руководителя"
          />
          <MultiSelect
            label="Ответственность за бизнес-процессы"
            options={BUSINESS_PROCESSES}
            value={profile.businessProcesses}
            onChange={(v) => set("businessProcesses", v)}
          />
          <MultiSelect
            label="Владелец"
            options={OWNER_UNITS}
            value={profile.riskOwner}
            onChange={(v) => set("riskOwner", v)}
          />
          <MultiSelect
            label="Управление рисками"
            options={RISKS_MANAGEMENT}
            value={profile.riskManagement}
            onChange={(v) => set("riskManagement", v)}
            withAddButton
          />
          <MultiSelect
            label="Носитель рисков (риски, которые сотрудник может провоцировать по должности)"
            options={RISKS_CARRIER}
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
