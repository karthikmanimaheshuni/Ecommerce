import express from "express";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();
const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error("❌ Mongo URI is undefined. Please check your .env file!");
  process.exit(1);
}

router.get("/", async (req, res) => {
  let client;
  try {
    client = new MongoClient(uri);
    await client.connect();
    console.log("✅ Connected to MongoDB cluster");

    const data = await client
      .db("e-commerce")
      .collection("network_metrics")
      .find({})
      .sort({ timestamp: -1 })
      .limit(100)
      .toArray();

    console.log(`📦 Fetched ${data.length} records from MongoDB`);
    res.json(data);
  } catch (err) {
    console.error("Error fetching metrics:", err.message);
    res.status(500).json({ error: err.message });
  } finally {
    if (client) await client.close();
  }
});

export default router;
