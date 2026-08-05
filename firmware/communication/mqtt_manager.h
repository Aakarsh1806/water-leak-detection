#ifndef MQTT_MANAGER_H
#define MQTT_MANAGER_H

/**
 * ESP32 MQTT Manager
 * Manages WiFi connection, MQTT publish (1Hz telemetry), command subscription, and reconnects.
 */

class MQTTManager {
private:
    const char* serverHost;
    int port;
    const char* topicTelemetry;
    const char* topicCmd;

public:
    MQTTManager(const char* host = "192.168.1.10", int brokerPort = 1883) 
        : serverHost(host), port(brokerPort), topicTelemetry("rig/telemetry"), topicCmd("rig/cmd") {}

    void connect() {
        // PubSubClient reconnect loop
    }

    void publishTelemetry(const char* jsonPayload) {
        // Publish payload to rig/telemetry
    }

    void loop() {
        // Keep-alive loop
    }
};

#endif
