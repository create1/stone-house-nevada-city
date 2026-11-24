"use client";

import { useCallback, useEffect, useState } from "react";
import { X } from "lucide-react";

export default function ExitIntentPopup() {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const handleMouseLeave = useCallback(
    (e: MouseEvent) => {
      if (e.clientY <= 0 && !show && !dismissed) {
        setShow(true);
      }
    },
    [show, dismissed],
  );

  useEffect(() => {
    document.addEventListener("mouseleave", handleMouseLeave);
    return () => document.removeEventListener("mouseleave", handleMouseLeave);
  }, [handleMouseLeave]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    try {
      const payload = {
        form_type: "pamphlet_wedding",
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
    <div className="fixed inset-0 z-[9995] flex items-center justify-center bg-black/60 p-4" onClick={close}>
      <div
        className="relative w-full max-w-md rounded-sm bg-surface p-8 text-cream shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={close}
          className="absolute right-3 top-3 text-muted transition-colors hover:text-cream"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        {error ? (
          <div className="text-center py-4">
            <p className="font-display text-display-sm text-red-400">Something went wrong</p>
            <p className="mt-3 text-sm text-muted">
              Please email bookings@stonehouse.io or call 530-265-5050.
            </p>
          </div>
        ) : submitted ? (
          <div className="text-center py-4">
            <p className="font-display text-display-sm text-gold">Check your inbox</p>
            <p className="mt-3 text-sm text-muted">
              Your 2026 pricing guide is on its way.
            </p>
          </div>
        ) : (
          <>
            <p className="small-label mb-2">Before You Go</p>
            <h3 className="font-display text-display-sm text-cream">
              Get Our 2026 Pricing Guide
            </h3>
            <p className="mt-3 text-sm text-muted">
              Venue rental rates, catering packages, bar options, and everything you need to plan
              your event at Stonehouse.
            </p>
            <form onSubmit={handleSubmit} className="mt-6 flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="flex-1 rounded-sm border border-surface-400 bg-surface-200 px-4 py-3 text-sm text-cream placeholder:text-muted focus:border-gold focus:outline-none"
              />
              <button type="submit" className="btn-gold whitespace-nowrap px-5 py-3 text-xs">
                Send It
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
