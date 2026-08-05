# PROJECT CONTEXT

> **AI AGENT INSTRUCTIONS**
> 1. Read `PROJECT_CONTEXT.md` before coding.
> 2. Do not create duplicate modules.
> 3. Reuse existing files whenever possible.
> 4. Update `PROJECT_CONTEXT.md` after changes.
> 5. Update `CHANGELOG.md` after changes.
> 6. Do not modify MQTT schema without updating `MQTT_SPEC.md`.
> 7. Do not modify database schema without updating `DATABASE_SCHEMA.md`.
> 8. Keep architecture simple.
> 9. Complete current phase before starting next phase.
> 10. Do not introduce new frameworks without justification.

---

## Hardware Status

| Component | Status | Interface / Pin | Notes |
|---|---|---|---|
| **ESP32 DevKit V1** | ONLINE | WiFi / MQTT | Fixed IP 192.168.1.104 |
| **YF-S201 Flow Sensor #1 ($Q_{\text{in}}$)** | WORKING | GPIO 18 | Inlet main pulse meter |
| **YF-S201 Flow Sensor #2 ($Q_{\text{out}}$)** | WORKING | GPIO 19 | Outlet return pulse meter |
| **YF-S201 Flow Sensor #3 ($Q_{\text{branch}}$)** | WORKING | GPIO 21 | Branch A side pulse meter |
| **INA219 Power/Current Sensor** | WORKING | I2C (SDA 21 / SCL 22) | Motor current load monitoring |
| **12V DC Pump #1** | WORKING | Relay GPIO 26 | Primary circulation pump |
| **12V DC Pump #2** | WORKING | Relay GPIO 27 | Auxiliary pump / variable load |
| **Servo Motor Isolation Valve** | WORKING | PWM GPIO 13 | Branch A active isolation (0° / 45° / 90°) |

**Last Verified Hardware Test**: 2026-08-03 10:00:00 UTC

---

## Project Overview
- **Name**: Water Leak Detection System (Hardware-In-The-Loop Bench & Analytics Workbench)
- **Scope**: 2-week student project for 5 team members.
- **Goal**: High-reliability physical rig and digital twin for real-time water pipeline leak detection, multi-algorithm sensor fusion, branch isolation, and automated crew work order scheduling.
- **Current Phase**: Rebuilding the real pipeline ahead of the Aug 8 hackathon-ready checkpoint — an audit on 2026-08-05 found most of "Phase 1-3 Completed" below was dashboard-mock/scaffolding, not wired end-to-end. See `docs/CHANGELOG.md` [2026-08-05] for what was actually fixed.
- **Current Status**: Real MongoDB persistence, MNF detection, and a shared live/replay `DetectionPipeline` now exist and are wired through `backend/api_server.py` -> `server.ts` (proxy) -> dashboard. Firmware was rewritten with real WiFi/MQTT/sensor code but is untested against physical hardware in this environment. Still needed before demo: run against a real Mosquitto broker + MongoDB instance + the physical rig; flash and bench-test firmware; verify the Azure OpenAI summary path end-to-end (falls back to a template if unset).
- **Last Updated**: 2026-08-05

---

## Team Roles & Members
- **Member A**: Firmware & Sensor Rig Lead (ESP32, Flow Sensors, INA219, Relays)
- **Member B**: Backend & MQTT Architect (Python Collector, MongoDB Repository, Telemetry Parser)
- **Member C**: Detection Algorithms Lead (Mass Balance, Current Signature, MNF, CUSUM, Fusion)
- **Member D**: Replay Engine & Analytics (Historical Replay, ROC/F1 Evaluation Metrics)
- **Member E**: Dashboard & Optimization Lead (Streamlit / React Workbench, Branch Localization, CP-SAT Scheduler)

---

## System Architecture Summary
```text
ESP32 (Telemetry Rig)
  ↓ [MQTT / Telemetry Topics]
Mosquitto Broker
  ↓
Python Backend / Express Server
  ├── Telemetry Collector & Validator
  ├── MongoDB Storage Engine (data/water_leak_detection)
  ├── Detectors (Mass Balance, Current, MNF, CUSUM, Fusion)
  ├── Localization & Isolation
  ├── Replay Engine
  └── CP-SAT Work Order Scheduler
  ↓
MongoDB Database (mongodb://localhost:27017/water_leak_detection)
  ↓
Interactive Dashboard Workbench
```

---

## Completed Features
- [x] **MQTT Spec & Collector**: JSON Telemetry schema (`rig/telemetry`), input/output flow ($Q_{in}$, $Q_{out}$, $Q_{branch}$), pump power consumption ($I_{mA}$, $V$).
- [x] **MongoDB Collections & Repository**: Collections `telemetry`, `leak_events`, `detections`, `experiment_runs`, `work_orders`.
- [x] **Core Mass Balance Detector**: $3\sigma$ thresholding on differential flow residual ($Q_{in} - Q_{out} - Q_{branch}$).
- [x] **Current Signature Analysis**: Motor load current spike/drop detection on valve actuation.
- [x] **Minimum Night Flow (MNF) Detector**: Low-baseline leak residual tracking during quiet operational windows.
- [x] **CUSUM Detector**: Cumulative sum drift tracker for subtle micro-leaks.
- [x] **Multi-Sensor Confidence Fusion**: Weighted Bayesian / confidence score combining all 4 detection channels.
- [x] **Replay Engine**: Replay historical benchmark datasets (`RUN_001` - `RUN_012`) with speed adjustments and ROC/F1 evaluation calculation.
- [x] **Branch Localization**: Branch topology isolation determining leak proximity and branch node (Branch A / Branch B / Main).
- [x] **CP-SAT Work Order Scheduler**: Constraint-based crew dispatch matching leak severity with crew skills and travel times.
- [x] **WNTR / EPANET Simulation**: Hydraulic model runner & benchmark comparisons.

---

## Pending Features / Next Tasks
- [ ] Calibrate Flow Sensor 2 K-factor pulse drift under high pressure (>3 bar).
- [ ] Add live hardware serial pass-through connector for direct USB-ESP32 debugging.
- [ ] Execute Run 13-20 high-rate pulse noise stress test.

---

## Database Schema Overview
- `telemetry`: `_id`, `ts`, `seq`, `q_in_lpm`, `q_out_lpm`, `q_branch_lpm`, `current_ma`, `voltage_v`, `pressure_bar`, `raw_pulses_in`, `raw_pulses_out`
- `leak_events`: `_id`, `start_ts`, `stop_ts`, `location_node`, `severity_lpm`, `is_ground_truth`, `notes`
- `detections`: `_id`, `ts`, `method`, `confidence`, `residual`, `is_alarm`, `leak_event_id`
- `experiment_runs`: `_id`, `operator`, `date`, `leak_size_lpm`, `pump_mode`, `notes`
- `work_orders`: `_id`, `leak_event_id`, `crew_name`, `priority`, `scheduled_start`, `status`, `estimated_hrs`

---

## MQTT Topics Specification
- `rig/telemetry` -> Published by ESP32 every 1000ms.
- `rig/cmd` -> Commands sent to ESP32 (e.g. valve open/close, pump PWM speed).
- `rig/status` -> System health, WiFi RSSI, sensor status flags.

---

## Known Bugs & Fixes
- **Flow Sensor Pulse Drift**: Resolved by adding hardware debouncing capacitor (100nF) and 10ms software dead-time in ISR.
- **Servo Re-boot**: Addressed by isolating servo power line to dedicated 5V 2A regulator with common ground.

---

## Recent Decisions
- **Decision #001**: MongoDB selected over SQLite/Relational for schema flexibility, document-oriented time-series indexing, and scalable JSON telemetry storage.
- **Decision #002**: Flat backend structure (`collector`, `detectors`, `replay`, `scheduler`) chosen for 30-second error isolation.
