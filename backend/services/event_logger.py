"""
System Event Logger
Persists distinct operational events (actuator toggles, calibration runs, detector alarms) to MongoDB.
"""
import time
from backend.repositories.db import get_db
from backend.utils.logger import logger


class SystemEventLogger:
    def __init__(self, db=None):
        self.db = db if db is not None else get_db()

    def log_event(self, category: str, message: str, metadata: dict = None):
        event_doc = {
            "ts": time.time(),
            "category": category,
            "message": message,
            "metadata": metadata or {}
        }
        self.db.events.insert_one(dict(event_doc))
        logger.info(f"[EVENT] [{category}] {message}")
        return event_doc

    def get_recent_events(self, limit=50):
        cursor = self.db.events.find().sort("ts", -1).limit(limit)
        docs = list(cursor)
        docs.reverse()
        return docs
