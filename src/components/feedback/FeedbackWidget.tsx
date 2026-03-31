"use client";

import { useState } from "react";
import { MessageSquare, X, Send } from "lucide-react";
import { trackEvent } from "@/lib/tracking";

export default function FeedbackWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Track the feedback event
    await trackEvent({
      event: "feedback_submitted",
      email,
      name: message.slice(0, 50),
    });

    // Send via mailto as fallback
    const mailtoLink = `mailto:taeshinkim11@gmail.com?subject=EndoSpine Share Feedback&body=${encodeURIComponent(
      `Feedback from: ${email || "Anonymous"}\n\n${message}`
    )}`;

    // Try API route first
    try {
      await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, message }),
      });
    } catch {
      window.open(mailtoLink, "_blank");
    }

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setIsOpen(false);
      setMessage("");
      setEmail("");
    }, 2000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen && (
        <div className="mb-3 w-80 rounded-xl border border-gray-200 bg-white p-4 shadow-xl">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900">
              Send Feedback
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {submitted ? (
            <p className="py-4 text-center text-sm text-green-600">
              Thank you for your feedback!
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email (optional)"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#4DA8B2] focus:outline-none focus:ring-1 focus:ring-[#4DA8B2]"
              />
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="How can we improve EndoSpine Share?"
                rows={3}
                required
                className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#4DA8B2] focus:outline-none focus:ring-1 focus:ring-[#4DA8B2]"
              />
              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#4DA8B2] px-4 py-2 text-sm font-medium text-white hover:bg-[#3d8a93] transition-colors"
              >
                <Send className="h-4 w-4" />
                Send Feedback
              </button>
            </form>
          )}
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-[#4DA8B2] text-white shadow-lg hover:bg-[#3d8a93] transition-all hover:scale-105"
        title="Send feedback"
      >
        <MessageSquare className="h-5 w-5" />
      </button>
    </div>
  );
}
