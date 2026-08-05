# CALIBRATION

## Flow Sensor Calibration Procedure
- **Sensor Model**: YF-S201 Hall Effect Flow Sensor (1-30 L/min range)
- **Pulse Formula**: Flow Rate $(\text{L/min}) = \frac{\text{Pulses per sec}}{K}$

### Sensor K-Factors
| Sensor ID | Location | Pulses / Liter (K) | Zero Offset (L/min) | Last Calibrated |
| :--- | :--- | :--- | :--- | :--- |
| Flow Sensor 1 | Main Inlet ($Q_{in}$) | 456 pulse/L | +0.02 | 2026-08-01 |
| Flow Sensor 2 | Main Outlet ($Q_{out}$) | 448 pulse/L | -0.01 | 2026-08-01 |
| Flow Sensor 3 | Branch ($Q_{branch}$) | 452 pulse/L | 0.00 | 2026-08-01 |

## INA219 Current Sensor Calibration
- **Shunt Resistor**: $0.1\,\Omega$
- **Max Expected Current**: $2.0\,\text{A}$
- **Current LSB**: $0.1\,\text{mA}$
- **Zero Load Bias**: $12.5\,\text{mA}$ offset subtracted in firmware.
