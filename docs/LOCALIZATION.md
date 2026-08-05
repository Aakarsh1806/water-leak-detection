# PIPELINE BRANCH LOCALIZATION & HYDRAULIC ZONE DIAGNOSIS

This document specifies the pipeline branch localization logic, servo valve isolation workflow, and hydraulic zone mapping for the physical test rig.

---

## 1. Network Topology & Hydraulic Zones

The physical rig consists of four distinct topological zones:

1. **Main_Trunk**: Primary loop connecting pump outlet to YF-S201 #1 ($Q_{\text{in}}$).
2. **Branch_A**: Side loop controlled by Servo Motor (0° = Open, 45°/90° = Closed) with YF-S201 #3 ($Q_{\text{branch}}$).
3. **Branch_B**: Secondary loop feeding downstream node 3.
4. **Branch_C**: Return manifold leading back to YF-S201 #2 ($Q_{\text{out}}$) and reservoir tank.

---

## 2. Active Isolation Workflow

When a leak is CONFIRMED by the Fusion Engine:

1. **Baseline Assessment**:
   Record initial mass balance residual $R_{\text{initial}} = Q_{\text{in}} - Q_{\text{out}} - Q_{\text{branch}}$.
2. **Actuate Servo Valve**:
   Send command `rig/cmd` with `{"servo_deg": 45}` to isolate Branch A.
3. **Observe Residual Drop**:
   - If $R_{\text{post\_isolation}} \le 0.1 \times R_{\text{initial}}$ (70%+ drop):
     - **Verdict**: Leak is localized to **Branch A**.
   - If residual remains unchanged:
     - **Verdict**: Leak is localized to **Main Trunk** or **Branch B/C**.
4. **Restore Valve Position**:
   Return servo to 0° baseline after diagnostic window.

---

## 3. Decision Matrix

| $Q_{\text{branch}}$ Flow Delta | Servo Isolation Drop | Localized Zone | Confidence |
|---|---|---|---|
| $> +0.3 \text{ LPM}$ | N/A | **Branch A (Side Loop)** | HIGH |
| $< 0.05 \text{ LPM}$ | $> 70\%$ drop | **Branch A** | HIGH |
| $< 0.05 \text{ LPM}$ | $< 10\%$ drop | **Branch B / Main Trunk** | MEDIUM |
| $< 0.05 \text{ LPM}$ | Variable | **Branch C (Return Manifold)** | LOW |

---

## 4. UI Visualization
The Dashboard **Localization Page** displays:
- Color-coded interactive SVG network diagram (Green = PASS, Red = FAIL/LEAK)
- Isolation test execution history table with before/after residual metrics
- Current estimated leak zone banner
