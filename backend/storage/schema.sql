-- Water Leak Detection SQLite Schema

CREATE TABLE IF NOT EXISTS telemetry (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ts INTEGER NOT NULL,
  q_in REAL NOT NULL,
  q_out REAL NOT NULL,
  q_branch REAL DEFAULT 0.0,
  current_ma REAL NOT NULL,
  voltage_v REAL DEFAULT 12.0,
  pressure_bar REAL DEFAULT 2.5,
  raw_pulses_in INTEGER DEFAULT 0,
  raw_pulses_out INTEGER DEFAULT 0,
  solenoid_state INTEGER DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_telemetry_ts ON telemetry(ts);

CREATE TABLE IF NOT EXISTS leak_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  start_ts INTEGER NOT NULL,
  stop_ts INTEGER,
  location_node TEXT NOT NULL,
  severity_lpm REAL NOT NULL,
  is_ground_truth INTEGER DEFAULT 1,
  notes TEXT
);

CREATE TABLE IF NOT EXISTS detections (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ts INTEGER NOT NULL,
  method TEXT NOT NULL,
  confidence REAL NOT NULL,
  residual REAL NOT NULL,
  is_alarm INTEGER DEFAULT 1,
  leak_event_id INTEGER REFERENCES leak_events(id)
);

CREATE INDEX IF NOT EXISTS idx_detections_ts ON detections(ts);

CREATE TABLE IF NOT EXISTS experiment_runs (
  run_id TEXT PRIMARY KEY,
  operator TEXT NOT NULL,
  date TEXT NOT NULL,
  leak_size_lpm REAL DEFAULT 0.0,
  leak_location TEXT DEFAULT 'Branch_A',
  pump_mode TEXT DEFAULT 'constant',
  notes TEXT
);

CREATE TABLE IF NOT EXISTS work_orders (
  id TEXT PRIMARY KEY,
  leak_event_id INTEGER REFERENCES leak_events(id),
  location_node TEXT NOT NULL,
  severity_lpm REAL NOT NULL,
  priority TEXT NOT NULL,
  assigned_crew TEXT NOT NULL,
  scheduled_start TEXT NOT NULL,
  estimated_hrs REAL NOT NULL,
  status TEXT DEFAULT 'PENDING'
);
