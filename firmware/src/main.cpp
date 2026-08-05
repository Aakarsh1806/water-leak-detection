#include <Arduino.h>
#include "config.h"
#include "flow_sensor.h"
#include "ina219.h"
#include "mqtt_client.h"
#include "relay.h"
#include "servo.h"

FlowSensor flowIn(PIN_FLOW_IN, K_FACTOR_FLOW_IN);
FlowSensor flowOut(PIN_FLOW_OUT, K_FACTOR_FLOW_OUT);
FlowSensor flowBranch(PIN_FLOW_BRANCH, K_FACTOR_FLOW_BRANCH);
INA219Sensor powerMeter;
MQTTHandler mqtt;
RelayController pumpRelay(PIN_RELAY_PUMP);
RelayController leakRelay(PIN_RELAY_LEAK);
ServoController leakServo(PIN_SERVO_LEAK);

unsigned long lastTelemetryTime = 0;
unsigned long lastStatusTime = 0;

// Handles SET_VALVE commands received on rig/cmd. This only actuates the
// diagnostic leak-injection valve used to seed synthetic leak events for
// validation — it is not exposed to end users as an operational control.
void handleValveCommand(const char* valveId, bool open) {
    Serial.printf("[CMD] SET_VALVE %s -> %s\n", valveId, open ? "OPEN" : "CLOSE");
    if (open) {
        leakRelay.on();
        leakServo.setAngle(45);
    } else {
        leakRelay.off();
        leakServo.setAngle(0);
    }
}

void setup() {
    Serial.begin(115200);
    Serial.println("[ESP32] Initializing Water Leak Detection Rig...");

    flowIn.begin();
    flowOut.begin();
    flowBranch.begin();
    powerMeter.begin();
    pumpRelay.begin();
    leakRelay.begin();
    leakServo.begin();

    pumpRelay.on(); // Turn pump ON by default
    mqtt.connectWiFi(WIFI_SSID, WIFI_PASS);
    mqtt.connectMQTT(MQTT_BROKER, MQTT_PORT, DEVICE_ID);
    mqtt.setCommandCallback(handleValveCommand);

    Serial.println("[ESP32] System initialization complete. Telemetry active.");
}

void loop() {
    mqtt.loop();

    unsigned long now = millis();
    if (now - lastTelemetryTime >= 1000) {
        lastTelemetryTime = now;

        float qIn = flowIn.readFlowLPM();
        float qOut = flowOut.readFlowLPM();
        float qBranch = flowBranch.readFlowLPM();
        float currentMA = powerMeter.readCurrentMA();
        float voltageV = powerMeter.readVoltageV();

        time_t epoch = time(nullptr);
        unsigned long ts = (epoch > 1700000000) ? (unsigned long)epoch : (now / 1000);

        mqtt.publishTelemetry(ts, qIn, qOut, qBranch, currentMA, voltageV,
                               flowIn.getTotalPulses(), flowOut.getTotalPulses(), leakRelay.getState());
    }

    if (now - lastStatusTime >= 10000) {
        lastStatusTime = now;
        mqtt.publishStatus(WiFi.RSSI(), now / 1000, ESP.getFreeHeap());
    }
}
