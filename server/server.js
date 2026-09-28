import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import analyzeRoutes from "./routes/analyze.js";
import historyRoutes from "./routes/history.js";
import extractRoutes from "./routes/extract.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
connectDB();

const app = express();

const configuredOrigins = (process.env.CLIENT_URL || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
const developmentOrigins =
  process.env.NODE_ENV === "production"
    ? []
    : ["http://localhost:5173", "http://localhost:5174"];
const allowedOrigins = new Set([...configuredOrigins, ...developmentOrigins]);

app.use(
  cors({
    origin: (origin, callback) => {
      callback(null, !origin || allowedOrigins.has(origin));
    },
    credentials: true,
  }),
);
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/analyze", analyzeRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/extract", extractRoutes);

// Health check
app.get("/api", (req, res) => res.json({ message: "TruthNet API running ✅" }));

// Serve static frontend files
const publicDirectory = path.join(__dirname, "public");
const frontendIndex = path.join(publicDirectory, "index.html");
app.use(express.static(publicDirectory));

// Serve the React app when bundled; otherwise keep this service API-only.
app.get(/.*/, (req, res) => {
  if (fs.existsSync(frontendIndex)) {
    res.sendFile(frontendIndex);
    return;
  }

  res.status(404).json({ message: "API route not found" });
});
const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}

export default app;