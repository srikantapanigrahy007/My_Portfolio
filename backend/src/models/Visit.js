import mongoose from "mongoose";

const visitSchema = new mongoose.Schema({
  pathname: { type: String, required: true },
  ip: { type: String, default: "" },
  userAgent: { type: String, default: "" },
  country: { type: String, default: "" },
  city: { type: String, default: "" },
  timestamp: { type: Date, default: Date.now, expires: 60 * 60 * 24 * 180 }, // auto-expire after 180 days
});

visitSchema.index({ timestamp: -1 });

export default mongoose.models.Visit || mongoose.model("Visit", visitSchema);
