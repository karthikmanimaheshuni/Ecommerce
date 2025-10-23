import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectdb from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import userRouter from './routes/userRoute.js';
import productRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';
import analyticsRouter from "./routes/analytics.js";
import path from 'path';
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();
console.log("✅ Environment check");
console.log("MONGO_URI:", !!process.env.MONGODB_URI);
console.log("CLOUD_NAME:", process.env.CLOUD_NAME);
console.log("NODE_ENV:", process.env.NODE_ENV);

// Check env
if (!process.env.MONGODB_URI) {
  console.error("❌ Missing MONGODB_URI in .env");
  process.exit(1);
}
console.log("Loaded Mongo URI: ✅ Found");

// ES module __dirname fix
const __filename = fileURLToPath(import.meta.url);
console.log(__filename);
const __dirname = path.dirname(__filename);
console.log(__dirname);

// App config
const app = express();
const port = process.env.PORT || 3000;

// Connect DB and Cloudinary
connectdb();
connectCloudinary();

// -------------------- Middleware --------------------

//const frontendURL = process.env.FRONTEND_URL || "http://localhost:5173";
 app.use(cors({ credentials:true, 
  origin: [ 
    "http://localhost:5173", 
    "http://ecommerce-env.eba-jb3sprw8.ap-south-1.elasticbeanstalk.com",
     "https://ksfashionz-frontend.vercel.app",
     "https://ksfashionz-backend.vercel.app"
     ] ,
    
  methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization","token"]})); 
  app.use(express.json());
// -------------------- API Routes --------------------
app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);
app.use('/api/metrics', analyticsRouter);

// Test route
app.get('/api', (req, res) => res.send("API working"));

// -------------------- Serve React build in production --------------------
// if (process.env.NODE_ENV === "production") {
//   const buildPath = path.join(__dirname, "build");
//   app.use(express.static(buildPath));
//   app.get("*", (req, res) => res.sendFile(path.join(buildPath, "index.html")));
// }

// Root route
app.get('/', (req, res) => res.send('Backend is running!'));

// Start server
app.listen(port, "0.0.0.0", () => {
  console.log(`✅ Server started on port: ${port}`);
});

export default app;
