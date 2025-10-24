import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("❌ MONGODB_URI is missing in .env");
}

let isConnected = false;
const connectdb = async () => {
  if (isConnected) {
    console.log("✅ Reusing existing MongoDB connection");
    return;
  }

  try {
    const db = await mongoose.connect(MONGODB_URI, {
      dbName: "e-commerce",
    });

    isConnected = db.connections[0].readyState === 1;
    console.log("🚀 MongoDB Connected:", isConnected);
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error);
    process.exit(1);
  }
};
export default connectdb;