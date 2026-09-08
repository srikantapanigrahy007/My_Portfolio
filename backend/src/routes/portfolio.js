import { Router } from "express";
import Profile from "../models/Profile.js";
import Skill from "../models/Skill.js";
import Experience from "../models/Experience.js";
import Education from "../models/Education.js";
import Certification from "../models/Certification.js";
import Project from "../models/Project.js";

const router = Router();

// Public: everything the frontend needs to render the site in one call.
router.get("/", async (req, res) => {
  const [profile, skills, experience, education, certifications, projects] =
    await Promise.all([
      Profile.findOne({ singleton: "profile" }).lean(),
      Skill.find().sort({ order: 1, createdAt: 1 }).lean(),
      Experience.find().sort({ order: 1, createdAt: 1 }).lean(),
      Education.find().sort({ order: 1, createdAt: 1 }).lean(),
      Certification.find().sort({ order: 1, createdAt: 1 }).lean(),
      Project.find().sort({ order: 1, createdAt: 1 }).lean(),
    ]);

  res.json({ profile, skills, experience, education, certifications, projects });
});

export default router;
