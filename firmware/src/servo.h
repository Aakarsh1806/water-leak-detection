#ifndef SERVO_H
#define SERVO_H

#include <Arduino.h>
#include <ESP32Servo.h>

class ServoController {
private:
    uint8_t pin;
    Servo servo;
    int currentAngle;

public:
    ServoController(uint8_t gpioPin);
    void begin();
    void setAngle(int angleDegrees);
    int getAngle();
};

#endif
