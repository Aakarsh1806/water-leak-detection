"""Seed a Replay Run

Generates a realistic multi-minute telemetry series with an injected leak
window and stores it for real in MongoDB, so Replay mode has genuine data to
run against before the physical rig has produced its first live-captured run.
Ground truth leak events are stored alongside so precision/recall/F1 are
computed against something real, not a hand-authored placeholder.

Run with: python -m backend.replay.seed_runs
"""
import random
import time

from backend.repositories.telemetry_repository import TelemetryRepository
from backend.repositories.detection_repository import LeakEventRepository
from backend.models.telemetry import TelemetryDTO, FlowData, PowerData, ActuatorData, HealthData
from backend.repositories.db import get_db
from backend.utils.logger import logger


def generate_run(run_id="RUN_001", duration_sec=300, leak_start_sec=120, leak_end_sec=180,
                  leak_size_lpm=1.25, location_node="Branch_A", base_ts=None):
    base_ts = base_ts or int(time.time()) - duration_sec
    random.seed(42)  # deterministic demo data

    db = get_db()
    telemetry_repo = TelemetryRepository(db)
    leak_event_repo = LeakEventRepository(db)

    # Clear any prior seed of this run so re-running is idempotent.
    db.telemetry.delete_many({"run_id": run_id})
    db.leak_events.delete_many({"run_id": run_id})
    db.experiment_runs.delete_many({"run_id": run_id})

    seq = 0
    for t in range(duration_sec):
        ts = base_ts + t
        is_leak = leak_start_sec <= t <= leak_end_sec
        noise = random.uniform(-0.03, 0.03)

        q_in = 5.2 + noise
        q_out = (q_in - leak_size_lpm) if is_leak else (q_in - 0.02 + noise)
        q_branch = 0.0
        current_ma = (420.0 - 30.0 if is_leak else 420.0) + random.uniform(-2, 2)

        dto = TelemetryDTO(
            ts=ts,
            seq=seq,
            flow=FlowData(q_in_lpm=round(q_in, 3), q_out_lpm=round(max(0.0, q_out), 3),
                           q_branch_lpm=q_branch, pulses_in=seq * 40, pulses_out=seq * 39),
            power=PowerData(voltage=12.05, current_ma=round(current_ma, 1)),
            actuators=ActuatorData(pump1=True, pump2=False, servo_deg=45 if is_leak else 0),
            health=HealthData(uptime_s=t, wifi_rssi=-58, free_heap=180000),
        )
        pressure_bar = round(2.5 - (0.35 * leak_size_lpm if is_leak else 0.0), 2)
        telemetry_repo.save_sample(dto, run_id=run_id, extra={"pressure_bar": pressure_bar})
        seq += 1

    leak_event_repo.create_event(
        start_ts=base_ts + leak_start_sec,
        location_node=location_node,
        severity_lpm=leak_size_lpm,
        run_id=run_id,
        is_ground_truth=True,
        notes="Seeded synthetic leak for replay demo",
    )
    db.leak_events.update_many(
        {"run_id": run_id},
        {"$set": {"stop_ts": base_ts + leak_end_sec}}
    )

    db.experiment_runs.insert_one({
        "run_id": run_id,
        "operator": "seed_script",
        "date": time.strftime("%Y-%m-%d"),
        "leak_size_lpm": leak_size_lpm,
        "location": location_node,
        "duration_sec": duration_sec,
        "pump_mode": "constant",
        "notes": "Synthetic seed run for replay demo",
    })

    logger.info(f"[Seed] Stored {seq} telemetry samples + 1 leak event for run_id={run_id}")
    return run_id


if __name__ == "__main__":
    generate_run()
