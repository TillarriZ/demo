import Card, { CardBody } from "@/components/ui/Card";

export default function AboutPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-slate-800">About Us</h1>
      <Card>
        <CardBody>
          <p className="text-slate-600">
            Vista AI-Human Factor — платформа для анализа и управления рисками человеческого фактора.
            Выявление причин инцидентов, поддержка принятия решений, симуляция сценариев.
          </p>
        </CardBody>
      </Card>
    </div>
  );
}
