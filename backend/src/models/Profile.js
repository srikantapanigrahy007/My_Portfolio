import mongoose from "mongoose";

const socialSchema = new mongoose.Schema(
  {
    key: { type: String, required: true },
    name: { type: String, required: true },
    url: { type: String, required: true },
    icon: { type: String, required: true },
    navbar: { type: Boolean, default: false },
  },
  { _id: false }
);

const profileSchema = new mongoose.Schema(
  {
    singleton: { type: String, default: "profile", unique: true },
    name: { type: String, required: true },
    initials: { type: String, default: "" },
    url: { type: String, default: "" },
    resumeUrl: { type: String, default: "" },
    avatarUrl: { type: String, default: "" },
    description: { type: String, default: "" },
    summary: { type: String, default: "" },
    heroDescription: { type: String, default: "" },
    email: { type: String, default: "" },
    tel: { type: String, default: "" },
    socials: { type: [socialSchema], default: [] },
  },
  { timestamps: true }
);

export default mongoose.models.Profile || mongoose.model("Profile", profileSchema);
