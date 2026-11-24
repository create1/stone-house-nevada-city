import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Users, Check, ArrowRight } from "lucide-react";
import Button from "@/components/ui/Button";
import InquiryCTA from "@/components/sections/InquiryCTA";
import { spaces, fullBuilding } from "@/data/spaces";

export const metadata: Metadata = {
  title: "Our Spaces | Stone House Nevada City — Six Unique Event Venues",
  description:
    "Explore six unique event spaces at Stone House — from the underground Wine Cavern to the sunlit Courtyard. Find the perfect setting for your celebration in Nevada City.",
  openGraph: {
    title: "Our Spaces | Stone House Nevada City — Six Unique Event Venues",
    description:
      "Explore six unique event spaces at Stone House — from the underground Wine Cavern to the sunlit Courtyard. Find the perfect setting for your celebration in Nevada City.",
  },
  robots: { index: true, follow: true },
};

export default function SpacesPage() {
  return (
    <main>
      {/* ── Hero ─────────────────────────────────── */}
      <section className="relative flex min-h-[60vh] items-center justify-center bg-black">
        <Image
          src="https://cdn.prod.website-files.com/65f8783a30b4f349defb4960/697e61f92beaf320fb3c45ea_thegreathall5.webp"
          alt="Stonehouse venue spaces overview"
          fill
          className="object-cover opacity-40"
          priority
        />
        <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-gold">
            The Venue
          </p>
          <h1 className="font-display text-display-xl text-white text-balance">
            Six Spaces, One Story
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-white/60">
            10,000 square feet of historic character across six distinct spaces
            — each with its own atmosphere, all under one roof.
          </p>
        </div>
      </section>

      {/* ── Capacity Quick Reference ─────────────── */}
      <section className="bg-surface py-section-sm">
        <div className="mx-auto max-w-[80rem] px-6">
          <h2 className="mb-8 text-center font-display text-display-sm text-cream">
            Capacity at a Glance
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-left">
              <thead>
                <tr className="border-b border-surface-400 text-sm font-medium uppercase tracking-widest text-cream/30">
                  <th className="pb-3 pr-4 font-medium">Space</th>
                  <th className="pb-3 pr-4 font-medium">Seated</th>
                  <th className="pb-3 pr-4 font-medium">Standing</th>
                  <th className="pb-3 pr-4 font-medium">Other</th>
                  <th className="pb-3 font-medium">Floor</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {spaces.map((space) => (
                  <tr
                    key={space.slug}
                    className="border-b border-surface-400/50"
                  >
                    <td className="py-4 pr-4">
                      <Link
                        href={`/venue/${space.slug}`}
                        className="font-display text-lg font-semibold text-cream transition-colors hover:text-gold"
                      >
                        {space.name}
                      </Link>
                    </td>
                    <td className="py-4 pr-4 text-cream/60">
                      {space.capacity.seated
                        ? `${space.capacity.seated}`
                        : "—"}
                    </td>
                    <td className="py-4 pr-4 text-cream/60">
                      {space.capacity.standing
                        ? `${space.capacity.standing}`
                        : "—"}
                    </td>
                    <td className="py-4 pr-4 text-cream/60">
                      {space.capacity.ceremony
                        ? `${space.capacity.ceremony} ceremony`
                        : space.capacity.dinner
                          ? `${space.capacity.dinner} dinner`
                          : "—"}
                    </td>
                    <td className="py-4 text-cream/60">
                      {space.floor === "outdoor"
                        ? "Outdoor"
                        : `${space.floor} Floor`}
                      {!space.adaCompliant && (
                        <span className="ml-2 text-xs text-cream/30">
                          (not ADA)
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── Alternating Space Sections ────────────── */}
      {spaces.map((space, i) => (
        <section
          key={space.slug}
          className={i % 2 === 0 ? "bg-surface py-section" : "bg-surface-100 py-section"}
        >
          <div className="mx-auto max-w-[80rem] px-6">
            <div
              className={`grid items-center gap-12 lg:grid-cols-2 ${
                i % 2 !== 0 ? "lg:[direction:rtl]" : ""
              }`}
            >
              {/* Image */}
              <div className={i % 2 !== 0 ? "lg:[direction:ltr]" : ""}>
                <div className="overflow-hidden rounded-sm">
                  <Image
                    src={space.image}
                    alt={`${space.name} event space at Stone House Nevada City`}
                    width={800}
                    height={600}
                    className="h-auto w-full object-cover"
                  />
                </div>
              </div>

              {/* Content */}
              <div className={i % 2 !== 0 ? "lg:[direction:ltr]" : ""}>
                <div className="gold-divider mb-6" />
                <h2 className="font-display text-display-md text-cream">
                  {space.name}
                </h2>
                <p className="mt-1 font-display text-lg text-gold-dark italic">
                  {space.tagline}
                </p>
                <p className="mt-4 text-cream/60">{space.description}</p>

                {/* Capacity badges */}
                <div className="mt-6 flex flex-wrap gap-3">
                  {space.capacity.seated && (
                    <span className="flex items-center gap-1.5 rounded-sm bg-black/5 px-3 py-1.5 text-sm">
                      <Users size={14} className="text-gold" />
                      {space.capacity.seated} seated
                    </span>
                  )}
                  {space.capacity.standing && (
                    <span className="flex items-center gap-1.5 rounded-sm bg-black/5 px-3 py-1.5 text-sm">
                      <Users size={14} className="text-gold" />
                      {space.capacity.standing} standing
                    </span>
                  )}
                  {space.capacity.ceremony && (
                    <span className="flex items-center gap-1.5 rounded-sm bg-black/5 px-3 py-1.5 text-sm">
                      <Users size={14} className="text-gold" />
                      {space.capacity.ceremony} ceremony
                    </span>
                  )}
                  {space.capacity.dinner && (
                    <span className="flex items-center gap-1.5 rounded-sm bg-black/5 px-3 py-1.5 text-sm">
                      <Users size={14} className="text-gold" />
                      {space.capacity.dinner} dinner
                    </span>
                  )}
                </div>

                {/* Features */}
                <ul className="mt-6 space-y-2">
                  {space.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2 text-sm text-cream/60"
                    >
                      <Check
                        size={16}
                        className="mt-0.5 shrink-0 text-gold"
                      />
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* Notes */}
                {space.notes && (
                  <div className="mt-4">
                    {space.notes.map((note) => (
                      <p key={note} className="text-sm text-cream/30 italic">
                        {note}
                      </p>
                    ))}
                  </div>
                )}

                <div className="mt-8">
                  <Button href={`/venue/${space.slug}`} variant="outline" size="md">
                    View {space.name}
                    <ArrowRight size={14} className="ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* ── Full Building CTA ────────────────────── */}
      <section className="bg-black py-section">
        <div className="mx-auto max-w-[80rem] px-6 text-center">
          <div className="gold-divider mx-auto mb-8" />
          <h2 className="font-display text-display-lg text-white">
            {fullBuilding.name}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/60">
            {fullBuilding.description}
          </p>

          <ul className="mx-auto mt-8 flex max-w-lg flex-col gap-3">
            {fullBuilding.includes.map((item) => (
              <li
                key={item}
                className="flex items-center justify-center gap-2 text-white/70"
              >
                <Check size={16} className="text-gold" />
                {item}
              </li>
            ))}
          </ul>

          <div className="mt-10">
            <Button href="/inquiry" variant="primary" size="lg">
              Inquire About Full Building
            </Button>
          </div>
        </div>
      </section>

      {/* ── InquiryCTA ───────────────────────────── */}
      <InquiryCTA />
    </main>
  );
}
