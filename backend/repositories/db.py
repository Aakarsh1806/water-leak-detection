"""MongoDB Connection

Single shared client for all repositories (docs/DECISIONS.md #001). Connection
is lazy and cached — repositories import get_db() rather than each opening
their own client.
"""
import os
from pymongo import MongoClient
from backend.utils.logger import logger

_client = None
_db = None


def get_db():
    global _client, _db
    if _db is not None:
        return _db

    uri = os.getenv("MONGO_URI", "mongodb://localhost:27017")
    db_name = os.getenv("MONGO_DB_NAME", "water_leak_detection")
    _client = MongoClient(uri, serverSelectionTimeoutMS=3000)
    _db = _client[db_name]
    logger.info(f"[MongoDB] Connected to {uri}/{db_name}")
    return _db
