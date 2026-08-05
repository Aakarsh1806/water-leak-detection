# Water Leak Detection System (Hardware-In-The-Loop & Analytics Workbench)

A high-reliability, real-time water pipeline leak detection system combining physical test rig telemetry (ESP32), multi-algorithm sensor fusion (Mass Balance, Current Signature, CUSUM, MNF), explainable confidence evaluation, branch isolation localization, and a full-stack Web Workbench & Dashboard.

---

## 🛠️ Prerequisites & Installation Requirements

Before running the application or physical rig components, ensure the following prerequisites are installed on your environment:

### 1. System Runtime Requirements
* **Node.js**: `v18.x` or `v20.x` (LTS recommended)
* **npm**: `v9.x` or higher
* **Python**: `3.9+` (with `pip` package manager)
* **MQTT Broker**: Mosquitto MQTT Broker (or compatible broker) running on port `1883`
* **Database**: MongoDB instance (v6.0+ recommended) running on `mongodb://localhost:27017`
* **Firmware (Optional for Physical Rig)**: PlatformIO CLI or Arduino IDE with ESP32 board support packages

---

## 📦 Installation Guide

### Step 1: Install Node.js Dependencies (Dashboard & Server)

In the project root directory, run:

```bash
npm install
```

This installs Express, React 19, Recharts, Lucide React, Vite, Tailwind CSS, motion, tsx, and type declarations.

---

### Step 2: Install Python Backend Dependencies

Install the required Python packages using `requirements.txt`:

```bash
pip install -r requirements.txt
```

*Required Python libraries installed:*
* `pyyaml`: Configuration parsing
* `paho-mqtt`: MQTT communication client
* `pymongo`: Database operations
* `pydantic`: DTO schema validation
* `numpy` / `scipy`: Numerical processing & analytics

---

## 🚀 Running Commands

### 1. System Self-Diagnostic Test
Before starting the web app or connecting hardware, verify all backend modules (Config Loader, Telemetry Validator, Detector Engine, State Machine, Fusion & Confidence Engine, Localization Service):

```bash
python backend/self_test/system_self_test.py
```

---

### 2. Hardware Unit Test Scripts
Test individual sensor and actuator interfaces:

```bash
# Test YF-S201 Flow Sensor #1 calculation logic
python tests/test_flow1.py

# Test INA219 Motor Current & Voltage sampling logic
python tests/test_ina219.py

# Test Servo Motor isolation PWM commands
python tests/test_servo.py

# Test Relay Pump toggle signals
python tests/test_pump.py
```

---

### 3. Start Development Web Workbench (Full-Stack Express + Vite)

To run the interactive live dashboard and backend proxy server:

```bash
npm run dev
```

* Access the live dashboard at: `http://localhost:3000`

---

### 4. Build for Production

To compile the React client assets and bundle `server.ts` into a standalone CommonJS bundle (`dist/server.cjs`):

```bash
npm run build
```

---

### 5. Start Production Server

Launch the compiled production bundle:

```bash
npm run start
```

---

## ⚙️ Configuration Setup

System parameters and thresholds are dynamically configured in `backend/config/settings.yaml`:

```yaml
mqtt:
  host: "localhost"
  port: 1883
  topic: "rig/telemetry"
  cmd_topic: "rig/cmd"

database:
  uri: "mongodb://localhost:27017"
  name: "water_leak_detection"

detector:
  sigma_multiplier: 3.0
  persistence_seconds: 10
  bias_lpm: 0.10
  current_drop_threshold_ma: 20.0
  cusum_slack_k: 0.15
  cusum_decision_h: 3.0
```

---

## 🔌 Hardware Setup & Firmware Flashing

1. Connect ESP32 DevKit V1 to (see `docs/HARDWARE_SETUP.md` / `firmware/docs/PINOUT.md` — source of truth, matches `firmware/src/config.h`):
   - **YF-S201 Flow Sensors**: GPIO 34 ($Q_{\text{in}}$), GPIO 35 ($Q_{\text{out}}$), GPIO 32 ($Q_{\text{branch}}$)
   - **INA219 Current Sensor**: I2C SDA (GPIO 21) / SCL (GPIO 22)
   - **Relays (Pump / Leak Solenoid)**: GPIO 25 & GPIO 26
   - **Servo Isolation Actuator**: PWM GPIO 27
   - No physical pressure sensor is installed; `pressure_bar` is estimated server-side from flow/pump state.
2. Open `firmware/` in PlatformIO (`platformio.ini` targets `esp32dev`).
3. `pio run --target upload` to flash, `pio device monitor` to view logs.
