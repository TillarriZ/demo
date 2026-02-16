import Link from "next/link";
import Card, { CardBody } from "@/components/ui/Card";

export default function CalculatorPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-slate-800">HF-Calculator</h1>
      <p className="text-slate-600 text-sm">
        Расчёт стоимости рисков человеческого фактора, построение графов процессов и аналитика по документации.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/calculator/cost">
          <Card className="h-full hover:border-[var(--accent)] transition-colors cursor-pointer">
            <CardBody>
              <span className="font-medium text-slate-800">Расчёт стоимости</span>
            </CardBody>
          </Card>
        </Link>
        <Link href="/calculator/graphs">
          <Card className="h-full hover:border-[var(--accent)] transition-colors cursor-pointer">
            <CardBody>
              <span className="font-medium text-slate-800">Графы</span>
            </CardBody>
          </Card>
        </Link>
        <Link href="/calculator/analytics">
          <Card className="h-full hover:border-[var(--accent)] transition-colors cursor-pointer">
            <CardBody>
              <span className="font-medium text-slate-800">Аналитика</span>
            </CardBody>
          </Card>
        </Link>
      </div>
    </div>
  );
}
