import Link from "next/link";
import Card, { CardBody } from "@/components/ui/Card";

const modules = [
  { href: "/rca", title: "RCA" },
  { href: "/copilot", title: "Employee CoPilot" },
  { href: "/calculator", title: "HF-Calculator" },
  { href: "/anomalies", title: "Real-time Anomaly Detector" },
  { href: "/digital-twin", title: "Digital Twin & Strategic Simulator" },
  { href: "/analytics", title: "Analytics" },
];

export default function HomePage() {
  return (
    <div className="space-y-8">
      <Card className="max-w-2xl mx-auto">
        <CardBody className="text-center">
          <h1 className="text-2xl font-bold text-slate-800 mb-4">
            Добро пожаловать в Vista AI-Human Factor
          </h1>
          <p className="text-slate-600 mb-6">
            Выберите модуль для перехода.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
            {modules.map((m) => (
              <Link
                key={m.href}
                href={m.href}
                className="block p-4 rounded-lg border-2 border-[var(--border)] bg-[var(--bg-white)] hover:border-[var(--accent)] hover:bg-[var(--accent-light)] transition-colors"
              >
                <span className="font-medium text-slate-800">{m.title}</span>
              </Link>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
