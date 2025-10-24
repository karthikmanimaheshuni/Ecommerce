import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import axios from "axios";

// ----------------- CONFIG -----------------
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) throw new Error("❌ MONGODB_URI is missing in .env");

const LATENCY_THRESHOLD = 800; // ms

const ENDPOINTS = [
  "https://ksfashionz-frontend.vercel.app/product",
  "https://ksfashionz-frontend.vercel.app",
  "https://ksfashionz-frontend.vercel.app/collection",
];

// ----------------- MONGODB SETUP -----------------
mongoose.connect(MONGODB_URI, { dbName: "e-commerce" });
const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => console.log("✅ MongoDB connected"));

// Schema
const metricSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  endpoint: String,
  latency_ms: Number,
  status: String,
  anomaly_threshold: Boolean,
  anomaly_stat: Boolean,
});

const Metric = mongoose.model("Metric", metricSchema);

// ----------------- MONITORING FUNCTION -----------------
const monitor = async () => {
  console.log(`[${new Date().toISOString()}] Running monitor...`);

  for (const url of ENDPOINTS) {
    let latency = null;
    let status = "DOWN";

    try {
      const start = Date.now();
      const res = await axios.get(url, { timeout: 5000 });
      latency = Date.now() - start;
      status = res.status === 200 ? "UP" : "DOWN";
    } catch (err) {
      status = "DOWN";
      latency = null;
    }

    // Threshold anomaly
    const anomaly_threshold = latency !== null && latency > LATENCY_THRESHOLD;

    // Statistical anomaly (simple z-score)
    const recentMetrics = await Metric.find({ endpoint })
      .sort({ timestamp: -1 })
      .limit(50);

    const latencies = recentMetrics
      .map((m) => m.latency_ms)
      .filter((l) => l !== null);

    let anomaly_stat = false;
    if (latencies.length >= 10 && latency !== null) {
      const mean =
        latencies.reduce((sum, l) => sum + l, 0) / latencies.length;
      const std = Math.sqrt(
        latencies.reduce((sum, l) => sum + (l - mean) ** 2, 0) /
          latencies.length
      );
      const z = (latency - mean) / std;
      if (Math.abs(z) > 2) anomaly_stat = true;
    }

    // Save record
    await Metric.create({
      endpoint,
      latency_ms: latency,
      status,
      anomaly_threshold,
      anomaly_stat,
    });

    console.log(
      `[${new Date().toISOString()}] ${url} → ${status} (${latency}ms) | Threshold anomaly: ${anomaly_threshold} | Statistical anomaly: ${anomaly_stat}`
    );
  }
};

// ----------------- Vercel Serverless Entry -----------------
export default async function handler(req, res) {
  try {
    await monitor();
    res.status(200).json({ message: "Monitoring run completed" });
  } catch (err) {
    console.error("❌ Monitoring failed:", err);
    res.status(500).json({ error: err.message });
  }
}
