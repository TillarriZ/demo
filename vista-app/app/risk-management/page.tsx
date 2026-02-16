"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";

type RiskRow = {
  id: string;
  num: number;
  name: string;
  riskNumber: string;
  status: string;
  businessProcess: string;
  processGoal: string;
  riskFactor: string;
  impact: string;
  likelihood: string;
  consequences: string;
  costImpact: string;
  owner: string;
  relations: string;
  measures: string;
  initialRisk: number;
  residualRisk: number;
  dateModified: string;
  dateCreated: string;
};

const MOCK_RISKS: RiskRow[] = [
  {
    id: "1",
    num: 1,
    name: "Нехватка персонала ATC",
    riskNumber: "R-HF-001",
    status: "Активен",
    businessProcess: "Управление воздушным движением",
    processGoal: "Безопасность и регулярность полётов",
    riskFactor: "Человеческий фактор, укомплектованность",
    impact: "Высокий",
    likelihood: "Вероятно",
    consequences: "Задержки, рост нагрузки на диспетчеров",
    costImpact: "85 000",
    owner: "Начальник Диспетчерской службы",
    relations: "R-HF-002, R-HF-005",
    measures: "Ротация, мониторинг усталости, резерв",
    initialRisk: 72,
    residualRisk: 35,
    dateModified: "10.02.2025",
    dateCreated: "15.01.2024",
  },
  {
    id: "2",
    num: 2,
    name: "Усталость экипажа",
    riskNumber: "R-HF-002",
    status: "Активен",
    businessProcess: "Выполнение полетов",
    processGoal: "Безопасность полётов",
    riskFactor: "FRMS, графики смен",
    impact: "Критический",
    likelihood: "Редко",
    consequences: "Ошибки, процедурные нарушения",
    costImpact: "120 000",
    owner: "Начальник Летных операций",
    relations: "R-HF-001, R-HF-003",
    measures: "FRMS, лимиты полётов, тренажёры",
    initialRisk: 65,
    residualRisk: 28,
    dateModified: "08.02.2025",
    dateCreated: "20.02.2024",
  },
  {
    id: "3",
    num: 3,
    name: "Сбои коммуникации между службами",
    riskNumber: "R-HF-003",
    status: "В мониторинге",
    businessProcess: "Оперативное управление полетами",
    processGoal: "Своевременность вылетов",
    riskFactor: "Координация, инструменты",
    impact: "Средний",
    likelihood: "Иногда",
    consequences: "Задержки, дублирование запросов",
    costImpact: "45 000",
    owner: "OCC",
    relations: "R-HF-001",
    measures: "Единый канал, AI-ассистент",
    initialRisk: 48,
    residualRisk: 22,
    dateModified: "05.02.2025",
    dateCreated: "10.03.2024",
  },
  {
    id: "4",
    num: 4,
    name: "Недостаточная квалификация наземного персонала",
    riskNumber: "R-HF-004",
    status: "Активен",
    businessProcess: "Наземное обслуживание ВС",
    processGoal: "Своевременность и качество обслуживания",
    riskFactor: "Обучение, ротация",
    impact: "Средний",
    likelihood: "Иногда",
    consequences: "Ошибки при заправке, погрузке, задержки",
    costImpact: "62 000",
    owner: "Начальник наземной службы",
    relations: "R-HF-003, R-HF-007",
    measures: "АТТ, тренажёры, наставничество",
    initialRisk: 42,
    residualRisk: 20,
    dateModified: "01.02.2025",
    dateCreated: "05.04.2024",
  },
  {
    id: "5",
    num: 5,
    name: "Нарушение процедур безопасности при заправке",
    riskNumber: "R-HF-005",
    status: "Активен",
    businessProcess: "Управление авиатопливом",
    processGoal: "Безопасность и учёт топлива",
    riskFactor: "Человеческий фактор, контроль",
    impact: "Высокий",
    likelihood: "Редко",
    consequences: "Разлив, пожар, травмы",
    costImpact: "180 000",
    owner: "Ответственный за топливо",
    relations: "R-HF-001, R-HF-004",
    measures: "Чек-листы, контроль доступа, обучение",
    initialRisk: 56,
    residualRisk: 28,
    dateModified: "09.02.2025",
    dateCreated: "12.04.2024",
  },
  {
    id: "6",
    num: 6,
    name: "Ошибки при вводе данных в системы планирования",
    riskNumber: "R-HF-006",
    status: "В мониторинге",
    businessProcess: "Оперативное управление полетами",
    processGoal: "Корректность расписания и слотов",
    riskFactor: "Внимательность, интерфейсы",
    impact: "Средний",
    likelihood: "Иногда",
    consequences: "Задержки, дубли рейсов, неверные слоты",
    costImpact: "38 000",
    owner: "OCC",
    relations: "R-HF-003",
    measures: "Валидация, обучение, двойной ввод",
    initialRisk: 35,
    residualRisk: 18,
    dateModified: "07.02.2025",
    dateCreated: "18.05.2024",
  },
  {
    id: "7",
    num: 7,
    name: "Усталость диспетчеров в ночную смену",
    riskNumber: "R-HF-007",
    status: "Активен",
    businessProcess: "Управление воздушным движением",
    processGoal: "Безопасность и регулярность",
    riskFactor: "FRMS, графики",
    impact: "Критический",
    likelihood: "Редко",
    consequences: "Ошибки управления, конфликты эшелонов",
    costImpact: "250 000",
    owner: "Начальник Диспетчерской службы",
    relations: "R-HF-001, R-HF-004",
    measures: "Лимиты смен, мониторинг, ротация",
    initialRisk: 70,
    residualRisk: 32,
    dateModified: "11.02.2025",
    dateCreated: "22.05.2024",
  },
  {
    id: "8",
    num: 8,
    name: "Несвоевременная передача смены экипажами",
    riskNumber: "R-HF-008",
    status: "Активен",
    businessProcess: "Выполнение полетов",
    processGoal: "Безопасность полётов",
    riskFactor: "Коммуникация, чек-листы",
    impact: "Высокий",
    likelihood: "Иногда",
    consequences: "Пропуск данных, ошибки в полёте",
    costImpact: "95 000",
    owner: "Начальник Летных операций",
    relations: "R-HF-002",
    measures: "Стандартизация брифингов, чек-листы",
    initialRisk: 50,
    residualRisk: 24,
    dateModified: "04.02.2025",
    dateCreated: "01.06.2024",
  },
  {
    id: "9",
    num: 9,
    name: "Недостаток информации при принятии решений диспетчером",
    riskNumber: "R-HF-009",
    status: "В мониторинге",
    businessProcess: "Управление воздушным движением",
    processGoal: "Безопасность движения",
    riskFactor: "Информационные системы, обучение",
    impact: "Средний",
    likelihood: "Иногда",
    consequences: "Задержки, неоптимальные маршруты",
    costImpact: "52 000",
    owner: "Начальник Диспетчерской службы",
    relations: "R-HF-001, R-HF-003",
    measures: "Обучение, улучшение интерфейсов",
    initialRisk: 40,
    residualRisk: 22,
    dateModified: "06.02.2025",
    dateCreated: "10.06.2024",
  },
  {
    id: "10",
    num: 10,
    name: "Самонадеянность при выполнении рутинных операций",
    riskNumber: "R-HF-010",
    status: "Активен",
    businessProcess: "Техническое обслуживание ВС",
    processGoal: "Надёжность и сроки ТО",
    riskFactor: "Культура безопасности",
    impact: "Высокий",
    likelihood: "Иногда",
    consequences: "Пропуск шагов, дефекты",
    costImpact: "78 000",
    owner: "Начальник ТО",
    relations: "R-HF-004",
    measures: "Чек-листы, аудиты, Just Culture",
    initialRisk: 48,
    residualRisk: 26,
    dateModified: "08.02.2025",
    dateCreated: "15.07.2024",
  },
  {
    id: "11",
    num: 11,
    name: "Давление со стороны руководства на сокращение времени обслуживания",
    riskNumber: "R-HF-011",
    status: "Активен",
    businessProcess: "Наземное обслуживание ВС",
    processGoal: "Регулярность вылетов",
    riskFactor: "Организационная культура",
    impact: "Высокий",
    likelihood: "Вероятно",
    consequences: "Нарушения процедур, ошибки",
    costImpact: "88 000",
    owner: "Начальник наземной службы",
    relations: "R-HF-004, R-HF-005",
    measures: "KPI по безопасности, отчётность",
    initialRisk: 55,
    residualRisk: 30,
    dateModified: "12.02.2025",
    dateCreated: "20.08.2024",
  },
  {
    id: "12",
    num: 12,
    name: "Пробелы в знаниях при работе с новым оборудованием",
    riskNumber: "R-HF-012",
    status: "В мониторинге",
    businessProcess: "Наземное обслуживание ВС",
    processGoal: "Качество обслуживания",
    riskFactor: "Обучение, изменения",
    impact: "Средний",
    likelihood: "Иногда",
    consequences: "Поломки, задержки, травмы",
    costImpact: "44 000",
    owner: "Начальник наземной службы",
    relations: "R-HF-004",
    measures: "Обучение, инструкции, тренажёры",
    initialRisk: 36,
    residualRisk: 19,
    dateModified: "03.02.2025",
    dateCreated: "01.09.2024",
  },
  {
    id: "13",
    num: 13,
    name: "Слепые зоны культуры при расследовании инцидентов",
    riskNumber: "R-HF-013",
    status: "Активен",
    businessProcess: "Авиационная безопасность",
    processGoal: "Снижение повторений",
    riskFactor: "Just Culture, отчётность",
    impact: "Средний",
    likelihood: "Вероятно",
    consequences: "Сокрытие, неполные отчёты",
    costImpact: "58 000",
    owner: "Руководитель по безопасности",
    relations: "R-HF-010",
    measures: "Анонимные каналы, обучение",
    initialRisk: 45,
    residualRisk: 24,
    dateModified: "05.02.2025",
    dateCreated: "10.10.2024",
  },
  {
    id: "14",
    num: 14,
    name: "Неверные решения при нестандартных ситуациях",
    riskNumber: "R-HF-014",
    status: "Активен",
    businessProcess: "Выполнение полетов",
    processGoal: "Безопасность полётов",
    riskFactor: "Опыт, тренажёры, процедуры",
    impact: "Критический",
    likelihood: "Редко",
    consequences: "Инциденты, аварии",
    costImpact: "320 000",
    owner: "Начальник Летных операций",
    relations: "R-HF-002, R-HF-008",
    measures: "CRM, симуляторы, сценарии",
    initialRisk: 68,
    residualRisk: 35,
    dateModified: "09.02.2025",
    dateCreated: "15.11.2024",
  },
  {
    id: "15",
    num: 15,
    name: "Низкая доля добровольных сообщений об ошибках",
    riskNumber: "R-HF-015",
    status: "В мониторинге",
    businessProcess: "Авиационная безопасность",
    processGoal: "Раннее выявление рисков",
    riskFactor: "Just Culture, доверие",
    impact: "Средний",
    likelihood: "Вероятно",
    consequences: "Позднее выявление, повторения",
    costImpact: "41 000",
    owner: "Руководитель по безопасности",
    relations: "R-HF-013",
    measures: "Кампании, анонимность, разбор без наказания",
    initialRisk: 42,
    residualRisk: 22,
    dateModified: "11.02.2025",
    dateCreated: "01.12.2024",
  },
];

export default function RiskManagementPage() {
  const [selected, setSelected] = useState<RiskRow | null>(null);
  const [showModal, setShowModal] = useState(false);

  const openDetail = (row: RiskRow) => {
    setSelected(row);
    setShowModal(true);
  };

  return (
    <div className="space-y-4 w-full max-w-[100%]">
      <h1 className="text-lg font-bold text-slate-800">Реестр рисков</h1>

      <div className="overflow-x-auto w-full border border-slate-200 rounded-lg bg-white">
        <table className="w-full text-xs" style={{ minWidth: "960px" }}>
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="text-left py-2 px-1.5 font-semibold text-slate-700 text-[10px] leading-tight break-words whitespace-normal align-top w-8 min-w-[32px]">№</th>
              <th className="text-left py-2 px-1.5 font-semibold text-slate-700 text-[10px] leading-tight break-words whitespace-normal align-top min-w-[100px]">Название риска</th>
              <th className="text-left py-2 px-1.5 font-semibold text-slate-700 text-[10px] leading-tight break-words whitespace-normal align-top min-w-[72px]">Номер риска</th>
              <th className="text-left py-2 px-1.5 font-semibold text-slate-700 text-[10px] leading-tight break-words whitespace-normal align-top min-w-[52px]">Статус</th>
              <th className="text-left py-2 px-1.5 font-semibold text-slate-700 text-[10px] leading-tight break-words whitespace-normal align-top min-w-[90px]">Бизнес-процесс</th>
              <th className="text-left py-2 px-1.5 font-semibold text-slate-700 text-[10px] leading-tight break-words whitespace-normal align-top min-w-[90px]">Цель бизнес-процесса</th>
              <th className="text-left py-2 px-1.5 font-semibold text-slate-700 text-[10px] leading-tight break-words whitespace-normal align-top min-w-[70px]">Риск-фактор</th>
              <th className="text-left py-2 px-1.5 font-semibold text-slate-700 text-[10px] leading-tight break-words whitespace-normal align-top min-w-[56px]">Влияние</th>
              <th className="text-left py-2 px-1.5 font-semibold text-slate-700 text-[10px] leading-tight break-words whitespace-normal align-top min-w-[68px]">Вероятность</th>
              <th className="text-left py-2 px-1.5 font-semibold text-slate-700 text-[10px] leading-tight break-words whitespace-normal align-top min-w-[80px]">Последствия</th>
              <th className="text-left py-2 px-1.5 font-semibold text-slate-700 text-[10px] leading-tight break-words whitespace-normal align-top min-w-[72px]">Стоимость воздействия</th>
              <th className="text-left py-2 px-1.5 font-semibold text-slate-700 text-[10px] leading-tight break-words whitespace-normal align-top min-w-[80px]">Владелец риска</th>
              <th className="text-left py-2 px-1.5 font-semibold text-slate-700 text-[10px] leading-tight break-words whitespace-normal align-top min-w-[72px]">Мероприятия</th>
              <th className="text-left py-2 px-1.5 font-semibold text-slate-700 text-[10px] leading-tight break-words whitespace-normal align-top min-w-[72px]">Первонач. риск %</th>
              <th className="text-left py-2 px-1.5 font-semibold text-slate-700 text-[10px] leading-tight break-words whitespace-normal align-top min-w-[72px]">Остаточ. риск %</th>
              <th className="text-left py-2 px-1.5 font-semibold text-slate-700 text-[10px] leading-tight break-words whitespace-normal align-top min-w-[64px]">Дата созд.</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_RISKS.map((row) => (
              <tr
                key={row.id}
                className="border-b border-slate-100 hover:bg-slate-50/80 cursor-pointer"
                onClick={() => openDetail(row)}
              >
                <td className="py-1.5 px-1.5 text-slate-700 text-[11px] align-top">{row.num}</td>
                <td className="py-1.5 px-1.5 text-slate-700 font-medium text-[11px] leading-tight break-words whitespace-normal align-top" title={row.name}>{row.name}</td>
                <td className="py-1.5 px-1.5 text-slate-600 text-[11px] break-words align-top">{row.riskNumber}</td>
                <td className="py-1.5 px-1.5 align-top">
                  <span className={`px-1.5 py-0.5 rounded text-[10px] ${row.status === "Активен" ? "bg-amber-100 text-amber-800" : "bg-slate-100 text-slate-700"}`}>
                    {row.status}
                  </span>
                </td>
                <td className="py-1.5 px-1.5 text-slate-600 text-[11px] leading-tight break-words whitespace-normal align-top" title={row.businessProcess}>{row.businessProcess}</td>
                <td className="py-1.5 px-1.5 text-slate-600 text-[11px] leading-tight break-words whitespace-normal align-top" title={row.processGoal}>{row.processGoal}</td>
                <td className="py-1.5 px-1.5 text-slate-600 text-[11px] leading-tight break-words whitespace-normal align-top" title={row.riskFactor}>{row.riskFactor}</td>
                <td className="py-1.5 px-1.5 text-slate-700 text-[11px] align-top">{row.impact}</td>
                <td className="py-1.5 px-1.5 text-slate-700 text-[11px] align-top">{row.likelihood}</td>
                <td className="py-1.5 px-1.5 text-slate-600 text-[11px] leading-tight break-words whitespace-normal align-top" title={row.consequences}>{row.consequences}</td>
                <td className="py-1.5 px-1.5 text-slate-700 text-[11px] align-top">{row.costImpact}</td>
                <td className="py-1.5 px-1.5 text-slate-600 text-[11px] leading-tight break-words whitespace-normal align-top" title={row.owner}>{row.owner}</td>
                <td className="py-1.5 px-1.5 text-slate-600 text-[11px] leading-tight break-words whitespace-normal align-top" title={row.measures}>{row.measures}</td>
                <td className="py-1.5 px-1.5 text-slate-700 text-[11px] align-top">{row.initialRisk}</td>
                <td className="py-1.5 px-1.5 text-slate-700 text-[11px] align-top">{row.residualRisk}</td>
                <td className="py-1.5 px-1.5 text-slate-500 text-[11px] align-top">{row.dateCreated}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-[10px] text-slate-500">Для просмотра деталей нажмите на строку.</p>

      {/* Детальная информация о риске (модальное окно) */}
      {showModal && selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={() => setShowModal(false)}>
          <div
            className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-5 text-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-base font-semibold text-slate-800">Детальная информация о риске</h3>
              <button
                type="button"
                className="text-slate-400 hover:text-slate-600 text-xl leading-none"
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-slate-500 text-xs mb-0.5">Название</p>
                <p className="font-medium text-slate-800">{selected.name}</p>
              </div>
              <div>
                <p className="text-slate-500 text-xs mb-0.5">Номер риска</p>
                <p className="text-slate-700">{selected.riskNumber}</p>
              </div>
              <div>
                <p className="text-slate-500 text-xs mb-0.5">Дата создания</p>
                <p className="text-slate-700">{selected.dateCreated}</p>
              </div>
              <div>
                <p className="text-slate-500 text-xs mb-0.5">Дата изменения</p>
                <p className="text-slate-700">{selected.dateModified}</p>
              </div>
            </div>
            <h4 className="text-sm font-semibold text-slate-700 mt-4 mb-2">Оценка риска</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
              <div><p className="text-slate-500 text-xs">Статус</p><p className="text-slate-700">{selected.status}</p></div>
              <div><p className="text-slate-500 text-xs">Критичность</p><p className="text-slate-700">{selected.impact}</p></div>
              <div><p className="text-slate-500 text-xs">Влияние</p><p className="text-slate-700">{selected.impact}</p></div>
              <div><p className="text-slate-500 text-xs">Вероятность</p><p className="text-slate-700">{selected.likelihood}</p></div>
              <div><p className="text-slate-500 text-xs">Первоначальный риск %</p><p className="text-slate-700">{selected.initialRisk}</p></div>
              <div><p className="text-slate-500 text-xs">Остаточный риск %</p><p className="text-slate-700">{selected.residualRisk}</p></div>
            </div>
            <h4 className="text-sm font-semibold text-slate-700 mt-4 mb-2">Финансовая информация</h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><p className="text-slate-500 text-xs">Стоимость воздействия</p><p className="text-slate-700">{selected.costImpact}</p></div>
            </div>
            <h4 className="text-sm font-semibold text-slate-700 mt-4 mb-2">Ответственность</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div><p className="text-slate-500 text-xs">Владелец риска</p><p className="text-slate-700">{selected.owner}</p></div>
              <div><p className="text-slate-500 text-xs">Бизнес-процесс</p><p className="text-slate-700">{selected.businessProcess}</p></div>
              <div className="sm:col-span-2"><p className="text-slate-500 text-xs">Цель бизнес-процесса</p><p className="text-slate-700">{selected.processGoal}</p></div>
            </div>
            <h4 className="text-sm font-semibold text-slate-700 mt-4 mb-2">Детали риска</h4>
            <div className="space-y-2 text-sm">
              <div><p className="text-slate-500 text-xs">Риск-фактор</p><p className="text-slate-700">{selected.riskFactor}</p></div>
              <div><p className="text-slate-500 text-xs">Последствия</p><p className="text-slate-700">{selected.consequences}</p></div>
            </div>
            <h4 className="text-sm font-semibold text-slate-700 mt-4 mb-2">Взаимосвязи</h4>
            <p className="text-slate-700 text-sm">Связанные элементы: {selected.relations}</p>
            <h4 className="text-sm font-semibold text-slate-700 mt-4 mb-2">Мероприятия по риску</h4>
            <p className="text-slate-700 text-sm">Применяемые меры: {selected.measures}</p>
            <h4 className="text-sm font-semibold text-slate-700 mt-4 mb-2">Реализация риска</h4>
            <p className="text-slate-700 text-sm">Была ли реализация: Нет</p>
            <div className="mt-5 flex gap-2">
              <Button variant="secondary" onClick={() => setShowModal(false)}>Закрыть</Button>
              <Button>Редактировать</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
