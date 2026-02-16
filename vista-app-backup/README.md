# Vista AI-Human Factor — веб-панель

Единая веб-панель платформы поддержки принятия решений в области рисков человеческого фактора.

## Стек

- **Frontend:** Next.js (App Router), React, TypeScript, Tailwind CSS
- **Backend:** API-роуты Next.js (чат, RAG, симулятор)
- **Данные:** схема в `lib/db/schema.sql` (PostgreSQL/SQLite)

## Модули

1. **Root Cause Analysis (RCA)** — анализ причин инцидентов, теги, корректирующие мероприятия
2. **Employee CoPilot** — профиль сотрудника, подсказки, добровольные сообщения
3. **Human Factor Calculator** — графы процессов/сотрудников, оценки рисков и стоимости
4. **Real-time Anomalies Detector** — поток событий, Early Warning, Root-Cause Ассистент
5. **Digital Twin & Strategy Simulator** — живой мониторинг, сценарии «what if»

## Запуск

```bash
npm install
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000).

## API

- `POST /api/chat` — чат с AI-ботом (body: `{ "message": "..." }`)
- `POST /api/rag` — поиск по базе знаний (body: `{ "query": "..." }`)
- `POST /api/simulator` — симулятор сценариев (body: `{ "scenarioId": "...", "params": {} }`)

## Навигация

- **Верхнее меню:** HF Анализ, RCA, CoPilot, Калькулятор HF, Аномалии, Digital Twin, Связь, Wiki
- **Левый сайдбар:** сворачивается кнопкой у левого края; разделы «Модули» и «Управление»

Интерфейс на русском языке, оформление в зелёной теме по макетам проекта.
