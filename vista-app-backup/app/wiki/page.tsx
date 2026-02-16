import Link from "next/link";
import Card, { CardBody } from "@/components/ui/Card";
import Button from "@/components/ui/Button";

export default function WikiPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-slate-800">Wiki</h1>
      <p className="text-slate-600">
        База знаний, инструкции, правила, технологии операций.
      </p>

      <Card accent>
        <CardBody>
          <h2 className="font-semibold text-slate-800 mb-2">База знаний в разработке</h2>
          <p className="text-sm text-slate-600 mb-4">
            Здесь будут инструкции, регламенты, технологии операций и поиск по документации.
            Связь с модулями RCA и CoPilot для контекстных подсказок.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button size="sm">Предложить раздел</Button>
            <Link href="/copilot">
              <Button variant="secondary" size="sm">Контекстные подсказки в CoPilot</Button>
            </Link>
          </div>
        </CardBody>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardBody>
            <h3 className="font-semibold text-slate-800 mb-2">Инструкции</h3>
            <p className="text-sm text-slate-500">Пошаговые инструкции по процессам — раздел готовится.</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <h3 className="font-semibold text-slate-800 mb-2">Правила и регламенты</h3>
            <p className="text-sm text-slate-500">Внутренние правила и стандарты — раздел готовится.</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <h3 className="font-semibold text-slate-800 mb-2">Технологии операций</h3>
            <p className="text-sm text-slate-500">Описание технологий и процедур — раздел готовится.</p>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
