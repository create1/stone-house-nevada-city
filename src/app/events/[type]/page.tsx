import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Landmark,
  UserCheck,
  ChefHat,
  Monitor,
  ChevronRight,
  ArrowRight,
  Users,
  Check,
} from "lucide-react";
import Button from "@/components/ui/Button";
import InquiryCTA from "@/components/sections/InquiryCTA";
import { eventTypes, getEventBySlug } from "@/data/events";
import { getSpaceBySlug } from "@/data/spaces";
import { getBreadcrumbJsonLd } from "@/lib/structured-data";

const featureCards = [
  {
    icon: <Landmark size={24} />,
    title: "Historic Venue",
    description:
      "Original 1857 stone walls and timber beams create an atmosphere no modern build can replicate.",
  },
  {
    icon: <UserCheck size={24} />,
    title: "Dedicated Team",
    description:
      "Full building rentals include a Day-Of Coordinator. Our team handles every detail.",
  },
  {
    icon: <ChefHat size={24} />,
    title: "Custom Catering",
    description:
      "Work with our preferred caterers or bring your own. We accommodate any menu vision.",
  },
  {
    icon: <Monitor size={24} />,
    title: "Full A/V",
    description:
      "State-of-the-art sound, professional lighting, and presentation-ready technology.",
  },
];

const faqsByType: Record<string, { q: string; a: string }[]> = {
  weddings: [
    {
      q: "What is the maximum guest count for a wedding?",
      a: "A full building buyout accommodates up to 300 guests across all six spaces. Individual spaces range from 30 to 300 depending on configuration.",
    },
    {
      q: "Can we hold the ceremony and reception at Stonehouse?",
      a: "Absolutely. Most couples hold their ceremony on the Patio (up to 130 guests) and move inside for the reception. It's one of the biggest advantages of our venue.",
    },
    {
      q: "Do you have a preferred vendor list?",
      a: "Yes — we work with a curated list of caterers, florists, photographers, and DJs who know the space well. You're also welcome to bring your own vendors.",
    },
    {
      q: "Is there a bridal suite or getting-ready space?",
      a: "Yes. The Lounge serves as a private getting-ready suite, and the backstage green room at the Music Venue is available for wedding parties.",
    },
  ],
  corporate: [
    {
      q: "Do you have A/V and presentation equipment?",
      a: "Yes — our Music Venue has a state-of-the-art sound system and professional lighting. We can also arrange projectors and screens for the Dining Room.",
    },
    {
      q: "Can you accommodate team building activities?",
      a: "Absolutely. Our six spaces offer variety — from wine tastings in the Cavern to cocktail-making in the Tavern. We'll help design a custom itinerary.",
    },
    {
      q: "Is there parking for corporate events?",
      a: "There is street parking throughout downtown Nevada City, plus a public lot within a 2-minute walk. We can arrange shuttle service for larger groups.",
    },
    {
      q: "Can we book just a few hours during the day?",
      a: "Yes — individual spaces are available by the hour starting at $250/hr. Contact us for a custom quote based on your needs.",
    },
  ],
  "private-dining": [
    {
      q: "What is the minimum guest count for a private dinner?",
      a: "The Wine Cavern accommodates as few as 10 guests for an intimate experience. There's no minimum for other spaces, though pricing is based on space rental rather than headcount.",
    },
    {
      q: "Can we bring our own wine?",
      a: "We offer a curated wine program, but we're happy to discuss corkage options for special bottles. Contact us for details.",
    },
    {
      q: "Do you offer tasting menus?",
      a: "Yes — our catering partners offer multi-course tasting menus. The Wine Cavern is especially popular for wine-paired dinners.",
    },
    {
      q: "Are dietary restrictions accommodated?",
      a: "Absolutely. Our catering partners work with all dietary needs including vegetarian, vegan, gluten-free, and allergen-specific menus.",
    },
  ],
  "live-music": [
    {
      q: "What is the sound system like?",
      a: "Our Music Venue features a state-of-the-art professional sound system with a wooden dance floor, professional lighting rig, and backstage green room.",
    },
    {
      q: "What is the capacity for a concert?",
      a: "The Music Venue holds up to 300 standing or 50 seated. The Tavern (100 standing) is also available for pre-show drinks.",
    },
    {
      q: "Is there a curfew for live music?",
      a: "Indoor music has no curfew. The Patio has a 10 PM music curfew out of respect for our Nevada City neighbors.",
    },
    {
      q: "How do we book a show?",
      a: "Contact us at bookings@stonehouse.io with your preferred date, expected attendance, and any technical requirements. We'll get back to you within 24 hours.",
    },
  ],
  fundraisers: [
    {
      q: "Can we set up auction tables?",
      a: "Yes — the Dining Room and Tavern are ideal for silent auction displays, and the Music Venue works perfectly for live auctions with its stage and sound system.",
    },
    {
      q: "Do you offer nonprofit pricing?",
      a: "We're proud supporters of the Nevada City community. Contact us about special pricing for registered nonprofits.",
    },
    {
      q: "Can we combine spaces for a large gala?",
      a: "Absolutely. A full building buyout gives you all six spaces for up to 300 guests, with a Day-Of Coordinator included.",
    },
    {
      q: "Is there a stage for speeches and presentations?",
      a: "Yes — the Music Venue has a built-in stage with professional sound and lighting, perfect for keynotes, honoree speeches, and entertainment.",
    },
  ],
  "holiday-parties": [
    {
      q: "How far in advance should we book?",
      a: "Holiday season (November–December) books quickly. We recommend reaching out at least 3–4 months in advance to secure your preferred date.",
    },
    {
      q: "Can you help with holiday décor?",
      a: "The venue's stone walls and warm lighting create a naturally festive atmosphere. We can also connect you with decorators for custom theming.",
    },
    {
      q: "What holiday menu options are available?",
      a: "Our catering partners offer seasonal menus featuring holiday favorites. From passed hors d'oeuvres to multi-course dinners, we'll match the menu to your vision.",
    },
    {
      q: "Can we have a DJ or live band?",
      a: "Absolutely. The Music Venue has a state-of-the-art sound system. We can also recommend local bands and DJs who know the space well.",
    },
  ],
  celebrations: [
    {
      q: "What group sizes can you accommodate?",
      a: "From intimate gatherings of 10 in the Wine Cavern to full-building celebrations of 300 guests. We'll help you find the right space for your group.",
    },
    {
      q: "Can we bring our own decorations?",
      a: "Absolutely. You're welcome to bring decorations and we can connect you with event designers who know the space well for larger setups.",
    },
    {
      q: "Is live music or a DJ available?",
      a: "Yes — the Music Venue has a state-of-the-art sound system and stage. We also have a list of recommended DJs and bands who know the room.",
    },
    {
      q: "Do you offer packages for milestone birthdays?",
      a: "We create custom packages based on your guest count, space selection, and catering needs. Contact us with your vision and we'll build a proposal.",
    },
  ],
  memorials: [
    {
      q: "How quickly can you accommodate a memorial service?",
      a: "We understand that memorial planning often happens on short notice. We'll do our best to accommodate your timeline — reach out and we'll check availability immediately.",
    },
    {
      q: "Can we hold both a ceremony and a reception?",
      a: "Yes. Many families hold a ceremony on the Patio or in the Dining Room and then gather for a reception in the Tavern or Music Venue.",
    },
    {
      q: "Do you provide event coordination for memorials?",
      a: "Full building rentals include a Day-Of Coordinator. For individual space rentals, coordination services can be added. Our team provides compassionate, attentive support throughout.",
    },
    {
      q: "Are there ADA accessible spaces available?",
      a: "Yes — the first floor (Music Venue, Tavern, Wine Cavern) and Patio are fully ADA accessible. We're happy to discuss accommodation options for your guests.",
    },
  ],
};

const startingPrices: Record<string, string> = {
  weddings: "$8,000",
  corporate: "$250/hr",
  "private-dining": "$250/hr",
  "live-music": "$250/hr",
  fundraisers: "$250/hr",
  "holiday-parties": "$250/hr",
  celebrations: "$250/hr",
  memorials: "$250/hr",
};

export async function generateStaticParams() {
  return eventTypes.map((e) => ({ type: e.slug }));
}

const seoMeta: Record<string, { title: string; description: string }> = {
  weddings: {
    title:
      "Weddings at Stone House | Nevada City Wedding Venue — Gold Country",
    description:
      "Plan your dream wedding at Stone House Nevada City. Six unique spaces, full bar service, in-house catering, and 169 years of history. From intimate ceremonies to 300-guest celebrations.",
  },
  corporate: {
    title: "Corporate Retreats & Events | Stone House Nevada City",
    description:
      "Host your corporate retreat, team building event, or conference at Stone House. Six versatile spaces in downtown Nevada City, 60 miles from Sacramento. Customizable packages available.",
  },
  "private-dining": {
    title: "Private Dining & Dinner Events | Stone House Nevada City",
    description:
      "Host a private dinner party, wine pairing, or chef's table experience at Stone House. Intimate spaces, local cuisine, and personalized service in Nevada City.",
  },
  "live-music": {
    title: "Live Music Events | Stone House Nevada City — Concerts & Shows",
    description:
      "Nevada City's home for live music. Professional stage, sound system, and 300-person capacity in a historic Gold Country venue. View upcoming shows and book your event.",
  },
  fundraisers: {
    title: "Fundraiser & Gala Venue | Stone House Nevada City",
    description:
      "Host your nonprofit fundraiser, charity gala, or benefit dinner at Stone House. Elegant spaces, full event support, and the historic charm of Nevada City.",
  },
  "holiday-parties": {
    title: "Holiday Party Venue | Stone House Nevada City",
    description:
      "Book your holiday party at Stone House Nevada City. Corporate holiday events, team celebrations, and festive gatherings in a historic Gold Country setting.",
  },
  celebrations: {
    title: "Birthday Parties & Celebrations | Stone House Nevada City",
    description:
      "Celebrate birthdays, anniversaries, and milestones at Stone House Nevada City. Six unique spaces for groups of 10 to 300 in Gold Country's most iconic venue.",
  },
  memorials: {
    title: "Celebration of Life Venue | Stone House Nevada City",
    description:
      "Honor your loved one in a beautiful, dignified setting. Stone House Nevada City offers compassionate event support and six peaceful spaces for memorial gatherings.",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ type: string }>;
}): Promise<Metadata> {
  const { type: slug } = await params;
  const event = getEventBySlug(slug);
  if (!event) return {};
  const seo = seoMeta[slug];
  const title = seo?.title ?? event.name;
  const description = seo?.description ?? event.description.slice(0, 160);
  return {
    title,
    description,
    openGraph: { title, description },
    robots: { index: true, follow: true },
  };
}

export default async function EventTypePage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type: slug } = await params;
  const event = getEventBySlug(slug);
  if (!event) notFound();

  const faqs = faqsByType[event.slug] ?? [];
  const otherEvents = eventTypes.filter((e) => e.slug !== event.slug);
  const recommendedSpaces = event.recommendedSpaces
    .map((s) => getSpaceBySlug(s))
    .filter(Boolean);

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            getBreadcrumbJsonLd([
              { name: "Home", url: "https://stonehouse.io" },
              { name: "Events", url: "https://stonehouse.io/events" },
              { name: event.name, url: `https://stonehouse.io/events/${event.slug}` },
            ])
          ),
        }}
      />
      {/* ── Hero ─────────────────────────────────── */}
      <section className="relative flex min-h-[60vh] items-center justify-center bg-black">
        <Image
          src={event.image}
          alt={`${event.name} at Stonehouse`}
          fill
          className="object-cover opacity-40"
          priority
        />
        <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-gold">
            Events
          </p>
          <h1 className="font-display text-display-xl text-white">
            {event.name}
          </h1>
          <p className="mt-3 font-display text-xl text-white/70 italic">
            {event.tagline}
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button href="/inquiry" variant="primary" size="lg">
              {event.cta}
            </Button>
            <Button href="/venue/spaces" variant="ghost" size="lg">
              View Our Spaces
            </Button>
          </div>
        </div>
      </section>

      {/* ── Breadcrumb ───────────────────────────── */}
      <div className="bg-surface">
        <nav
          className="mx-auto flex max-w-[80rem] items-center gap-2 px-6 py-4 text-sm text-cream/30"
          aria-label="Breadcrumb"
        >
          <Link href="/" className="transition-colors hover:text-gold">
            Home
          </Link>
          <ChevronRight size={14} />
          <span className="transition-colors">Events</span>
          <ChevronRight size={14} />
          <span className="text-cream">{event.name}</span>
        </nav>
      </div>

      {/* ── About + Feature Cards ────────────────── */}
      <section className="bg-surface py-section">
        <div className="mx-auto max-w-[80rem] px-6">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <div className="gold-divider mb-6" />
              <h2 className="font-display text-display-md text-cream">
                {event.name} at Stonehouse
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-cream/60">
                {event.description}
              </p>

              {/* Starting price */}
              <div className="mt-6 inline-flex items-center gap-2 rounded-sm border border-gold/20 bg-gold/5 px-4 py-2">
                <span className="text-sm text-cream/40">Starting from</span>
                <span className="font-display text-xl font-semibold text-gold-dark">
                  {startingPrices[event.slug]}
                </span>
              </div>

              {/* Highlights */}
              <ul className="mt-8 space-y-3">
                {event.highlights.map((h) => (
                  <li
                    key={h}
                    className="flex items-start gap-2 text-cream/60"
                  >
                    <Check
                      size={16}
                      className="mt-0.5 shrink-0 text-gold"
                    />
                    {h}
                  </li>
                ))}
              </ul>
            </div>

            {/* Feature cards */}
            <div className="grid gap-4 sm:grid-cols-2">
              {featureCards.map((card) => (
                <div
                  key={card.title}
                  className="rounded-sm border border-surface-400 bg-surface-200 p-6"
                >
                  <div className="mb-3 text-gold">{card.icon}</div>
                  <h3 className="font-display text-lg font-semibold text-cream">
                    {card.title}
                  </h3>
                  <p className="mt-1.5 text-sm text-cream/50">
                    {card.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Recommended Spaces ───────────────────── */}
      <section className="bg-surface-100 py-section">
        <div className="mx-auto max-w-[80rem] px-6">
          <div className="text-center">
            <div className="gold-divider mx-auto mb-6" />
            <h2 className="font-display text-display-md text-cream">
              Recommended Spaces
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-cream/50">
              These spaces are our top picks for {event.name.toLowerCase()}.
              Mix and match, or book them all.
            </p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {recommendedSpaces.map((space) =>
              space ? (
                <Link
                  key={space.slug}
                  href={`/venue/${space.slug}`}
                  className="group overflow-hidden rounded-sm bg-black"
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <Image
                      src={space.image}
                      alt={`${space.name} — recommended for ${event.name.toLowerCase()} at Stone House`}
                      width={400}
                      height={300}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-display text-lg text-white">
                      {space.name}
                    </h3>
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {space.capacity.seated && (
                        <span className="text-xs text-white/50">
                          <Users size={10} className="mr-0.5 inline" />
                          {space.capacity.seated} seated
                        </span>
                      )}
                      {space.capacity.standing && (
                        <span className="text-xs text-white/50">
                          <Users size={10} className="mr-0.5 inline" />
                          {space.capacity.standing} standing
                        </span>
                      )}
                    </div>
                    <span className="mt-2 flex items-center gap-1 text-sm text-gold opacity-0 transition-opacity group-hover:opacity-100">
                      View Space <ArrowRight size={12} />
                    </span>
                  </div>
                </Link>
              ) : null,
            )}
          </div>
        </div>
      </section>

      {/* ── Gallery Strip ────────────────────────── */}
      <section className="bg-surface py-section">
        <div className="mx-auto max-w-[80rem] px-6">
          <div className="text-center">
            <div className="gold-divider mx-auto mb-6" />
            <h2 className="font-display text-display-md text-cream">
              See It in Action
            </h2>
          </div>
          <div className="mt-10 flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {event.gallery
              .concat([event.image, event.gallery[0]])
              .slice(0, 5)
              .map((src, i) => (
                <div
                  key={i}
                  className="w-[300px] shrink-0 overflow-hidden rounded-sm md:w-[400px]"
                >
                  <Image
                    src={src}
                    alt={`${event.name} at Stone House Nevada City photo ${i + 1}`}
                    width={400}
                    height={300}
                    className="aspect-[4/3] w-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* ── FAQ Accordion ────────────────────────── */}
      {faqs.length > 0 && (
        <section className="bg-surface-100 py-section">
          <div className="mx-auto max-w-3xl px-6">
            <div className="text-center">
              <div className="gold-divider mx-auto mb-6" />
              <h2 className="font-display text-display-md text-cream">
                Frequently Asked Questions
              </h2>
            </div>
            <div className="mt-10 space-y-4">
              {faqs.map((faq, i) => (
                <details
                  key={i}
                  className="group rounded-sm border border-surface-400 bg-surface-200"
                >
                  <summary className="flex cursor-pointer items-center justify-between px-6 py-5 font-display text-lg font-semibold text-cream">
                    {faq.q}
                    <span className="ml-4 shrink-0 text-gold transition-transform duration-200 group-open:rotate-45">
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <line x1="9" y1="3" x2="9" y2="15" />
                        <line x1="3" y1="9" x2="15" y2="9" />
                      </svg>
                    </span>
                  </summary>
                  <div className="px-6 pb-5 text-cream/60">{faq.a}</div>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Other Event Types ────────────────────── */}
      <section className="bg-surface py-section-sm">
        <div className="mx-auto max-w-[80rem] px-6">
          <h3 className="mb-6 text-center font-display text-display-sm text-cream">
            Explore Other Events
          </h3>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {otherEvents.map((e) => (
              <Link
                key={e.slug}
                href={`/events/${e.slug}`}
                className="rounded-sm border border-surface-400 bg-surface-200 px-5 py-2.5 text-sm font-medium text-cream transition-all hover:border-gold hover:text-gold"
              >
                {e.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── InquiryCTA ───────────────────────────── */}
      <InquiryCTA />
    </main>
  );
}
