import { Router } from "express";
import { requireAdmin } from "../middleware/auth.js";

// Generic admin CRUD router for a simple Mongoose model.
// GET is public (list), POST/PUT/DELETE require an admin JWT.
export function createCrudRouter(Model) {
  const router = Router();

  router.get("/", async (req, res) => {
    const docs = await Model.find().sort({ order: 1, createdAt: 1 }).lean();
    res.json(docs);
  });

  router.post("/", requireAdmin, async (req, res) => {
    try {
      const doc = await Model.create(req.body);
      res.status(201).json(doc);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  router.put("/:id", requireAdmin, async (req, res) => {
    try {
      const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
      if (!doc) return res.status(404).json({ error: "Not found" });
      res.json(doc);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  router.delete("/:id", requireAdmin, async (req, res) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ error: "Not found" });
    res.json({ success: true });
  });

  return router;
}
