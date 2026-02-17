"use client";

import { useState } from "react";
import Link from "next/link";
import Card, { CardBody } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { RadarChart, TrendChart, TrainingBarChart, AudioStateChart, TrajectoryConclusion } from "./ReliabilityCharts";

const profileData = {
  fio: "Иванов Иван Иванович",
  position: "Второй пилот отряда B-777",
  department: "Служба производства полетов",
  tenure: "7 лет 4 мес.",
};

const profileMetrics = {
  simulatorSuccess: { value: 94, unit: "%", detail: "17 из 18 сессий" },
  stressLevel: { value: 32, unit: "%", detail: "низкий" },
  risksCount: { value: 5, unit: "", detail: "активных" },
  humanFactorLevel: { value: 7.2, unit: "/10", detail: "72%" },
};

const achievements = [
  "Лучшие показатели — 2024",
  "Почётная грамота — 2023",
  "Лучший показатель по безопасности — 2025",
  "Высокое качество работы — 2024",
  "Благодарность — 2021",
];

// Допуски: 15 действующих (год 2028), 3 истекают (2026, месяц с 06)
const allowancesValid = [
  { name: "Свидетельство коммерческого пилота (ATPL)", until: "до 12.2028" },
  { name: "Тип ВС Boeing 777", until: "до 06.2028" },
  { name: "Тип ВС Boeing 737", until: "до 06.2028" },
  { name: "CRM (управление ресурсами экипажа)", until: "до 03.2028" },
  { name: "MCC (многоэкипажное управление)", until: "до 03.2028" },
  { name: "Английский язык ICAO уровень 4", until: "до 09.2028" },
  { name: "ВЛЭК 1 класса", until: "до 02.2028" },
  { name: "Допуск к полётам по приборам", until: "до 06.2028" },
  { name: "Подготовка по аварийно-спасательным работам", until: "до 08.2028" },
  { name: "Опасные грузы (категория 1)", until: "до 11.2028" },
  { name: "Экипажная подготовка B-777", until: "до 05.2028" },
  { name: "Тренажёрная подготовка B-777", until: "до 05.2028" },
  { name: "Линейная тренировка B-777", until: "до 07.2028" },
  { name: "Противодействие актам незаконного вмешательства", until: "до 01.2028" },
  { name: "Охрана труда для ВС", until: "до 04.2028" },
];

const allowancesExpiring = [
  { name: "Ежегодная проверка по типу B-777", until: "до 06.2026" },
  { name: "Проверка техники пилотирования B-777", until: "до 07.2026" },
  { name: "Медицинский осмотр (периодический)", until: "до 08.2026" },
];

// История: учебный отряд 6 мес, Второй пилот B-737, Командир B-737, Второй пилот B-777 (1 г 2 мес)
const careerHistory = [
  { period: "Март 2018 — Август 2018", role: "Учебный отряд авиакомпании", duration: "6 мес." },
  { period: "Сентябрь 2018 — Август 2021", role: "Второй пилот отряда B-737", duration: "3 года" },
  { period: "Сентябрь 2021 — Апрель 2024", role: "Командир воздушного судна отряда B-737", duration: "2 г 8 мес." },
  { period: "Май 2024 — по н.в.", role: "Второй пилот отряда B-777", duration: "1 г 2 мес." },
];

// Результаты психологического профиля (после «Запросить результаты»)
const psychologicalResults = {
  cognitive: {
    title: "Когнитивные способности",
    level: "общий уровень — высокий",
    zones: [
      {
        name: "Внимание и контроль внимания",
        items: [
          { name: "Избирательное внимание", value: "85%" },
          { name: "Устойчивое внимание", value: "88%" },
          { name: "Переключение внимания", value: "90%" },
          { name: "Контроль интерференции/шумоустойчивость", value: "92%" },
          { name: "Бдительность/внимание к редким сигналам", value: "97%" },
        ],
      },
      {
        name: "Скорость обработки информации",
        items: [
          { name: "Психомоторная скорость", value: "96%" },
          { name: "Скорость перцептивного различения", value: "85%" },
          { name: "Скорость принятия простых решений", value: "95%" },
          { name: "Темп работы при сохранении точности", value: "88%" },
        ],
      },
      {
        name: "Память",
        items: [
          { name: "Кратковременная", value: "83%" },
          { name: "Рабочая память: удержание + переработка", value: "86%" },
          { name: "Вербальная/зрительно-пространственная рабочая память", value: "91%" },
          { name: "Семантическая (знания)", value: "89%" },
          { name: "Процедурная (навыки)", value: "85%" },
          { name: "Эпизодическая (события)", value: "87%" },
          { name: "Обучаемость/скорость усвоения", value: "97%" },
          { name: "Проспективная («не забыть сделать»)", value: "—" },
        ],
      },
      {
        name: "Исполнительные функции",
        items: [
          { name: "Самоконтроль/ингибиция", value: "82%" },
          { name: "Когнитивная гибкость (перестраиваться)", value: "85%" },
          { name: "Мониторинг ошибок", value: "87%" },
          { name: "Устойчивость к фрустрации в задачах", value: "82%" },
          { name: "Целеполагание и удержание цели под нагрузкой", value: "92%" },
        ],
      },
      {
        name: "Мышление и интеллект",
        items: [
          { name: "Логическое мышление", value: "92%" },
          { name: "Абстрактное мышление", value: "84%" },
          { name: "Аналитическое мышление", value: "86%" },
          { name: "Индукция/дедукция", value: "81%" },
          { name: "Числовое, вербальное, пространственное рассуждение", value: "97%" },
          { name: "Системное мышление (структуры/взаимосвязи)", value: "94%" },
          { name: "Критическое мышление (оценка аргументов)", value: "95%" },
        ],
      },
      {
        name: "Решение задач и принятие решений",
        items: [
          { name: "Оценка риска/вероятностей", value: "90%" },
          { name: "Калибровка уверенности", value: "81%" },
          { name: "Решение в неопределенности", value: "87%" },
          { name: "Приоритизация (стоимость/время/безопасность)", value: "82%" },
          { name: "Поиск альтернатив/генерация вариантов", value: "79%" },
          { name: "Стратегии (эвристики vs последовательный анализ)", value: "85%" },
        ],
      },
      {
        name: "Восприятие и перцептивные навыки",
        items: [
          { name: "Пространственная ориентация/ментальные вращения", value: "86%" },
          { name: "Восприятие времени/темпа", value: "90%" },
          { name: "Пороговые/сенсомоторные реакции", value: "84%" },
        ],
      },
      {
        name: "Язык и коммуникация",
        items: [
          { name: "Понимание инструкций/текста", value: "87%" },
          { name: "Вербальная беглость", value: "83%" },
        ],
      },
      {
        name: "Метакогниция",
        items: [
          { name: "Осознание собственных ошибок/ограничений", value: "92%" },
          { name: "Умение проверять себя", value: "91%" },
          { name: "Регуляция стратегии («заметил — изменил подход»)", value: "85%" },
        ],
      },
    ],
  },
  personal: {
    title: "Личностные и поведенческие способности",
    level: "общий высокий уровень",
    zones: [
      {
        name: "Базовые личностные черты",
        items: [
          { name: "Экстраверсия", value: "80%" },
          { name: "Доброжелательность", value: "79%" },
          { name: "Добросовестность", value: "87%" },
          { name: "Нейротизм/эмоциональная стабильность", value: "83%" },
          { name: "Открытость", value: "75%" },
          { name: "Самооценка/уверенность", value: "81%" },
        ],
      },
      {
        name: "Саморегуляция",
        items: [
          { name: "Самодисциплина", value: "88%" },
          { name: "Ответственность/исполнительность", value: "93%" },
          { name: "Планомерность/организованность", value: "85%" },
          { name: "Аккуратность/внимание к деталям", value: "83%" },
          { name: "Следование правилам/процедурам", value: "79%" },
          { name: "Надежность под рутиной", value: "75%" },
          { name: "Надежность под нагрузкой", value: "87%" },
        ],
      },
      {
        name: "Стрессоустойчивость и адаптация",
        items: [
          { name: "Толерантность к стрессу", value: "93%" },
          { name: "Устойчивость к неопределенности", value: "89%" },
          { name: "Способности к восстановлению", value: "91%" },
          { name: "Регуляция эмоций", value: "94%" },
        ],
      },
      {
        name: "Мотивация и рабочие драйверы",
        items: [
          { name: "Достиженческая мотивация", value: "77%" },
          { name: "Ориентация на качество/безопасность/результат", value: "82%" },
          { name: "Потребность в контроле/власти/признании", value: "72%" },
          { name: "Локус контроля (внутренний/внешний)", value: "95%" },
        ],
      },
      {
        name: "Риск-поведение и безопасность",
        items: [
          { name: "Склонность к риску / риск-избегание", value: "71%" },
          { name: "Импульсивность vs осторожность", value: "73%" },
          { name: "Соблюдение безопасного поведения", value: "79%" },
          { name: "Толерантность к отклонениям", value: "85%" },
          { name: "Склонность к нарушению правил ради скорости/выгоды", value: "65%" },
        ],
      },
      {
        name: "Социальные и командные способности",
        items: [
          { name: "Кооперативность", value: "87%" },
          { name: "Конфликтность", value: "65%" },
          { name: "Ассертивность (умение говорить «стоп»)", value: "95%" },
          { name: "Доверие", value: "76%" },
          { name: "Подозрительность", value: "67%" },
        ],
      },
      {
        name: "Лидерство и управленческий стиль",
        items: [
          { name: "Стиль принятия решений", value: "авторитарный к коллегиальному как 6 к 4" },
          { name: "Делегирование/контроль", value: "55%" },
          { name: "Влияние/убеждение", value: "86%" },
          { name: "Управление конфликтом", value: "90%" },
          { name: "Управление изменениями", value: "89%" },
        ],
      },
      {
        name: "Этика, надежность, добропорядочность",
        items: [
          { name: "Честность (валидизационные шкалы)", value: "82%" },
          { name: "Склонность к нарушениям", value: "55%" },
          { name: "Правдивость ответов/социальная желательность (шкалы контроля)", value: "35%" },
        ],
      },
    ],
  },
};

const expandableSections = [
  {
    id: "development",
    title: "Возможности развития",
  },
];

// Рекомендации на основании данных профиля (допуски, тренд, аудио, показатели, радар и т.д.)
const developmentRecommendations = [
  {
    source: "Допуски",
    text: "Три допуска истекают в 2026 г. (ежегодная проверка по типу B-777, проверка техники пилотирования, медосмотр). Запланировать продление до истечения срока.",
  },
  {
    source: "Тренд проф. надёжности",
    text: "В последний период — снижение показателя. Рекомендуется детальный разбор причин (нагрузка, ротация, личные факторы) и при необходимости корректирующие мероприятия или консультация с руководителем.",
  },
  {
    source: "Аудиоанализ",
    text: "В части записей зафиксированы проявления отклонений от нормы. Целесообразен разбор эпизодов с психологом или супервизором для снижения рисков.",
  },
  {
    source: "Успешность тренажёров (94%)",
    text: "Высокий результат. Поддерживать текущий уровень подготовки; при интересе к карьерному шагу — рассмотреть программу переподготовки на КВС B-777 с учётом опыта КВС B-737.",
  },
  {
    source: "Уровень стресса (32%)",
    text: "Низкий уровень стресса — благоприятный фон. Рекомендуется сохранять режим труда и отдыха и текущие практики восстановления.",
  },
  {
    source: "Количество рисков (5)",
    text: "Регулярно пересматривать назначенные риски, выполнять запланированные мероприятия по снижению и контролировать сроки.",
  },
  {
    source: "Личный уровень Human Factor (72%)",
    text: "Показатель в зоне оптимума. Поддерживать практики, связанные с надёжностью (CRM, брифинги, учёт усталости), и проходить плановый мониторинг.",
  },
  {
    source: "Психологический профиль (1-я группа прогноза)",
    text: "Плановое обследование не реже одного раза в год; при изменении нагрузки или условий работы — по показаниям.",
  },
  {
    source: "Радар инцидентов и причин",
    text: "По направлениям «Усталость» и «Физиологические факторы» ночные показатели выше. Усилить контроль режима отдыха перед ночными рейсами и при смене циклов.",
  },
];

function Chevron({ open }: { open: boolean }) {
  return (
    <span className={`shrink-0 text-xs text-slate-500 transition-transform ${open ? "rotate-180" : ""}`}>
      ▼
    </span>
  );
}

export default function CoPilotProfilePage() {
  const [openId, setOpenId] = useState<string | null>(null);
  const [psychOpen, setPsychOpen] = useState(false);
  const [psychResultsShown, setPsychResultsShown] = useState(false);
  const [psychResultPanel, setPsychResultPanel] = useState<"cognitive" | "personal" | null>(null);
  const [allowancesOpen, setAllowancesOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);

  return (
    <div className="space-y-6">
      <Link href="/copilot" className="text-sm text-[var(--accent)] hover:underline">
        ← Employee CoPilot
      </Link>
      <h1 className="text-xl font-bold text-slate-800">Профиль</h1>

      {/* Поля: ФИО, должность, подразделение, стаж */}
      <Card>
        <CardBody>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-slate-500 font-medium">ФИО</dt>
              <dd className="text-slate-800 mt-0.5">{profileData.fio}</dd>
            </div>
            <div>
              <dt className="text-slate-500 font-medium">Должность</dt>
              <dd className="text-slate-800 mt-0.5">{profileData.position}</dd>
            </div>
            <div>
              <dt className="text-slate-500 font-medium">Подразделение</dt>
              <dd className="text-slate-800 mt-0.5">{profileData.department}</dd>
            </div>
            <div>
              <dt className="text-slate-500 font-medium">Стаж</dt>
              <dd className="text-slate-800 mt-0.5">{profileData.tenure}</dd>
            </div>
          </dl>
        </CardBody>
      </Card>

      {/* Показатели в цифрах и % */}
      <div>
        <h2 className="text-sm font-semibold text-slate-700 mb-3">Показатели</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardBody className="p-4">
              <div className="text-2xl font-bold text-[var(--accent)]">
                {profileMetrics.simulatorSuccess.value}{profileMetrics.simulatorSuccess.unit}
              </div>
              <div className="text-xs text-slate-500 mt-1">Успешность прохождения тренажёров</div>
              <div className="text-xs text-slate-600 mt-0.5">{profileMetrics.simulatorSuccess.detail}</div>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="p-4">
              <div className="text-2xl font-bold text-[var(--accent)]">
                {profileMetrics.stressLevel.value}{profileMetrics.stressLevel.unit}
              </div>
              <div className="text-xs text-slate-500 mt-1">Уровень стресса</div>
              <div className="text-xs text-slate-600 mt-0.5">{profileMetrics.stressLevel.detail}</div>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="p-4">
              <div className="text-2xl font-bold text-[var(--accent)]">
                {profileMetrics.risksCount.value}{profileMetrics.risksCount.unit}
              </div>
              <div className="text-xs text-slate-500 mt-1">Количество рисков</div>
              <div className="text-xs text-slate-600 mt-0.5">{profileMetrics.risksCount.detail}</div>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="p-4">
              <div className="text-2xl font-bold text-[var(--accent)]">
                {profileMetrics.humanFactorLevel.value}{profileMetrics.humanFactorLevel.unit}
              </div>
              <div className="text-xs text-slate-500 mt-1">Личный уровень Human Factor</div>
              <div className="text-xs text-slate-600 mt-0.5">{profileMetrics.humanFactorLevel.detail}</div>
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Достижения — плашки */}
      <div>
        <h2 className="text-sm font-semibold text-slate-700 mb-3">Достижения</h2>
        <div className="flex flex-wrap gap-3">
          {achievements.map((a) => (
            <span
              key={a}
              className="inline-flex px-4 py-2 rounded-lg border-2 border-[var(--border)] bg-[var(--bg-white)] text-slate-800 text-sm font-medium"
            >
              {a}
            </span>
          ))}
        </div>
      </div>

      {/* Раздел «Личные данные» — всегда первый, с вложенным контентом */}
      <div>
        <h2 className="text-sm font-semibold text-slate-700 mb-3">Разделы</h2>
        <Card>
          <button
            type="button"
            onClick={() => setOpenId(openId === "personal" ? null : "personal")}
            className="w-full text-left px-6 py-4 flex items-center justify-between gap-2 hover:bg-slate-50/50 transition-colors rounded-t-xl"
          >
            <span className="font-semibold text-slate-800">Личные данные</span>
            <Chevron open={openId === "personal"} />
          </button>
          {openId === "personal" && (
            <CardBody className="pt-0 border-t border-[var(--border)] space-y-4">
              {/* Психологический профиль */}
              <div>
                <button
                  type="button"
                  onClick={() => setPsychOpen(!psychOpen)}
                  className="w-full text-left flex items-center justify-between gap-2 py-2 px-3 rounded-lg bg-[var(--bg-white)] border border-[var(--border)] hover:border-[var(--accent)]"
                >
                  <span className="font-medium text-slate-800">Психологический профиль</span>
                  <span className="text-sm text-slate-600">1-я группа прогноза</span>
                  <Chevron open={psychOpen} />
                </button>
                {psychOpen && (
                  <div className="mt-2 pl-3 border-l-2 border-[var(--accent)] text-sm text-slate-600 space-y-4">
                    <p className="mb-2">
                      <strong>1-я группа прогноза</strong> — высокая предрасположенность к надёжному выполнению профессиональных задач.
                      Учитываются показатели по стабильности, стрессоустойчивости и работе в экипаже. Рекомендуется плановый мониторинг не реже раза в год.
                    </p>
                    <Button size="sm" onClick={() => setPsychResultsShown(true)}>
                      Запросить результаты
                    </Button>
                    {psychResultsShown && (
                      <div className="space-y-2 mt-4">
                        {/* Плашка: Когнитивные способности */}
                        <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-white)] overflow-hidden">
                          <button
                            type="button"
                            onClick={() => setPsychResultPanel(psychResultPanel === "cognitive" ? null : "cognitive")}
                            className="w-full text-left px-4 py-3 flex items-center justify-between gap-2 hover:bg-slate-50/80 transition-colors"
                          >
                            <span className="font-semibold text-slate-800">
                              {psychologicalResults.cognitive.title} — {psychologicalResults.cognitive.level}
                            </span>
                            <Chevron open={psychResultPanel === "cognitive"} />
                          </button>
                          {psychResultPanel === "cognitive" && (
                            <div className="px-4 pb-4 pt-0 border-t border-[var(--border)] space-y-4">
                              {psychologicalResults.cognitive.zones.map((zone) => (
                                <div key={zone.name}>
                                  <div className="font-medium text-slate-700 text-sm mb-2">{zone.name}</div>
                                  <ul className="space-y-1 text-sm">
                                    {zone.items.map((item) => (
                                      <li key={item.name} className="flex justify-between gap-4 text-slate-600">
                                        <span>{item.name}</span>
                                        <span className="shrink-0 font-medium text-slate-800">{item.value}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        {/* Плашка: Личностные и поведенческие способности */}
                        <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-white)] overflow-hidden">
                          <button
                            type="button"
                            onClick={() => setPsychResultPanel(psychResultPanel === "personal" ? null : "personal")}
                            className="w-full text-left px-4 py-3 flex items-center justify-between gap-2 hover:bg-slate-50/80 transition-colors"
                          >
                            <span className="font-semibold text-slate-800">
                              {psychologicalResults.personal.title} — {psychologicalResults.personal.level}
                            </span>
                            <Chevron open={psychResultPanel === "personal"} />
                          </button>
                          {psychResultPanel === "personal" && (
                            <div className="px-4 pb-4 pt-0 border-t border-[var(--border)] space-y-4">
                              {psychologicalResults.personal.zones.map((zone) => (
                                <div key={zone.name}>
                                  <div className="font-medium text-slate-700 text-sm mb-2">{zone.name}</div>
                                  <ul className="space-y-1 text-sm">
                                    {zone.items.map((item) => (
                                      <li key={item.name} className="flex justify-between gap-4 text-slate-600">
                                        <span>{item.name}</span>
                                        <span className="shrink-0 font-medium text-slate-800">{item.value}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Допуски — 15 зелёным, 3 оранжевым */}
              <div>
                <button
                  type="button"
                  onClick={() => setAllowancesOpen(!allowancesOpen)}
                  className="w-full text-left flex items-center justify-between gap-2 py-2 px-3 rounded-lg bg-[var(--bg-white)] border border-[var(--border)] hover:border-[var(--accent)]"
                >
                  <span className="font-medium text-slate-800">Допуски</span>
                  <span className="flex items-center gap-2">
                    <span className="text-[var(--accent)] font-semibold">15</span>
                    <span className="text-slate-400">/</span>
                    <span className="text-[var(--risk-orange)] font-semibold">3</span>
                  </span>
                  <Chevron open={allowancesOpen} />
                </button>
                {allowancesOpen && (
                  <div className="mt-2 space-y-3 text-sm">
                    <div>
                      <p className="text-slate-500 font-medium mb-1">
                        Действуют, срок более 1 года — <span className="text-[var(--accent)]">15</span>
                      </p>
                      <ul className="space-y-1 pl-2">
                        {allowancesValid.map((a) => (
                          <li key={a.name} className="text-slate-700 flex justify-between gap-2">
                            <span>{a.name}</span>
                            <span className="text-[var(--accent)] shrink-0">{a.until}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-slate-500 font-medium mb-1">
                        Истекают в ближайшие 12 месяцев — <span className="text-[var(--risk-orange)]">3</span>
                      </p>
                      <ul className="space-y-1 pl-2">
                        {allowancesExpiring.map((a) => (
                          <li key={a.name} className="text-slate-700 flex justify-between gap-2">
                            <span>{a.name}</span>
                            <span className="text-[var(--risk-orange)] shrink-0">{a.until}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              {/* История — 7,4 */}
              <div>
                <button
                  type="button"
                  onClick={() => setHistoryOpen(!historyOpen)}
                  className="w-full text-left flex items-center justify-between gap-2 py-2 px-3 rounded-lg bg-[var(--bg-white)] border border-[var(--border)] hover:border-[var(--accent)]"
                >
                  <span className="font-medium text-slate-800">История</span>
                  <span className="text-slate-600 font-medium">7,4</span>
                  <Chevron open={historyOpen} />
                </button>
                {historyOpen && (
                  <ul className="mt-2 space-y-2 text-sm">
                    {careerHistory.map((h) => (
                      <li key={h.role} className="flex flex-wrap items-baseline gap-2 pl-2 border-l-2 border-[var(--border)]">
                        <span className="text-slate-500">{h.period}</span>
                        <span className="font-medium text-slate-800">{h.role}</span>
                        <span className="text-slate-500">({h.duration})</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </CardBody>
          )}
        </Card>

        {/* Траектория профессиональной надёжности — с графиками */}
        <Card className="mt-2">
          <button
            type="button"
            onClick={() => setOpenId(openId === "trajectory" ? null : "trajectory")}
            className="w-full text-left px-6 py-4 flex items-center justify-between gap-2 hover:bg-slate-50/50 transition-colors rounded-t-xl"
          >
            <span className="font-semibold text-slate-800">Траектория профессиональной надёжности</span>
            <Chevron open={openId === "trajectory"} />
          </button>
          {openId === "trajectory" && (
            <CardBody className="pt-0 border-t border-[var(--border)] space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-semibold text-slate-700 mb-2">Радар «Инциденты и причины»</h3>
                  <RadarChart />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-700 mb-2">Аналитика обучения: % успешности (программы, сертификация, допуски)</h3>
                  <TrainingBarChart />
                </div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-semibold text-slate-700 mb-2">Тренд проф. надёжности (7 лет 4 мес.)</h3>
                  <TrendChart />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-700 mb-2">Аудио: состояние по записям</h3>
                  <AudioStateChart />
                </div>
              </div>
              <TrajectoryConclusion />
            </CardBody>
          )}
        </Card>

        {/* Возможности развития */}
        <div className="space-y-2 mt-2">
          {expandableSections.map((s) => {
            const isOpen = openId === s.id;
            return (
              <Card key={s.id}>
                <button
                  type="button"
                  onClick={() => setOpenId(isOpen ? null : s.id)}
                  className="w-full text-left px-6 py-4 flex items-center justify-between gap-2 hover:bg-slate-50/50 transition-colors rounded-xl"
                >
                  <span className="font-semibold text-slate-800">{s.title}</span>
                  <Chevron open={isOpen} />
                </button>
                {isOpen && (
                  <CardBody className="pt-0 border-t border-[var(--border)]">
                    {s.id === "development" ? (
                      <ul className="text-sm text-slate-600 space-y-4">
                        {developmentRecommendations.map((rec, i) => (
                          <li key={i} className="flex flex-col gap-1 pl-3 border-l-2 border-[var(--accent)]">
                            <span className="font-medium text-slate-700">{rec.source}</span>
                            <span>{rec.text}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      "content" in s && s.content != null ? (
                        <p className="text-sm text-slate-600">{String(s.content)}</p>
                      ) : null
                    )}
                  </CardBody>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
