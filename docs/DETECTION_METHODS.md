# DETECTION METHODS

## 1. Mass Balance Residual ($3\sigma$)
- **Principle**: Conservation of mass in closed loop flow.
- **Equation**: $\Delta Q = Q_{in} - (Q_{out} + Q_{branch})$
- **Alarm Rule**: Trigger alarm if $|\Delta Q| > \mu_{clean} + 3\sigma_{clean}$ sustained over $N=5$ consecutive samples.

## 2. Motor Current Signature Analysis
- **Principle**: Pump hydraulic load changes under pressure drop caused by leaks or valve openings.
- **Signal**: Differential current transient $\Delta I = I(t) - I(t-1)$.
- **Alarm Rule**: Sudden negative current drop ($\Delta I < -25\text{ mA}$) followed by stabilized low-current shift indicates downstream pressure bleed / leak.

## 3. Minimum Night Flow (MNF)
- **Principle**: Baseline residual evaluation during quiet/low-demand operational periods.
- **Threshold**: Sustained non-zero minimum flow residual during zero-demand window indicates background pipe network degradation.

## 4. Cumulative Sum (CUSUM)
- **Principle**: Sequential analysis for early detection of subtle, gradual micro-leaks ($<0.3\text{ L/min}$).
- **Statistic**: $S_t = \max(0, S_{t-1} + (\Delta Q_t - k))$
- **Alarm Rule**: Trigger alarm when $S_t > h$ (decision threshold $h=5.0$, allowance $k=0.15$).

## 5. Multi-Sensor Confidence Fusion
- **Principle**: Weighted confidence combination across all four independent detection channels:
  $$\text{Confidence} = w_1 C_{\text{MassBalance}} + w_2 C_{\text{Current}} + w_3 C_{\text{MNF}} + w_4 C_{\text{CUSUM}}$$
  where $w_1=0.4, w_2=0.2, w_3=0.2, w_4=0.2$.
- **Decision**: High confidence ($>0.75$) triggers immediate high-priority alarm and CP-SAT work order creation.
