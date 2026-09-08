import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import { connectDB } from "./db.js";
import Skill from "./models/Skill.js";
import Experience from "./models/Experience.js";
import Education from "./models/Education.js";
import Certification from "./models/Certification.js";
import Project from "./models/Project.js";
import { createCrudRouter } from "./routes/crud.js";
import authRouter from "./routes/auth.js";
import portfolioRouter from "./routes/portfolio.js";
import profileRouter from "./routes/profile.js";
import visitorsRouter from "./routes/visitors.js";
import contactRouter from "./routes/contact.js";

const REQUIRED_ENV = ["MONGODB_URI", "JWT_SECRET"];
for (const key of REQUIRED_ENV) {
  if (!process.env[key]) {
    console.error(`Missing required env var: ${key}`);
    process.exit(1);
  }
}

const app = express();

app.set("trust proxy", 1);
app.use(helmet());
app.use(express.json({ limit: "200kb" }));

const allowedOrigins = (process.env.FRONTEND_URL || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      callback(new Error("Not allowed by CORS"));
    },
  })
);

const globalLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 120,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(globalLimiter);

app.get("/health", (req, res) => res.json({ status: "ok" }));

app.use("/api/auth", authRouter);
app.use("/api/portfolio", portfolioRouter);
app.use("/api/profile", profileRouter);
app.use("/api/visitors", visitorsRouter);
app.use("/api/contact", contactRouter);
app.use("/api/skills", createCrudRouter(Skill));
app.use("/api/experience", createCrudRouter(Experience));
app.use("/api/education", createCrudRouter(Education));
app.use("/api/certifications", createCrudRouter(Certification));
app.use("/api/projects", createCrudRouter(Project));

app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || "Server error" });
});

const PORT = process.env.PORT || 4000;

export async function start() {
  await connectDB(process.env.MONGODB_URI);
  return new Promise((resolve) => {
    const server = app.listen(PORT, () => {
      console.log(`Portfolio API listening on port ${PORT}`);
      resolve(server);
    });
  });
}

if (process.env.NODE_ENV !== "test") {
  start().catch((err) => {
    console.error("Failed to start server:", err);
    process.exit(1);
  });
}

export default app;
