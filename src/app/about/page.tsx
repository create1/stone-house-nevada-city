import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/Button";
import InquiryCTA from "@/components/sections/InquiryCTA";
import { getBreadcrumbJsonLd } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Our Story | Stone House Nevada City — Since 1857",
  description:
    "From Gold Rush brewery to Nevada City's premier event venue. Discover 169 years of history at Stone House, where six distinctive spaces meet modern elegance in Gold Country.",
  openGraph: {
    title: "Our Story | Stone House Nevada City — Since 1857",
    description:
      "From Gold Rush brewery to Nevada City's premier event venue. Discover 169 years of history at Stone House, where six distinctive spaces meet modern elegance in Gold Country.",
  },
  robots: { index: true, follow: true },
};

const stats = [
  { value: "10,000", label: "Sq Ft" },
  { value: "6", label: "Unique Spaces" },
  { value: "$70K+", label: "First 3 Weeks" },
  { value: "1", label: "Historic Building" },
];

const team = [
  {
    name: "Jon Rowe",
    role: "Operations & Client Relations",
    bio: "Jon took over Stonehouse in 2017 with a vision to honor its history while making it the premier event destination in the Sierra Foothills. He oversees every event and is usually the first voice you'll hear when you reach out.",
    image: "/images/team/jon.jpg",
  },
  {
    name: "Jake",
    role: "Technology & Systems",
    bio: "Jake builds the systems that keep Stonehouse running smoothly — from booking and communications to the technology powering your event experience.",
    image: "/images/team/jake.jpg",
  },
];

export default function AboutPage() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            getBreadcrumbJsonLd([
              { name: "Home", url: "https://stonehouse.io" },
              { name: "About", url: "https://stonehouse.io/about" },
            ])
          ),
        }}
      />
      {/* ── Hero ─────────────────────────────────── */}
      <section className="relative flex min-h-[60vh] items-center justify-center bg-black">
        <Image
          src="/images/about/about-hero.jpg"
          alt="Stonehouse historic stone building exterior"
          fill
          className="object-cover opacity-40"
          priority
        />
        <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-gold">
            Our Story
          </p>
          <h1 className="font-display text-display-xl text-white text-balance">
            A Historic Building, Reimagined for Modern Celebration
          </h1>
        </div>
      </section>

      {/* ── Stats Bar ────────────────────────────── */}
      <section className="bg-gold">
        <div className="mx-auto grid max-w-[80rem] grid-cols-2 gap-6 px-6 py-10 md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-display text-display-md text-black">
                {stat.value}
              </p>
              <p className="mt-1 text-sm font-medium uppercase tracking-widest text-black/60">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Story Section ────────────────────────── */}
      <section className="bg-surface py-section">
        <div className="mx-auto max-w-[80rem] px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <div className="gold-divider mb-6" />
              <h2 className="font-display text-display-lg text-cream">
                Built by the Rush, Rebuilt by Hand
              </h2>
              <div className="mt-6 space-y-4 text-lg leading-relaxed text-cream/60">
                <p>
                  In 1857, at the height of the California Gold Rush, a brewery
                  was built on Sacramento Street in the heart of Nevada City.
                  Its foundation — massive blocks of local granite — was laid by
                  Chinese immigrants who quarried each stone by hand, one block
                  at a time.
                </p>
                <p>
                  The building has lived many lives since. It has been a brewery,
                  a gathering place, and a cornerstone of downtown Nevada City
                  through fires, floods, and the passage of time. Its stone
                  walls have stood for over 165 years.
                </p>
                <p>
                  In 2017, Jon Rowe took over the building with a clear vision:
                  honor the history, modernize the experience, and create a
                  venue unlike anything in the Sierra Foothills. Today,
                  Stonehouse is 10,000 square feet of character spread across
                  six unique spaces — from an underground wine cavern carved
                  into the original stone to a sunlit patio framed by towering
                  pines.
                </p>
                <p>
                  Every event here is shaped by that history. The walls tell the
                  story. We just make sure the evening is unforgettable.
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="overflow-hidden rounded-sm">
                <Image
                  src="https://cdn.prod.website-files.com/65f8783a30b4f349defb4960/6793f72050b2690b8c799686_DSC00429.avif"
                  alt="Original stone walls of Stonehouse"
                  width={700}
                  height={500}
                  className="w-full object-cover"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="overflow-hidden rounded-sm">
                  <Image
                    src="https://cdn.prod.website-files.com/65f8783a30b4f349defb4960/697e61f92beaf320fb3c45ea_thegreathall5.webp"
                    alt="Stone House Nevada City historic Gold Rush-era building detail"
                    width={340}
                    height={250}
                    className="w-full object-cover"
                  />
                </div>
                <div className="overflow-hidden rounded-sm">
                  <Image
                    src="https://cdn.prod.website-files.com/65f8783a30b4f349defb4960/678ed8ba7186bc93b18ebc73_A91A3219.avif"
                    alt="Original 1857 timber beam construction at Stone House Nevada City"
                    width={340}
                    height={250}
                    className="w-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Team Section ─────────────────────────── */}
      <section className="bg-surface-100 py-section">
        <div className="mx-auto max-w-[80rem] px-6">
          <div className="text-center">
            <div className="gold-divider mx-auto mb-6" />
            <h2 className="font-display text-display-lg text-cream">
              The Team
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-cream/50">
              A small team with a big commitment to making every event at
              Stonehouse exceptional.
            </p>
          </div>

          <div className="mx-auto mt-12 grid max-w-3xl gap-12 md:grid-cols-2">
            {team.map((person) => (
              <div key={person.name} className="text-center">
                <div className="mx-auto h-48 w-48 overflow-hidden rounded-full bg-surface-300">
                  <Image
                    src={person.image}
                    alt={`${person.name}, ${person.role} at Stone House Nevada City`}
                    width={192}
                    height={192}
                    className="h-full w-full object-cover"
                  />
                </div>
                <h3 className="mt-6 font-display text-display-sm text-cream">
                  {person.name}
                </h3>
                <p className="mt-1 text-sm font-medium uppercase tracking-widest text-gold-dark">
                  {person.role}
                </p>
                <p className="mt-3 text-cream/50">{person.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Vision Quote ─────────────────────────── */}
      <section className="bg-black py-section">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <span
            className="font-display text-6xl leading-none text-gold/30"
            aria-hidden="true"
          >
            &ldquo;
          </span>
          <blockquote className="mt-4 font-display text-display-md text-white italic">
            Premium but approachable. Historic but alive.
          </blockquote>
          <p className="mt-6 text-white/40">
            — The Stonehouse philosophy
          </p>
        </div>
      </section>

      {/* ── Come See CTA ─────────────────────────── */}
      <section className="bg-surface py-section">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <div className="gold-divider mx-auto mb-8" />
          <h2 className="font-display text-display-lg text-cream">
            Come See for Yourself
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-cream/50">
            No photo or description can capture what it feels like to walk
            through 165 years of history. Book a tour and experience Stonehouse
            in person.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button href="/inquiry" variant="primary" size="lg">
              Book a Tour
            </Button>
            <Button href="/gallery" variant="outline" size="lg">
              View Gallery
            </Button>
          </div>
          <p className="mx-auto mt-6 max-w-md text-sm text-cream/30">
            Planning a wedding?{" "}
            <Link
              href="/events/weddings"
              className="text-gold transition-colors hover:text-gold-dark"
            >
              See what weddings look like at Stonehouse
            </Link>
          </p>
        </div>
      </section>

      {/* ── InquiryCTA ───────────────────────────── */}
      <InquiryCTA />
    </main>
  );
}
