#ifndef INA219_H
#define INA219_H

#include <Arduino.h>
#include <Adafruit_INA219.h>

class INA219Sensor {
private:
    Adafruit_INA219 ina219;
    bool ready;

public:
    INA219Sensor();
    void begin();
    float readCurrentMA();
    float readVoltageV();
    bool isReady();
};

#endif
