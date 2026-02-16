"use client";

import Link from "next/link";
import Card, { CardBody } from "@/components/ui/Card";
import ReliabilityTrendsChart from "./ReliabilityTrendsChart";

export default function CoPilotTrendsPage() {
  return (
    <div className="space-y-6">
      <Link href="/copilot" className="text-sm text-[var(--accent)] hover:underline">
        ← Employee CoPilot
      </Link>
      <h1 className="text-xl font-bold text-slate-800">Тренды компании</h1>
      <p className="text-slate-600 text-sm">
        Тренды профессиональной надёжности по компании и группам; сравнение с вашим трендом.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <Card accent className="order-2 lg:order-1">
          <CardBody>
            <h2 className="text-sm font-semibold text-slate-700 mb-3">Выводы относительно вас</h2>
            <ul className="space-y-3 text-sm text-slate-700">
              <li className="pl-3 border-l-2 border-[var(--accent)]">
                <span className="font-medium text-slate-800">Где вы находитесь:</span>
                {" "}
                В 2021–2024 годах ваш тренд был выше среднего по вторым пилотам, по вторым пилотам B-777 и по отряду B-777 в целом. В последнем периоде (2024–2025) показатель снизился и оказался ниже среднего по всем этим группам. Текущий личный уровень Human Factor 7,2/10 по-прежнему в зоне оптимума, но динамика требует внимания.
              </li>
              <li className="pl-3 border-l-2 border-slate-300">
                <span className="font-medium text-slate-800">Плюсы:</span>
                {" "}
                Стабильно высокие результаты по тренажёрам (94%), низкий уровень стресса (32%), опыт КВС на B-737 и успешный переход на B-777. Психологический профиль 1-й группы прогноза. Достижения и благодарности за безопасность и качество работы.
              </li>
              <li className="pl-3 border-l-2 border-slate-300">
                <span className="font-medium text-slate-800">Как улучшить тренд:</span>
                {" "}
                Сфокусироваться на факторах, связанных с последним спадом: контроль усталости и режима отдыха перед ночными рейсами (по радару — выше показатели по «Усталость» и «Физиологические факторы» в ночных сессиях). Своевременно продлить допуски, истекающие в 2026. Использовать рекомендации раздела «Возможности развития» в профиле и при необходимости разобрать эпизоды с аномалиями по аудио с психологом или супервизором.
              </li>
              <li className="pl-3 border-l-2 border-slate-300">
                <span className="font-medium text-slate-800">На что обратить внимание:</span>
                {" "}
                Не допускать дальнейшего снижения показателя ниже среднего по вторым пилотам, по вторым пилотам B-777 и по отряду B-777. Тренд среди вторых пилотов B-777 в 2025 году выше вашего — целесообразно ориентироваться на восстановление уровня выше этой группы. Регулярно пересматривать назначенные риски (5 активных) и выполнять мероприятия по их снижению. Сохранять практики CRM и учёта человеческого фактора в брифингах и в полёте.
              </li>
            </ul>
          </CardBody>
        </Card>
        <Card className="order-1 lg:order-2">
          <CardBody>
            <h2 className="text-sm font-semibold text-slate-700 mb-4">Профессиональная надёжность: тренды</h2>
            <ReliabilityTrendsChart />
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
