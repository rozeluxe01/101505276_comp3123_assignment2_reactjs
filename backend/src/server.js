import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";

import { connectDB } from "./db.js";
import authRoutes from "./routes/auth.routes.js";
import employeesRoutes from "./routes/employees.routes.js";
import { notFound, errorHandler } from "./middleware/errors.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(
  morgan(process.env.NODE_ENV === "production" ? "combined" : "dev")
);

// Static folder for uploaded images
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

// Simple health check
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "COMP3123 Assignment API" });
});

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/emp", employeesRoutes);

// Error handlers
app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 3000;
const uri = process.env.MONGODB_URI;

(async () => {
  await connectDB(uri);
  app.listen(port, () => {
    console.log(`🚀 Server running on http://localhost:${port}`);
  });
})();
