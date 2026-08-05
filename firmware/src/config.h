#ifndef CONFIG_H
#define CONFIG_H

// WiFi Configuration
#define WIFI_SSID "WaterRigNet"
#define WIFI_PASS "LeakDetection2026"

// MQTT Configuration
#define MQTT_BROKER "192.168.1.100"
#define MQTT_PORT 1883
#define MQTT_TOPIC_TELEMETRY "rig/telemetry"
#define MQTT_TOPIC_CMD "rig/cmd"
#define MQTT_TOPIC_STATUS "rig/status"
#define DEVICE_ID "esp32_rig_01"

// GPIO Pinout (see docs/HARDWARE_SETUP.md and firmware/docs/PINOUT.md — README.md's
// table is stale/wrong, do not wire from it)
#define PIN_FLOW_IN 34
#define PIN_FLOW_OUT 35
#define PIN_FLOW_BRANCH 32
#define PIN_RELAY_PUMP 25
#define PIN_RELAY_LEAK 26
#define PIN_SERVO_LEAK 27
#define PIN_I2C_SDA 21
#define PIN_I2C_SCL 22

// Sensor Calibration Constants
#define K_FACTOR_FLOW_IN 456.0f
#define K_FACTOR_FLOW_OUT 448.0f
#define K_FACTOR_FLOW_BRANCH 452.0f

// No physical pressure sensor is installed on this rig. pressure_bar is
// intentionally omitted from the telemetry payload; the backend derives an
// estimated value from flow/pump state instead (see backend/utils/pressure_estimate.py).

#endif // CONFIG_H
