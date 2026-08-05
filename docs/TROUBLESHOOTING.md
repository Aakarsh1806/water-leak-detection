# TROUBLESHOOTING GUIDE

| Issue | Root Cause | Verification | Solution / Fix |
| :--- | :--- | :--- | :--- |
| **No MQTT messages** | ESP32 WiFi disconnect or wrong broker IP | Check Serial monitor @ 115200 baud | Re-flash `config.h` with correct WiFi/MQTT IP |
| **Random false leak alarms** | Trapped air bubbles in flow meter chamber | Inspect clear PVC tube for bubbles | Bleed air from system at high pump speed for 2 mins |
| **Flow sensor pulse drift** | High pressure pulse skipping | Run K-factor test script | Add 100nF filtering capacitor across signal line |
| **ESP32 reboots when Servo moves** | Voltage drop on 5V rail due to servo current spike | Probe 5V pin on oscilloscope | Isolate servo power to separate 5V 2A regulator |
| **MongoDB connection timeout** | MongoDB daemon down or wrong URI | Run `mongod --version` / test connection | Start `mongod` daemon or update `MONGO_URI=mongodb://localhost:27017` |

