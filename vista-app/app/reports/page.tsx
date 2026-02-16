"use client";

import { useState } from "react";
import Card, { CardBody, CardHeader } from "@/components/ui/Card";

type Report = {
  id: string;
  title: string;
  date: string;
  processes: string[];
  risks: string[];
  processGaps: string[];
  hazardousFactors: string[];
  anomalies: string[];
  recurringEvents: string[];
  estimatedHFCost: string;
  hypotheses: string[];
  recommendations: string[];
};

const MOCK_REPORTS: Report[] = [
  {
    id: "1",
    title: "Human Factor",
    date: "10.02.2025",
    processes: ["Управление воздушным движением", "Наземное обслуживание", "Оперативное управление полетами", "Планирование экипажей"],
    risks: ["Нехватка персонала ATC (вероятность 4/5)", "Усталость экипажа в ночных слотах", "Сбои коммуникации OCC ↔ службы"],
    processGaps: ["Отсутствие единого окна статусов заправки/посадки", "Ручная передача смен без чек-листа", "Нет автоматического учёта времени реакции диспетчеров"],
    hazardousFactors: ["Пиковая нагрузка 06:00–10:00 и 15:00–18:00", "Работа в смешанных бригадах (языковой барьер)", "Давление SLA на сокращение времени разворота"],
    anomalies: ["Резкий рост времени ответа OCC в дни с задержками >30 мин", "Кластер опозданий экипажа по понедельникам после ночных рейсов"],
    recurringEvents: ["Задержка рейса SY-2407 (3ч 15м) — аналогично 12 случаям за 6 мес", "Нарушение SOP при смене диспетчера — 4 случая за квартал"],
    estimatedHFCost: "€612 000 (повторяющиеся инциденты €127k, ошибки/решения €89k, задержки €340k, ремонты/потери €56k)",
    hypotheses: ["Увеличение штата ATC на 2 в пиковые окна снизит задержки на >20%", "Внедрение AI-коммуникации сократит время ответа до <2 мин", "Ротация и FRMS снизят кластер опозданий по понедельникам"],
    recommendations: ["Внедрить мониторинг стресса и усталости в реальном времени", "Добавить 2 диспетчера в слоты 06:00–10:00 и 15:00–18:00", "Внедрить единый канал статусов (заправка/посадка) с уведомлениями", "Провести тренинги по коммуникации в смешанных бригадах"],
  },
  {
    id: "2",
    title: "Human Factor",
    date: "28.01.2025",
    processes: ["Техническое обслуживание ВС", "Контроль качества", "Планирование ТО"],
    risks: ["Пропуск проверок по чек-листу при сжатых окнах", "Недостаточная квалификация при смене подрядчика"],
    processGaps: ["Нет «пешеходных окон» на складе; spotter-роли не закреплены", "Редкое обновление карты рисков в зоне погрузки"],
    hazardousFactors: ["Плохое освещение в ночную смену", "Скользкое покрытие в зимний период", "Спешка из-за SLA"],
    anomalies: ["Рост числа отклонений в отчётах ТО в декабре", "Корреляция опозданий техников и задержек вылета"],
    recurringEvents: ["Почти-столкновение на складе — 2 случая за год", "Наезд ТС при разгрузке — 1 случай"],
    estimatedHFCost: "€185 000 (ремонты, простой, штрафы, репутация)",
    hypotheses: ["Введение geo-alerts на карте склада снизит риск наездов", "Закрепление spotter-ролей и «пешеходных окон» уменьшит почти-столкновения"],
    recommendations: ["Внедрить geo-alerts на карте склада", "Закрепить spotter-роли и пешеходные окна в SOP", "Улучшить освещение и разметку в зоне погрузки", "Обучение подрядчиков по процедурам при смене бригад"],
  },
  {
    id: "3",
    title: "Human Factor",
    date: "15.01.2025",
    processes: ["Обслуживание пассажиров", "Обработка багажа", "Регистрация"],
    risks: ["Рассинхрон регистрации и подачи багажа", "Рост жалоб при задержках >1 ч"],
    processGaps: ["Регистрация не учитывает реальное распределение прибытия пассажиров", "Нет предиктивной модели подачи багажа"],
    hazardousFactors: ["Пиковые часы вылетов", "Нехватка тележек в терминале"],
    anomalies: ["Корреляция позднего завершения регистрации и задержки подачи багажа r=0.78"],
    recurringEvents: ["Жалобы на потерю/задержку багажа — 8 случаев в месяц при задержках рейсов"],
    estimatedHFCost: "€94 000 (компенсации, репутация, доп. обработка)",
    hypotheses: ["Предиктивная модель прибытия пассажиров синхронизирует багаж и сократит задержки"],
    recommendations: ["Внедрить предиктивную модель прибытия пассажиров", "Синхронизировать логистику багажа с окнами регистрации", "Увеличить буфер тележек в пиковые часы"],
  },
];

export default function ReportsPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = MOCK_REPORTS.find((r) => r.id === selectedId);

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-slate-800">Отчеты</h1>
      <p className="text-slate-600 text-sm">
        Формирование и просмотр отчётов по рискам, инцидентам и показателям надёжности. Клик по плашке открывает детали.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {MOCK_REPORTS.map((r) => (
          <button
            key={r.id}
            type="button"
            onClick={() => setSelectedId(selectedId === r.id ? null : r.id)}
            className={`text-left rounded-xl border-2 p-4 transition-colors ${
              selectedId === r.id ? "border-[var(--accent)] bg-[var(--accent-light)]" : "border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50"
            }`}
          >
            <p className="font-semibold text-slate-800">{r.title}</p>
            <p className="text-sm text-slate-500 mt-1">{r.date}</p>
          </button>
        ))}
      </div>

      {selected && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <h2 className="font-semibold text-slate-800">Отчёт Human Factor — {selected.date}</h2>
            <button type="button" onClick={() => setSelectedId(null)} className="text-slate-400 hover:text-slate-600 text-sm">Свернуть</button>
          </CardHeader>
          <CardBody className="pt-0 space-y-6">
            <section>
              <h3 className="text-sm font-semibold text-slate-700 mb-2">По процессам</h3>
              <ul className="list-disc list-inside text-slate-600 text-sm space-y-1">
                {selected.processes.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
            </section>
            <section>
              <h3 className="text-sm font-semibold text-slate-700 mb-2">Вероятные риски</h3>
              <ul className="list-disc list-inside text-slate-600 text-sm space-y-1">
                {selected.risks.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </section>
            <section>
              <h3 className="text-sm font-semibold text-slate-700 mb-2">Пробелы в процессах</h3>
              <ul className="list-disc list-inside text-slate-600 text-sm space-y-1">
                {selected.processGaps.map((g, i) => (
                  <li key={i}>{g}</li>
                ))}
              </ul>
            </section>
            <section>
              <h3 className="text-sm font-semibold text-slate-700 mb-2">Возможные опасные факторы</h3>
              <ul className="list-disc list-inside text-slate-600 text-sm space-y-1">
                {selected.hazardousFactors.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
            </section>
            <section>
              <h3 className="text-sm font-semibold text-slate-700 mb-2">Аномалии</h3>
              <ul className="list-disc list-inside text-slate-600 text-sm space-y-1">
                {selected.anomalies.map((a, i) => (
                  <li key={i}>{a}</li>
                ))}
              </ul>
            </section>
            <section>
              <h3 className="text-sm font-semibold text-slate-700 mb-2">Повторяющиеся события</h3>
              <ul className="list-disc list-inside text-slate-600 text-sm space-y-1">
                {selected.recurringEvents.map((e, i) => (
                  <li key={i}>{e}</li>
                ))}
              </ul>
            </section>
            <section>
              <h3 className="text-sm font-semibold text-slate-700 mb-2">Приблизительная стоимость потерь из-за Human Factor</h3>
              <p className="text-slate-700 text-sm">{selected.estimatedHFCost}</p>
            </section>
            <section>
              <h3 className="text-sm font-semibold text-slate-700 mb-2">Гипотезы для проверки</h3>
              <ul className="list-disc list-inside text-slate-600 text-sm space-y-1">
                {selected.hypotheses.map((h, i) => (
                  <li key={i}>{h}</li>
                ))}
              </ul>
            </section>
            <section>
              <h3 className="text-sm font-semibold text-slate-700 mb-2">Рекомендации</h3>
              <ul className="list-disc list-inside text-slate-600 text-sm space-y-1">
                {selected.recommendations.map((rec, i) => (
                  <li key={i}>{rec}</li>
                ))}
              </ul>
            </section>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
