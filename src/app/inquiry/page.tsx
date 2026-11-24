import type { Metadata } from "next";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import InquiryForm from "@/components/forms/InquiryForm";

export const metadata: Metadata = {
  title: "Check Availability | Book Stone House Nevada City",
  description:
    "Request availability and schedule a tour of Stone House Nevada City. Share your event details and our team will follow up within 24 hours.",
  openGraph: {
    title: "Check Availability | Book Stone House Nevada City",
    description:
      "Request availability and schedule a tour of Stone House Nevada City. Share your event details and our team will follow up within 24 hours.",
  },
  robots: { index: true, follow: true },
};

const steps = [
  {
    number: "01",
    title: "Review",
    description:
      "We review your inquiry within 24 hours and reach out with initial availability and pricing.",
  },
  {
    number: "02",
    title: "Tour",
    description:
      "Schedule an in-person walk-through of the venue. See the spaces, ask questions, and feel the atmosphere.",
  },
  {
    number: "03",
    title: "Proposal",
    description:
      "Receive a custom proposal tailored to your event — spaces, timing, catering, and everything in between.",
  },
];

export default function InquiryPage() {
  return (
    <main className="bg-surface">
      {/* ── Header ───────────────────────────────── */}
      <section className="bg-black py-section-sm pt-32">
        <div className="mx-auto max-w-[80rem] px-6 text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-gold">
            Get in Touch
          </p>
          <h1 className="font-display text-display-lg text-white">
            Let&apos;s Plan Your Event
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-white/60">
            Tell us about your vision and we&apos;ll show you how Stonehouse
            can bring it to life.
          </p>
        </div>
      </section>

      {/* ── Two Column Layout ────────────────────── */}
      <section className="py-section">
        <div className="mx-auto max-w-[80rem] px-6">
          <div className="grid gap-16 lg:grid-cols-5">
            {/* Left Column - Process + Contact */}
            <div className="lg:col-span-2">
              {/* Process Steps */}
              <div className="gold-divider mb-6" />
              <h2 className="font-display text-display-sm text-cream">
                How It Works
              </h2>
              <div className="mt-8 space-y-8">
                {steps.map((step) => (
                  <div key={step.number} className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold/10 font-display text-lg font-semibold text-gold">
                      {step.number}
                    </div>
                    <div>
                      <h3 className="font-display text-lg font-semibold text-cream">
                        {step.title}
                      </h3>
                      <p className="mt-1 text-sm text-cream/50">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Contact Info */}
              <div className="mt-12 rounded-sm border border-surface-400 bg-surface-200 p-6">
                <h3 className="font-display text-lg font-semibold text-cream">
                  Contact
                </h3>
                <div className="mt-4 space-y-4">
                  <a
                    href="tel:5302655050"
                    className="flex items-center gap-3 text-sm text-cream/60 transition-colors hover:text-gold"
                  >
                    <Phone size={16} className="text-gold" />
                    (530) 265-5050
                  </a>
                  <a
                    href="mailto:bookings@stonehouse.io"
                    className="flex items-center gap-3 text-sm text-cream/60 transition-colors hover:text-gold"
                  >
                    <Mail size={16} className="text-gold" />
                    bookings@stonehouse.io
                  </a>
                  <div className="flex items-start gap-3 text-sm text-cream/60">
                    <MapPin size={16} className="mt-0.5 shrink-0 text-gold" />
                    <span>
                      107 Sacramento St
                      <br />
                      Nevada City, CA 95959
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-cream/60">
                    <Clock size={16} className="text-gold" />
                    Tours by appointment
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Form */}
            <div className="lg:col-span-3">
              <div className="rounded-sm border border-surface-400 bg-surface-200 p-8 shadow-sm">
                <h2 className="mb-6 font-display text-xl font-semibold text-cream">
                  Tell Us About Your Event
                </h2>
                <InquiryForm />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
