#include "ina219.h"
#include "config.h"
#include <Wire.h>

INA219Sensor::INA219Sensor() : ready(false) {}

void INA219Sensor::begin() {
    Wire.begin(PIN_I2C_SDA, PIN_I2C_SCL, 400000);
    ready = ina219.begin(&Wire);
    if (!ready) {
        Serial.println("[INA219] WARNING: sensor not found on I2C bus — current/voltage readings will be 0");
    }
}

float INA219Sensor::readCurrentMA() {
    if (!ready) return 0.0f;
    return ina219.getCurrent_mA();
}

float INA219Sensor::readVoltageV() {
    if (!ready) return 0.0f;
    // Bus voltage is measured downstream of the shunt; add the shunt drop back
    // in so this reflects the supply rail, matching what current_signature
    // detection on the backend expects (~12V nominal).
    return ina219.getBusVoltage_V() + (ina219.getShuntVoltage_mV() / 1000.0f);
}

bool INA219Sensor::isReady() {
    return ready;
}
