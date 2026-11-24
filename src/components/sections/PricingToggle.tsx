"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import Button from "@/components/ui/Button";

type Category = "weddings" | "corporate" | "private";

interface PackageTier {
  name: string;
  price: string;
  description: string;
  includes: string[];
  featured?: boolean;
}

const packages: Record<Category, PackageTier[]> = {
  weddings: [
    {
      name: "Essential",
      price: "From $4,500",
      description: "Intimate celebrations with everything you need",
      includes: [
        "Choice of one space (up to 4 hours)",
        "Tables and chairs included",
        "Basic sound system",
        "Setup and breakdown assistance",
        "On-site event manager",
        "Access to preferred vendor list",
      ],
    },
    {
      name: "Premium",
      price: "From $6,500",
      description: "Elevated experiences across multiple spaces",
      includes: [
        "Two connecting spaces (up to 6 hours)",
        "Full furniture package",
        "Professional sound and lighting",
        "Day-Of Coordinator",
        "Ceremony and reception configurations",
        "Cocktail hour setup",
        "Complimentary tasting",
      ],
      featured: true,
    },
    {
      name: "Full Building",
      price: "From $8,000",
      description: "Exclusive use of all six spaces",
      includes: [
        "All six spaces (up to 8 hours)",
        "Day-Of Coordinator included",
        "Up to 300 guests",
        "Full furniture and decor package",
        "Professional sound, lighting, and staging",
        "Bridal suite access",
        "Rehearsal time included",
        "Valet coordination",
      ],
    },
  ],
  corporate: [
    {
      name: "Meeting",
      price: "From $1,500",
      description: "Professional gatherings in a unique setting",
      includes: [
        "Choice of one space (up to 4 hours)",
        "A/V equipment and WiFi",
        "Conference-style seating",
        "Coffee and refreshment station",
        "On-site support",
      ],
    },
    {
      name: "Retreat",
      price: "From $3,500",
      description: "Full-day team experiences",
      includes: [
        "Multiple spaces (up to 8 hours)",
        "A/V and presentation equipment",
        "Flexible room configurations",
        "Catering packages available",
        "Team building space options",
        "Dedicated event coordinator",
      ],
      featured: true,
    },
    {
      name: "Executive",
      price: "From $6,000",
      description: "Premium corporate entertainment",
      includes: [
        "Full building access",
        "White-glove service",
        "Custom catering and bar program",
        "Professional A/V with tech support",
        "Branded event elements",
        "VIP spaces (Wine Cavern, Lounge)",
        "Valet coordination",
      ],
    },
  ],
  private: [
    {
      name: "Intimate",
      price: "From $1,200",
      description: "Small gatherings with big character",
      includes: [
        "Wine Cavern or Lounge (up to 3 hours)",
        "Up to 30 guests",
        "Basic bar service",
        "Appetizer-style catering available",
        "Ambient lighting and music",
      ],
    },
    {
      name: "Dinner Party",
      price: "From $3,000",
      description: "Elevated seated dining experiences",
      includes: [
        "Dining Room or Lounge (up to 4 hours)",
        "Up to 90 seated guests",
        "Multi-course dining options",
        "Wine pairing available",
        "Custom menu consultation",
        "Table settings and decor",
      ],
      featured: true,
    },
    {
      name: "Celebration",
      price: "From $5,000",
      description: "Full-scale private events",
      includes: [
        "Multiple spaces or full building",
        "Up to 300 guests",
        "Full catering and bar program",
        "Live music and entertainment options",
        "Day-Of Coordinator",
        "Custom event planning",
        "Late-night options available",
      ],
    },
  ],
};

const categories: { key: Category; label: string }[] = [
  { key: "weddings", label: "Weddings" },
  { key: "corporate", label: "Corporate" },
  { key: "private", label: "Private Events" },
];

export default function PricingToggle() {
  const [active, setActive] = useState<Category>("weddings");

  return (
    <section className="bg-surface py-section" id="pricing">
      <div className="mx-auto max-w-[80rem] px-6">
        <div className="text-center">
          <p className="small-label mb-4">Investment</p>
          <h2 className="font-display text-display-lg text-cream">Transparent pricing. No surprises.</h2>
          <p className="mx-auto mt-3 max-w-xl text-cream/50">
            Wedding reception packages are priced per guest (buffet or plated). Venue hire, bar, and tax are quoted separately for your date.
          </p>
        </div>

        {/* Toggle */}
        <div className="mt-10 flex items-center justify-center gap-1 rounded-sm bg-surface-300 p-1">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActive(cat.key)}
              className={`rounded-sm px-6 py-2.5 text-sm font-medium transition-all duration-300 ${
                active === cat.key
                  ? "bg-gold text-black shadow-sm"
                  : "text-cream/50 hover:text-cream"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Packages */}
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {packages[active].map((pkg) => (
            <div
              key={pkg.name}
              className={`relative rounded-sm border p-8 transition-all duration-300 ${
                pkg.featured
                  ? "border-gold bg-surface-300 shadow-lg"
                  : "border-surface-400 bg-surface-200 hover:border-gold/30"
              }`}
            >
              {pkg.featured && (
                <span className="absolute -top-3 left-6 rounded-sm bg-gold px-3 py-1 text-xs font-medium uppercase tracking-wider text-black">
                  Most Popular
                </span>
              )}
              <h3 className="font-display text-display-sm text-cream">{pkg.name}</h3>
              <p className="mt-1 text-2xl font-semibold text-gold">{pkg.price}</p>
              <p className="mt-2 text-sm text-cream/50">{pkg.description}</p>
              <ul className="mt-6 space-y-3">
                {pkg.includes.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-cream/60">
                    <Check size={16} className="mt-0.5 shrink-0 text-gold" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Button
                  href="/inquiry"
                  variant={pkg.featured ? "primary" : "outline"}
                  size="md"
                  className="w-full"
                >
                  Get a Quote
                </Button>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-cream/30">
          All packages are customizable. Catering and bar services available as add-ons.
          Contact us for seasonal availability and special rates.
        </p>
      </div>
    </section>
  );
}
