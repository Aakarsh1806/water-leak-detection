# Firmware (ESP32)

Platform: **PlatformIO / Arduino Framework**
Target MCU: **ESP32 DevModule**

## Building & Flashing

```bash
# Compile and flash via USB serial
pio run --target upload

# Open Serial Monitor (115200 baud)
pio device monitor
```

## Structure
- `src/main.cpp`: Main firmware entry point, timer interrupts, MQTT telemetry publisher.
- `src/config.h`: WiFi credentials, MQTT broker IP, GPIO pin definitions.
- `src/flow_sensor.*`: Pulse ISR counting & LPM flow calculations.
- `src/ina219.*`: Pump current & voltage sensor driver.
- `src/mqtt_client.*`: MQTT network handler & command receiver.
- `src/relay.*`: Pump and solenoid relay controllers.
- `src/servo.*`: Variable leak aperture servo control.
