#ifndef FLOW_SENSOR_H
#define FLOW_SENSOR_H

/**
 * ESP32 Driver for YF-S201 Hall-Effect Flow Sensor
 * Uses Interrupt Service Routine (ISR) for pulse counting.
 */

class FlowSensor {
private:
    uint8_t pin;
    volatile uint32_t pulseCount;
    float kFactor; // Pulses per second per L/min (default 7.5 for YF-S201)
    unsigned long lastTimeMs;

public:
    FlowSensor(uint8_t gpioPin, float calibrationFactor = 7.5) 
        : pin(gpioPin), pulseCount(0), kFactor(calibrationFactor), lastTimeMs(0) {}

    void IRAM_ATTR handleInterrupt() {
        pulseCount++;
    }

    void begin() {
        lastTimeMs = millis();
        pulseCount = 0;
    }

    float readFlowLPM() {
        unsigned long now = millis();
        float durationSec = (now - lastTimeMs) / 1000.0;
        if (durationSec <= 0.0) return 0.0;

        uint32_t pulses = pulseCount;
        pulseCount = 0;
        lastTimeMs = now;

        float hz = pulses / durationSec;
        return hz / kFactor;
    }
};

#endif
