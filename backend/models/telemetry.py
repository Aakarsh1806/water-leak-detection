"""
Frozen Telemetry Data Transfer Objects (DTOs)
Strictly enforces sensor payload structure from ESP32.
"""
from typing import Optional
from dataclasses import dataclass, field

@dataclass
class FlowData:
    q_in_lpm: float = 0.0
    q_out_lpm: float = 0.0
    q_branch_lpm: float = 0.0
    pulses_in: int = 0
    pulses_out: int = 0
    pulses_branch: int = 0

@dataclass
class PowerData:
    voltage: float = 12.0
    current_ma: float = 400.0

@dataclass
class ActuatorData:
    pump1: bool = True
    pump2: bool = False
    servo_deg: int = 0

@dataclass
class HealthData:
    uptime_s: int = 0
    wifi_rssi: int = -60
    free_heap: int = 180000

@dataclass
class TelemetryDTO:
    ts: float
    seq: int
    flow: FlowData = field(default_factory=FlowData)
    power: PowerData = field(default_factory=PowerData)
    actuators: ActuatorData = field(default_factory=ActuatorData)
    health: HealthData = field(default_factory=HealthData)

    @classmethod
    def from_dict(cls, data: dict) -> 'TelemetryDTO':
        flow_d = data.get("flow", {})
        power_d = data.get("power", {})
        act_d = data.get("actuators", {})
        health_d = data.get("health", {})

        return cls(
            ts=data.get("ts", 0.0),
            seq=data.get("seq", 0),
            flow=FlowData(
                q_in_lpm=float(flow_d.get("q_in_lpm", 0.0)),
                q_out_lpm=float(flow_d.get("q_out_lpm", 0.0)),
                q_branch_lpm=float(flow_d.get("q_branch_lpm", 0.0)),
                pulses_in=int(flow_d.get("pulses_in", 0)),
                pulses_out=int(flow_d.get("pulses_out", 0)),
                pulses_branch=int(flow_d.get("pulses_branch", 0))
            ),
            power=PowerData(
                voltage=float(power_d.get("voltage", 12.0)),
                current_ma=float(power_d.get("current_ma", 400.0))
            ),
            actuators=ActuatorData(
                pump1=bool(act_d.get("pump1", True)),
                pump2=bool(act_d.get("pump2", False)),
                servo_deg=int(act_d.get("servo_deg", 0))
            ),
            health=HealthData(
                uptime_s=int(health_d.get("uptime_s", 0)),
                wifi_rssi=int(health_d.get("wifi_rssi", -60)),
                free_heap=int(health_d.get("free_heap", 180000))
            )
        )
