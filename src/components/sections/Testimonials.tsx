"use client";

import { useState, useEffect, useCallback } from "react";
import { clsx } from "clsx";

const testimonials = [
  {
    quote:
      "Stonehouse made our wedding absolutely magical. The Wine Cavern cocktail hour and Patio ceremony were everything we dreamed of — our guests are still talking about it months later.",
    author: "Sarah & Michael",
    event: "Wedding, October 2024",
  },
  {
    quote:
      "We booked Stonehouse for our annual company retreat and it exceeded every expectation. The Dining Room was perfect for our presentations and the Tavern kept the team socializing well into the evening.",
    author: "Jessica Torres",
    event: "Corporate Retreat, March 2024",
  },
  {
    quote:
      "The history and character of this building is unmatched. From the stone walls to the incredible staff, every detail of our fundraising gala felt elevated. We raised 40% more than our goal.",
    author: "David Chen",
    event: "Annual Fundraiser, November 2024",
  },
];

export default function Testimonials() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => {
    setActive((prev) => (prev + 1) % testimonials.length);
  }, []);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [paused, next]);

  return (
    <section className="bg-surface-100 py-section">
      <div className="mx-auto max-w-[80rem] px-6">
        <div className="text-center">
          <p className="small-label mb-4">What Couples Say</p>
          <h2 className="font-display text-display-md text-cream">
            Stories that speak for themselves
          </h2>
        </div>

        <div
          className="relative mx-auto mt-12 max-w-3xl"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* Quotes */}
          <div className="relative min-h-[200px]">
            {testimonials.map((t, i) => (
              <blockquote
                key={i}
                className={clsx(
                  "absolute inset-0 flex flex-col items-center justify-center text-center transition-all duration-700",
                  i === active
                    ? "translate-y-0 opacity-100"
                    : "translate-y-4 opacity-0 pointer-events-none",
                )}
                aria-hidden={i !== active}
              >
                {/* Gold quote mark */}
                <span
                  className="mb-6 font-display text-6xl leading-none text-gold/30"
                  aria-hidden="true"
                >
                  &ldquo;
                </span>
                <p className="text-lg leading-relaxed text-cream/70 italic md:text-xl">
                  {t.quote}
                </p>
                <footer className="mt-6">
                  <cite className="not-italic">
                    <span className="block font-display text-lg font-semibold text-cream">
                      {t.author}
                    </span>
                    <span className="mt-1 block text-sm text-gold-dark">
                      {t.event}
                    </span>
                  </cite>
                </footer>
              </blockquote>
            ))}
          </div>

          {/* Dot Navigation */}
          <div
            className="mt-8 flex items-center justify-center gap-3"
            role="tablist"
            aria-label="Testimonial navigation"
          >
            {testimonials.map((_, i) => (
              <button
                key={i}
                role="tab"
                aria-selected={i === active}
                aria-label={`Testimonial ${i + 1}`}
                onClick={() => setActive(i)}
                className={clsx(
                  "h-2.5 rounded-full transition-all duration-300",
                  i === active
                    ? "w-8 bg-gold"
                    : "w-2.5 bg-gold/30 hover:bg-gold/50",
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
