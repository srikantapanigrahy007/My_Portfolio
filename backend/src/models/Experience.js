import mongoose from "mongoose";

const experienceSchema = new mongoose.Schema(
  {
    company: { type: String, required: true },
    href: { type: String, default: "" },
    location: { type: String, default: "" },
    title: { type: String, required: true },
    logoUrl: { type: String, default: "" },
    start: { type: String, required: true },
    end: { type: String, default: "" },
    description: { type: String, default: "" },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Experience || mongoose.model("Experience", experienceSchema);
