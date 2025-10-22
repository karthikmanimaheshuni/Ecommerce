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

console.log("Loaded Mongo URI:", process.env.MONGODB_URI ? "✅ Found" : "❌ Missing");

// ES module __dirname fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// App config
const app = express();
const port = process.env.PORT || 3000;

// Connect to DB and Cloudinary
connectdb();
connectCloudinary();

// Middleware
const frontendURL = process.env.FRONTEND_URL || "http://localhost:5173";

app.use(cors({
    origin: (origin, callback) => {
        const allowedOrigins = [
            "http://localhost:5174",
            "http://localhost:5173",
             "http://ecommerce-env.eba-jb3sprw8.ap-south-1.elasticbeanstalk.com",
            "https://ksfashionz-frontend.vercel.app"
        ];
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization","token"],
}));

app.use(express.json());

// API routes
app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);
app.use('/api/metrics',analyticsRouter)

// Test route
// Test route
app.get('/api', (req, res) => {
  res.send("API working");
});

// ✅ Serve React build only in production
if (process.env.NODE_ENV === "production") {
  const buildPath = path.join(__dirname, "build");
  app.use(express.static(buildPath));
  app.get("*", (req, res) => {
    res.sendFile(path.join(buildPath, "index.html"));
  });
}
app.get('/', (req, res) => {
    res.send('Backend is running!');
});

app.listen(port, "0.0.0.0", () => {
  console.log(`✅ Server started on port: ${port}`);
});
