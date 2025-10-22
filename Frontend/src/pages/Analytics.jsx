import React, { useEffect, useState, useContext } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { ShopContext } from "../context/shopContext";

export default function Analytics() {
  const [data, setData] = useState([]);
  const [anomalies, setAnomalies] = useState([]);
  const { backendUrl } = useContext(ShopContext);

  // 🔹 Define latency threshold for anomaly detection (ms)
  const LATENCY_THRESHOLD = 1000;

  useEffect(() => {
    fetch(`${backendUrl}/api/metrics`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched data:", data);
        setData(data);

        // 🔹 Detect anomalies
        const detected = data.filter((d) => d.latency_ms > LATENCY_THRESHOLD);
        setAnomalies(detected);
      })
      .catch((err) => console.error("Fetch error:", err));
  }, [backendUrl]);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Network Health Dashboard</h1>

      {/* 🚨 Show anomaly alert if any */}
      {anomalies.length > 0 ? (
        <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4 font-semibold">
          🚨 {anomalies.length} anomaly{anomalies.length > 1 ? "ies" : ""} detected — latency above {LATENCY_THRESHOLD} ms
        </div>
      ) : (
        <div className="bg-green-100 text-green-700 p-3 rounded-md mb-4 font-semibold">
          ✅ All systems healthy — no anomalies detected
        </div>
      )}

      {/* 📊 Latency Trend Graph */}
      <LineChart width={800} height={400} data={data}>
        <XAxis dataKey="timestamp" />
        <YAxis dataKey="latency_ms" />
        <Tooltip />
        <CartesianGrid stroke="#ccc" />
        <Line type="monotone" dataKey="latency_ms" stroke="#82ca9d" />
      </LineChart>

      {/* 📋 Table of Recent Status */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Recent Status</h2>
        <table className="table-auto w-full mt-2 border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Endpoint</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Latency (ms)</th>
            </tr>
          </thead>
          <tbody>
            {data.slice(0, 10).map((d, i) => (
              <tr
                key={i}
                className={
                  d.latency_ms > LATENCY_THRESHOLD
                    ? "bg-red-50"
                    : "hover:bg-gray-50"
                }
              >
                <td className="px-4 py-2">{d.endpoint}</td>
                <td
                  className={`px-4 py-2 font-semibold ${
                    d.status === "UP" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {d.status}
                </td>
                <td className="px-4 py-2">{d.latency_ms?.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
