import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import analyzeRoutes from "./routes/analyze.js";
import historyRoutes from "./routes/history.js";
import extractRoutes from "./routes/extract.js";

dotenv.config();
connectDB();

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/analyze", analyzeRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/extract", extractRoutes);

// Health check
app.get("/", (req, res) => res.json({ message: "TruthNet API running ✅" }));

const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}

export default app;