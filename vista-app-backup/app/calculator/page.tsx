import Card, { CardBody } from "@/components/ui/Card";
import Button from "@/components/ui/Button";

export default function CalculatorPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-slate-800">Human Factor Calculator</h1>
      <div className="flex gap-2 p-2 bg-slate-100 rounded-lg w-fit">
        <Button variant="secondary" size="sm">Процессы</Button>
        <Button size="sm">Сотрудники</Button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 min-h-[400px] flex items-center justify-center">
          <CardBody className="w-full">
            <div className="text-center text-slate-500">
              <p className="font-medium text-slate-700 mb-2">Граф взаимодействий</p>
              <p className="text-sm">
                Узлы: сотрудники (зелёные), факторы риска (красные/оранжевые). Пробел в знаниях,
                усталость, отвлекающие факторы, давление, нехватка ресурсов, стресс.
              </p>
            </div>
          </CardBody>
        </Card>
        <div className="space-y-4">
          <Card>
            <CardBody className="p-4">
              <h3 className="font-semibold text-slate-800 text-sm mb-2">Оценки</h3>
              <ul className="text-sm text-slate-600 space-y-1">
                <li>Стоимость потерь из-за HF</li>
                <li>Вероятность реализации HF-рисков</li>
                <li>Зоны риска по сменам, ролям, процессам</li>
              </ul>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="p-4">
              <h3 className="font-semibold text-slate-800 text-sm mb-2">Документация процессов</h3>
              <p className="text-sm text-slate-600">
                Анализ на соответствие, пробелы, несоответствия «как на бумаге» и «как в реальности».
              </p>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
