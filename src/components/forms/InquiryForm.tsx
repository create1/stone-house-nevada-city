"use client";

import { useState } from "react";
import { clsx } from "clsx";
import { Loader2, CheckCircle2, Send } from "lucide-react";

const eventTypeOptions = [
  "Wedding",
  "Corporate Event",
  "Private Dining",
  "Live Music",
  "Fundraiser",
  "Holiday Party",
  "Other",
];

const spaceOptions = [
  "Music Venue",
  "Tavern",
  "Dining Room",
  "Lounge",
  "Wine Cavern",
  "Patio",
  "Full Building",
];

const budgetOptions = [
  "Under $5,000",
  "$5,000 – $10,000",
  "$10,000 – $15,000",
  "$15,000 – $25,000",
  "$25,000+",
  "Not sure yet",
];

const hearAboutOptions = [
  "Google Search",
  "Instagram",
  "Facebook",
  "The Knot",
  "Zola",
  "WeddingWire",
  "Word of Mouth",
  "Drove By",
  "Other",
];

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  eventType: string;
  spaces: string[];
  eventDate: string;
  guestCount: string;
  budgetRange: string;
  hearAboutUs: string;
  message: string;
  requestTour: boolean;
}

const initialForm: FormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  eventType: "",
  spaces: [],
  eventDate: "",
  guestCount: "",
  budgetRange: "",
  hearAboutUs: "",
  message: "",
  requestTour: false,
};

export default function InquiryForm() {
  const [form, setForm] = useState<FormData>(initialForm);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const validate = (): boolean => {
    const errs: Partial<Record<keyof FormData, string>> = {};

    if (!form.firstName.trim()) errs.firstName = "First name is required";
    if (!form.lastName.trim()) errs.lastName = "Last name is required";
    if (!form.email.trim()) {
      errs.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = "Please enter a valid email";
    }
    if (!form.eventType) errs.eventType = "Please select an event type";
    if (!form.message.trim()) errs.message = "Please include a message";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const toggleSpace = (space: string) => {
    setForm((prev) => ({
      ...prev,
      spaces: prev.spaces.includes(space)
        ? prev.spaces.filter((s) => s !== space)
        : [...prev.spaces, space],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus("loading");
    setErrorMessage("");

    try {
      const payload = {
        form_type: "inquiry",
        first_name: form.firstName,
        last_name: form.lastName,
        partner_name: "",
        email: form.email,
        phone: form.phone,
        event_type: form.eventType,
        event_date: form.eventDate || "",
        guest_count: form.guestCount,
        budget: form.budgetRange,
        message: form.message,
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

      setStatus("success");
      setForm(initialForm);
    } catch {
      setStatus("error");
      setErrorMessage(
        "Something went wrong — please email bookings@stonehouse.io or call 530-265-5050.",
      );
    }
  };

  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gold/10">
          <CheckCircle2 size={32} className="text-gold" />
        </div>
        <h3 className="font-display text-2xl font-semibold text-black">
          Inquiry Sent!
        </h3>
        <p className="mt-2 max-w-md text-black/60">
          Thank you for your interest in Stonehouse. We&apos;ll review your
          inquiry and get back to you within 24 hours.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-6 text-sm font-medium text-gold underline underline-offset-4 transition-colors hover:text-gold-dark"
        >
          Submit another inquiry
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {/* Name */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="First Name"
          error={errors.firstName}
          required
        >
          <input
            type="text"
            value={form.firstName}
            onChange={(e) => setForm({ ...form, firstName: e.target.value })}
            className={inputClass(errors.firstName)}
            placeholder="First name"
          />
        </Field>
        <Field
          label="Last Name"
          error={errors.lastName}
          required
        >
          <input
            type="text"
            value={form.lastName}
            onChange={(e) => setForm({ ...form, lastName: e.target.value })}
            className={inputClass(errors.lastName)}
            placeholder="Last name"
          />
        </Field>
      </div>

      {/* Contact */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Email" error={errors.email} required>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className={inputClass(errors.email)}
            placeholder="you@email.com"
          />
        </Field>
        <Field label="Phone">
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className={inputClass()}
            placeholder="(530) 555-0100"
          />
        </Field>
      </div>

      {/* Event Type */}
      <Field label="Event Type" error={errors.eventType} required>
        <select
          value={form.eventType}
          onChange={(e) => setForm({ ...form, eventType: e.target.value })}
          className={inputClass(errors.eventType)}
        >
          <option value="">Select event type...</option>
          {eventTypeOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </Field>

      {/* Spaces - multi-select pills */}
      <Field label="Spaces of Interest">
        <div className="flex flex-wrap gap-2">
          {spaceOptions.map((space) => (
            <button
              key={space}
              type="button"
              onClick={() => toggleSpace(space)}
              className={clsx(
                "rounded-sm border px-4 py-2 text-sm transition-all",
                form.spaces.includes(space)
                  ? "border-gold bg-gold text-black"
                  : "border-stone-dark bg-white text-black/60 hover:border-gold/50",
              )}
            >
              {space}
            </button>
          ))}
        </div>
      </Field>

      {/* Date + Guest Count */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Event Date">
          <input
            type="date"
            value={form.eventDate}
            onChange={(e) => setForm({ ...form, eventDate: e.target.value })}
            className={inputClass()}
          />
        </Field>
        <Field label="Estimated Guest Count">
          <input
            type="number"
            value={form.guestCount}
            onChange={(e) => setForm({ ...form, guestCount: e.target.value })}
            className={inputClass()}
            placeholder="e.g. 150"
            min={1}
          />
        </Field>
      </div>

      {/* Budget */}
      <Field label="Budget Range">
        <select
          value={form.budgetRange}
          onChange={(e) => setForm({ ...form, budgetRange: e.target.value })}
          className={inputClass()}
        >
          <option value="">Select budget range...</option>
          {budgetOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </Field>

      {/* How did you hear */}
      <Field label="How did you hear about us?">
        <select
          value={form.hearAboutUs}
          onChange={(e) => setForm({ ...form, hearAboutUs: e.target.value })}
          className={inputClass()}
        >
          <option value="">Select...</option>
          {hearAboutOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </Field>

      {/* Message */}
      <Field label="Tell us about your event" error={errors.message} required>
        <textarea
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className={clsx(inputClass(errors.message), "min-h-[120px] resize-y")}
          placeholder="Share your vision — date, guest count, vibe, anything that helps us understand your dream event."
          rows={5}
        />
      </Field>

      {/* Request Tour */}
      <label className="flex cursor-pointer items-center gap-3">
        <input
          type="checkbox"
          checked={form.requestTour}
          onChange={(e) => setForm({ ...form, requestTour: e.target.checked })}
          className="h-5 w-5 rounded-sm border-stone-dark text-gold accent-gold"
        />
        <span className="text-sm text-black/70">
          I&apos;d like to schedule an in-person tour of the venue
        </span>
      </label>

      {/* Error message */}
      {status === "error" && (
        <div className="rounded-sm border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={status === "loading"}
        className="btn-gold flex w-full items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "loading" ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Sending...
          </>
        ) : (
          <>
            <Send size={16} />
            Send Inquiry
          </>
        )}
      </button>

      <p className="text-center text-xs text-black/40">
        We respond to all inquiries within 24 hours.
      </p>
    </form>
  );
}

/* ── Helper components ───────────────────────── */

function Field({
  label,
  error,
  required,
  children,
}: {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-black/80">
        {label}
        {required && <span className="ml-0.5 text-gold">*</span>}
      </label>
      {children}
      {error && (
        <p className="mt-1 text-xs text-red-600">{error}</p>
      )}
    </div>
  );
}

function inputClass(error?: string) {
  return clsx(
    "w-full rounded-sm border bg-white px-4 py-3 text-sm text-black transition-colors",
    "placeholder:text-black/30",
    "focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold",
    error ? "border-red-300" : "border-stone-dark",
  );
}
