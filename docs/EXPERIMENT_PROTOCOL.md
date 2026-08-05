# EXPERIMENT PROTOCOL

## Standardized Leak Injection Procedure

1. **System Preparation**:
   - Verify water reservoir level is $>80\%$.
   - Power up pump and run at nominal flow rate ($5.0\text{ L/min}$) for 3 minutes to bleed trapped air bubbles.
   - Confirm baseline differential residual $|Q_{in} - Q_{out}| < 0.1\text{ L/min}$.

2. **Control Baseline Phase (0s - 120s)**:
   - Start telemetry logger (`RUN_XXX`).
   - Allow system to stabilize for 120 seconds with all leak valves closed.

3. **Leak Injection Phase (120s - 300s)**:
   - Open designated leak valve (e.g. `Leak_Valve_A` for small leak $0.5\text{ L/min}$, `Leak_Valve_B` for medium leak $1.2\text{ L/min}$, `Leak_Valve_C` for large leak $2.5\text{ L/min}$).
   - Note exact time of valve opening in experiment logbook.

4. **Recovery Phase (300s - 420s)**:
   - Close leak valve.
   - Continue logging for 120 seconds until flow returns to baseline.

5. **Post-Run Audit**:
   - Save dataset as `RUN_XXX/telemetry.csv`.
   - Update `metadata.json` with ground truth start/stop timestamps and measured leak rate.
