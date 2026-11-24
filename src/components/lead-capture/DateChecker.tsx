"use client";

import { useState } from "react";

export default function DateChecker() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !date) return;

    setStatus("submitting");
    try {
      await fetch("/api/lead-capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          eventDate: date,
          source: "date-checker",
          asset: "availability-check",
        }),
      });
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  return (
    <section className="section-dark py-section">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <p className="small-label mb-4">Availability</p>
        <h2 className="font-display text-display-md text-cream">Is your date still open?</h2>
        <p className="mx-auto mt-3 max-w-lg text-sm text-muted">
          Our most popular dates book 12&ndash;18 months out. Check your date in 30 seconds — no commitment required.
        </p>

        {status === "success" ? (
          <div className="mt-8 rounded-sm border border-gold/20 bg-surface-200 p-6">
            <p className="font-display text-display-sm text-gold">Request sent</p>
            <p className="mt-2 text-sm text-muted">
              We&apos;ll respond within 24 hours with availability for your date.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              required
              className="flex-1 rounded-sm border border-surface-400 bg-surface-200 px-4 py-3 text-sm text-cream placeholder:text-muted focus:border-gold focus:outline-none"
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="flex-1 rounded-sm border border-surface-400 bg-surface-200 px-4 py-3 text-sm text-cream placeholder:text-muted focus:border-gold focus:outline-none"
            />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="rounded-sm border border-surface-400 bg-surface-200 px-4 py-3 text-sm text-cream focus:border-gold focus:outline-none"
            />
            <button
              type="submit"
              disabled={status === "submitting"}
              className="btn-gold whitespace-nowrap px-6 py-3"
            >
              {status === "submitting" ? "Sending..." : "Check Availability"}
            </button>
          </form>
        )}

        <p className="mt-6 text-xs font-medium uppercase tracking-[0.15em] text-gold/70">
          Only 14 Saturday dates remain in 2026&ndash;2027
        </p>
      </div>
    </section>
  );
}
