import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock } from "lucide-react";
import { getAllPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Planning Library | Stone House Nevada City — Guides & Inspiration",
  description:
    "Wedding planning guides, event inspiration, and insider tips from Stone House Nevada City. Your resource for planning unforgettable celebrations in Gold Country.",
  openGraph: {
    title: "Planning Library | Stone House Nevada City — Guides & Inspiration",
    description:
      "Wedding planning guides, event inspiration, and insider tips from Stone House Nevada City. Your resource for planning unforgettable celebrations in Gold Country.",
  },
  robots: { index: true, follow: true },
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <main>
      {/* ── Hero ─────────────────────────────────── */}
      <section className="bg-black py-section-sm pt-32">
        <div className="mx-auto max-w-[80rem] px-6 text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-gold">
            Blog
          </p>
          <h1 className="font-display text-display-lg text-white">
            Stories & Inspiration
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-white/60">
            Event planning insights, venue inspiration, and behind-the-scenes
            stories from Stonehouse.
          </p>
        </div>
      </section>

      {/* ── Post Grid ────────────────────────────── */}
      <section className="bg-surface py-section">
        <div className="mx-auto max-w-[80rem] px-6">
          {posts.length === 0 ? (
            <p className="py-20 text-center text-cream/30">
              Blog posts coming soon.
            </p>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group overflow-hidden rounded-sm border border-surface-400 bg-surface-200 transition-shadow hover:shadow-lg"
                >
                  <div className="aspect-[16/9] overflow-hidden bg-surface-300">
                    <Image
                      src={post.image}
                      alt={post.title}
                      width={600}
                      height={338}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-4 text-xs text-cream/30">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {new Date(post.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {post.readTime}
                      </span>
                    </div>
                    <h2 className="mt-3 font-display text-xl font-semibold text-cream transition-colors group-hover:text-gold">
                      {post.title}
                    </h2>
                    <p className="mt-2 text-sm text-cream/50 line-clamp-3">
                      {post.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
