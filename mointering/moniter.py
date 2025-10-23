import requests, time, pymongo
from datetime import datetime
import schedule
import numpy as np
from sklearn.ensemble import IsolationForest
from datetime import datetime, timezone

# MongoDB setup
client = pymongo.MongoClient("mongodb+srv://karthikmanimaheshuni:bPRRJQmxe9aAhCDp@cluster0.r1ryuqb.mongodb.net")
db = client["e-commerce"]
metrics = db["network_metrics"]

# Endpoints to monitor
ENDPOINTS = [
    "https://ksfashionz-frontend.vercel.app/product",
    "https://ksfashionz-frontend.vercel.app",
    "https://ksfashionz-frontend.vercel.app/collection",
    "http://localhost:5173",
    "http://localhost:5173/collection"
]

# Function to ping endoints
def monitor():
    for url in ENDPOINTS:
        try:
            start = time.time()
            r = requests.get(url, timeout=5)
            latency = (time.time() - start) * 1000
            status = "UP" if r.status_code == 200 else "DOWN"
        except Exception:
            latency = None
            status = "DOWN"

        record = {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "endpoint": url,
            "latency_ms": latency,
            "status": status,
        }
        metrics.insert_one(record)
        print(f"[{datetime.now()}] {url} → {status} ({latency:.2f}ms)")

# Optional: Anomaly Detection Function
def detect_anomalies():
    data = list(metrics.find().sort("timestamp", -1).limit(50))
    latencies = [d["latency_ms"] for d in data if d["latency_ms"]]
    if len(latencies) > 10:
        model = IsolationForest(contamination=0.1)
        preds = model.fit_predict(np.array(latencies).reshape(-1, 1))
        anomalies = sum(p == -1 for p in preds)
        print(f"⚠️  Anomalies detected: {anomalies}")

# Schedule monitoring every 5 minutes
schedule.every(5).minutes.do(monitor)
schedule.every(15).minutes.do(detect_anomalies)

while True:
    schedule.run_pending()
    time.sleep(1)