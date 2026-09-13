import { Router } from "express";
import rateLimit from "express-rate-limit";
import Profile from "../models/Profile.js";

const router = Router();

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many messages sent. Please try again later." },
});

router.post("/", contactLimiter, async (req, res) => {
  try {
    const body = req.body || {};
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const message = typeof body.message === "string" ? body.message.trim() : "";

    if (!name || !email || !message) {
      return res
        .status(400)
        .json({ message: "Please complete all fields before sending." });
    }

    const resendApiKey = process.env.RESEND_API_KEY?.trim();
    const emailFrom = process.env.EMAIL_FROM?.trim() || "onboarding@resend.dev";

    let recipientEmail = process.env.CONTACT_TO_EMAIL?.trim();
    if (!recipientEmail) {
      const profile = await Profile.findOne({ singleton: "profile" }).lean();
      recipientEmail = profile?.email;
    }

    if (!resendApiKey || !recipientEmail) {
      return res.status(500).json({
        message:
          "Email delivery is not configured yet. Add RESEND_API_KEY to your environment to enable form submissions.",
      });
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    let response;
    try {
      response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: `Portfolio Contact <${emailFrom}>`,
          to: [recipientEmail],
          reply_to: email,
          subject: `New message from ${name}`,
          text: [`Name: ${name}`, `Email: ${email}`, "", message].join("\n"),
        }),
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeout);
    }

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Resend API error (${response.status}): ${errorBody}`);
    }

    res.json({ message: "Your message has been sent successfully." });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Contact form error:", errorMessage);
    res.status(500).json({
      message: "Unable to send your message right now. Please try again later.",
      ...(process.env.NODE_ENV !== "production" ? { debug: errorMessage } : {}),
    });
  }
});

export default router;
