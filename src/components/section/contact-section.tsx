"use client";

import { useState, type FormEvent } from "react";
import { submitContact, ApiError } from "@/lib/api";
import { motion, AnimatePresence } from "motion/react";
import SectionHeading from "@/components/section-heading";
import { cn } from "@/lib/utils";

const fieldClass =
  "w-full rounded-[10px] border border-input bg-background px-4 py-3 text-sm font-normal text-foreground shadow-card outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-muted-foreground/70 hover:border-foreground/25 focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/15 focus-visible:outline-none";

export default function ContactSection() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!name.trim() || !email.trim() || !message.trim()) {
      setStatus("Please complete all fields before sending.");
      return;
    }

    setIsSubmitting(true);
    setStatus("Sending your message...");

    try {
      await submitContact({
        name: name.trim(),
        email: email.trim(),
        message: message.trim(),
      });

      setIsSuccess(true);
      setStatus("I have received your request and I will get back to you ASAP.");
      setName("");
      setEmail("");
      setMessage("");
    } catch (error) {
      setStatus(
        error instanceof ApiError
          ? error.message
          : "Unable to send your message right now."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="surface p-6 sm:p-10">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-12">
        <SectionHeading
          eyebrow="Contact"
          title="Send me a message"
          description="Fill out the form below and I'll get back to you as soon as possible."
          className="lg:pt-2"
        />

        <div className="flex min-h-[350px] w-full items-center justify-center">
          <AnimatePresence mode="wait">
            {isSuccess ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                role="status"
                className="w-full py-12 flex flex-col items-center justify-center gap-5 text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.2, 1] }}
                  transition={{ delay: 0.1, duration: 0.5, times: [0, 0.7, 1] }}
                  className="size-16 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-500"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={3}
                    stroke="currentColor"
                    className="size-8"
                  >
                    <motion.path
                      strokeDasharray="30"
                      strokeDashoffset="30"
                      animate={{ strokeDashoffset: 0 }}
                      transition={{ delay: 0.3, duration: 0.4, ease: "easeOut" }}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.5 12.75l6 6 9-13.5"
                    />
                  </svg>
                </motion.div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold tracking-tight text-foreground">Message Sent!</h3>
                  <p className="text-muted-foreground text-sm max-w-md mx-auto">
                    I have received your request and I will get back to you ASAP.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsSuccess(false);
                    setStatus("");
                  }}
                  className="rounded-sm text-sm font-medium text-accent-foreground underline-offset-4 hover:underline"
                >
                  Send another message
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit}
                className="w-full space-y-4 text-left"
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="flex flex-col gap-2 text-sm font-medium text-foreground">
                    Name
                    <input
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      placeholder="John Doe"
                      className={fieldClass}
                    />
                  </label>
                  <label className="flex flex-col gap-2 text-sm font-medium text-foreground">
                    Email
                    <input
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="john@example.com"
                      className={fieldClass}
                    />
                  </label>
                </div>

                <label className="flex flex-col gap-2 text-sm font-medium text-foreground">
                  Message
                  <textarea
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    placeholder="Tell me about your project, idea, or question."
                    rows={6}
                    className={cn(fieldClass, "resize-y")}
                  />
                </label>

                <div className="flex flex-col items-start gap-3 pt-1 sm:flex-row sm:items-center sm:gap-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex h-11 w-full items-center justify-center rounded-[10px] bg-primary px-6 text-[15px] font-semibold text-primary-foreground shadow-card transition-colors duration-200 hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </button>
                  {status ? (
                    <p role="status" aria-live="polite" className="text-sm text-muted-foreground">{status}</p>
                  ) : null}
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
