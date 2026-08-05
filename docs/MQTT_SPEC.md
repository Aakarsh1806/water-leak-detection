# MQTT SPECIFICATION

## Broker Configuration
- **Default Port**: 1883 (TCP)
- **Quality of Service (QoS)**: 1 (At least once delivery)
- **Retain Flag**: False for telemetry, True for status

## Topics

### 1. `rig/telemetry`
Published by ESP32 every 1000ms.

#### JSON Payload Schema:
```json
{
  "ts": 1722686947,
  "device_id": "esp32_rig_01",
  "q_in_lpm": 5.20,
  "q_out_lpm": 5.15,
  "q_branch_lpm": 0.00,
  "current_ma": 420.5,
  "voltage_v": 12.1,
  "raw_pulses_in": 2368,
  "raw_pulses_out": 2345,
  "solenoid_state": false
}
```

> **Note:** `pressure_bar` is *not* published by the firmware — there is no physical
> pressure sensor on the rig. The backend (`backend/utils/pressure_estimate.py`)
> derives an estimated `pressure_bar` from flow/pump state on ingestion and tags it
> `"source": "estimated"` in stored/returned documents. Replay/synthetic datasets may
> carry real authored `pressure_bar` values, tagged `"source": "logged"`.

### 2. `rig/cmd`
Commands sent to the ESP32.

#### Example Command Payload:
```json
{
  "cmd": "SET_VALVE",
  "valve_id": "leak_valve_1",
  "state": "OPEN",
  "ts": 1722686950
}
```

### 3. `rig/status`
Health status published on boot and periodically.

```json
{
  "device_id": "esp32_rig_01",
  "wifi_rssi": -62,
  "uptime_sec": 3450,
  "heap_free": 184520,
  "status": "ONLINE"
}
```
