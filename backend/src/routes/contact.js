import { Router } from "express";
import rateLimit from "express-rate-limit";
import nodemailer from "nodemailer";
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

    const smtpHost = process.env.SMTP_HOST?.trim();
    const smtpPort = Number(process.env.SMTP_PORT || 587);
    const smtpUser = process.env.SMTP_USER?.trim();
    const smtpPass = process.env.SMTP_PASS?.replace(/\s+/g, "").trim();
    const smtpFrom = process.env.SMTP_FROM?.trim() || smtpUser;

    let recipientEmail = process.env.CONTACT_TO_EMAIL?.trim();
    if (!recipientEmail) {
      const profile = await Profile.findOne({ singleton: "profile" }).lean();
      recipientEmail = profile?.email;
    }

    if (!smtpHost || !smtpUser || !smtpPass || !recipientEmail) {
      return res.status(500).json({
        message:
          "Email delivery is not configured yet. Add SMTP settings to your environment to enable form submissions.",
      });
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: { user: smtpUser, pass: smtpPass },
    });

    await transporter.sendMail({
      from: smtpFrom,
      to: recipientEmail,
      replyTo: email,
      subject: `New message from ${name}`,
      text: [`Name: ${name}`, `Email: ${email}`, "", message].join("\n"),
    });

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
