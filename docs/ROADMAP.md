# ROADMAP

## Phase 1: Telemetry Pipeline
- **Goal**: Get telemetry data moving reliably end-to-end.
- **Deliverables**:
  - ESP32 publishes telemetry (`rig/telemetry`)
  - MQTT Mosquitto broker receives telemetry
  - Python backend validates and stores data in MongoDB
  - Dashboard displays live telemetry streams
- **Success Criteria**:
  - Water flows through rig, pulse counters convert to L/min
  - Dashboard updates smoothly at 1Hz
  - Data correctly persisted in MongoDB (`telemetry` collection)


---

## Phase 2: Core Leak Detection
- **Goal**: Mass Balance Leak Detection & Replay System
- **Deliverables**:
  - Differential Mass Balance detector ($Q_{in} - Q_{out}$)
  - Ground truth leak event logging system
  - Replay system for benchmark datasets
  - Analytics & evaluation metrics (Precision, Recall, F1, Latency)
- **Success Criteria**:
  - Opening solenoid/valve triggers instant leak residual spike
  - Alarm appears on dashboard within <3s
  - Detection event auto-created and linked to ground truth
  - Replay system allows offline re-testing of algorithms

---

## Phase 3: Advanced Detection & Localization
- **Goal**: Multi-Method Fusion & Branch Localization
- **Deliverables**:
  - Motor Current Signature detector (INA219 current transients)
  - Minimum Night Flow (MNF) baseline tracker
  - CUSUM (Cumulative Sum) residual drift detector
  - Confidence Fusion Engine (weighted Bayesian score)
  - Hydraulic Branch Localization engine
- **Success Criteria**:
  - All 4 detection algorithms operate concurrently
  - Combined confidence index correctly flags micro-leaks (<0.3 L/min)
  - Branch localization accurately identifies Branch A vs Branch B vs Main Pipe

---

## Phase 4: Scale, Simulation & Optimization
- **Goal**: Hydraulic Simulation & Field Crew Work Order Optimization
- **Deliverables**:
  - WNTR / EPANET hydraulic model simulation runner
  - CP-SAT Solver work order scheduler for repair crew dispatch
  - Final evaluation report generator
- **Success Criteria**:
  - Hydraulic simulation generates synthetic leak scenarios matching physical rig
  - CP-SAT solver computes optimal crew dispatch schedule within constraints
  - Final metrics export (PDF/JSON summary)
