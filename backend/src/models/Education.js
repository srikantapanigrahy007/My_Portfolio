import mongoose from "mongoose";

const educationSchema = new mongoose.Schema(
  {
    school: { type: String, required: true },
    href: { type: String, default: "" },
    degree: { type: String, default: "" },
    logoUrl: { type: String, default: "" },
    start: { type: String, default: "" },
    end: { type: String, default: "" },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Education || mongoose.model("Education", educationSchema);
