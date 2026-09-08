import { DATA } from "@/data/resume";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = typeof body?.name === "string" ? body.name.trim() : "";
    const email = typeof body?.email === "string" ? body.email.trim() : "";
    const message = typeof body?.message === "string" ? body.message.trim() : "";

    if (!name || !email || !message) {
      return NextResponse.json(
        { message: "Please complete all fields before sending." },
        { status: 400 }
      );
    }

    const smtpHost = process.env.SMTP_HOST?.trim();
    const smtpPort = Number(process.env.SMTP_PORT || 587);
    const smtpUser = process.env.SMTP_USER?.trim();
    const smtpPass = process.env.SMTP_PASS?.replace(/\s+/g, "").trim();
    const smtpFrom = process.env.SMTP_FROM?.trim() || smtpUser;
    const recipientEmail = process.env.CONTACT_TO_EMAIL?.trim() || DATA.contact.email;

    if (!smtpHost || !smtpUser || !smtpPass) {
      return NextResponse.json(
        {
          message:
            "Email delivery is not configured yet. Add SMTP settings to your environment to enable form submissions.",
        },
        { status: 500 }
      );
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    await transporter.sendMail({
      from: smtpFrom,
      to: recipientEmail,
      replyTo: email,
      subject: `New message from ${name}`,
      text: [
        `Name: ${name}`,
        `Email: ${email}`,
        "",
        message,
      ].join("\n"),
    });

    return NextResponse.json({
      message: "Your message has been sent successfully.",
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Contact form error:", errorMessage);
    return NextResponse.json(
      {
        message: "Unable to send your message right now. Please try again later.",
        ...(process.env.NODE_ENV !== "production"
          ? { debug: errorMessage }
          : {}),
      },
      { status: 500 }
    );
  }
}
