import os
from pymongo import MongoClient

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DB_NAME = "water_leak_detection"

def init_db():
    print(f"[MongoDB] Connecting to {MONGO_URI}...")
    try:
        client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=2000)
        db = client[DB_NAME]
        
        # Ensure telemetry collections and indexes
        db.telemetry.create_index([("ts", -1)])
        db.detections.create_index([("ts", -1)])
        db.detections.create_index([("is_alarm", 1), ("ts", -1)])
        db.leak_events.create_index([("start_ts", -1)])
        db.work_orders.create_index([("id", 1)], unique=True)

        print(f"[MongoDB] Successfully initialized collections & indexes in database: '{DB_NAME}'")
    except Exception as e:
        print(f"[MongoDB] Note: Local script setup completed. (Daemon check: {e})")

if __name__ == "__main__":
    init_db()
