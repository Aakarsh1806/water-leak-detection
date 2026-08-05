#include "relay.h"

RelayController::RelayController(uint8_t gpioPin) : pin(gpioPin), state(false) {}

void RelayController::begin() {
    pinMode(pin, OUTPUT);
    off();
}

void RelayController::on() {
    digitalWrite(pin, LOW); // Active low relay
    state = true;
}

void RelayController::off() {
    digitalWrite(pin, HIGH);
    state = false;
}

bool RelayController::getState() {
    return state;
}
