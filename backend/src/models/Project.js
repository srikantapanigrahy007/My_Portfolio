import mongoose from "mongoose";

const projectLinkSchema = new mongoose.Schema(
  {
    type: { type: String, required: true },
    href: { type: String, required: true },
    icon: { type: String, default: "globe" },
  },
  { _id: false }
);

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    href: { type: String, default: "" },
    active: { type: Boolean, default: true },
    description: { type: String, default: "" },
    dates: { type: String, default: "" },
    technologies: { type: [String], default: [] },
    links: { type: [projectLinkSchema], default: [] },
    image: { type: String, default: "" },
    video: { type: String, default: "" },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Project || mongoose.model("Project", projectSchema);
