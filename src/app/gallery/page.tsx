import type { Metadata } from "next";
import Image from "next/image";
import GalleryGrid from "@/components/gallery/GalleryGrid";
import type { GalleryImage } from "@/components/gallery/GalleryGrid";
import { getBreadcrumbJsonLd } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Photos & Gallery | Stone House Nevada City Weddings & Events",
  description:
    "See real weddings, corporate events, and celebrations at Stone House Nevada City. Browse photos of The Great Hall, The Cavern, The Courtyard, and all six unique spaces.",
  openGraph: {
    title: "Photos & Gallery | Stone House Nevada City Weddings & Events",
    description:
      "See real weddings, corporate events, and celebrations at Stone House Nevada City. Browse photos of The Great Hall, The Cavern, The Courtyard, and all six unique spaces.",
  },
  robots: { index: true, follow: true },
};

const galleryImages: GalleryImage[] = [
  { src: "/images/gallery/gallery-1.jpg", alt: "Stonehouse wedding ceremony on the Patio", category: "weddings", width: 800, height: 1000 },
  { src: "/images/gallery/gallery-2.jpg", alt: "Music Venue during a live concert", category: "spaces", width: 800, height: 600 },
  { src: "/images/gallery/gallery-3.jpg", alt: "Wine Cavern dinner setup", category: "food", width: 800, height: 800 },
  { src: "/images/gallery/gallery-4.jpg", alt: "Corporate event in the Dining Room", category: "corporate", width: 800, height: 600 },
  { src: "/images/gallery/gallery-5.jpg", alt: "Craft cocktails at the Tavern", category: "food", width: 800, height: 1000 },
  { src: "/images/gallery/gallery-6.jpg", alt: "Wedding reception with string lights", category: "weddings", width: 800, height: 600 },
  { src: "/images/gallery/gallery-7.jpg", alt: "Lounge leather seating", category: "spaces", width: 800, height: 800 },
  { src: "/images/gallery/gallery-8.jpg", alt: "Patio ceremony under the pines", category: "weddings", width: 800, height: 600 },
  { src: "/images/gallery/wedding-ceremony.webp", alt: "Wedding ceremony at Stonehouse", category: "weddings", width: 800, height: 600 },
  { src: "/images/gallery/reception-dinner.webp", alt: "Reception dinner setup", category: "food", width: 800, height: 600 },
];

export default function GalleryPage() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            getBreadcrumbJsonLd([
              { name: "Home", url: "https://stonehouse.io" },
              { name: "Gallery", url: "https://stonehouse.io/gallery" },
            ])
          ),
        }}
      />
      {/* ── Hero ─────────────────────────────────── */}
      <section className="relative flex min-h-[40vh] items-center justify-center bg-black">
        <Image
          src="/images/gallery/gallery-1.jpg"
          alt="Stone House Nevada City event venue photo gallery"
          fill
          className="object-cover opacity-40"
          priority
        />
        <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-gold">
            Gallery
          </p>
          <h1 className="font-display text-display-xl text-white">
            See Stone House
          </h1>
          <p className="mt-3 text-lg text-white/60">
            Browse moments from weddings, events, and celebrations in our
            historic spaces.
          </p>
        </div>
      </section>

      {/* ── Gallery Grid ─────────────────────────── */}
      <div className="bg-surface">
        <GalleryGrid images={galleryImages} />
      </div>
    </main>
  );
}
