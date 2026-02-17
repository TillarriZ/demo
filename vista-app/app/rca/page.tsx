"use client";

import { Fragment, useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Button, Card, CardBody, Input, Badge } from "@/components/ui";

const INCIDENT_TYPES = ["Простой", "Задержка", "Авария", "Повреждение", "Конфликт", "Неверное решение", "Ошибка", "Другое"];
const DEPARTMENTS = [
  "Производство", "Контроль качества", "Техническое обслуживание", "Логистика", "IT отдел", "HR", "Финансы", "Безопасность", "Администрация", "Продажи", "Маркетинг", "R&D",
  "Летные операции", "Наземное обслуживание", "Управление воздушным движением", "Техническое обслуживание ВС", "Грузовые операции", "Обслуживание пассажиров", "Авиационная безопасность", "Оперативное управление полетами", "Метеорологическая служба", "Топливозаправочная служба", "Диспетчерская служба", "Планирование перевозок", "Управление автопарком", "Планирование маршрутов", "Обработка грузов", "Таможенное оформление", "Складские операции", "Служба водителей", "Ремонт и обслуживание ТС", "Управление топливом", "Другое",
];
const SYSTEMS = [
  "Система управления воздушным движением", "Система планирования полетов", "Система отслеживания воздушных судов", "Радионавигационные средства", "Радиолокационная система", "Метеорологическая система", "Система управления аэропортом", "Система обработки багажа", "Система управления авиатопливом", "Система оперативного управления полетами", "Система планирования экипажей", "Система планирования ТО ВС", "Система контроля вылетов (DCS)", "Система управления авиагрузами", "Система наземного обслуживания", "Система управления транспортом (TMS)", "Диспетчерская система", "Система отслеживания грузов", "DMS", "WMS", "TMS", "CRM", "OCC", "Другое",
];
const CRITICALITY_LEVELS = [
  "1 - Критичный (Полная остановка работы)", "2 - Высокий (Значительное влияние на работу)", "3 - Средний (Умеренное влияние)", "4 - Низкий (Минимальное влияние)", "5 - Незначительный (Косметические проблемы)",
];
const METRICS = [
  "Регулярность полетов (%)", "Отмена рейсов (%)", "Задержки рейсов (мин)", "Использование воздушных судов (%)", "Время реакции", "Частота инцидентов", "Соответствие процедурам", "Производительность экипажа", "Количество авиационных происшествий", "Время наземного обслуживания", "Другое",
];
const BUSINESS_PROCESSES = [
  "Планирование полетов", "Выполнение полетов", "Планирование экипажей", "Техническое обслуживание ВС", "Наземное обслуживание", "Обслуживание пассажиров", "Обработка багажа", "Обработка авиагрузов", "Управление авиатопливом", "Аэропортовые операции", "Управление воздушным движением", "Координация слотов", "Метеорологический мониторинг", "Управление безопасностью полетов", "Оперативное управление полетами", "Управление полётами", "Техобслуживание", "Другое",
];
const PROGRAMS = [
  "Amadeus (RMS)", "Sabre (RMS)", "Galileo (RMS)", "Worldspan (RMS)", "Altea (Amadeus)", "Navitaire (NCR)", "AIMS (авиационная ERP)", "FlightPath (управление полетами)", "Skywise (Airbus)", "Boeing Analytics", "Employee CoPilot", "Wiki", "RCA", "Другое",
];
const SHIFTS = [
  "Утренняя (08:00-16:00)", "Вечерняя (16:00-00:00)", "Ночная (00:00-08:00)", "Дневная (09:00-18:00)", "Разделенная смена", "Гибкий график", "Утренняя", "Дневная", "Вечерняя", "Ночная",
];
const AREAS = [
  "Летное поле", "Терминал", "Багажный зал", "Грузовой терминал", "Ангар технического обслуживания", "Диспетчерская башня", "Наземное оборудование", "Топливное хозяйство", "Кейтеринг", "Служба безопасности", "Таможня", "Метеослужба", "Диспетчерский центр", "Склад", "Офис", "Участок 1", "Участок 2", "Другое",
];
const OPERATIONS = [
  "Прибытие воздушного судна", "Вылет воздушного судна", "Предполетная проверка", "Послеполетная проверка", "Заправка топливом", "Загрузка багажа", "Выгрузка багажа", "Посадка пассажиров", "Высадка пассажиров", "Оперативное планирование полета", "Планирование маршрута", "Предполётная подготовка", "Посадка", "Другое",
];
const POSITIONS = [
  "КВС", "Второй пилот", "Пилот-инструктор", "Штурман", "Бортинженер", "Диспетчер", "Техник", "Старший бортпроводник", "Бортпроводник", "Специалист наземного обслуживания", "Специалист по заправке", "Специалист по багажу", "Другое",
];
const ROLES = ["Исполнитель", "Контролёр", "Координатор", "Другое"];
const EMPLOYEES = ["Иванов Иван Иванович", "Петров Петр Петрович", "Сидоров Сидор Сидорович", "Козлов Алексей Михайлович", "Смирнов Дмитрий Александрович", "Кузнецов Владимир Сергеевич", "Попов Андрей Николаевич", "Соколов Максим Игоревич", "Лебедев Роман Владимирович", "Новиков Артем Евгеньевич", "Другое"];
const EMPLOYEE_IDS = ["EMP001", "EMP002", "EMP003", "EMP004", "EMP005", "EMP006", "EMP007", "EMP008", "EMP009", "EMP010", "EMP011", "EMP012", "EMP013", "EMP014", "EMP015", "EMP016", "EMP017", "EMP018", "EMP019", "EMP020"];
const POSSIBLE_CAUSES = [
  "Метеоусловия", "Загруженность воздушного пространства", "Техническая неисправность ВС", "Ошибка экипажа", "Неисправность наземного оборудования", "Проблемы с топливной системой", "Отказ навигационной системы", "Отказ связи", "Проблемы с инфраструктурой аэропорта", "Усталость экипажа", "Нарушения процедур безопасности", "Ошибка диспетчера", "Недостаточное обучение", "Недостаток опыта", "Усталость", "Стресс", "Отвлечение", "Недостаток коммуникации", "Нарушение процедуры", "Нехватка времени", "Организационные проблемы", "Другое",
];

type HistoryDetail = {
  providedInfo: { label: string; value: string }[];
  causalRelationships: string[];
  hfComponents: string[];
  costEstimate: { incident: string; annual: string };
  recurrence: { probability: string; deteriorations: string[] };
  riskModels: string[];
  hypotheses: string[];
  measures: string[];
  achievedChanges: string | null;
};

const HISTORY_ROWS: Array<{
  date: string;
  name: string;
  result: string;
  status: string;
  detail: HistoryDetail;
}> = [
  {
    date: "29.02.2024",
    name: "Нарушение порядка чек-листа",
    result: "Результат анализа",
    status: "Завершен",
    detail: {
      providedInfo: [
        { label: "Тип инцидента", value: "Ошибка" },
        { label: "Дата/время", value: "29.02.2024, 14:30" },
        { label: "Подразделение", value: "Летные операции" },
        { label: "Описание", value: "Пропуск пунктов чек-листа при предполётной подготовке" },
        { label: "Затронутые системы", value: "Система планирования полетов, SOP/чек-листы" },
        { label: "Метрики", value: "Соответствие процедурам" },
        { label: "Критичность", value: "2 - Высокий" },
        { label: "Смена", value: "Утренняя (08:00-16:00)" },
        { label: "Операция", value: "Предполётная проверка" },
        { label: "Связанные инциденты", value: "INC-2024-012, INC-2024-008" },
      ],
      causalRelationships: [
        "Пропуск пунктов чек-листа → Неполная проверка → Риск полётной годности",
        "Отвлечение при выполнении чек-листа → Снижение внимания к критичным пунктам",
        "Скрытый фактор: спешка из-за давления на время оборота ВС",
      ],
      hfComponents: ["SOP/чек-листы и соблюдение процедур", "Коммуникации: брифинги/дебрифы", "Компетенции и обучение"],
      costEstimate: { incident: "≈ 45 000 ₽ (задержка, перепроверка)", annual: "≈ 2,1 млн ₽ при 47 повторениях в год" },
      recurrence: {
        probability: "62% при сохранении текущих условий",
        deteriorations: ["Рост количества пропусков при увеличении интенсивности", "Риск инцидента с тяжёлыми последствиями"],
      },
      riskModels: ["Bow-Tie", "Fishbone (Ишикава)", "FRAM (Functional Resonance Analysis)"],
      hypotheses: [
        "Недостаточная подготовка по работе с чек-листами в условиях дефицита времени",
        "Отсутствие spotter-роли при выполнении предполётной проверки",
      ],
      measures: [
        "Внедрить электронный чек-лист с напоминаниями о критичных пунктах",
        "Ввести обязательную role-пару (читает / отмечает) при проверке",
        "Обучить управлению временем и приоритизации в условиях давления",
      ],
      achievedChanges: "Электронный чек-лист внедрён с 15.03.2024. За первый месяц — снижение пропусков на 34%.",
    },
  },
  {
    date: "28.02.2024",
    name: "Отклонение от установленных процедур",
    result: "Результат анализа",
    status: "Завершен",
    detail: {
      providedInfo: [
        { label: "Тип инцидента", value: "Нарушение процедуры" },
        { label: "Дата/время", value: "28.02.2024, 11:15" },
        { label: "Подразделение", value: "Наземное обслуживание" },
        { label: "Описание", value: "Работа на перроне без назначенного spotter" },
        { label: "Участок", value: "Летное поле" },
        { label: "Операция", value: "Заправка топливом" },
        { label: "Критичность", value: "3 - Средний" },
        { label: "Связанные инциденты", value: "INC-2024-015" },
      ],
      causalRelationships: [
        "Отсутствие spotter → Снижение осведомлённости об опасностях → Почти-столкновение",
        "Скрытый фактор: нехватка персонала в вечернюю смену",
      ],
      hfComponents: ["Планирование работ, JSA/TRA и Permit-to-Work", "Лидерство и культура безопасности", "Управление подрядчиками"],
      costEstimate: { incident: "≈ 12 000 ₽", annual: "≈ 580 000 ₽ при 48 подобных отклонениях" },
      recurrence: {
        probability: "48%",
        deteriorations: ["Рост тяжести при совпадении с другими факторами (погода, усталость)"],
      },
      riskModels: ["Bow-Tie", "5 Whys"],
      hypotheses: [
        "Дефицит персонала ведёт к упрощению процедур",
        "Низкая осведомлённость о последствиях сокращения spotter-роли",
      ],
      measures: [
        "Усилить контроль соблюдения Permit-to-Work",
        "Провести брифинги по культуре «никогда не работать без spotter»",
      ],
      achievedChanges: null,
    },
  },
  {
    date: "27.02.2024",
    name: "Неверные действия экипажа",
    result: "Результат анализа",
    status: "Завершен",
    detail: {
      providedInfo: [
        { label: "Тип инцидента", value: "Ошибка экипажа" },
        { label: "Дата/время", value: "27.02.2024, 06:45" },
        { label: "Подразделение", value: "Летные операции" },
        { label: "Описание", value: "Ошибка при вводе веса в FMS" },
        { label: "Смена", value: "Ночная (00:00-08:00)" },
        { label: "Позиции", value: "КВС, Второй пилот" },
        { label: "Критичность", value: "2 - Высокий" },
        { label: "Бизнес-процесс", value: "Предполётная подготовка" },
      ],
      causalRelationships: [
        "Усталость в ночной смене → Снижение внимания → Ошибка ввода",
        "Недостаточный cross-check → Пропуск неверного значения",
        "Скрытый фактор: высокая загрузка экипажа в предыдущие дни",
      ],
      hfComponents: ["Управление усталостью и графиками (FRMS)", "Коммуникации: брифинги/дебрифы", "SOP/чек-листы"],
      costEstimate: { incident: "≈ 85 000 ₽ (пересчёт, задержка вылета)", annual: "≈ 1,5 млн ₽" },
      recurrence: {
        probability: "55%",
        deteriorations: ["Риск выхода за пределы центровки при повторении", "Недопустимая нагрузка на конструкцию"],
      },
      riskModels: ["HFACS", "FRAM", "Bow-Tie"],
      hypotheses: [
        "Нарушение лимитов FRMS повышает риск ошибок в ночных сменах",
        "Процедура cross-check не всегда выполняется при нехватке времени",
      ],
      measures: [
        "Аудит соблюдения FRMS и лимитов усталости",
        "Усилить процедуру проверки веса и центровки (двойной ввод)",
      ],
      achievedChanges: "Информация об изменениях отсутствует.",
    },
  },
  {
    date: "26.02.2024",
    name: "Задержка рейса SY-2407",
    result: "Результат анализа",
    status: "Завершен",
    detail: {
      providedInfo: [
        { label: "Тип инцидента", value: "Задержка" },
        { label: "Дата/время", value: "26.02.2024, 09:07" },
        { label: "Подразделение", value: "Оперативное управление полетами" },
        { label: "Описание", value: "Задержка 3ч 15м, Варязиск → Солнечск" },
        { label: "Метрики", value: "Задержки рейсов (мин)" },
        { label: "Критичность", value: "2 - Высокий" },
        { label: "Смена", value: "Утренняя" },
        { label: "Связанные инциденты", value: "INC-2024-003, INC-2024-009, INC-2024-011" },
      ],
      causalRelationships: [
        "Нехватка персонала ATC ↔ Коммуникационные задержки (r=0,84)",
        "Усталость экипажа ↔ Процедурные ошибки (r=0,76)",
        "Скрытый фактор: метеоусловия и дефицит слотов de-icing",
      ],
      hfComponents: ["Управление усталостью (FRMS)", "Коммуникации", "Планирование работ", "SLA наземных служб"],
      costEstimate: { incident: "≈ 320 000 ₽ (компенсации, топливо, слоты)", annual: "≈ 8,5 млн ₽ при 27 подобных задержек" },
      recurrence: {
        probability: "72% в сезон de-icing",
        deteriorations: ["Риск переработки экипажа", "Потеря слотов", "Снижение NPS"],
      },
      riskModels: ["Bow-Tie", "Fishbone", "Корреляционный анализ"],
      hypotheses: [
        "Комплексный эффект: ATC + метео + de-icing создаёт каскад задержек",
        "Недостаточная заблаговременность планирования при неблагоприятной погоде",
      ],
      measures: [
        "Увеличить штат ATC в пиковые периоды",
        "Внедрить мониторинг стресса персонала",
        "Оптимизировать очередь de-icing и slot-swap",
      ],
      achievedChanges: "Согласовано увеличение смен ATC на 2 чел. с 01.04.2024. Пилотный мониторинг стресса запущен.",
    },
  },
  {
    date: "25.02.2024",
    name: "Рассинхрон регистрации и загрузки",
    result: "Результат анализа",
    status: "Завершен",
    detail: {
      providedInfo: [
        { label: "Тип инцидента", value: "Простой" },
        { label: "Дата/время", value: "25.02.2024, 16:22" },
        { label: "Подразделение", value: "Обработка багажа" },
        { label: "Описание", value: "Расхождение данных DCS и системы загрузки багажа" },
        { label: "Затронутые системы", value: "DCS, Система обработки багажа, Altea" },
        { label: "Бизнес-процесс", value: "Обработка багажа" },
        { label: "Критичность", value: "3 - Средний" },
        { label: "Участок", value: "Багажный зал" },
      ],
      causalRelationships: [
        "Задержка обновления DCS → Неверные данные загрузки → Дублирование проверок",
        "Скрытый фактор: низкая надёжность интеграции между системами",
      ],
      hfComponents: ["Качество данных", "Коммуникации между службами", "Управление изменениями (интеграции)"],
      costEstimate: { incident: "≈ 18 000 ₽", annual: "≈ 720 000 ₽" },
      recurrence: {
        probability: "40%",
        deteriorations: ["Риск отправки багажа на неверный рейс при масштабировании сбоя"],
      },
      riskModels: ["STPA", "Fishbone"],
      hypotheses: [
        "Интерфейс DCS — багаж не синхронизируется при высокой нагрузке",
        "Недостаточное обучение работе с ручным вводом при сбоях",
      ],
      measures: [
        "Аудит интеграции DCS и системы багажа",
        "Процедура ручной сверки при расхождении",
      ],
      achievedChanges: "Информация об изменениях отсутствует.",
    },
  },
];

const ASSESSMENT_CATEGORIES = [
  "Техническое обслуживание и инспекции",
  "Эргономика рабочих мест",
  "Мониторинг и управление сигналами",
  "Аварийная готовность и тренировки",
  "Аудиты/инспекции и соответствие ISO/SMS",
  "Качество данных",
  "Управление изменениями",
  "Компетенции, обучение и тренажеры",
  "SOP/чек-листы и соблюдение процедур",
  "Лидерство, ритуалы безопасности и культура обучения",
  "Коммуникации: брифинги/дебрифы",
  "Планирование работ, JSA/TRA и Permit-to-Work",
  "Сменные передачи и хэнд-оффы",
  "RCA/CAPA воркфлоу",
  "Сообщения о событиях и Just Culture",
  "Управление усталостью и графиками (FRMS)",
  "Управление подрядчиками и допусками",
];
const ASSESSMENT_DATA = [
  { reform: 3, significant: 21, minor: 52, none: 22 },
  { reform: 8, significant: 28, minor: 45, none: 17 },
  { reform: 5, significant: 25, minor: 50, none: 18 },
  { reform: 12, significant: 35, minor: 40, none: 11 },
  { reform: 7, significant: 30, minor: 48, none: 13 },
  { reform: 15, significant: 40, minor: 35, none: 8 },
  { reform: 10, significant: 32, minor: 42, none: 14 },
  { reform: 18, significant: 38, minor: 32, none: 10 },
  { reform: 14, significant: 42, minor: 35, none: 7 },
  { reform: 9, significant: 33, minor: 45, none: 11 },
  { reform: 11, significant: 36, minor: 40, none: 12 },
  { reform: 6, significant: 28, minor: 52, none: 12 },
  { reform: 16, significant: 40, minor: 32, none: 10 },
  { reform: 20, significant: 45, minor: 25, none: 8 },
  { reform: 22, significant: 38, minor: 28, none: 10 },
  { reform: 54, significant: 32, minor: 11, none: 2 },
  { reform: 30, significant: 40, minor: 20, none: 10 },
];

export default function RCAPage() {
  const [openSearch, setOpenSearch] = useState(false);
  const [openResults, setOpenResults] = useState(false);
  const [openHistory, setOpenHistory] = useState(false);
  const [expandedHistoryId, setExpandedHistoryId] = useState<number | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [personnelRows, setPersonnelRows] = useState([{ position: "", role: "" }]);
  const [relatedRows, setRelatedRows] = useState([{ number: "", date: "" }]);
  const [files, setFiles] = useState<File[]>([]);
  const [analysisRun, setAnalysisRun] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (analysisRun && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [analysisRun]);

  const removeTag = (t: string) => setTags((p) => p.filter((x) => x !== t));
  const addPersonnel = () => setPersonnelRows((p) => [...p, { position: "", role: "" }]);
  const addRelated = () => setRelatedRows((p) => [...p, { number: "", date: "" }]);
  const runAnalysis = () => {
    setAnalysisRun(true);
  };

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-slate-800">RCA — Root Cause Analysis</h1>

      {/* Плашка: Поиск причинно-следственных связей */}
      <Card>
        <button
          type="button"
          onClick={() => setOpenSearch((v) => !v)}
          className="w-full text-left px-6 py-4 flex items-center justify-between gap-2 hover:bg-slate-50/50 transition-colors rounded-t-xl"
        >
          <span className="font-semibold text-slate-800">Поиск причинно-следственных связей</span>
          <span className={`shrink-0 text-slate-500 transition-transform ${openSearch ? "rotate-180" : ""}`}>▼</span>
        </button>
        {openSearch && (
          <CardBody className="pt-0 border-t border-[var(--border)]">
            <p className="text-slate-600 text-sm mb-4">
              Заполните данные для проведения анализа и формирования причинно-следственных связей. Для определения связей полезны: смены, нагрузка, доступность инструкций, эскалации, профили сотрудников, исторические данные по задачам.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Описание инцидента */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-700">Описание инцидента</h3>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Тип инцидента</label>
                  <select className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--accent)]">
                    <option value="">Выберите тип</option>
                    {INCIDENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Дата</label>
                    <input type="date" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--accent)]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Время</label>
                    <input type="time" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--accent)]" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Подразделение</label>
                  <select className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--accent)]">
                    <option value="">Выберите подразделение</option>
                    {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Описание проблемы</label>
                  <textarea placeholder="Детальное описание инцидента..." rows={3} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--accent)] resize-y" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Затронутые системы</label>
                  <div className="flex flex-wrap items-center gap-1 border border-slate-300 rounded-lg px-2 py-1.5 min-h-[40px]">
                    {tags.map((t) => (
                      <span key={t} className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 text-xs px-2 py-0.5 rounded">
                        {t}
                        <button type="button" onClick={() => removeTag(t)} className="text-slate-400 hover:text-slate-600">×</button>
                      </span>
                    ))}
                    <select value="" onChange={(e) => { const v = e.target.value; if (v) setTags((p) => [...p, v]); }} className="border-0 py-1 text-sm focus:ring-0 flex-1 min-w-[80px]">
                      <option value="">Добавить...</option>
                      {SYSTEMS.filter((s) => !tags.includes(s)).map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Метрики</label>
                    <select className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--accent)]">
                      <option value="">Выберите метрику</option>
                      {METRICS.map((m) => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Критичность</label>
                    <select className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--accent)]">
                      <option value="">Выберите уровень критичности</option>
                      {CRITICALITY_LEVELS.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Файл инцидента</label>
                  <input type="file" multiple accept=".pdf,.doc,.docx,.csv,.json,.xml,.txt,.jpg,.png" onChange={(e) => e.target.files?.length && setFiles((p) => [...p, ...Array.from(e.target.files!)])} className="block w-full text-sm text-slate-600 file:mr-2 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-sm file:bg-[var(--accent)] file:text-white file:cursor-pointer" />
                  {files.length > 0 && <ul className="mt-1 text-xs text-slate-500">{files.map((f, i) => <li key={i}>{f.name}</li>)}</ul>}
                </div>
              </div>

              {/* Детальная информация, операционные показатели, персонал, связанные инциденты */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-700">Детальная информация</h3>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Бизнес-процессы</label>
                  <select className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--accent)]">
                    <option value="">Выберите бизнес-процессы</option>
                    {BUSINESS_PROCESSES.map((b) => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Поиск информации</label>
                  <select className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--accent)]">
                    <option value="">Выберите программу</option>
                    {PROGRAMS.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>

                <h3 className="text-sm font-semibold text-slate-700 pt-2">Операционные показатели</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-0.5">Подразделение</label>
                    <select className="w-full border border-slate-300 rounded-lg px-2 py-1.5 text-sm">
                      <option value="">Выберите</option>
                      {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-0.5">Смена</label>
                    <select className="w-full border border-slate-300 rounded-lg px-2 py-1.5 text-sm">
                      <option value="">Выберите смену</option>
                      {SHIFTS.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-0.5">Участок деятельности</label>
                    <select className="w-full border border-slate-300 rounded-lg px-2 py-1.5 text-sm">
                      <option value="">Выберите участок</option>
                      {AREAS.map((a) => <option key={a} value={a}>{a}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-0.5">Операция</label>
                    <select className="w-full border border-slate-300 rounded-lg px-2 py-1.5 text-sm">
                      <option value="">Выберите операцию</option>
                      {OPERATIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                </div>

                <h3 className="text-sm font-semibold text-slate-700 pt-2">Данные персонала</h3>
                <div className="grid grid-cols-1 gap-2 mb-2">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-0.5">ФИО</label>
                    <select className="w-full border border-slate-300 rounded-lg px-2 py-1.5 text-sm">
                      <option value="">Выберите сотрудника</option>
                      {EMPLOYEES.map((e) => <option key={e} value={e}>{e}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-0.5">ID номер</label>
                    <select className="w-full border border-slate-300 rounded-lg px-2 py-1.5 text-sm">
                      <option value="">Выберите ID</option>
                      {EMPLOYEE_IDS.map((id) => <option key={id} value={id}>{id}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-0.5">Возможные причины</label>
                    <select className="w-full border border-slate-300 rounded-lg px-2 py-1.5 text-sm">
                      <option value="">Выберите причину</option>
                      {POSSIBLE_CAUSES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                {personnelRows.map((row, i) => (
                  <div key={i} className="flex gap-2 items-end">
                    <div className="flex-1">
                      <label className="block text-xs font-medium text-slate-600 mb-0.5">Позиция</label>
                      <select className="w-full border border-slate-300 rounded-lg px-2 py-1.5 text-sm">
                        <option value="">Выберите</option>
                        {POSITIONS.map((pos) => <option key={pos} value={pos}>{pos}</option>)}
                      </select>
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs font-medium text-slate-600 mb-0.5">Роль в процессе</label>
                      <select className="w-full border border-slate-300 rounded-lg px-2 py-1.5 text-sm">
                        <option value="">Выберите</option>
                        {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </div>
                    {i === personnelRows.length - 1 && (
                      <button type="button" onClick={addPersonnel} className="shrink-0 w-8 h-8 rounded-full bg-[var(--accent)] text-white flex items-center justify-center text-lg leading-none" aria-label="Добавить">+</button>
                    )}
                  </div>
                ))}

                <h3 className="text-sm font-semibold text-slate-700 pt-2">Связанные инциденты</h3>
                {relatedRows.map((row, i) => (
                  <div key={i} className="flex gap-2 items-end">
                    <div className="flex-1">
                      <label className="block text-xs font-medium text-slate-600 mb-0.5">Номер</label>
                      <input type="text" placeholder="Введите" className="w-full border border-slate-300 rounded-lg px-2 py-1.5 text-sm" />
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs font-medium text-slate-600 mb-0.5">Дата</label>
                      <input type="date" className="w-full border border-slate-300 rounded-lg px-2 py-1.5 text-sm" />
                    </div>
                    {i === relatedRows.length - 1 && (
                      <button type="button" onClick={addRelated} className="shrink-0 w-8 h-8 rounded-full bg-[var(--accent)] text-white flex items-center justify-center text-lg leading-none" aria-label="Добавить">+</button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">Загрузка данных</label>
              <label className="flex flex-col items-center justify-center w-full min-h-[120px] border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors py-6 px-4">
                <span className="text-slate-500 text-sm text-center">Перетащите файлы сюда или нажмите для выбора</span>
                <span className="text-slate-400 text-xs mt-1">Поддерживаются: jpg, csv, json, xml, txt, log</span>
                <input type="file" multiple accept=".jpg,.jpeg,.csv,.json,.xml,.txt,.log" className="hidden" onChange={(e) => e.target.files?.length && setFiles((p) => [...p, ...Array.from(e.target.files!)])} />
              </label>
            </div>

            {/* Результат — показывается после нажатия «Запустить анализ», переход сюда по скроллу */}
            {analysisRun && (
              <div ref={resultRef} className="mt-6 pt-6 border-t border-[var(--border)] space-y-4">
                <h3 className="text-base font-semibold text-slate-800">Результат</h3>
                <div className="rounded-lg bg-slate-50 border border-slate-200 p-4 space-y-4 text-sm">
                  <div>
                    <p className="font-medium text-slate-700 mb-1">AI Анализ в реальном времени</p>
                    <p className="text-slate-600">Обнаружена корреляция: Нехватка персонала ATC ↔ Коммуникационные задержки (r = 0.84) | Усталость экипажа ↔ Процедурные ошибки (r = 0.76)</p>
                  </div>
                  <div>
                    <p className="font-medium text-slate-700 mb-1">Аномалия в логах</p>
                    <p className="text-slate-600">Критическая нехватка диспетчеров (−30%), повышенное время реакции экипажа (+65%), сбои в координации служб</p>
                  </div>
                  <div>
                    <p className="font-medium text-slate-700 mb-1">Похожие инциденты</p>
                    <p className="text-slate-600">Найдено 12 схожих случаев с человеческим фактором в аэропортах Варязиск и Солнечск за 6 месяцев</p>
                  </div>
                  <div>
                    <p className="font-medium text-slate-700 mb-1">Анализ человеческого фактора</p>
                    <p className="text-slate-600">Стресс-уровень персонала: ВЫСОКИЙ | Эффективность коммуникации: СНИЖЕНА | Соблюдение процедур: 78% (норма 95%)</p>
                  </div>
                  <div>
                    <p className="font-medium text-slate-700 mb-1">Ключевые выводы</p>
                    <ul className="list-disc list-inside text-slate-600 space-y-0.5">
                      <li>Человеческий фактор становится доминирующим в 78% случаев критических задержек</li>
                      <li>Стресс-уровень персонала значительно влияет на качество координации между службами</li>
                      <li>Усталость экипажа напрямую коррелирует с процедурными ошибками при выполнении операций</li>
                      <li>Нехватка персонала ATC является критическим фактором коммуникационных задержек</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-medium text-slate-700 mb-1">Рекомендации по мониторингу</p>
                    <ul className="list-disc list-inside text-slate-600 space-y-0.5">
                      <li>Создать систему оценки качества коммуникации между службами</li>
                      <li>Реализовать отслеживание времени реакции экипажа на критические ситуации</li>
                      <li>Настроить автоматические уведомления при нехватке персонала ATC &gt; 20%</li>
                      <li>Внедрить систему мониторинга уровня стресса персонала в реальном времени</li>
                    </ul>
                  </div>
                  <div className="pt-2 border-t border-slate-200">
                    <p className="font-medium text-slate-700 mb-1">Отчет о задержке (имитация)</p>
                    <p className="text-slate-600">Рейс SY-2407, Варязиск → Солнечск, 09.07.2025. Задержка 3ч 15м. Первопричина: комплексные факторы (нехватка ATC, усталость экипажа, сбои коммуникации). Рекомендации: увеличить штат ATC, внедрить мониторинг стресса, оптимизировать смены.</p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-3 mt-6 pt-4 border-t border-[var(--border)]">
              <Button onClick={runAnalysis}>Запустить анализ</Button>
              <Button variant="secondary" onClick={() => { setFiles([]); setTags([]); setAnalysisRun(false); }}>Очистить</Button>
            </div>
          </CardBody>
        )}
      </Card>

      {/* Плашка: Результаты — аналитика, Bow-Tie, Оценка изменений, Fishbone (файлы 13, 14, root-cause-assistant) */}
      <Card id="results">
        <button
          type="button"
          onClick={() => setOpenResults((v) => !v)}
          className="w-full text-left px-6 py-4 flex items-center justify-between gap-2 hover:bg-slate-50/50 transition-colors rounded-t-xl"
        >
          <span className="font-semibold text-slate-800">Результаты</span>
          <span className={`shrink-0 text-slate-500 transition-transform ${openResults ? "rotate-180" : ""}`}>▼</span>
        </button>
        {openResults && (
          <CardBody className="pt-0 border-t border-[var(--border)] space-y-6">
            <h3 className="text-base font-semibold text-slate-800">Отчет по инциденту №BBB</h3>
            <p className="text-sm text-slate-600">Human Factor · Root Cause · Рекомендации</p>

            {/* Bow-Tie: Приемлемый/Контролируемый слева, центральное событие, Контролируемый/Неприемлемый справа */}
            <div className="rounded-lg border-2 border-slate-200 bg-slate-50/50 p-4 overflow-x-auto">
              <h4 className="text-sm font-semibold text-slate-700 mb-3">Диаграмма Bow-Tie</h4>
              <div className="flex items-stretch gap-2 min-w-[800px]">
                <div className="flex-1 flex flex-col gap-2">
                  <div className="flex gap-2 text-xs font-medium text-slate-600">
                    <span>Приемлемый</span>
                    <span>Контролируемый</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="px-2 py-1 rounded bg-emerald-700 text-white text-xs">Резервный слот или «старт по готовности» при окне погоды</span>
                    <span className="px-2 py-1 rounded bg-emerald-600 text-white text-xs">Достаточный запас антиобледенительной жидкости</span>
                    <span className="px-2 py-1 rounded bg-emerald-600 text-white text-xs">Очередь на de-icing</span>
                    <span className="px-2 py-1 rounded bg-emerald-600 text-white text-xs">Cross-check по чек-листу</span>
                    <span className="px-2 py-1 rounded bg-emerald-600 text-white text-xs">Поздний приход трапа/техников</span>
                    <span className="px-2 py-1 rounded bg-emerald-600 text-white text-xs">SLA наземных служб</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    <span className="px-2 py-1 rounded bg-amber-200 text-amber-900 text-xs">Неблагоприятные метеоусловия / de-icing на перроне и ВС</span>
                    <span className="px-2 py-1 rounded bg-amber-200 text-amber-900 text-xs">SLA наземных служб</span>
                  </div>
                </div>
                <div className="shrink-0 flex items-center">
                  <div className="px-4 py-3 rounded-lg border-2 border-emerald-500 bg-amber-200 text-amber-900 font-semibold text-sm text-center whitespace-nowrap">
                    Задержка вылета &gt;30 мин
                  </div>
                </div>
                <div className="flex-1 flex flex-col gap-2 text-right">
                  <div className="flex gap-2 text-xs font-medium text-slate-600 justify-end">
                    <span>Контролируемый</span>
                    <span>Неприемлемый</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 justify-end">
                    <span className="px-2 py-1 rounded bg-amber-200 text-amber-900 text-xs">Приоритизация руления / slot-swap</span>
                    <span className="px-2 py-1 rounded bg-amber-200 text-amber-900 text-xs">Информирование пассажиров/экипажа</span>
                    <span className="px-2 py-1 rounded bg-amber-200 text-amber-900 text-xs">Информирование и пересбор смен</span>
                    <span className="px-2 py-1 rounded bg-amber-200 text-amber-900 text-xs">Перезагрузка плана смен, пересбор смен</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 justify-end mt-1">
                    <span className="px-2 py-1 rounded bg-red-600 text-white text-xs">Штрафы или риск потери слота</span>
                    <span className="px-2 py-1 rounded bg-red-600 text-white text-xs">Пропущенные стыковки</span>
                    <span className="px-2 py-1 rounded bg-red-600 text-white text-xs">Переработка экипажа. Выход за норму. Нужен резерв</span>
                    <span className="px-2 py-1 rounded bg-red-600 text-white text-xs">Снижение NPS пассажиров</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Оценка необходимости изменений — полный набор категорий + легенда */}
            <div className="rounded-lg border border-slate-200 p-4 overflow-x-auto">
              <h4 className="text-sm font-semibold text-slate-700 mb-3">Оценка необходимости изменений</h4>
              <div className="flex gap-3 mb-3 flex-wrap text-xs">
                <span className="inline-flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-slate-600 shrink-0" /> Нужно реформировать</span>
                <span className="inline-flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-slate-400 shrink-0" /> Нужны существенные изменения</span>
                <span className="inline-flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-emerald-300 shrink-0" /> Нужна небольшая корректировка</span>
                <span className="inline-flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-emerald-600 shrink-0" /> Не нужны изменения</span>
              </div>
              <div className="space-y-2 min-w-[600px]">
                {ASSESSMENT_CATEGORIES.map((cat, i) => {
                  const d = ASSESSMENT_DATA[i];
                  const total = d.reform + d.significant + d.minor + d.none;
                  return (
                    <div key={i} className="flex items-center gap-3">
                      <span className="w-56 text-xs text-slate-700 shrink-0 truncate" title={cat}>{cat}</span>
                      <div className="flex-1 h-6 flex rounded overflow-hidden bg-slate-100 min-w-[200px]">
                        {d.reform > 0 && <div className="bg-slate-600 flex items-center justify-center text-[10px] text-white font-medium" style={{ width: `${(d.reform / total) * 100}%`, minWidth: d.reform > 0 ? "18px" : 0 }} title={`Реформировать ${d.reform}%`}>{d.reform}</div>}
                        {d.significant > 0 && <div className="bg-slate-400 flex items-center justify-center text-[10px] text-white" style={{ width: `${(d.significant / total) * 100}%`, minWidth: d.significant > 0 ? "18px" : 0 }}>{d.significant}</div>}
                        {d.minor > 0 && <div className="bg-emerald-300 flex items-center justify-center text-[10px] text-slate-800" style={{ width: `${(d.minor / total) * 100}%`, minWidth: d.minor > 0 ? "18px" : 0 }}>{d.minor}</div>}
                        {d.none > 0 && <div className="bg-emerald-600 flex items-center justify-center text-[10px] text-white" style={{ width: `${(d.none / total) * 100}%`, minWidth: d.none > 0 ? "18px" : 0 }}>{d.none}</div>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Fishbone (Ишикава): хребет + 6 костей с подпричинами, всё видно по направлениям */}
            <div className="rounded-lg border border-slate-200 p-4 overflow-x-auto">
              <h4 className="text-sm font-semibold text-slate-700 mb-3">Причинно-следственная связь инцидента (Fishbone)</h4>
              <div className="relative min-w-[920px] flex flex-col gap-0" style={{ height: 320 }}>
                {/* Верхний ряд: 3 кости */}
                <div className="flex justify-between gap-2 px-2" style={{ height: 120 }}>
                  {[
                    { label: "Окружение", items: ["плохое освещение", "неблагоприятные погодные условия", "скользкое покрытие"] },
                    { label: "Материалы", items: ["редкие конусы", "отсутствуют барьеры"] },
                    { label: "Процесс", items: ["отсутствие «пешеходных окон»", "отсутствие spotter-ролей", "работа в пики"] },
                  ].map((b, i) => (
                    <div key={i} className="flex flex-col items-center flex-1 max-w-[220px]">
                      <div className="rounded border border-slate-300 bg-white px-2 py-1.5 shadow-sm w-full">
                        <p className="font-semibold text-slate-700 text-xs text-center">{b.label}</p>
                        <ul className="text-[10px] text-slate-600 mt-0.5 space-y-0.5 list-disc list-inside">
                          {b.items.map((item, j) => (
                            <li key={j}>{item}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="w-0.5 flex-1 bg-slate-500 min-h-[20px]" style={{ transform: "rotate(-20deg)", transformOrigin: "top center" }} />
                    </div>
                  ))}
                </div>
                {/* Хребет + подпись Причины + Эффект */}
                <div className="flex items-center gap-2 px-0 flex-shrink-0 h-8">
                  <span className="text-[10px] text-slate-500 w-12 shrink-0">Причины</span>
                  <div className="flex-1 h-0.5 bg-slate-500" />
                  <div className="px-3 py-1.5 rounded bg-slate-700 text-white text-xs font-semibold shrink-0">Почти-столкновение / наезд</div>
                </div>
                {/* Нижний ряд: 3 кости */}
                <div className="flex justify-between gap-2 px-2 flex-1 min-h-[120px]">
                  {[
                    { label: "Люди", items: ["спешка из-за SLA", "язык/коммуникации в смешанных бригадах"] },
                    { label: "ПО", items: ["нет geo-alerts на карте склада"] },
                    { label: "Машины", items: ["нерабочие звуковые сигналы", "изношенные тормоза"] },
                  ].map((b, i) => (
                    <div key={i} className="flex flex-col items-center flex-1 max-w-[220px]">
                      <div className="w-0.5 flex-1 bg-slate-500 min-h-[20px] shrink-0" style={{ transform: "rotate(20deg)", transformOrigin: "bottom center" }} />
                      <div className="rounded border border-slate-300 bg-white px-2 py-1.5 shadow-sm w-full mt-1">
                        <p className="font-semibold text-slate-700 text-xs text-center">{b.label}</p>
                        <ul className="text-[10px] text-slate-600 mt-0.5 space-y-0.5 list-disc list-inside">
                          {b.items.map((item, j) => (
                            <li key={j}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-500">
              Для полного отчёта запустите анализ в блоке «Поиск причинно-следственных связей» и сформируйте отчёт по данным инцидента.
            </p>
          </CardBody>
        )}
      </Card>

      {/* Плашка: История */}
      <Card>
        <button
          type="button"
          onClick={() => setOpenHistory((v) => !v)}
          className="w-full text-left px-6 py-4 flex items-center justify-between gap-2 hover:bg-slate-50/50 transition-colors rounded-t-xl"
        >
          <span className="font-semibold text-slate-800">История</span>
          <span className={`shrink-0 text-slate-500 transition-transform ${openHistory ? "rotate-180" : ""}`}>▼</span>
        </button>
        {openHistory && (
          <CardBody className="pt-0 border-t border-[var(--border)]">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">История запросов</h3>
            <p className="text-xs text-slate-500 mb-3">Нажмите на строку для просмотра деталей анализа</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="text-left p-3 font-medium text-slate-700 w-8" />
                    <th className="text-left p-3 font-medium text-slate-700">Дата запроса</th>
                    <th className="text-left p-3 font-medium text-slate-700">Название инцидента</th>
                    <th className="text-left p-3 font-medium text-slate-700">Результат</th>
                    <th className="text-left p-3 font-medium text-slate-700">Статус</th>
                    <th className="w-20 p-3" />
                  </tr>
                </thead>
                <tbody>
                  {HISTORY_ROWS.map((row, i) => {
                    const isExpanded = expandedHistoryId === i;
                    return (
                      <Fragment key={i}>
                        <tr
                          key={i}
                          onClick={() => setExpandedHistoryId(isExpanded ? null : i)}
                          className={`border-b border-slate-100 cursor-pointer transition-colors ${isExpanded ? "bg-slate-100" : "hover:bg-slate-50/50"}`}
                        >
                          <td className="p-2">
                            <span className={`inline-block transition-transform ${isExpanded ? "rotate-90" : ""}`}>▶</span>
                          </td>
                          <td className="p-3 text-slate-700">{row.date}</td>
                          <td className="p-3 text-slate-700 font-medium">{row.name}</td>
                          <td className="p-3 text-slate-600">{row.result}</td>
                          <td className="p-3">
                            <Badge variant="default">{row.status}</Badge>
                          </td>
                          <td className="p-2 flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                            <button type="button" className="p-1.5 rounded text-slate-500 hover:bg-slate-200 hover:text-slate-700" title="Просмотр">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                            </button>
                            <button type="button" className="p-1.5 rounded text-slate-500 hover:bg-slate-200 hover:text-slate-700" title="Скачать">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                            </button>
                          </td>
                        </tr>
                        {isExpanded && (
                          <tr key={`${i}-detail`}>
                            <td colSpan={6} className="p-0 bg-slate-50">
                              <div className="p-6 space-y-6 text-sm">
                                <h4 className="font-semibold text-slate-800 text-base">{row.name} — детали анализа</h4>

                                <div>
                                  <h5 className="font-medium text-slate-700 mb-2">Предоставленная информация</h5>
                                  <dl className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600">
                                    {row.detail.providedInfo.map((item, j) => (
                                      <div key={j} className="flex gap-2">
                                        <dt className="font-medium text-slate-600 shrink-0">{item.label}:</dt>
                                        <dd>{item.value}</dd>
                                      </div>
                                    ))}
                                  </dl>
                                </div>

                                <div>
                                  <h5 className="font-medium text-slate-700 mb-2">Причинно-следственные связи и скрытые факторы</h5>
                                  <ul className="list-disc list-inside text-slate-600 space-y-1">
                                    {row.detail.causalRelationships.map((c, j) => (
                                      <li key={j}>{c}</li>
                                    ))}
                                  </ul>
                                </div>

                                <div>
                                  <h5 className="font-medium text-slate-700 mb-2">Компоненты HF, задействованные в инциденте</h5>
                                  <div className="flex flex-wrap gap-1.5">
                                    {row.detail.hfComponents.map((c, j) => (
                                      <Badge key={j} variant="risk-low">{c}</Badge>
                                    ))}
                                  </div>
                                </div>

                                <div>
                                  <h5 className="font-medium text-slate-700 mb-2">Оценка стоимости</h5>
                                  <div className="text-slate-600 space-y-1">
                                    <p><strong>Инцидент:</strong> {row.detail.costEstimate.incident}</p>
                                    <p><strong>Годовая оценка</strong> (при повторении): {row.detail.costEstimate.annual}</p>
                                  </div>
                                </div>

                                <div>
                                  <h5 className="font-medium text-slate-700 mb-2">Вероятность повторения без мер и возможные ухудшения</h5>
                                  <p className="text-slate-600 mb-1"><strong>Вероятность:</strong> {row.detail.recurrence.probability}</p>
                                  <ul className="list-disc list-inside text-slate-600">
                                    {row.detail.recurrence.deteriorations.map((d, j) => (
                                      <li key={j}>{d}</li>
                                    ))}
                                  </ul>
                                </div>

                                <div>
                                  <h5 className="font-medium text-slate-700 mb-2">Применённые риск-модели для поиска</h5>
                                  <div className="flex flex-wrap gap-1.5">
                                    {row.detail.riskModels.map((m, j) => (
                                      <span key={j} className="px-2 py-0.5 rounded bg-slate-200 text-slate-700 text-xs">{m}</span>
                                    ))}
                                  </div>
                                </div>

                                <div>
                                  <h5 className="font-medium text-slate-700 mb-2">Разработанные гипотезы для проверки</h5>
                                  <ul className="list-disc list-inside text-slate-600 space-y-1">
                                    {row.detail.hypotheses.map((h, j) => (
                                      <li key={j}>{h}</li>
                                    ))}
                                  </ul>
                                </div>

                                <div>
                                  <h5 className="font-medium text-slate-700 mb-2">Возможные мероприятия для исключения повторения</h5>
                                  <ul className="list-disc list-inside text-slate-600 space-y-1">
                                    {row.detail.measures.map((m, j) => (
                                      <li key={j}>{m}</li>
                                    ))}
                                  </ul>
                                </div>

                                <div>
                                  <h5 className="font-medium text-slate-700 mb-2">Достигнутые изменения</h5>
                                  <p className={`text-slate-600 ${row.detail.achievedChanges ? "" : "italic text-slate-500"}`}>
                                    {row.detail.achievedChanges ?? "Информация об изменениях отсутствует."}
                                  </p>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="flex justify-center gap-1 p-2 mt-2">
              {[1, 2].map((n) => (
                <button key={n} type="button" className={`w-8 h-8 rounded text-sm ${n === 1 ? "bg-[var(--accent)] text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>{n}</button>
              ))}
            </div>
          </CardBody>
        )}
      </Card>
    </div>
  );
}
