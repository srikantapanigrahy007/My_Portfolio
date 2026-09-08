import { Router } from "express";
import rateLimit from "express-rate-limit";
import Visit from "../models/Visit.js";
import Counter from "../models/Counter.js";
import { requireAdmin } from "../middleware/auth.js";

const router = Router();

const trackLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
});

function getClientIp(req) {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.length > 0) {
    return forwarded.split(",")[0].trim();
  }
  return req.socket.remoteAddress || "";
}

// Public: log a pageview and bump the all-time counter.
router.post("/", trackLimiter, async (req, res) => {
  try {
    const { pathname, country = "", city = "" } = req.body || {};
    if (typeof pathname !== "string" || !pathname) {
      return res.status(400).json({ error: "pathname is required" });
    }

    const ip = getClientIp(req);
    const userAgent = req.headers["user-agent"] || "";

    await Promise.all([
      Visit.create({ pathname, ip, userAgent, country, city }),
      Counter.findOneAndUpdate(
        { key: "visitors" },
        { $inc: { total: 1 } },
        { upsert: true }
      ),
    ]);

    res.status(201).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: total count + recent visits, for the dashboard.
router.get("/", requireAdmin, async (req, res) => {
  const [counter, recent] = await Promise.all([
    Counter.findOne({ key: "visitors" }).lean(),
    Visit.find().sort({ timestamp: -1 }).limit(200).lean(),
  ]);

  res.json({ total: counter?.total || 0, recent });
});

export default router;
