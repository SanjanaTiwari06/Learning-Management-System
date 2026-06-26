import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { clerkMiddleware } from "@clerk/express";
import connectDB from "./config/db.js";
import courseRouter from "./routes/courseRouter.js";
import bookingRouter from "./routes/bookingRouter.js";
import { requireAuth } from "@clerk/express";

// Load env variables first
dotenv.config();

// Connect database
import dns from "dns";

dns.promises.resolveSrv("_mongodb._tcp.cluster0.mx7ap0s.mongodb.net")
  .then(console.log)
  .catch(console.error);
connectDB();

const app = express();
const port = process.env.PORT || 4000;

// middleware 
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', "https://learning-management-system-awyy.vercel.app"],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// middleware (yaha likhna hai)
app.use((req, res, next) => {
  console.log(`API HIT: ${req.method} ${req.url}`);
  next();
});
app.use(clerkMiddleware());
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/course', courseRouter);
app.use('/api/booking', bookingRouter);
app.use((req, res, next) => {
  console.log("API HIT:", req.method, req.url);
  next();
});

app.get("/", (req, res) => {
  res.send("LMS API Running");
});

// server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});