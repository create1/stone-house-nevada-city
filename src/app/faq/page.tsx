import type { Metadata } from "next";
import Link from "next/link";
import FaqAccordion from "@/components/ui/FaqAccordion";
import InquiryCTA from "@/components/sections/InquiryCTA";
import { getFaqJsonLd, getBreadcrumbJsonLd } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Frequently Asked Questions | Stone House Nevada City",
  description:
    "Answers about capacity, parking, catering, bar service, music, and accessibility at Stone House Nevada City. Everything you need to plan your event.",
  openGraph: {
    title: "Frequently Asked Questions | Stone House Nevada City",
    description:
      "Answers about capacity, parking, catering, bar service, music, and accessibility at Stone House Nevada City. Everything you need to plan your event.",
  },
  robots: { index: true, follow: true },
};

// Static FAQ data — will migrate to Sanity CMS
const faqs = [
  // General
  {
    question: "Where is Stonehouse located?",
    answer:
      "Stonehouse is located at 107 Sacramento Street in historic downtown Nevada City, California — in the heart of Gold Country, about 60 miles northeast of Sacramento.",
    category: "General",
  },
  {
    question: "How old is the building?",
    answer:
      "Stonehouse was originally built in 1857 as a brewery during the California Gold Rush. It was rebuilt by Chinese immigrants and has served many purposes over its 165+ year history. The original stone walls are still intact.",
    category: "General",
  },
  {
    question: "Can I schedule a tour before booking?",
    answer:
      "Absolutely! We encourage all prospective clients to tour the venue before booking. Tours are available by appointment and typically last 30-45 minutes. You can request a tour through our inquiry form or by calling (530) 265-5050.",
    category: "General",
  },

  // Weddings
  {
    question: "Can we have both our ceremony and reception at Stonehouse?",
    answer:
      "Yes! Many couples host their ceremony on the Patio (up to 130 guests) and then move indoors for cocktails and reception. The full building rental gives you seamless flow between all six spaces.",
    category: "Weddings",
  },
  {
    question: "Do you provide a Day-Of Coordinator?",
    answer:
      "Full building rentals include a Day-Of Coordinator at no additional charge. For individual space rentals, coordination services can be added as an upgrade. We also work closely with your wedding planner if you have one.",
    category: "Weddings",
  },
  {
    question: "What is your weather contingency for outdoor ceremonies?",
    answer:
      "The Patio is partially covered, and we always have an indoor backup plan. The Music Venue and Dining Room both work beautifully for ceremonies. We'll discuss contingency options during your planning meetings.",
    category: "Weddings",
  },

  // Pricing & Availability
  {
    question: "What is the starting price for a full building rental?",
    answer:
      "Full building rentals start at $8,000 and include all six spaces, a Day-Of Coordinator, furniture, and up to 8 hours of venue time. Pricing varies by season, day of week, and specific requirements. Contact us for a custom quote.",
    category: "Pricing & Availability",
  },
  {
    question: "Do you offer off-season or weekday discounts?",
    answer:
      "Yes, we offer competitive rates for weekday events and off-peak season bookings (November through March, excluding holidays). Contact us with your preferred dates for specific pricing.",
    category: "Pricing & Availability",
  },
  {
    question: "How far in advance should we book?",
    answer:
      "We recommend booking 6-12 months in advance for weddings, especially for peak season (April-October). Corporate events and private parties can often be accommodated with 2-4 weeks notice, depending on availability.",
    category: "Pricing & Availability",
  },

  // Catering & Bar
  {
    question: "Do you provide in-house catering?",
    answer:
      "We work with a curated list of preferred caterers who know our kitchen, layout, and standards. You're welcome to use your own caterer with prior approval. Our catering philosophy emphasizes local, seasonal ingredients — and we're proud to be seed oil-free.",
    category: "Catering & Bar",
  },
  {
    question: "What bar options are available?",
    answer:
      "Stonehouse features a craft cocktail program with full bar service. Options include hosted bar, cash bar, consumption bar, and specialty cocktail packages. We offer beer, wine, spirits, and curated cocktail menus tailored to your event.",
    category: "Catering & Bar",
  },

  // Vendors & Logistics
  {
    question: "Do you have a preferred vendor list?",
    answer:
      "Yes! We maintain a curated list of photographers, florists, DJs, bands, planners, and other vendors who know our venue inside and out. Using preferred vendors is optional but recommended for the smoothest experience.",
    category: "Vendors & Logistics",
  },
  {
    question: "Is there parking available?",
    answer:
      "There is street parking throughout downtown Nevada City, and a public parking lot within a short walk of the venue. For larger events, we can coordinate valet services through our preferred vendor.",
    category: "Vendors & Logistics",
  },
  {
    question: "What time do events need to end?",
    answer:
      "Indoor events can run until midnight. The Patio has a 10 PM music curfew per city ordinance, but guests can remain outdoors. Most events wrap between 10 PM and midnight.",
    category: "Vendors & Logistics",
  },

  // Accessibility
  {
    question: "Is the venue ADA accessible?",
    answer:
      "The first floor (Music Venue, Tavern, Wine Cavern) and Patio are fully ADA accessible. The second floor (Dining Room, Lounge) is accessed by stairs only and is not ADA compliant. We're happy to discuss accommodation options for your guests.",
    category: "Accessibility",
  },
];

export default function FaqPage() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            getFaqJsonLd(faqs.map((f) => ({ question: f.question, answer: f.answer })))
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            getBreadcrumbJsonLd([
              { name: "Home", url: "https://stonehouse.io" },
              { name: "FAQ", url: "https://stonehouse.io/faq" },
            ])
          ),
        }}
      />
      {/* Hero */}
      <section className="section-dark pb-section-sm pt-40">
        <div className="mx-auto max-w-[80rem] px-6 text-center">
          <p className="small-label mb-4">Got Questions?</p>
          <h1 className="font-display text-display-lg text-cream">
            Frequently Asked Questions
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-cream/50">
            Everything you need to know about hosting your event at Stonehouse.
            Can&apos;t find your answer? Reach out and we&apos;ll get back to you
            within 24 hours.
          </p>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="bg-surface py-section">
        <div className="mx-auto max-w-3xl px-6">
          <FaqAccordion items={faqs} grouped />

          {/* Cross-links */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-4 text-sm">
            <Link
              href="/pricing"
              className="rounded-sm border border-surface-400 bg-surface-200 px-5 py-2.5 font-medium text-cream transition-all hover:border-gold hover:text-gold"
            >
              View Pricing & Packages
            </Link>
            <Link
              href="/inquiry"
              className="rounded-sm border border-surface-400 bg-surface-200 px-5 py-2.5 font-medium text-cream transition-all hover:border-gold hover:text-gold"
            >
              Send an Inquiry
            </Link>
          </div>
        </div>
      </section>

      <InquiryCTA />
    </main>
  );
}
