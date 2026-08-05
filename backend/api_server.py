"""FastAPI Bridge

Serves the data/detection routes server.ts used to mock. Owns the live/replay
mode toggle: both sources run every sample through the same DetectionPipeline
(backend/pipeline.py) and response_builder, so switching modes only changes
where samples come from, never how they're evaluated.

Run with: uvicorn backend.api_server:app --host 0.0.0.0 --port 8000
"""
import threading
import time
from typing import Optional

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from backend.mqtt.subscriber import LiveTelemetryIngestor, run_subscriber
from backend.pipeline import DetectionPipeline
from backend.response.response_builder import build_response
from backend.repositories.telemetry_repository import TelemetryRepository
from backend.repositories.detection_repository import LeakEventRepository, WorkOrderRepository
from backend.replay.replay_runner import ReplayRunner
from backend.scheduler.cp_sat_scheduler import CPSatWorkOrderScheduler
from backend.localization.localization_service import LocalizationService
from backend.utils.logger import logger

app = FastAPI(title="Water Leak Detection API")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])


class ReplayPlayer:
    """Streams a stored run's telemetry through the pipeline at ~1 sample/sec,
    mirroring how live telemetry arrives, so /api/telemetry looks the same to
    the dashboard regardless of which mode is active."""

    def __init__(self):
        self.telemetry_repo = TelemetryRepository()
        self.pipeline: Optional[DetectionPipeline] = None
        self.thread: Optional[threading.Thread] = None
        self.stop_flag = threading.Event()
        self.latest_response = None
        self.latest_telemetry = None
        self.history = []
        self.current_run_id = None

    def start(self, run_id: str, speed: float = 4.0):
        self.stop()
        docs = self.telemetry_repo.get_by_run(run_id)
        if not docs:
            logger.warning(f"[ReplayPlayer] run_id={run_id} has no stored telemetry")
            return
        self.current_run_id = run_id
        self.pipeline = DetectionPipeline()
        self.stop_flag = threading.Event()
        self.history = []
        self.thread = threading.Thread(target=self._play, args=(docs, speed), daemon=True)
        self.thread.start()

    def _play(self, docs, speed):
        while not self.stop_flag.is_set():
            for doc in docs:
                if self.stop_flag.is_set():
                    return
                flow, power, actuators = doc["flow"], doc["power"], doc.get("actuators", {})
                result = self.pipeline.process_sample(
                    ts=doc["ts"], q_in=flow["q_in_lpm"], q_out=flow["q_out_lpm"],
                    q_branch=flow.get("q_branch_lpm", 0.0), current_ma=power["current_ma"],
                    voltage_v=power.get("voltage", 12.0), pump_on=actuators.get("pump1", True),
                    servo_state_deg=actuators.get("servo_deg", 0), pressure_bar=doc.get("pressure_bar"),
                )
                response = build_response(result)
                self.latest_response = response
                self.latest_telemetry = doc
                self.history.append(doc)
                if len(self.history) > 120:
                    self.history.pop(0)
                time.sleep(1.0 / speed)

    def stop(self):
        if self.thread and self.thread.is_alive():
            self.stop_flag.set()
            self.thread.join(timeout=2)


# --- Mode state -------------------------------------------------------------
_mode = "replay"  # default to replay so the dashboard has data before the rig connects
_live_ingestor = LiveTelemetryIngestor()
_replay_player = ReplayPlayer()
_mqtt_client = None


@app.on_event("startup")
def on_startup():
    global _mqtt_client
    try:
        _mqtt_client, _ = run_subscriber(ingestor=_live_ingestor, blocking=False)
    except Exception as e:
        logger.warning(f"[Startup] Could not connect to MQTT broker (live mode will show no data until it's reachable): {e}")


class ModeRequest(BaseModel):
    mode: str
    run_id: Optional[str] = None


@app.get("/api/health")
def health():
    return {
        "status": "ok",
        "mode": _mode,
        "mqtt_connected": bool(_mqtt_client and _mqtt_client.is_connected()) if _mqtt_client else False,
        "timestamp": int(time.time()),
    }


@app.get("/api/mode")
def get_mode():
    return {"mode": _mode, "run_id": _replay_player.current_run_id if _mode == "replay" else None}


@app.post("/api/mode")
def set_mode(req: ModeRequest):
    global _mode
    if req.mode not in ("live", "replay"):
        return {"success": False, "error": "mode must be 'live' or 'replay'"}
    _mode = req.mode
    if _mode == "replay" and req.run_id:
        _replay_player.start(req.run_id)
    return {"success": True, "mode": _mode}


def _flatten_telemetry(raw: dict, response: Optional[dict], mode: str) -> Optional[dict]:
    """Normalizes either a raw MQTT payload (live) or a stored Mongo telemetry
    doc (replay) into the flat {q_in, q_out, ...} shape the dashboard's chart
    and summary components expect, regardless of source."""
    if raw is None:
        return None

    if mode == "live":
        q_in, q_out, q_branch = raw.get("q_in_lpm", 0.0), raw.get("q_out_lpm", 0.0), raw.get("q_branch_lpm", 0.0)
        current_ma, voltage_v = raw.get("current_ma", 0.0), raw.get("voltage_v", 0.0)
        pump_on = True  # rig runs the pump continuously; not carried in the MQTT payload
        leak_active = bool(raw.get("solenoid_state", False))
        ts = raw.get("ts")
    else:
        flow, power, actuators = raw.get("flow", {}), raw.get("power", {}), raw.get("actuators", {})
        q_in, q_out, q_branch = flow.get("q_in_lpm", 0.0), flow.get("q_out_lpm", 0.0), flow.get("q_branch_lpm", 0.0)
        current_ma, voltage_v = power.get("current_ma", 0.0), power.get("voltage", 0.0)
        pump_on = actuators.get("pump1", True)
        leak_active = bool(response and response.get("is_alarm"))
        ts = raw.get("ts")

    residual = response.get("residual") if response else round(q_in - q_out - q_branch, 3)
    pressure_bar = response.get("pressure", {}).get("pressure_bar") if response else raw.get("pressure_bar")

    return {
        "ts": ts, "q_in": q_in, "q_out": q_out, "q_branch": q_branch,
        "current_ma": current_ma, "voltage_v": voltage_v, "residual": residual,
        "pressure_bar": pressure_bar, "pump_on": pump_on, "leak_active": leak_active,
    }


@app.get("/api/telemetry")
def get_telemetry():
    source = _live_ingestor if _mode == "live" else _replay_player
    flat = _flatten_telemetry(source.latest_telemetry, source.latest_response, _mode)
    return {
        "mode": _mode,
        "latest": flat,
        "pump_on": flat["pump_on"] if flat else True,
        "leak_active": flat["leak_active"] if flat else False,
        "evaluation": source.latest_response,
    }


@app.get("/api/telemetry/history")
def get_telemetry_history():
    if _mode == "live":
        docs = TelemetryRepository().get_recent(limit=120, run_id=None)
        return [_flatten_telemetry(d, None, "replay") for d in docs]
    return [_flatten_telemetry(d, None, "replay") for d in _replay_player.history]


@app.get("/api/replay/runs")
def list_replay_runs():
    from backend.repositories.db import get_db
    db = get_db()
    return list(db.experiment_runs.find({}, {"_id": 0}))


@app.post("/api/replay/evaluate")
def evaluate_replay(body: dict):
    run_id = body.get("run_id")
    if not run_id:
        return {"error": "run_id is required"}
    runner = ReplayRunner()
    return runner.run(run_id)


_ZONE_CONFIDENCE_NUMERIC = {"HIGH": 0.9, "MEDIUM": 0.6, "LOW": 0.3, "NONE": 0.0}
_ZONE_ISOLATION_VALVE = {"Branch_A": "SOLENOID_VALVE_2", "Branch_B": "SOLENOID_VALVE_3", "Main_Trunk": "MAIN_ISOLATION_VALVE"}


@app.get("/api/localization/current")
def localization_current():
    source = _live_ingestor if _mode == "live" else _replay_player
    resp = source.latest_response
    if not resp or resp.get("zone") in (None, "NONE"):
        return {"localized": False, "node": "NONE", "branch": "NONE", "distance_meters": 0.0, "confidence": 0.0}
    zone = resp["zone"]
    return {
        "localized": True,
        "node": zone,
        "branch": zone,
        "distance_meters": None,  # not measurable without a distributed pressure/flow sensor network
        "confidence": _ZONE_CONFIDENCE_NUMERIC.get(resp["zone_confidence"], 0.0),
        "isolation_valve_suggested": _ZONE_ISOLATION_VALVE.get(zone),
        "likelihood_score": resp["likelihood_score"],
    }


@app.post("/api/leak/toggle")
def leak_toggle(body: dict):
    # Live mode reflects the real rig — this only makes sense as a replay-mode
    # control (the seeded run already has leak windows baked in; this is a
    # placeholder for a future "restart replay with a custom leak" feature).
    if _mode == "live":
        return {"success": False, "error": "Leak injection is disabled in live mode — the rig is the source of truth."}
    return {"success": True, "note": "Replay runs currently use their pre-seeded leak window; manual injection is not yet implemented."}


@app.get("/api/work-orders")
def list_work_orders():
    return WorkOrderRepository().list_all()


@app.post("/api/work-orders/dispatch")
def dispatch_work_order(body: dict):
    scheduler = CPSatWorkOrderScheduler()
    leak = {
        "id": body.get("leak_event_id", int(time.time())),
        "location_node": body.get("location", "Branch_A"),
        "severity_lpm": float(body.get("severity", 1.25)),
    }
    work_orders = scheduler.optimize_schedule([leak])
    wo = work_orders[0]
    wo["id"] = wo.pop("work_order_id")
    WorkOrderRepository().insert(wo)
    return {"success": True, "work_order": wo}
