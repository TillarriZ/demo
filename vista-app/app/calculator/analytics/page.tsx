"use client";

import Link from "next/link";
import Card, { CardBody } from "@/components/ui/Card";

export default function CalculatorAnalyticsPage() {
  return (
    <div className="space-y-6">
      <Link href="/calculator" className="text-sm text-[var(--accent)] hover:underline">
        ← HF-Calculator
      </Link>
      <h1 className="text-xl font-bold text-slate-800">Аналитика</h1>
      <p className="text-slate-600 text-sm">
        Дашборд на основе проанализированной документации и процессов: вероятная стоимость потерь, противоречия, пробелы и отклонения.
      </p>

      {/* Вероятная стоимость потерь */}
      <Card accent>
        <CardBody>
          <h2 className="text-sm font-semibold text-slate-700 mb-3">Вероятная стоимость потерь</h2>
          <p className="text-slate-600 text-sm mb-4">
            Оценка построена на основе загруженной документации и процессов. Учтены выявленные противоречия, пробелы, отклонения и некорректно описанные процессы.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-50 rounded-lg p-4">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Суммарная оценка потерь (год)</p>
              <p className="text-xl font-bold text-slate-800 mt-1">4,2 – 7,1 млн руб.</p>
              <p className="text-xs text-slate-500 mt-1">при текущих рисках HF</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-4">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Стоимость одной ошибки</p>
              <p className="text-xl font-bold text-slate-800 mt-1">180 – 420 тыс. руб.</p>
              <p className="text-xs text-slate-500 mt-1">в среднем по процессам</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-4">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Стоимость одного неверного решения</p>
              <p className="text-xl font-bold text-slate-800 mt-1">320 – 580 тыс. руб.</p>
              <p className="text-xs text-slate-500 mt-1">по процессу при отклонениях</p>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Противоречия, пробелы, отклонения */}
      <Card>
        <CardBody>
          <h2 className="text-sm font-semibold text-slate-700 mb-3">Найденные противоречия, пробелы и отклонения</h2>
          <p className="text-slate-600 text-sm mb-4">
            По результатам анализа документации и процессов выявлено следующее.
          </p>
          <div className="space-y-3">
            <div className="flex gap-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
              <span className="text-amber-600 font-medium shrink-0">Противоречия:</span>
              <span className="text-slate-700 text-sm">Расхождение между инструкцией по предполётной подготовке (раздел 4.1) и регламентом службы (32): разные порядки проверки систем. Риск пропуска шагов при смене документа.</span>
            </div>
            <div className="flex gap-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
              <span className="text-amber-600 font-medium shrink-0">Пробелы:</span>
              <span className="text-slate-700 text-sm">В документе 31 не описаны действия при отказе связи с диспетчером в зоне руления. Нет ссылки на запасной канал и эскалацию.</span>
            </div>
            <div className="flex gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-slate-600 font-medium shrink-0">Отклонения:</span>
              <span className="text-slate-700 text-sm">Фактическое время на чек-лист «Перед взлётом» в логах в среднем на 15% меньше нормативного; в 22% случаев шаг «Проверка закрылков» выполняется после начала разгона.</span>
            </div>
            <div className="flex gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-slate-600 font-medium shrink-0">Некорректно сформированные процессы:</span>
              <span className="text-slate-700 text-sm">В одном из регламентов этап «Согласование с УВД» указан после «Выруливание на ВПП», что не соответствует реальной последовательности и увеличивает риск конфликтов на земле.</span>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Сводка: сколько может стоить ошибка / решение */}
      <Card>
        <CardBody>
          <h2 className="text-sm font-semibold text-slate-700 mb-3">Сводка: стоимость одной ошибки и одного неверного решения по процессу</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-2 font-medium text-slate-700">Процесс / зона</th>
                  <th className="text-right py-2 font-medium text-slate-700">Одна ошибка (тыс. руб.)</th>
                  <th className="text-right py-2 font-medium text-slate-700">Одно неверное решение (тыс. руб.)</th>
                </tr>
              </thead>
              <tbody className="text-slate-600">
                <tr className="border-b border-slate-100">
                  <td className="py-2">Предполётная подготовка</td>
                  <td className="text-right py-2">120 – 280</td>
                  <td className="text-right py-2">250 – 450</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-2">Руление / наземное движение</td>
                  <td className="text-right py-2">200 – 500</td>
                  <td className="text-right py-2">400 – 700</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-2">Заход на посадку / посадка</td>
                  <td className="text-right py-2">350 – 800</td>
                  <td className="text-right py-2">500 – 1 200</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-2">Нештатные / аварийные процедуры</td>
                  <td className="text-right py-2">400 – 1 000+</td>
                  <td className="text-right py-2">600 – 1 500+</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-slate-500 mt-3">
            Оценки носят приблизительный характер и зависят от частоты событий, тяжести последствий и выбранной методики расчёта. Для детализации используйте раздел «Расчёт стоимости» и RCA.
          </p>
        </CardBody>
      </Card>
    </div>
  );
}
