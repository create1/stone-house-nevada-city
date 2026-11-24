import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Calendar, Clock, ChevronRight } from "lucide-react";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllPosts, getPost } from "@/lib/blog";
import Button from "@/components/ui/Button";
import InquiryCTA from "@/components/sections/InquiryCTA";

export async function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    keywords: post.keywords,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      images: [{ url: post.image }],
    },
    robots: { index: true, follow: true },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  return (
    <main>
      {/* ── Header ───────────────────────────────── */}
      <section className="bg-black py-section-sm pt-32">
        <div className="mx-auto max-w-3xl px-6">
          {/* Breadcrumb */}
          <nav
            className="mb-8 flex items-center gap-2 text-sm text-white/40"
            aria-label="Breadcrumb"
          >
            <Link href="/" className="transition-colors hover:text-gold">
              Home
            </Link>
            <ChevronRight size={14} />
            <Link href="/blog" className="transition-colors hover:text-gold">
              Blog
            </Link>
            <ChevronRight size={14} />
            <span className="text-white/60 truncate">{post.title}</span>
          </nav>

          <div className="flex items-center gap-4 text-sm text-white/40">
            <span className="flex items-center gap-1">
              <Calendar size={14} />
              {new Date(post.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={14} />
              {post.readTime}
            </span>
          </div>

          <h1 className="mt-4 font-display text-display-lg text-white text-balance">
            {post.title}
          </h1>
          <p className="mt-4 text-lg text-white/60">{post.description}</p>
        </div>
      </section>

      {/* ── Article Body ─────────────────────────── */}
      <article className="bg-surface py-section">
        <div className="prose prose-lg prose-stone mx-auto max-w-3xl px-6 prose-headings:font-display prose-headings:text-cream prose-a:text-gold prose-a:no-underline hover:prose-a:underline prose-strong:text-cream prose-img:rounded-sm">
          <MDXRemote source={post.content} />
        </div>

        {/* Post CTA */}
        <div className="mx-auto mt-16 max-w-3xl px-6">
          <div className="rounded-sm border border-gold/20 bg-gold/5 p-8 text-center">
            <h3 className="font-display text-xl font-semibold text-cream">
              Ready to see Stonehouse in person?
            </h3>
            <p className="mt-2 text-cream/50">
              Schedule a tour and experience 165 years of history firsthand.
            </p>
            <div className="mt-6">
              <Button href="/inquiry" variant="primary" size="md">
                Book a Tour
              </Button>
            </div>
          </div>
        </div>
      </article>

      {/* ── InquiryCTA ───────────────────────────── */}
      <InquiryCTA />
    </main>
  );
}
