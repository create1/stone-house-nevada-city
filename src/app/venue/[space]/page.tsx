import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Users,
  Check,
  ArrowRight,
  ChevronRight,
  AlertTriangle,
  Calendar,
} from "lucide-react";
import Button from "@/components/ui/Button";
import InquiryCTA from "@/components/sections/InquiryCTA";
import { spaces, getSpaceBySlug, fullBuilding } from "@/data/spaces";
import { eventTypes } from "@/data/events";
import { getSpaceJsonLd, getBreadcrumbJsonLd } from "@/lib/structured-data";

/* Ideal-for tags by space */
const idealForMap: Record<string, string[]> = {
  "music-venue": [
    "Live Concerts",
    "Wedding Receptions",
    "Corporate Parties",
    "Dance Events",
    "Album Release Shows",
  ],
  tavern: [
    "Cocktail Hours",
    "Networking Events",
    "Casual Receptions",
    "Birthday Parties",
    "Social Gatherings",
  ],
  "dining-room": [
    "Seated Dinners",
    "Wedding Receptions",
    "Corporate Banquets",
    "Rehearsal Dinners",
    "Formal Events",
  ],
  lounge: [
    "Intimate Gatherings",
    "VIP Events",
    "Cocktail Parties",
    "After-Parties",
    "Small Celebrations",
  ],
  "wine-cavern": [
    "Wine Dinners",
    "Tasting Events",
    "Intimate Celebrations",
    "Elopements",
    "Private Chef Experiences",
  ],
  patio: [
    "Wedding Ceremonies",
    "Outdoor Dinners",
    "Garden Parties",
    "Bridal Showers",
    "Rehearsal Dinners",
  ],
};

export async function generateStaticParams() {
  return spaces.map((space) => ({ space: space.slug }));
}

const seoMeta: Record<string, { title: string; description: string }> = {
  "music-venue": {
    title:
      "The Great Hall — Live Music & Concert Venue | Stone House Nevada City",
    description:
      "300-guest capacity performance venue with elevated stage, professional sound and lighting, and wooden dance floor. Nevada City's premier live music and event space.",
  },
  "wine-cavern": {
    title:
      "The Cavern — Wine Cellar Event Space | Stone House Nevada City",
    description:
      "An intimate underground wine cellar perfect for tastings, private dinners, and cocktail hours. Stone walls, ambient lighting, and curated wine selections in historic Nevada City.",
  },
  lounge: {
    title:
      "The Penthouse — Private Lounge & VIP Space | Stone House Nevada City",
    description:
      "Exclusive upstairs lounge for intimate gatherings, VIP events, and cocktail receptions. Sophisticated ambiance with views of downtown Nevada City.",
  },
  patio: {
    title:
      "The Courtyard — Outdoor Event Patio | Stone House Nevada City",
    description:
      "Open-air courtyard for ceremonies, cocktail hours, and al fresco dining. String lights, stone walls, and Gold Country charm under the Sierra Foothills sky.",
  },
  "dining-room": {
    title:
      "The Showroom — Private Dining Room | Stone House Nevada City",
    description:
      "Elegant private dining for rehearsal dinners, business dinners, and intimate celebrations. Seats up to 60 guests with full catering and bar service at Stone House.",
  },
  tavern: {
    title:
      "The Parlor — Historic Tavern & Bar | Stone House Nevada City",
    description:
      "A charming tavern space for cocktail hours, small gatherings, and casual events. Craft cocktails and historic Gold Country ambiance at Stone House Nevada City.",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ space: string }>;
}): Promise<Metadata> {
  const { space: slug } = await params;
  const space = getSpaceBySlug(slug);
  if (!space) return {};
  const seo = seoMeta[slug];
  const title = seo?.title ?? space.name;
  const description = seo?.description ?? space.description;
  return {
    title,
    description,
    openGraph: { title, description },
    robots: { index: true, follow: true },
  };
}

export default async function SpacePage({
  params,
}: {
  params: Promise<{ space: string }>;
}) {
  const { space: slug } = await params;
  const space = getSpaceBySlug(slug);
  if (!space) notFound();

  const relatedSpaces = spaces.filter((s) => s.slug !== space.slug).slice(0, 3);
  const idealFor = idealForMap[space.slug] ?? [];

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getSpaceJsonLd(space)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            getBreadcrumbJsonLd([
              { name: "Home", url: "https://stonehouse.io" },
              { name: "Spaces", url: "https://stonehouse.io/venue/spaces" },
              { name: space.name, url: `https://stonehouse.io/venue/${space.slug}` },
            ])
          ),
        }}
      />
      {/* ── Hero ─────────────────────────────────── */}
      <section className="relative flex min-h-[60vh] items-center justify-center bg-black">
        <Image
          src={space.image}
          alt={`${space.name} at Stonehouse`}
          fill
          className="object-cover opacity-50"
          priority
        />
        <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
          <h1 className="font-display text-display-xl text-white">
            {space.name}
          </h1>
          <p className="mt-3 font-display text-xl text-gold italic">
            {space.tagline}
          </p>

          {/* Capacity badges */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            {space.capacity.seated && (
              <span className="flex items-center gap-1.5 rounded-sm bg-white/10 px-4 py-2 text-sm text-white backdrop-blur-sm">
                <Users size={14} className="text-gold" />
                {space.capacity.seated} seated
              </span>
            )}
            {space.capacity.standing && (
              <span className="flex items-center gap-1.5 rounded-sm bg-white/10 px-4 py-2 text-sm text-white backdrop-blur-sm">
                <Users size={14} className="text-gold" />
                {space.capacity.standing} standing
              </span>
            )}
            {space.capacity.ceremony && (
              <span className="flex items-center gap-1.5 rounded-sm bg-white/10 px-4 py-2 text-sm text-white backdrop-blur-sm">
                <Users size={14} className="text-gold" />
                {space.capacity.ceremony} ceremony
              </span>
            )}
            {space.capacity.dinner && (
              <span className="flex items-center gap-1.5 rounded-sm bg-white/10 px-4 py-2 text-sm text-white backdrop-blur-sm">
                <Users size={14} className="text-gold" />
                {space.capacity.dinner} dinner
              </span>
            )}
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
          <Link
            href="/venue/spaces"
            className="transition-colors hover:text-gold"
          >
            Spaces
          </Link>
          <ChevronRight size={14} />
          <span className="text-cream">{space.name}</span>
        </nav>
      </div>

      {/* ── Main Content ─────────────────────────── */}
      <section className="bg-surface py-section">
        <div className="mx-auto max-w-[80rem] px-6">
          <div className="grid gap-12 lg:grid-cols-3">
            {/* Left: Description + Features + Gallery */}
            <div className="lg:col-span-2">
              {/* Description */}
              <div className="gold-divider mb-6" />
              <h2 className="font-display text-display-md text-cream">
                About the {space.name}
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-cream/60">
                {space.description}
              </p>

              {/* ADA Notice */}
              {!space.adaCompliant && (
                <div className="mt-6 flex items-start gap-3 rounded-sm border border-gold/20 bg-gold/5 p-4">
                  <AlertTriangle
                    size={18}
                    className="mt-0.5 shrink-0 text-gold-dark"
                  />
                  <p className="text-sm text-cream/50">
                    This space is located on the {space.floor} floor and is not
                    ADA compliant. Please contact us to discuss accessibility
                    options for your event.
                  </p>
                </div>
              )}

              {/* Features */}
              <div className="mt-10">
                <h3 className="font-display text-display-sm text-cream">
                  Features
                </h3>
                <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                  {space.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2 text-cream/60"
                    >
                      <Check
                        size={16}
                        className="mt-0.5 shrink-0 text-gold"
                      />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Notes */}
              {space.notes && space.notes.length > 0 && (
                <div className="mt-6 space-y-1">
                  {space.notes.map((note) => (
                    <p key={note} className="text-sm text-cream/30 italic">
                      {note}
                    </p>
                  ))}
                </div>
              )}

              {/* Ideal For */}
              {idealFor.length > 0 && (
                <div className="mt-10">
                  <h3 className="font-display text-display-sm text-cream">
                    Ideal For
                  </h3>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {idealFor.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-sm border border-gold/20 bg-gold/5 px-4 py-2 text-sm text-cream/60"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommended Event Types */}
              {(() => {
                const relatedEvents = eventTypes.filter((e) =>
                  e.recommendedSpaces.includes(space.slug)
                ).slice(0, 3);
                return relatedEvents.length > 0 ? (
                  <div className="mt-10">
                    <h3 className="font-display text-display-sm text-cream">
                      Popular Event Types
                    </h3>
                    <div className="mt-4 flex flex-wrap gap-3">
                      {relatedEvents.map((e) => (
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
                ) : null;
              })()}

              {/* Photo Gallery */}
              <div className="mt-12">
                <h3 className="font-display text-display-sm text-cream">
                  Gallery
                </h3>
                <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {space.gallery.map((src, i) => (
                    <div
                      key={i}
                      className="overflow-hidden rounded-sm bg-surface-300"
                    >
                      <Image
                        src={src}
                        alt={`${space.name} event space at Stone House Nevada City photo ${i + 1}`}
                        width={400}
                        height={300}
                        className="aspect-[4/3] w-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="lg:col-span-1">
              {/* Inquiry Card */}
              <div className="sticky top-28 space-y-6">
                <div className="rounded-sm border border-surface-400 bg-surface-200 p-8">
                  <h3 className="font-display text-xl font-semibold text-cream">
                    Book the {space.name}
                  </h3>
                  <p className="mt-2 text-sm text-cream/50">
                    Interested in hosting your event here? Get in touch and
                    we&apos;ll help you plan every detail.
                  </p>
                  <div className="mt-6 space-y-3">
                    <Button
                      href="/inquiry"
                      variant="primary"
                      size="md"
                      className="w-full"
                    >
                      <Calendar size={16} className="mr-2" />
                      Book a Tour
                    </Button>
                    <Button
                      href="/inquiry"
                      variant="outline"
                      size="md"
                      className="w-full"
                    >
                      Send an Inquiry
                    </Button>
                  </div>
                  <p className="mt-4 text-center text-xs text-cream/30">
                    We respond within 24 hours
                  </p>
                </div>

                {/* Full Venue Upsell */}
                <div className="rounded-sm border border-gold/20 bg-gold/5 p-6">
                  <h4 className="font-display text-lg font-semibold text-cream">
                    Need More Space?
                  </h4>
                  <p className="mt-2 text-sm text-cream/50">
                    Book the full building — all 6 spaces, up to{" "}
                    {fullBuilding.maxCapacity} guests, with a Day-Of
                    Coordinator included.
                  </p>
                  <Button
                    href="/venue/spaces"
                    variant="text"
                    size="sm"
                    className="mt-4"
                  >
                    Learn About Full Building
                    <ArrowRight size={14} className="ml-1" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Related Spaces ───────────────────────── */}
      <section className="bg-surface-100 py-section">
        <div className="mx-auto max-w-[80rem] px-6">
          <div className="text-center">
            <div className="gold-divider mx-auto mb-6" />
            <h2 className="font-display text-display-md text-cream">
              Explore Other Spaces
            </h2>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {relatedSpaces.map((s) => (
              <Link
                key={s.slug}
                href={`/venue/${s.slug}`}
                className="group overflow-hidden rounded-sm bg-black"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <Image
                    src={s.image}
                    alt={`${s.name} event space at Stone House Nevada City`}
                    width={500}
                    height={375}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-display text-xl text-white">
                    {s.name}
                  </h3>
                  <p className="mt-1 text-sm text-white/50">{s.tagline}</p>
                  <span className="mt-3 flex items-center gap-1 text-sm font-medium text-gold opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    View Space <ArrowRight size={14} />
                  </span>
                </div>
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
