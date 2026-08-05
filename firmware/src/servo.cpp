#include "servo.h"

ServoController::ServoController(uint8_t gpioPin) : pin(gpioPin), currentAngle(0) {}

void ServoController::begin() {
    servo.setPeriodHertz(50);
    servo.attach(pin, 500, 2400);
    setAngle(0);
}

void ServoController::setAngle(int angleDegrees) {
    currentAngle = constrain(angleDegrees, 0, 180);
    servo.write(currentAngle);
}

int ServoController::getAngle() {
    return currentAngle;
}
