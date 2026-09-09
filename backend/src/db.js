import dns from "dns";
import mongoose from "mongoose";

// Some Windows setups have a local DNS resolver that fails SRV lookups
// (mongodb+srv://) even though the OS resolver works fine. Point Node's
// resolver at a public DNS server so it can reach Atlas reliably.
dns.setServers(["8.8.8.8", "1.1.1.1"]);

export async function connectDB(uri) {
  if (!uri) {
    throw new Error("MONGODB_URI is not set");
  }
  mongoose.set("strictQuery", true);
  await mongoose.connect(uri);
  console.log("MongoDB connected");
}
