import Card, { CardBody } from "@/components/ui/Card";
import Button from "@/components/ui/Button";

export default function CoPilotPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-slate-800">Employee CoPilot</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardBody>
          <h2 className="font-semibold text-slate-800 mb-4">Профиль сотрудника</h2>
          <ul className="space-y-2 text-sm text-slate-600">
            <li>Резюме, стаж, аудио/видео работы, задания и результаты</li>
            <li>Психологический профиль, обучение, допуски</li>
            <li>Персональная траектория профессиональной надёжности</li>
          </ul>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
          <h2 className="font-semibold text-slate-800 mb-4">Контекстные подсказки</h2>
          <ul className="space-y-2 text-sm text-slate-600">
            <li>«Что делать прямо сейчас»</li>
            <li>«Где найти правило, инструкцию, технологию операции»</li>
            <li>«Как действовать при сбое, конфликте и аварии»</li>
          </ul>
          </CardBody>
        </Card>
      </div>
      <Card accent>
        <CardBody>
        <h2 className="font-semibold text-slate-800 mb-4">Добровольные сообщения (Just Culture & Hazard Reporting)</h2>
        <p className="text-sm text-slate-600 mb-4">
          Отправка сообщений о том, что мешает или препятствует выполнению рабочих процессов.
        </p>
        <Button>Отправить сообщение</Button>
        </CardBody>
      </Card>
      <Card>
        <CardBody>
        <h2 className="font-semibold text-slate-800 mb-2">Аналитика для компании</h2>
        <p className="text-sm text-slate-600">
          Тренды профессиональной надёжности по командам и группам; аналитика добровольных
          сообщений; сопоставление тренды → инциденты → подготовка → ДС → стоимость и прогноз.
        </p>
        </CardBody>
      </Card>
    </div>
  );
}
