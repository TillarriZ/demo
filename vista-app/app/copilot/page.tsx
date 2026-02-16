import Link from "next/link";
import Card, { CardBody } from "@/components/ui/Card";

const sections = [
  { href: "/copilot/profile", title: "Профиль", description: "Личные данные, траектория проф. надёжности, возможности развития" },
  { href: "/copilot/search", title: "Поиск информации", description: "Правила, инструкции, технологии операций" },
  { href: "/copilot/voluntary", title: "Добровольные сообщения", description: "Just Culture & Hazard Reporting" },
  { href: "/copilot/trends", title: "Тренды компании", description: "Аналитика надёжности по командам и группам" },
];

export default function CoPilotPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-slate-800">Employee CoPilot</h1>
      <p className="text-slate-600 text-sm">
        Выберите раздел для перехода.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {sections.map((s) => (
          <Link key={s.href} href={s.href}>
            <Card className="h-full hover:border-[var(--accent)] transition-colors">
              <CardBody>
                <h2 className="font-semibold text-slate-800 mb-2">{s.title}</h2>
                <p className="text-sm text-slate-600">{s.description}</p>
              </CardBody>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
