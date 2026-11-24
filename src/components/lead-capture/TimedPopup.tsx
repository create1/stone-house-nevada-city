"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

interface TimedPopupProps {
  delayMs?: number;
}

export default function TimedPopup({ delayMs = 30000 }: TimedPopupProps) {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (dismissed) return;
    const timer = setTimeout(() => setShow(true), delayMs);
    return () => clearTimeout(timer);
  }, [delayMs, dismissed]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    try {
      const payload = {
        form_type: "pamphlet_other",
        first_name: "",
        last_name: "",
        partner_name: "",
        email,
        phone: "",
        event_type: "",
        event_date: "",
        guest_count: "",
        budget: "",
        message: "",
        page_url: typeof window !== "undefined" ? window.location.href : "",
      };

      const res = await fetch("https://stonehouse107.app.n8n.cloud/webhook/website-forms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Submission failed");
      }

      setSubmitted(true);
      setTimeout(() => { setShow(false); setDismissed(true); }, 2000);
    } catch {
      setError(true);
    }
  };

  const close = () => {
    setShow(false);
    setDismissed(true);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[9994] w-80 rounded-sm bg-surface p-5 shadow-2xl">
      <button
        onClick={close}
        className="absolute right-2 top-2 text-muted transition-colors hover:text-cream"
        aria-label="Close"
      >
        <X size={16} />
      </button>

      {error ? (
        <p className="text-center text-sm text-red-400">Something went wrong — please email bookings@stonehouse.io or call 530-265-5050.</p>
      ) : submitted ? (
        <p className="text-center text-sm text-gold">Sent! Check your inbox.</p>
      ) : (
        <>
          <p className="small-label mb-1">Free Download</p>
          <p className="font-display text-lg text-cream">2026 Pricing Guide</p>
          <form onSubmit={handleSubmit} className="mt-3 flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="flex-1 rounded-sm border border-surface-400 bg-surface-200 px-3 py-2 text-xs text-cream placeholder:text-muted focus:border-gold focus:outline-none"
            />
            <button type="submit" className="btn-gold px-3 py-2 text-xs">
              Get It
            </button>
          </form>
        </>
      )}
    </div>
  );
}
