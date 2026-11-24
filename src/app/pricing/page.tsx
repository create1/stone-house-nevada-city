import type { Metadata } from "next";
import { Check } from "lucide-react";
import Button from "@/components/ui/Button";
import InquiryCTA from "@/components/sections/InquiryCTA";
import { getBreadcrumbJsonLd } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Pricing & Packages | Stone House Nevada City Event Venue",
  description:
    "Transparent pricing for weddings and events at Stone House Nevada City. Venue rental, catering packages, and customizable options. Request a personalized quote today.",
  openGraph: {
    title: "Pricing & Packages | Stone House Nevada City Event Venue",
    description:
      "Transparent pricing for weddings and events at Stone House Nevada City. Venue rental, catering packages, and customizable options. Request a personalized quote today.",
  },
  robots: { index: true, follow: true },
};

/* ── Data ─────────────────────────────────────── */

const seasonalRates = [
  {
    season: "Off-Peak",
    months: "January – February",
    color: "bg-surface-100",
    rates: [
      { day: "Sunday – Thursday", price: "$8,000" },
      { day: "Friday", price: "$9,500" },
      { day: "Saturday (block only)", price: "$10,500" },
    ],
  },
  {
    season: "Shoulder",
    months: "March – April, November",
    color: "bg-gold/5",
    rates: [
      { day: "Sunday – Thursday", price: "$9,800" },
      { day: "Friday", price: "$11,500" },
      { day: "Saturday (block only)", price: "$13,000" },
    ],
  },
  {
    season: "Peak",
    months: "May – October, December",
    color: "bg-gold/10",
    rates: [
      { day: "Sunday – Thursday", price: "$11,000" },
      { day: "Friday", price: "$12,500" },
      { day: "Saturday (block only)", price: "$14,000" },
    ],
  },
];

const packages = [
  {
    name: "Single Room",
    price: "From $250/hr",
    description: "Perfect for intimate gatherings, meetings, and small celebrations.",
    includes: [
      "One space of your choice",
      "Tables and chairs included",
      "Bar service available",
      "2-hour minimum",
    ],
  },
  {
    name: "Partial Building",
    price: "From $550/hr",
    description: "Combine multiple spaces for medium-sized events and celebrations.",
    includes: [
      "2–4 spaces of your choice",
      "Flexible configurations",
      "Full bar service",
      "Event planning support",
      "3-hour minimum",
    ],
    featured: true,
  },
  {
    name: "Full Building",
    price: "From $8,000",
    description: "Exclusive use of all six spaces for your event — the complete Stonehouse experience.",
    includes: [
      "All 6 unique spaces",
      "Up to 300 guests",
      "Day-Of Coordinator included",
      "Full bar service",
      "Dedicated event planning",
      "Preferred vendor access",
    ],
  },
];

const cateringProteins = [
  { protein: "Chicken", price: "$45" },
  { protein: "Pork", price: "$50" },
  { protein: "Salmon", price: "$55" },
  { protein: "Tri-Tip", price: "$60" },
  { protein: "Filet Mignon", price: "$75" },
];

const barPackages = [
  {
    name: "Beer & Wine",
    price: "$40/person",
    includes: ["Craft beer selection", "Curated wine list", "Non-alcoholic options"],
  },
  {
    name: "Premium",
    price: "$50/person",
    includes: ["Everything in Beer & Wine", "Premium spirits", "Signature cocktails (2)"],
    featured: true,
  },
  {
    name: "Top Shelf",
    price: "$60/person",
    includes: ["Everything in Premium", "Top-shelf spirits", "Unlimited signature cocktails", "Custom menu collaboration"],
  },
];

const addOns = [
  { service: "Photography", price: "From $2,500", note: "4–8 hour packages" },
  { service: "Florals", price: "From $1,200", note: "Ceremony + reception" },
  { service: "Day-Of Coordinator", price: "From $1,500", note: "Included with full building" },
  { service: "DJ / Live Music", price: "From $800", note: "Sound system included" },
  { service: "Full Event Planner", price: "From $3,500", note: "End-to-end coordination" },
];

export default function PricingPage() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            getBreadcrumbJsonLd([
              { name: "Home", url: "https://stonehouse.io" },
              { name: "Pricing", url: "https://stonehouse.io/pricing" },
            ])
          ),
        }}
      />
      {/* ── Hero ─────────────────────────────────── */}
      <section className="bg-black py-section-sm pt-32">
        <div className="mx-auto max-w-[80rem] px-6 text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-gold">
            Pricing
          </p>
          <h1 className="font-display text-display-lg text-white">
            Transparent Pricing, Tailored Packages
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-white/60">
            Every event is unique. These are starting points — reach out for a
            custom proposal that fits your vision and budget.
          </p>
        </div>
      </section>

      {/* ── Seasonal Rates ───────────────────────── */}
      <section className="bg-surface py-section">
        <div className="mx-auto max-w-[80rem] px-6">
          <div className="text-center">
            <div className="gold-divider mx-auto mb-6" />
            <h2 className="font-display text-display-md text-cream">
              Full Building — Seasonal Rates
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-cream/50">
              Full building rates include all 6 spaces, up to 300 guests, and a
              Day-Of Coordinator.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {seasonalRates.map((season) => (
              <div
                key={season.season}
                className={`rounded-sm border border-surface-400 p-8 ${season.color}`}
              >
                <h3 className="font-display text-xl font-semibold text-cream">
                  {season.season}
                </h3>
                <p className="mt-1 text-sm text-cream/40">{season.months}</p>
                <div className="mt-6 space-y-4">
                  {season.rates.map((rate) => (
                    <div
                      key={rate.day}
                      className="flex items-center justify-between border-b border-surface-400/50 pb-3 last:border-0"
                    >
                      <span className="text-sm text-cream/60">{rate.day}</span>
                      <span className="font-display text-lg font-semibold text-cream">
                        {rate.price}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <p className="mt-6 text-center text-sm text-cream/30">
            Saturdays are block-only bookings in all seasons. Contact us for
            Friday + Saturday combination packages.
          </p>
        </div>
      </section>

      {/* ── Package Cards ────────────────────────── */}
      <section className="bg-surface-100 py-section">
        <div className="mx-auto max-w-[80rem] px-6">
          <div className="text-center">
            <div className="gold-divider mx-auto mb-6" />
            <h2 className="font-display text-display-md text-cream">
              Packages
            </h2>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {packages.map((pkg) => (
              <div
                key={pkg.name}
                className={`relative rounded-sm border p-8 ${
                  pkg.featured
                    ? "border-gold bg-surface-200 shadow-lg"
                    : "border-surface-400 bg-surface-200"
                }`}
              >
                {pkg.featured && (
                  <span className="absolute -top-3 left-6 rounded-sm bg-gold px-3 py-1 text-xs font-medium uppercase tracking-widest text-black">
                    Popular
                  </span>
                )}
                <h3 className="font-display text-xl font-semibold text-cream">
                  {pkg.name}
                </h3>
                <p className="mt-2 font-display text-2xl font-semibold text-gold-dark">
                  {pkg.price}
                </p>
                <p className="mt-3 text-sm text-cream/50">{pkg.description}</p>
                <ul className="mt-6 space-y-2.5">
                  {pkg.includes.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-sm text-cream/60"
                    >
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
        </div>
      </section>

      {/* ── Catering ─────────────────────────────── */}
      <section className="bg-surface py-section">
        <div className="mx-auto max-w-[80rem] px-6">
          <div className="grid gap-16 lg:grid-cols-2">
            {/* Proteins */}
            <div>
              <div className="gold-divider mb-6" />
              <h2 className="font-display text-display-md text-cream">
                Catering
              </h2>
              <p className="mt-3 text-cream/50">
                Per-person pricing based on protein selection. Includes sides,
                salad, bread, and service.
              </p>
              <div className="mt-8 overflow-hidden rounded-sm border border-surface-400 bg-surface-200">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-surface-400 bg-surface-100">
                      <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-widest text-cream/30">
                        Protein
                      </th>
                      <th className="px-6 py-3 text-right text-sm font-medium uppercase tracking-widest text-cream/30">
                        Per Person
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {cateringProteins.map((item) => (
                      <tr
                        key={item.protein}
                        className="border-b border-surface-400/50 last:border-0"
                      >
                        <td className="px-6 py-4 text-cream/70">
                          {item.protein}
                        </td>
                        <td className="px-6 py-4 text-right font-display text-lg font-semibold text-cream">
                          {item.price}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Bar Packages */}
            <div>
              <div className="gold-divider mb-6" />
              <h2 className="font-display text-display-md text-cream">
                Bar Packages
              </h2>
              <p className="mt-3 text-cream/50">
                Per-person pricing for the duration of your event. Includes
                bartending staff and glassware.
              </p>
              <div className="mt-8 space-y-4">
                {barPackages.map((bar) => (
                  <div
                    key={bar.name}
                    className={`rounded-sm border p-6 ${
                      bar.featured
                        ? "border-gold bg-gold/5"
                        : "border-surface-400 bg-surface-200"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-display text-lg font-semibold text-cream">
                        {bar.name}
                      </h3>
                      <span className="font-display text-lg font-semibold text-gold-dark">
                        {bar.price}
                      </span>
                    </div>
                    <ul className="mt-3 space-y-1.5">
                      {bar.includes.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-2 text-sm text-cream/50"
                        >
                          <Check
                            size={14}
                            className="mt-0.5 shrink-0 text-gold"
                          />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Add-On Services ──────────────────────── */}
      <section className="bg-surface-100 py-section">
        <div className="mx-auto max-w-3xl px-6">
          <div className="text-center">
            <div className="gold-divider mx-auto mb-6" />
            <h2 className="font-display text-display-md text-cream">
              Add-On Services
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-cream/50">
              Available through our preferred vendor network. Prices are
              starting points and vary by scope.
            </p>
          </div>

          <div className="mt-10 overflow-hidden rounded-sm border border-surface-400 bg-surface-200">
            <table className="w-full">
              <thead>
                <tr className="border-b border-surface-400 bg-surface-100">
                  <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-widest text-cream/30">
                    Service
                  </th>
                  <th className="px-6 py-3 text-right text-sm font-medium uppercase tracking-widest text-cream/30">
                    Starting Price
                  </th>
                  <th className="hidden px-6 py-3 text-right text-sm font-medium uppercase tracking-widest text-cream/30 sm:table-cell">
                    Note
                  </th>
                </tr>
              </thead>
              <tbody>
                {addOns.map((item) => (
                  <tr
                    key={item.service}
                    className="border-b border-surface-400/50 last:border-0"
                  >
                    <td className="px-6 py-4 font-medium text-cream/70">
                      {item.service}
                    </td>
                    <td className="px-6 py-4 text-right font-display text-lg font-semibold text-cream">
                      {item.price}
                    </td>
                    <td className="hidden px-6 py-4 text-right text-sm text-cream/40 sm:table-cell">
                      {item.note}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── Payment Schedule + Tax Notes ──────────── */}
      <section className="bg-surface py-section">
        <div className="mx-auto max-w-[80rem] px-6">
          <div className="grid gap-12 md:grid-cols-2">
            {/* Payment Schedule */}
            <div>
              <div className="gold-divider mb-6" />
              <h2 className="font-display text-display-sm text-cream">
                Payment Schedule
              </h2>
              <div className="mt-6 space-y-6">
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold/10 font-display text-lg font-semibold text-gold">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold text-cream">
                      50% Retainer — At Booking
                    </h3>
                    <p className="mt-1 text-sm text-cream/50">
                      Secures your date and begins the planning process.
                      Non-refundable.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold/10 font-display text-lg font-semibold text-gold">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold text-cream">
                      25% — 3 Months Before Event
                    </h3>
                    <p className="mt-1 text-sm text-cream/50">
                      Due as planning progresses and vendor coordination
                      begins.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold/10 font-display text-lg font-semibold text-gold">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold text-cream">
                      Final Balance — 30 Days Before
                    </h3>
                    <p className="mt-1 text-sm text-cream/50">
                      Remaining balance plus any additions or adjustments
                      finalized.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tax Notes */}
            <div>
              <div className="gold-divider mb-6" />
              <h2 className="font-display text-display-sm text-cream">
                Tax Information
              </h2>
              <div className="mt-6 space-y-4">
                <div className="rounded-sm border border-surface-400 bg-surface-200 p-6">
                  <h3 className="font-semibold text-cream">
                    Food & Beverage Tax
                  </h3>
                  <p className="mt-2 text-sm text-cream/50">
                    California sales tax of{" "}
                    <span className="font-semibold text-cream">8.875%</span>{" "}
                    applies to all food and beverage charges, including
                    catering and bar packages.
                  </p>
                </div>
                <div className="rounded-sm border border-surface-400 bg-surface-200 p-6">
                  <h3 className="font-semibold text-cream">
                    Venue Hire — Tax Exempt
                  </h3>
                  <p className="mt-2 text-sm text-cream/50">
                    Venue rental fees are{" "}
                    <span className="font-semibold text-cream">
                      not subject to sales tax
                    </span>
                    . This includes room rental, setup, and cleanup fees.
                  </p>
                </div>
              </div>
              <p className="mt-6 text-sm text-cream/30">
                All prices listed on this page are pre-tax. Final invoices
                will itemize taxable and non-taxable charges separately.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── InquiryCTA ───────────────────────────── */}
      <InquiryCTA />
    </main>
  );
}
