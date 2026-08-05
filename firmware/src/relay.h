#ifndef RELAY_H
#define RELAY_H

#include <Arduino.h>

class RelayController {
private:
    uint8_t pin;
    bool state;

public:
    RelayController(uint8_t gpioPin);
    void begin();
    void on();
    void off();
    bool getState();
};

#endif
