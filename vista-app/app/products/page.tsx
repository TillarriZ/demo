import Link from "next/link";
import Card, { CardBody } from "@/components/ui/Card";

const modules = [
  { href: "/rca", title: "RCA" },
  { href: "/copilot", title: "Employee CoPilot" },
  { href: "/calculator", title: "HF-Calculator" },
  { href: "/anomalies", title: "Real-time Anomaly Detector" },
  { href: "/digital-twin", title: "Digital Twin & Strategic Simulator" },
];

export default function ProductsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-slate-800">Products</h1>
      <p className="text-slate-600">Модули платформы Vista AI-Human Factor.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {modules.map((m) => (
          <Link key={m.href} href={m.href}>
            <Card className="h-full hover:border-[var(--accent)] transition-colors">
              <CardBody>
                <span className="font-medium text-slate-800">{m.title}</span>
              </CardBody>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
