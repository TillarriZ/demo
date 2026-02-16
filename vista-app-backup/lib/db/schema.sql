-- Vista AI-Human Factor: схема данных (PostgreSQL / SQLite-совместимая)
-- Сущности: сотрудники, смены, инциденты, документы, сценарии what-if, добровольные сообщения

-- Сотрудники
CREATE TABLE IF NOT EXISTS employees (
  id UUID PRIMARY KEY,
  external_id TEXT,
  full_name TEXT NOT NULL,
  email TEXT,
  department TEXT,
  position TEXT,
  shift_id UUID REFERENCES shifts(id),
  manager_id UUID REFERENCES employees(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Смены
CREATE TABLE IF NOT EXISTS shifts (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  start_time TIME,
  end_time TIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Инциденты
CREATE TABLE IF NOT EXISTS incidents (
  id UUID PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT, -- простой, задержка, авария, повреждение, конфликт, неверное решение, ошибка
  employee_id UUID REFERENCES employees(id),
  shift_id UUID REFERENCES shifts(id),
  occurred_at TIMESTAMP NOT NULL,
  root_cause_analysis_id UUID,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Теги инцидентов
CREATE TABLE IF NOT EXISTS incident_tags (
  incident_id UUID REFERENCES incidents(id),
  tag TEXT NOT NULL,
  PRIMARY KEY (incident_id, tag)
);

-- Root Cause Analysis
CREATE TABLE IF NOT EXISTS root_cause_analyses (
  id UUID PRIMARY KEY,
  incident_id UUID REFERENCES incidents(id),
  summary TEXT,
  causal_chain TEXT,
  corrective_actions TEXT,
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Документы (процессы, инструкции)
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT,
  type TEXT, -- process, instruction, sop
  version INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Добровольные сообщения (Just Culture)
CREATE TABLE IF NOT EXISTS voluntary_reports (
  id UUID PRIMARY KEY,
  employee_id UUID REFERENCES employees(id),
  content TEXT NOT NULL,
  category TEXT,
  status TEXT DEFAULT 'new',
  assigned_to UUID REFERENCES employees(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Сценарии what-if (Digital Twin)
CREATE TABLE IF NOT EXISTS scenarios (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  params JSONB,
  result_kpi JSONB,
  result_risk JSONB,
  baseline_id UUID REFERENCES scenarios(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Допуски и сертификаты сотрудников
CREATE TABLE IF NOT EXISTS employee_permits (
  id UUID PRIMARY KEY,
  employee_id UUID REFERENCES employees(id),
  name TEXT NOT NULL,
  valid_until DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Поток событий (Real-time)
CREATE TABLE IF NOT EXISTS stream_events (
  id UUID PRIMARY KEY,
  employee_id UUID REFERENCES employees(id),
  event_type TEXT, -- normal, error, conflict, violation
  started_at TIMESTAMP NOT NULL,
  break_duration_sec INTEGER,
  extra_info TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Индексы
CREATE INDEX IF NOT EXISTS idx_incidents_occurred ON incidents(occurred_at);
CREATE INDEX IF NOT EXISTS idx_incidents_type ON incidents(type);
CREATE INDEX IF NOT EXISTS idx_incident_tags_tag ON incident_tags(tag);
CREATE INDEX IF NOT EXISTS idx_stream_events_employee ON stream_events(employee_id);
CREATE INDEX IF NOT EXISTS idx_stream_events_started ON stream_events(started_at);
