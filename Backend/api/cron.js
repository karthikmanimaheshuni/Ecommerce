import mongoose from "mongoose";
import axios from "axios";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from project root explicitly
dotenv.config({ path: path.join(__dirname, "../.env") });



// ----------------- CONFIG -----------------
const MONGODB_URI = process.env.MONGODB_URI;
console.log("MONGODB_URI:", process.env.MONGODB_URI);

if (!MONGODB_URI) throw new Error("❌ MONGODB_URI is missing");
console.log("mongodb fetched 🤘")
const ENDPOINTS = [
  "https://ksfashionz-frontend.vercel.app/product",
  "https://ksfashionz-frontend.vercel.app",
  "https://ksfashionz-frontend.vercel.app/collection",
];

const LATENCY_THRESHOLD = 800; // ms

// ----------------- MONGODB SETUP -----------------
let cachedDb = null;

async function connectDB() {
  if (cachedDb) return cachedDb;
  cachedDb = await mongoose.connect(MONGODB_URI, { dbName: "e-commerce" });
  console.log("✅ MongoDB connected");
  return cachedDb;
}

// Schema
const metricSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  endpoint: String,
  latency_ms: Number,
  status: String,
  anomaly_threshold: Boolean,
  anomaly_stat: Boolean,
});

const Metric = mongoose.models.Metric || mongoose.model("Metric", metricSchema);

// ----------------- MONITORING FUNCTION -----------------
async function monitor() {
  console.log(`[${new Date().toISOString()}] Running serverless monitor...`);

  await connectDB();

  await Promise.all(
    ENDPOINTS.map(async (url) => {
      let latency = null;
      let status = "DOWN";

      try {
        const start = Date.now();
        const res = await axios.get(url, { timeout: 5000 });
        latency = Date.now() - start;
        status = res.status === 200 ? "UP" : "DOWN";
      } catch {
        latency = null;
        status = "DOWN";
      }

      // Threshold anomaly
      const anomaly_threshold = latency !== null && latency > LATENCY_THRESHOLD;

      // Statistical anomaly (simple z-score)
      const recentMetrics = await Metric.find({ endpoint: url })
        .sort({ timestamp: -1 })
        .limit(50);

      const latencies = recentMetrics.map((m) => m.latency_ms).filter((l) => l !== null);
      let anomaly_stat = false;
      if (latencies.length >= 10 && latency !== null) {
        const mean = latencies.reduce((sum, l) => sum + l, 0) / latencies.length;
        const std = Math.sqrt(
          latencies.reduce((sum, l) => sum + (l - mean) ** 2, 0) / latencies.length
        );
        const z = (latency - mean) / std;
        if (Math.abs(z) > 2) anomaly_stat = true;
      }

      // Save record
      await Metric.create({
        endpoint: url,
        latency_ms: latency,
        status,
        anomaly_threshold,
        anomaly_stat,
      });

      console.log(
        `[${new Date().toISOString()}] ${url} → ${status} (${latency}ms) | Threshold anomaly: ${anomaly_threshold} | Statistical anomaly: ${anomaly_stat}`
      );
    })
  );
}

// ----------------- Vercel serverless handler -----------------
export default async function handler(req, res) {
  try {
    await monitor();
    res.status(200).json({ message: "✅ Monitoring run completed" });
  } catch (err) {
    console.error("❌ Monitoring failed:", err);
    res.status(500).json({ error: err.message });
  } finally {
    // Disconnect mongoose in serverless to avoid timeouts
    if (mongoose.connection.readyState === 1) await mongoose.disconnect();
  }
}
