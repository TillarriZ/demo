import Link from "next/link";
import Card, { CardBody, CardHeader } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

type Criticality = "high" | "medium" | "low";

const streamRows: {
  id: number;
  date: string;
  start: string;
  break: string;
  log: string;
  info: string;
  criticality: Criticality;
}[] = [
  { id: 1, date: "01.02", start: "08:00", break: "—", log: "Норма", info: "—", criticality: "low" },
  { id: 2, date: "01.02", start: "09:15", break: "10 мин", log: "Ошибка", info: "Обр. внимание", criticality: "high" },
  { id: 3, date: "01.02", start: "11:00", break: "—", log: "Конфликт", info: "Нужен отпуск", criticality: "high" },
  { id: 4, date: "02.02", start: "08:00", break: "—", log: "Нарушение", info: "Проф. прогноз", criticality: "medium" },
];

const earlyWarnings: { id: string; name: string; level: Criticality; date: string }[] = [
  { id: "1", name: "Exec Error", level: "high", date: "02.02 09:15" },
  { id: "2", name: "Conflict", level: "high", date: "02.02 11:00" },
  { id: "3", name: "SOP Violation", level: "medium", date: "02.02 08:00" },
  { id: "4", name: "Delay", level: "medium", date: "01.02 14:20" },
  { id: "5", name: "Deadline Miss", level: "low", date: "01.02 16:00" },
  { id: "6", name: "Overload", level: "low", date: "01.02 12:00" },
];

const criticalityLabel: Record<Criticality, string> = {
  high: "Высокий",
  medium: "Средний",
  low: "Низкий",
};

const criticalityVariant: Record<Criticality, "risk-high" | "risk-medium" | "risk-low"> = {
  high: "risk-high",
  medium: "risk-medium",
  low: "risk-low",
};

export default function AnomaliesPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-slate-800">Real-time Anomalies Detector</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 overflow-hidden">
          <CardHeader>
            <h2 className="font-semibold text-slate-800">Поток данных (Stream)</h2>
          </CardHeader>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left p-3 font-medium text-slate-700">ID</th>
                <th className="text-left p-3 font-medium text-slate-700">Дата</th>
                <th className="text-left p-3 font-medium text-slate-700">Начало</th>
                <th className="text-left p-3 font-medium text-slate-700">Перерыв</th>
                <th className="text-left p-3 font-medium text-slate-700">Критичность</th>
                <th className="text-left p-3 font-medium text-slate-700">Логи</th>
                <th className="text-left p-3 font-medium text-slate-700">Доп. инфо</th>
              </tr>
            </thead>
            <tbody>
              {streamRows.map((r) => (
                <tr key={r.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="p-3">{r.id}</td>
                  <td className="p-3">{r.date}</td>
                  <td className="p-3">{r.start}</td>
                  <td className="p-3">{r.break}</td>
                  <td className="p-3">
                    <Badge variant={criticalityVariant[r.criticality]}>
                      {criticalityLabel[r.criticality]}
                    </Badge>
                  </td>
                  <td className="p-3">
                    <span
                      className={
                        r.log !== "Норма"
                          ? "text-[var(--risk-red)] font-medium"
                          : "text-slate-600"
                      }
                    >
                      {r.log}
                    </span>
                  </td>
                  <td className="p-3 text-slate-600">{r.info}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
        <div className="space-y-4">
          <Card accent>
            <CardBody>
              <h3 className="font-semibold text-slate-800 text-sm mb-3 flex items-center gap-2">
                <span className="text-amber-500">⚠</span> Early Warning
              </h3>
              <ul className="space-y-2">
                {earlyWarnings.map((w) => (
                  <li
                    key={w.id}
                    className="flex flex-wrap items-center gap-2 text-sm p-2 rounded-lg bg-slate-50 hover:bg-slate-100"
                  >
                    <Badge variant={criticalityVariant[w.level]}>{criticalityLabel[w.level]}</Badge>
                    <span className="font-medium text-slate-800">{w.name}</span>
                    <span className="text-slate-500 text-xs">{w.date}</span>
                    <div className="w-full flex gap-1 mt-1">
                      <Link href={`/rca?incident=${w.id}`} className="text-[var(--accent)] text-xs font-medium hover:underline">
                        Перейти к RCA
                      </Link>
                      <span className="text-slate-300">|</span>
                      <button type="button" className="text-slate-500 text-xs hover:text-slate-700">
                        Принять в работу
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <h3 className="font-semibold text-slate-800 text-sm mb-2">Root-Cause Ассистент</h3>
              <p className="text-sm text-slate-600 mb-3">
                Драфт отчёта по инциденту: причина → следствие, связь с документацией и заданиями.
              </p>
              <Link href="/copilot">
                <Button size="sm">Открыть AI-бот</Button>
              </Link>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
