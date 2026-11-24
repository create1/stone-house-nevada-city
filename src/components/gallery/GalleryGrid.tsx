"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { clsx } from "clsx";

export interface GalleryImage {
  src: string;
  alt: string;
  category: string;
  width: number;
  height: number;
}

const categories = [
  { label: "All", value: "all" },
  { label: "Weddings", value: "weddings" },
  { label: "Corporate", value: "corporate" },
  { label: "Spaces", value: "spaces" },
  { label: "Food & Drink", value: "food" },
];

interface GalleryGridProps {
  images: GalleryImage[];
}

export default function GalleryGrid({ images }: GalleryGridProps) {
  const [activeFilter, setActiveFilter] = useState("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filtered =
    activeFilter === "all"
      ? images
      : images.filter((img) => img.category === activeFilter);

  const openLightbox = useCallback((i: number) => setLightboxIndex(i), []);
  const closeLightbox = useCallback(() => setLightboxIndex(null), []);

  const prev = useCallback(() => {
    setLightboxIndex((i) =>
      i !== null ? (i - 1 + filtered.length) % filtered.length : null,
    );
  }, [filtered.length]);

  const next = useCallback(() => {
    setLightboxIndex((i) =>
      i !== null ? (i + 1) % filtered.length : null,
    );
  }, [filtered.length]);

  // Keyboard navigation
  useEffect(() => {
    if (lightboxIndex === null) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [lightboxIndex, closeLightbox, prev, next]);

  return (
    <>
      {/* Filter Tabs - sticky below header */}
      <div className="sticky top-[72px] z-30 border-b border-surface-400 bg-surface/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-[80rem] items-center gap-2 overflow-x-auto px-6 py-3">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => {
                setActiveFilter(cat.value);
                setLightboxIndex(null);
              }}
              className={clsx(
                "shrink-0 rounded-sm px-4 py-2 text-sm font-medium transition-all",
                activeFilter === cat.value
                  ? "bg-gold text-black"
                  : "bg-surface-200 text-cream/50 hover:text-cream border border-surface-400",
              )}
            >
              {cat.label}
            </button>
          ))}
          <span className="ml-auto shrink-0 text-sm text-cream/30">
            {filtered.length} photos
          </span>
        </div>
      </div>

      {/* Masonry Grid */}
      <div className="mx-auto max-w-[80rem] px-6 py-section-sm">
        <div className="columns-2 gap-4 md:columns-3 lg:columns-4">
          {filtered.map((img, i) => (
            <button
              key={`${img.src}-${i}`}
              onClick={() => openLightbox(i)}
              className="mb-4 block w-full break-inside-avoid overflow-hidden rounded-sm bg-surface-300 transition-transform duration-300 hover:scale-[1.02]"
            >
              <Image
                src={img.src}
                alt={img.alt}
                width={img.width}
                height={img.height}
                className="w-full object-cover"
              />
            </button>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="py-20 text-center text-cream/30">
            No photos in this category yet.
          </p>
        )}
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && filtered[lightboxIndex] && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
          onClick={closeLightbox}
        >
          {/* Close button */}
          <button
            className="absolute right-6 top-6 z-10 text-white/70 transition-colors hover:text-white"
            onClick={closeLightbox}
            aria-label="Close lightbox"
          >
            <X size={28} />
          </button>

          {/* Counter */}
          <div className="absolute left-6 top-6 text-sm text-white/50">
            {lightboxIndex + 1} / {filtered.length}
          </div>

          {/* Prev */}
          <button
            className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white/70 transition-colors hover:bg-white/20 hover:text-white"
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            aria-label="Previous image"
          >
            <ChevronLeft size={24} />
          </button>

          {/* Image */}
          <div
            className="relative max-h-[85vh] max-w-[90vw]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={filtered[lightboxIndex].src}
              alt={filtered[lightboxIndex].alt}
              width={filtered[lightboxIndex].width}
              height={filtered[lightboxIndex].height}
              className="max-h-[85vh] w-auto object-contain"
              priority
            />
          </div>

          {/* Next */}
          <button
            className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white/70 transition-colors hover:bg-white/20 hover:text-white"
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            aria-label="Next image"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      )}
    </>
  );
}
