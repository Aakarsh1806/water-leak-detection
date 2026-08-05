#include "flow_sensor.h"

FlowSensor::FlowSensor(uint8_t gpioPin, float kFactorValue)
    : pin(gpioPin), kFactor(kFactorValue), pulseCount(0), lastPulseCount(0), lastReadMs(0) {}

void IRAM_ATTR FlowSensor::isrHandler(void* arg) {
    FlowSensor* self = static_cast<FlowSensor*>(arg);
    self->pulseCount++;
}

void FlowSensor::begin() {
    pinMode(pin, INPUT_PULLUP);
    lastReadMs = millis();
    // attachInterruptArg lets each instance register its own ISR without a
    // global lookup table — required since FlowSensor::handleISR can't be
    // used directly as a C function pointer.
    attachInterruptArg(digitalPinToInterrupt(pin), isrHandler, this, FALLING);
}

void FlowSensor::handleISR() {
    pulseCount++;
}

float FlowSensor::readFlowLPM() {
    unsigned long now = millis();
    unsigned long elapsedMs = now - lastReadMs;
    if (elapsedMs == 0) return 0.0f;

    noInterrupts();
    uint32_t currentPulses = pulseCount;
    interrupts();

    uint32_t deltaPulses = currentPulses - lastPulseCount;
    lastPulseCount = currentPulses;
    lastReadMs = now;

    float pulsesPerSec = (float)deltaPulses / ((float)elapsedMs / 1000.0f);
    float lpm = pulsesPerSec / kFactor * 60.0f;
    return (lpm < 0.05f) ? 0.0f : lpm;
}

uint32_t FlowSensor::getTotalPulses() {
    noInterrupts();
    uint32_t total = pulseCount;
    interrupts();
    return total;
}
