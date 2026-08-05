"""
Experiment Service
Manages digital ground truth logging during physical test rig experiments.
"""
import time
from backend.utils.logger import logger

class ExperimentService:
    def __init__(self):
        self.active_experiment = None
        self.active_leak_event = None

    def start_experiment(self, run_id: str, operator: str, target_leak_lpm: float, location: str):
        self.active_experiment = {
            "run_id": run_id,
            "operator": operator,
            "target_leak_lpm": target_leak_lpm,
            "location": location,
            "start_time": time.time(),
            "status": "RUNNING"
        }
        logger.info(f"[ExperimentService] Started benchmark run {run_id} ({location}, {target_leak_lpm} LPM)")
        return self.active_experiment

    def start_ground_truth_leak(self):
        if not self.active_experiment:
            return None
        self.active_leak_event = {
            "run_id": self.active_experiment["run_id"],
            "leak_start_ts": time.time(),
            "leak_stop_ts": None,
            "is_active": True
        }
        logger.info(f"[GroundTruth] Logged leak START at {self.active_leak_event['leak_start_ts']}")
        return self.active_leak_event

    def stop_ground_truth_leak(self):
        if self.active_leak_event and self.active_leak_event["is_active"]:
            self.active_leak_event["leak_stop_ts"] = time.time()
            self.active_leak_event["is_active"] = False
            logger.info(f"[GroundTruth] Logged leak STOP at {self.active_leak_event['leak_stop_ts']}")
            return self.active_leak_event
        return None

    def stop_experiment(self):
        if self.active_experiment:
            self.active_experiment["end_time"] = time.time()
            self.active_experiment["status"] = "COMPLETED"
            logger.info(f"[ExperimentService] Completed benchmark run {self.active_experiment['run_id']}")
            res = self.active_experiment
            self.active_experiment = None
            return res
        return None
