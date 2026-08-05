# MULTI-METHOD DETECTOR DESIGN & FUSION SPECIFICATION

This document outlines the multi-algorithm leak detection architecture, state machine, and multi-sensor fusion engine for the physical rig & digital twin platform.

---

## 1. Detection Algorithms

### A. Mass Balance Residual (3-Sigma)
- **Principle**: Conservation of mass across physical closed-loop system.
- **Formula**:
  $$\text{Residual } R(t) = Q_{\text{in}} - Q_{\text{out}} - Q_{\text{branch}} - \text{Bias}$$
- **Threshold**:
  $$\text{Threshold} = \mu_{\text{residual}} + 3 \times \sigma_{\text{residual}}$$
- **Smoothing**: Exponentially Weighted Moving Average (EWMA, $\alpha = 0.2$) removes short-duration air bubble noise.

---

### B. Motor Current Signature Analysis
- **Principle**: INA219 current sensor monitors motor load ($I_{\text{mA}}$). When a leak occurs, hydraulic backpressure drops, causing an immediate load current shift.
- **Expected Model**:
  $$I_{\text{expected}} = I_{\text{no\_load}} + (Q_{\text{in}} \times k_{\text{slope}})$$
- **Residual**: $\Delta I = I_{\text{expected}} - I_{\text{actual}}$
- **Trigger**: $\Delta I > 20.0 \text{ mA}$ drop or continuous low load under flow.

---

### C. CUSUM (Cumulative Sum) Residual Tracker
- **Principle**: Accumulates small positive residual deviations over time to catch low-severity micro-leaks ($< 0.3 \text{ LPM}$) that do not breach the $3\sigma$ threshold.
- **Formula**:
  $$S_t = \max(0, S_{t-1} + (R(t) - k))$$
- **Trigger**: $S_t \ge h = 3.0$

---

### D. Minimum Night Flow (MNF) Baseline
- **Principle**: Tracks lowest rolling flow differential over quiet operational windows to establish physical zero-leak baseline.

---

## 2. Multi-Sensor Fusion Engine

Combines outputs from independent detectors using a weighted ensemble score:

$$S_{\text{fusion}} = w_{\text{MB}} C_{\text{MB}} + w_{\text{CS}} C_{\text{CS}} + w_{\text{CUSUM}} C_{\text{CUSUM}} + w_{\text{MNF}} C_{\text{MNF}}$$

Default Weights:
- Mass Balance ($w_{\text{MB}}$): **0.40**
- Motor Current ($w_{\text{CS}}$): **0.25**
- CUSUM ($w_{\text{CUSUM}}$): **0.20**
- MNF ($w_{\text{MNF}}$): **0.15**

---

## 3. Explainable Confidence Engine

Categorizes fused decision into qualitative, explainable risk levels:

| Fused Score ($S_{\text{fusion}}$) | Active Detectors | Qualitative Tier | Action |
|---|---|---|---|
| $\ge 0.75$ | $\ge 3$ detectors | **CRITICAL** | Automated Solenoid Isolation + CP-SAT Crew Dispatch |
| $\ge 0.50$ | $\ge 2$ detectors | **HIGH** | Operator Dashboard Alarm + High-Priority Work Order |
| $\ge 0.35$ | $1$ detector | **MEDIUM** | Suspect Flag + Verification Run |
| $< 0.35$ | $0$ detectors | **LOW / NORMAL** | Baseline Monitoring |

---

## 4. Detection State Machine

To prevent false alarms caused by transient air pockets or pump startup surges:

```
[ NORMAL ]
   │
   ├─ Residual > 3σ ──► [ SUSPECTED ]
   │                        │
   │                        ├─ 10s Continuous ──► [ CONFIRMED ]
   │                        │                         │
   │                        └─ Residual Normal ───────┼─► [ RECOVERING ]
   │                                                  │       │
   └──────────────────────────────────────────────────┴───────┴─► [ NORMAL ]
```
