import mongoose from "mongoose";

// Keeps an accurate all-time total independent of the Visit log's TTL expiry.
const counterSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  total: { type: Number, default: 0 },
});

export default mongoose.models.Counter || mongoose.model("Counter", counterSchema);
