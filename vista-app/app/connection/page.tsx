import Link from "next/link";
import Card, { CardBody } from "@/components/ui/Card";
import Button from "@/components/ui/Button";

export default function ConnectionPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-slate-800">Связь</h1>
      <p className="text-slate-600">
        Интеграции, коммуникации между службами, каналы оповещений.
      </p>

      <Card accent>
        <CardBody>
          <h2 className="font-semibold text-slate-800 mb-2">Скоро здесь</h2>
          <p className="text-sm text-slate-600 mb-4">
            Раздел «Связь» в разработке: интеграции с RMS/ERP, каналы оповещений (email, мессенджеры),
            настройка коммуникаций между службами.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button size="sm">Уведомить о запуске</Button>
            <Link href="/wiki">
              <Button variant="secondary" size="sm">Перейти в Wiki</Button>
            </Link>
          </div>
        </CardBody>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardBody>
            <h3 className="font-semibold text-slate-800 mb-2">Интеграции</h3>
            <p className="text-sm text-slate-500">Подключение внешних систем и API — в планах.</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <h3 className="font-semibold text-slate-800 mb-2">Оповещения</h3>
            <p className="text-sm text-slate-500">Настройка каналов и правил уведомлений — в планах.</p>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
