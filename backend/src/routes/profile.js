import { Router } from "express";
import Profile from "../models/Profile.js";
import { requireAdmin } from "../middleware/auth.js";

const router = Router();

router.get("/", async (req, res) => {
  const profile = await Profile.findOne({ singleton: "profile" }).lean();
  res.json(profile);
});

router.put("/", requireAdmin, async (req, res) => {
  try {
    const { singleton, _id, ...updates } = req.body || {};
    const profile = await Profile.findOneAndUpdate(
      { singleton: "profile" },
      updates,
      { new: true, upsert: true, runValidators: true }
    );
    res.json(profile);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
