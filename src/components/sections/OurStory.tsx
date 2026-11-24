import Image from "next/image";
import Link from "next/link";
import ScrollReveal from "@/components/effects/ScrollReveal";
import StatCounter from "@/components/ui/StatCounter";

export default function OurStory() {
  return (
    <section className="section-dark py-section">
      <div className="mx-auto max-w-[80rem] px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Image */}
          <ScrollReveal direction="left">
            <div className="relative aspect-[4/5] overflow-hidden rounded-sm">
              <Image
                src="https://cdn.prod.website-files.com/65f8783a30b4f349defb4960/6793f72050b2690b8c799686_DSC00429.avif"
                alt="Stone House historic building Nevada City"
                fill
                className="object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-6 py-3 text-center text-sm tracking-[0.15em] text-white/80 backdrop-blur-sm">
                107 Sacramento Street &middot; Nevada City
              </div>
            </div>
          </ScrollReveal>

          {/* Content */}
          <ScrollReveal direction="right" delay={200}>
            <div>
              <p className="small-label mb-4">Our Story</p>
              <h2 className="font-display text-display-lg text-cream">
                Handbuilt in 1857. Reimagined for today.
              </h2>
              <div className="mt-6 space-y-4 text-cream/60">
                <p>
                  Within Nevada City&apos;s historic district, Stone House occupies one of Gold
                  Country&apos;s most extraordinary structures — a mid-19th century building
                  constructed by hand from the very stone it stands upon.
                </p>
                <p>
                  Today, 10,000 square feet of beautifully restored space hosts weddings,
                  celebrations, and gatherings where elevated cuisine and irreplaceable
                  architecture converge.
                </p>
              </div>
              <Link
                href="/about"
                className="mt-6 inline-flex items-center gap-2 text-sm font-medium uppercase tracking-[0.15em] text-gold transition-colors hover:text-gold-dark"
              >
                Discover the Full History →
              </Link>
            </div>
          </ScrollReveal>
        </div>

        {/* Stats */}
        <div className="mt-section grid grid-cols-3 gap-8">
          <StatCounter target={6} label="Unique Spaces" />
          <StatCounter target={300} label="Guest Capacity" />
          <StatCounter target={1857} label="Est. Nevada City" />
        </div>
      </div>
    </section>
  );
}
