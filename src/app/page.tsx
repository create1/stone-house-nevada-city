import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
} from "lucide-react";
import Button from "@/components/ui/Button";
import Testimonials from "@/components/sections/Testimonials";
import InquiryCTA from "@/components/sections/InquiryCTA";
import OurStory from "@/components/sections/OurStory";
import PricingToggle from "@/components/sections/PricingToggle";
import DateChecker from "@/components/lead-capture/DateChecker";
import ExitIntentPopup from "@/components/lead-capture/ExitIntentPopup";
import TimedPopup from "@/components/lead-capture/TimedPopup";
import ScrollReveal from "@/components/effects/ScrollReveal";
import { spaces } from "@/data/spaces";

export default function HomePage() {
  return (
    <main>
      {/* Lead capture popups */}
      <ExitIntentPopup />
      <TimedPopup delayMs={30000} />

      {/* ── Hero ─────────────────────────────────── */}
      <section className="relative flex min-h-screen items-end pb-24 md:items-center md:pb-0">
        {/* Hero video with image fallback */}
        <video
          autoPlay
          muted
          loop
          playsInline
          poster="https://cdn.prod.website-files.com/65f8783a30b4f349defb4960/68950a62c9bcf227c2629194_Sophie%2BNic-7983.webp"
          className="absolute inset-0 h-full w-full object-cover"
        >
          {/* Uncomment when hero video is ready:
          <source src="/videos/hero.mp4" type="video/mp4" />
          */}
        </video>
        <Image
          src="https://cdn.prod.website-files.com/65f8783a30b4f349defb4960/68950a62c9bcf227c2629194_Sophie%2BNic-7983.webp"
          alt="Wedding at Stone House Nevada City"
          fill
          className="object-cover"
          priority
          quality={85}
        />
        <div className="hero-overlay" />
        <div className="relative z-10 mx-auto w-full max-w-[80rem] px-6 md:px-12">
          <p className="small-label mb-4 text-gold">
            <span className="mr-2 inline-block h-[1px] w-6 bg-gold/60 align-middle" />
            Nevada City, California · Historic District
          </p>
          <h1 className="max-w-3xl font-display text-display-xl text-white">
            Where History
            <br />
            <em className="italic">Meets Intention</em>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-white/60">
            A handbuilt 1857 stone building in the heart of Nevada City. Six unique spaces. Elevated seed-oil-free cuisine. Extraordinary celebrations.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Button href="/inquiry" variant="primary" size="lg">
              Check Your Date →
            </Button>
            <Button href="/venue/spaces" variant="ghost" size="lg">
              Explore All Six Spaces
            </Button>
          </div>
        </div>
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-white/40">Scroll</span>
          <div className="h-8 w-[1px] animate-pulse bg-gradient-to-b from-white/40 to-transparent" />
        </div>
      </section>

      {/* ── Social Proof Bar ──────────────────────── */}
      <section className="border-y border-white/10 bg-surface py-4">
        <div className="mx-auto flex max-w-[80rem] flex-wrap items-center justify-center gap-8 px-6 text-sm text-cream/50">
          <div className="flex items-center gap-2">
            <span className="text-gold">★★★★★</span>
            <span>4.9 on Google · 200+ Reviews</span>
          </div>
          <div className="hidden sm:block">
            <span className="italic">The Knot</span> Best of Weddings 2024
          </div>
          <div>200+ Celebrations</div>
        </div>
      </section>

      {/* ── Scrolling Marquee ────────────────────── */}
      <section className="overflow-hidden border-y border-white/10 bg-surface py-4">
        <div className="flex animate-[marquee_30s_linear_infinite] whitespace-nowrap">
          {[...Array(2)].map((_, rep) => (
            <div key={rep} className="flex shrink-0 items-center gap-8 px-4">
              {["Venue", "Catering", "Planning", "Nevada City, California", "Est. 1857", "10,000 Sq Ft", "Six Unique Spaces", "Always Seed Oil Free", "Historic Gold Country", "Private Venue Tours Available"].map((item) => (
                <span key={`${rep}-${item}`} className="flex items-center gap-3 text-sm font-medium uppercase tracking-[0.2em] text-cream/30">
                  <span className="h-1.5 w-1.5 rounded-full bg-gold/40" />
                  {item}
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ── Our Story ──────────────────────────── */}
      <OurStory />

      {/* ── Spaces Grid ──────────────────────────── */}
      <section className="bg-surface py-section">
        <div className="mx-auto max-w-[80rem] px-6">
          <div className="text-center">
            <p className="small-label mb-4">Six Distinctive Spaces</p>
            <h2 className="font-display text-display-lg text-cream">
              Every space tells a different story
            </h2>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {spaces.map((space, i) => {
              const maxCapacity = Math.max(
                space.capacity.seated ?? 0,
                space.capacity.standing ?? 0,
                space.capacity.ceremony ?? 0,
                space.capacity.dinner ?? 0,
              );
              return (
                <ScrollReveal key={space.slug} delay={i * 100}>
                  <Link
                    href={`/venue/${space.slug}`}
                    className="group relative block overflow-hidden rounded-sm bg-black"
                  >
                    <div className="aspect-[4/3] overflow-hidden">
                      <Image
                        src={space.image}
                        alt={`${space.name} event space at Stone House Nevada City`}
                        width={600}
                        height={450}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/30 to-transparent p-6">
                      <span className="text-xs font-medium uppercase tracking-[0.2em] text-gold">
                        UP TO {maxCapacity} GUESTS
                      </span>
                      <h3 className="mt-1 font-display text-2xl text-white">
                        {space.name}
                      </h3>
                      <p className="mt-1 text-sm text-white/60">
                        {space.tagline}
                      </p>
                      <span className="mt-3 flex items-center gap-1 text-sm font-medium text-gold opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        View Space <ArrowRight size={14} />
                      </span>
                    </div>
                  </Link>
                </ScrollReveal>
              );
            })}
          </div>

          <div className="mt-10 text-center">
            <Button href="/venue/spaces" variant="outline" size="md">
              Explore All Spaces &rarr;
            </Button>
          </div>
        </div>
      </section>

      {/* ── Date Checker ──────────────────────────── */}
      <DateChecker />

      {/* ── Why Stone House ─────────────────────── */}
      <section className="bg-surface-100 py-section">
        <div className="mx-auto max-w-[80rem] px-6">
          <div className="text-center">
            <p className="small-label mb-4">Why Stone House</p>
            <h2 className="font-display text-display-lg text-cream">
              Nothing else in Gold Country compares
            </h2>
          </div>

          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <ScrollReveal delay={0}>
              <div className="rounded-sm border border-cream/10 bg-cream/5 p-8">
                <h3 className="font-display text-display-sm text-cream">
                  Genuinely Historic
                </h3>
                <p className="mt-3 text-sm text-cream/50">
                  Handbuilt in 1857 — not a barn conversion or a modern venue with vintage props. The stone walls are original. The history is real.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={100}>
              <div className="rounded-sm border border-cream/10 bg-cream/5 p-8">
                <h3 className="font-display text-display-sm text-cream">
                  Seed Oil Free Cuisine
                </h3>
                <p className="mt-3 text-sm text-cream/50">
                  The only wedding venue in Gold Country committed to 100% seed-oil-free cooking. Real ingredients, extraordinary food.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={200}>
              <div className="rounded-sm border border-cream/10 bg-cream/5 p-8">
                <h3 className="font-display text-display-sm text-cream">
                  Six Spaces, One Roof
                </h3>
                <p className="mt-3 text-sm text-cream/50">
                  Ceremony, cocktail hour, reception, rehearsal dinner — all under one historic roof. No shuttles, no logistics headaches.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={300}>
              <div className="rounded-sm border border-cream/10 bg-cream/5 p-8">
                <h3 className="font-display text-display-sm text-cream">
                  Downtown Nevada City
                </h3>
                <p className="mt-3 text-sm text-cream/50">
                  Walkable to boutique hotels, restaurants, and the charm of one of California&apos;s most beloved historic towns.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── Weddings ─────────────────────────────── */}
      <section className="bg-surface py-section">
        <div className="mx-auto max-w-[80rem] px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="small-label mb-4">Weddings</p>
            <h2 className="font-display text-display-lg text-cream">
              Your ceremony deserves an epic backdrop
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-cream/50">
              From intimate elopements to 200-guest celebrations. In-house catering, planning support, and six unique spaces under one historic roof.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button href="/inquiry" variant="primary" size="md">
                Check 2026 &amp; 2027 Availability
              </Button>
              <Button href="/gallery" variant="outline" size="md">
                See Real Weddings
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Pricing ──────────────────────────────── */}
      <PricingToggle />

      {/* ── Gallery Preview ──────────────────────── */}
      <section className="bg-surface-200 py-section">
        <div className="mx-auto max-w-[80rem] px-6">
          <div className="text-center">
            <p className="small-label mb-4">Real Weddings</p>
            <h2 className="font-display text-display-lg text-cream">
              Every love story written in stone
            </h2>
          </div>

          <div className="mt-12 columns-2 gap-4 md:columns-3 lg:columns-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="mb-4 break-inside-avoid overflow-hidden rounded-sm bg-surface-300"
              >
                <Image
                  src={`/images/gallery/gallery-${i + 1}.jpg`}
                  alt={`Stone House Nevada City event venue interior photo ${i + 1}`}
                  width={400}
                  height={i % 3 === 0 ? 500 : i % 2 === 0 ? 350 : 400}
                  className="w-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Button href="/gallery" variant="outline" size="md">
              View All Stories &rarr;
            </Button>
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────── */}
      <Testimonials />

      {/* ── Instagram Feed ───────────────────────── */}
      <section className="bg-surface py-section">
        <div className="mx-auto max-w-[80rem] px-6">
          <div className="text-center">
            <div className="gold-divider mx-auto mb-6" />
            <h2 className="font-display text-display-md text-cream">
              Follow Along
            </h2>
            <p className="mt-2 text-cream/50">
              <a
                href="https://instagram.com/stonehousenevadacity"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold transition-colors hover:text-gold-dark"
              >
                @stonehousenevadacity
              </a>
            </p>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <a
                key={i}
                href="https://instagram.com/stonehousenevadacity"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative aspect-square overflow-hidden rounded-sm bg-surface-300"
              >
                <Image
                  src={`/images/instagram/ig-${i + 1}.jpg`}
                  alt={`Stone House Nevada City events and celebrations Instagram post ${i + 1}`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-300 group-hover:bg-black/40">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  >
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Inquiry CTA ──────────────────────────── */}
      <InquiryCTA />
    </main>
  );
}
