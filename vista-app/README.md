# Vista AI-Human Factor — веб-панель

Единая веб-панель платформы поддержки принятия решений в области рисков человеческого фактора.

> **Копия предыдущей версии прототипа** (с дашбордом рисков, аналитикой на главной, старым меню) сохранена в папке `vista-app-backup` в корне репозитория. Запуск: `cd vista-app-backup && npm run dev`.

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

- **Верхнее меню:** Products, About Us, Human Factor Wiki. Логотип — переход на главную.
- **Боковое меню (раскрывается слева):** Модули (RCA, Employee CoPilot, HF-Calculator, Real-time Anomaly Detector, Digital Twin & Strategic Simulator), Управление (Аналитика, Риск-менеджмент, Отчеты).
- **Профиль** (правый верхний угол): открывает модальное окно с данными пользователя и показателями.

Цвета: основная зелёная гамма (#638e59, #79A471, #8db881, #b5d1ad, #3b692f, #165b00, #024605, #95c740), фон #f6f6f6, акцент грязный оранжевый #E4BA6A.
