import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/db.js";
import authRouter from "./routes/auth.routes.js"
import userRouter from "./routes/user.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
dotenv.config();
const app = express();

//Connect to MongoDB
connectDB();

//Middleware
app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: "http://localhost:5173", // your frontend's origin
  credentials: true,
}));

// Health Check Route
app.use("/health", (req, res) => res.send("OK"));

// Auth Routes
app.use("/api/auth", authRouter );

// User Routes
app.use("/api/user", userRouter );

//Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
