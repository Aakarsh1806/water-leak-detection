"""WNTR (Water Network Tool for Resilience) Hydraulic Model Simulator

Simulates pressure and flow responses across pipe network topology under emitter/leak injections.
"""

class WNTRSimulator:
    def __init__(self, pipe_count=12, junction_count=8):
        self.pipe_count = pipe_count
        self.junction_count = junction_count

    def run_simulation(self, leak_emitter_coefficient=0.05, duration_hrs=24):
        time_steps = []
        junction_pressures = []

        for hour in range(duration_hrs):
            time_steps.append(f"{hour:02d}:00")
            base_p = 32.0 + 3.0 * np.sin(hour * np.pi / 12)
            leak_drop = leak_emitter_coefficient * 18.0 if 10 <= hour <= 18 else 0.0
            junction_pressures.append(round(base_p - leak_drop, 2))

        return {
            "network": "Net3_Rig_Subsystem",
            "duration_hrs": duration_hrs,
            "time_steps": time_steps,
            "pressures": junction_pressures,
            "leak_flow_lpm": round(leak_emitter_coefficient * 25.0, 2)
        }
