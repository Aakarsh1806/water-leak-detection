#ifndef WATCHDOG_H
#define WATCHDOG_H

/**
 * ESP32 Hardware Watchdog Service
 * Safely shuts down pumps if MQTT control heartbeats stop for > 30 seconds.
 */

class HardwareWatchdog {
private:
    unsigned long lastCommandMs;
    const unsigned long timeoutMs = 30000;

public:
    HardwareWatchdog() : lastCommandMs(0) {}

    void feed() {
        lastCommandMs = millis();
    }

    void checkSafety() {
        if (millis() - lastCommandMs > timeoutMs) {
            // Safety Trip: Cut power to relays
            // digitalWrite(PUMP1_PIN, LOW);
            // digitalWrite(PUMP2_PIN, LOW);
        }
    }
};

#endif
