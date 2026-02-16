import Card, { CardBody } from "@/components/ui/Card";
import Button from "@/components/ui/Button";

export default function DigitalTwinPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-slate-800">Digital Twin & Strategy Simulator</h1>
      <p className="text-slate-600 text-sm">
        «Живой мониторинг → объяснение → мера» в одном кадре для руководителей.
      </p>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardBody>
          <h2 className="font-semibold text-slate-800 mb-4">Живой мониторинг</h2>
          <ul className="text-sm text-slate-600 space-y-2">
            <li>Аналитика по опасным факторам, аномалиям, отклонениям</li>
            <li>Поиск причинно-следственных связей и системных изъянов</li>
            <li>Прогноз рисков на основе организационных и поведенческих факторов</li>
          </ul>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
          <h2 className="font-semibold text-slate-800 mb-4">Стратегический симулятор «What if»</h2>
          <ul className="text-sm text-slate-600 space-y-2">
            <li>Тестирование управленческих гипотез «что если»</li>
            <li>Моделирование A/B/C сценариев</li>
            <li>Расчёт KPI / риск / стоимость; выбор оптимума</li>
            <li>Сравнение «до/после» и передача в RMS/ERP</li>
          </ul>
          <Button className="mt-4">+ Digital Twin Сценарии</Button>
          </CardBody>
        </Card>
      </div>
      <Card>
        <CardBody>
        <h3 className="font-semibold text-slate-800 mb-2">Наглядные панели</h3>
        <p className="text-sm text-slate-600">
          Data-driven реагирование; управление надёжностью операционных процессов; оценка влияния
          политик и ресурсов на KPI, риск, стоимость.
        </p>
        </CardBody>
      </Card>
    </div>
  );
}
