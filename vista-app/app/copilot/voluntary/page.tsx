import Link from "next/link";
import Card, { CardBody } from "@/components/ui/Card";
import Button from "@/components/ui/Button";

export default function CoPilotVoluntaryPage() {
  return (
    <div className="space-y-6">
      <Link href="/copilot" className="text-sm text-[var(--accent)] hover:underline">
        ← Employee CoPilot
      </Link>
      <h1 className="text-xl font-bold text-slate-800">Добровольные сообщения</h1>
      <Card accent>
        <CardBody>
          <p className="text-slate-600 text-sm mb-4">
            Отправка сообщений о том, что мешает или препятствует выполнению рабочих процессов
            (Just Culture & Hazard Reporting).
          </p>
          <Link href="/copilot/voluntary/new">
            <Button>Отправить сообщение</Button>
          </Link>
        </CardBody>
      </Card>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link href="/copilot/voluntary/history">
          <Card className="h-full hover:border-[var(--accent)] transition-colors cursor-pointer">
            <CardBody>
              <span className="font-medium text-slate-800">История</span>
              <p className="text-sm text-slate-600 mt-1">
                Ранее отправленные сообщения и ответы на них.
              </p>
            </CardBody>
          </Card>
        </Link>
      </div>
    </div>
  );
}
