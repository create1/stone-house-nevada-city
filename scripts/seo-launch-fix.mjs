/**
 * One-shot SEO launch fixes: www host, extensionless canonicals/og:url,
 * primary nav/footer hrefs, and H1 br whitespace. Safe for emails.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const PUBLIC_PAGES = [
  "accommodations",
  "blog",
  "brunch",
  "catering",
  "check-your-date",
  "chef-story",
  "contact",
  "elopement",
  "events",
  "faq",
  "floor-plans",
  "gallery",
  "getting-ready",
  "gold-country-venues",
  "grass-valley-wedding-venues",
  "library",
  "local-guide",
  "menus",
  "nevada-city-wedding-venue",
  "nevada-county-wedding-venues",
  "press",
  "pricing",
  "privacy",
  "private-events",
  "rehearsal-dinner",
  "spaces",
  "timeline",
  "vendors",
  "weather-guide",
  "wedding-pricing",
];

const pageSet = new Set(PUBLIC_PAGES);

function walkHtml(dir, out = []) {
  for (const name of fs.readdirSync(dir)) {
    if (name === "node_modules" || name === "dist" || name === "studio" || name === "assets") continue;
    if (name === "START-HERE.html") continue;
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) walkHtml(p, out);
    else if (name.endsWith(".html")) out.push(p);
  }
  return out;
}

function stripExtPath(pathname) {
  if (!pathname || pathname === "/") return "/";
  let p = pathname.replace(/\.html$/i, "");
  if (p.length > 1 && p.endsWith("/")) p = p.slice(0, -1);
  return p || "/";
}

function toWwwUrl(raw) {
  try {
    const u = new URL(String(raw).replace(/([^:]\/)\/+/g, "$1"));
    if (u.hostname === "stonehouse.io" || u.hostname === "www.stonehouse.io") {
      u.protocol = "https:";
      u.hostname = "www.stonehouse.io";
      let path = stripExtPath(u.pathname.replace(/\/{2,}/g, "/"));
      if (!path || path === "/") return "https://www.stonehouse.io/";
      return `https://www.stonehouse.io${path}${u.search || ""}`;
    }
  } catch {
    /* ignore */
  }
  return raw;
}

function fixAbsoluteHosts(html) {
  // absolute site URLs only (emails stay bookings@stonehouse.io)
  return html.replace(/https:\/\/(www\.)?stonehouse\.io/g, "https://www.stonehouse.io");
}

function fixCanonicalAndOg(html) {
  return html
    .replace(
      /(<link\s+[^>]*rel=["']canonical["'][^>]*href=["'])([^"']+)(["'])/gi,
      (_, a, href, c) => a + toWwwUrl(href) + c
    )
    .replace(
      /(<link\s+[^>]*href=["'])([^"']+)(["'][^>]*rel=["']canonical["'][^>]*>)/gi,
      (_, a, href, c) => a + toWwwUrl(href) + c
    )
    .replace(
      /(<meta\s+[^>]*property=["']og:url["'][^>]*content=["'])([^"']+)(["'])/gi,
      (_, a, href, c) => a + toWwwUrl(href) + c
    )
    .replace(
      /(<meta\s+[^>]*content=["'])([^"']+)(["'][^>]*property=["']og:url["'][^>]*>)/gi,
      (_, a, href, c) => a + toWwwUrl(href) + c
    );
}

function fixInternalPageHrefs(html) {
  // root-relative nav-friendly: foo.html / ../../foo.html → /foo
  return html.replace(
    /\b(href)=(["'])((?:\.\.\/)*)([a-z0-9][a-z0-9-]*)\.html(#[^"']*)?\2/gi,
    (full, attr, q, _dots, page, hash = "") => {
      const slug = page.toLowerCase();
      if (slug === "index") return `${attr}=${q}/${hash || ""}${q}`;
      if (!pageSet.has(slug) && slug !== "layouts") return full;
      if (slug === "layouts") return `${attr}=${q}/floor-plans${hash || ""}${q}`;
      return `${attr}=${q}/${slug}${hash || ""}${q}`;
    }
  );
}

function fixHeadingBrWhitespace(html) {
  return html.replace(/<(h[1-3])(\s[^>]*)?>((?:(?!<\/h[1-3]>).)*)<\/\1>/gis, (full, tag, attrs = "", inner) => {
    const fixed = inner.replace(/([^\s>])(<br\b[^>]*>)/gi, "$1 $2");
    return `<${tag}${attrs || ""}>${fixed}</${tag}>`;
  });
}

function normalizeJsonLdUrls(html) {
  // ensure page-like JSON-LD absolute urls use www + no .html
  return html.replace(/https:\/\/www\.stonehouse\.io(\/[a-z0-9][a-z0-9./_-]*)?/gi, (url) => {
    if (url.includes("@") || url.endsWith(".jpg") || url.endsWith(".png") || url.endsWith(".webp") || url.endsWith(".pdf") || url.endsWith(".svg") || url.includes("/assets/")) {
      return url;
    }
    return toWwwUrl(url);
  });
}

const files = walkHtml(root);
let changed = 0;
for (const file of files) {
  let html = fs.readFileSync(file, "utf8");
  const before = html;
  html = fixAbsoluteHosts(html);
  html = fixCanonicalAndOg(html);
  html = normalizeJsonLdUrls(html);
  html = fixInternalPageHrefs(html);
  html = fixHeadingBrWhitespace(html);
  // privacy canonical edge case
  if (file.endsWith("privacy.html")) {
    html = html.replace(
      /href="https:\/\/www\.stonehouse\.io\/privacy-policy\/?"/g,
      'href="https://www.stonehouse.io/privacy"'
    );
  }
  if (html !== before) {
    fs.writeFileSync(file, html);
    changed++;
  }
}

// robots.txt
const robots = `User-agent: *
Allow: /

# Internal / utility — not for search
Disallow: /studio/
Disallow: /api/
Disallow: /paypal-checkout
Disallow: /checkout
Disallow: /order-confirmation

# PDFs crawlable for discovery; X-Robots-Tag noindex still set on Vercel

Sitemap: https://www.stonehouse.io/sitemap.xml
`;
fs.writeFileSync(path.join(root, "robots.txt"), robots);

// sitemap.xml — extensionless www only
const today = "2026-08-10";
const urls = [
  { loc: "/", prio: "1.0", freq: "weekly", lastmod: today },
  { loc: "/nevada-city-wedding-venue", prio: "0.95", freq: "monthly", lastmod: today },
  { loc: "/grass-valley-wedding-venues", prio: "0.95", freq: "monthly", lastmod: today },
  { loc: "/wedding-pricing", prio: "0.95", freq: "monthly", lastmod: today },
  { loc: "/nevada-county-wedding-venues", prio: "0.9", freq: "monthly", lastmod: today },
  { loc: "/private-events", prio: "0.9", freq: "monthly", lastmod: today },
  { loc: "/events", prio: "0.9", freq: "monthly", lastmod: today },
  { loc: "/spaces", prio: "0.9", freq: "monthly", lastmod: today },
  { loc: "/catering", prio: "0.9", freq: "monthly", lastmod: today },
  { loc: "/contact", prio: "0.9", freq: "monthly", lastmod: today },
  { loc: "/pricing", prio: "0.85", freq: "monthly", lastmod: today },
  { loc: "/gold-country-venues", prio: "0.85", freq: "monthly", lastmod: today },
  { loc: "/elopement", prio: "0.85", freq: "monthly", lastmod: today },
  { loc: "/floor-plans", prio: "0.85", freq: "monthly", lastmod: today },
  { loc: "/gallery", prio: "0.85", freq: "monthly", lastmod: today },
  { loc: "/menus", prio: "0.85", freq: "monthly", lastmod: today },
  { loc: "/faq", prio: "0.8", freq: "monthly", lastmod: today },
  { loc: "/library", prio: "0.7", freq: "monthly", lastmod: today },
  { loc: "/blog", prio: "0.7", freq: "weekly", lastmod: today },
  { loc: "/accommodations", prio: "0.7", freq: "monthly", lastmod: "2026-04-22" },
  { loc: "/vendors", prio: "0.65", freq: "monthly", lastmod: "2026-04-22" },
  { loc: "/chef-story", prio: "0.65", freq: "monthly", lastmod: "2026-04-22" },
  { loc: "/local-guide", prio: "0.65", freq: "monthly", lastmod: "2026-04-22" },
  { loc: "/rehearsal-dinner", prio: "0.65", freq: "monthly", lastmod: "2026-04-22" },
  { loc: "/weather-guide", prio: "0.6", freq: "monthly", lastmod: "2026-04-22" },
  { loc: "/timeline", prio: "0.6", freq: "monthly", lastmod: "2026-04-22" },
  { loc: "/getting-ready", prio: "0.6", freq: "monthly", lastmod: "2026-04-22" },
  { loc: "/brunch", prio: "0.55", freq: "monthly", lastmod: "2026-04-22" },
  { loc: "/press", prio: "0.4", freq: "yearly", lastmod: "2026-04-22" },
  { loc: "/blog/complete-guide-eloping-nevada-city", prio: "0.75", freq: "yearly", lastmod: today },
  { loc: "/blog/what-to-expect-gold-country-wedding-spring", prio: "0.7", freq: "yearly", lastmod: today },
  { loc: "/blog/seed-oil-free-kitchen-private-event-dining", prio: "0.6", freq: "yearly", lastmod: today },
  { loc: "/blog/how-to-choose-the-right-spaces", prio: "0.6", freq: "yearly", lastmod: today },
  { loc: "/blog/must-do-spring-activities-in-nevada-city", prio: "0.55", freq: "yearly", lastmod: "2025-06-11" },
  { loc: "/blog/the-rich-history-of-stone-house-a-legacy-of-innovation-gathering", prio: "0.55", freq: "yearly", lastmod: "2025-02-18" },
  { loc: "/blog/the-dirt-on-stone-house-farms-stone-houses-bold-new-chapter", prio: "0.55", freq: "yearly", lastmod: "2025-02-10" },
  { loc: "/blog/100-years-of-ranching-one-goal-a-better-future-for-our-food-system", prio: "0.5", freq: "yearly", lastmod: "2025-02-26" },
  { loc: "/privacy", prio: "0.2", freq: "yearly", lastmod: today },
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>https://www.stonehouse.io${u.loc === "/" ? "/" : u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.freq}</changefreq>
    <priority>${u.prio}</priority>
  </url>`
  )
  .join("\n")}
</urlset>
`;
fs.writeFileSync(path.join(root, "sitemap.xml"), sitemap);

console.log(`Updated ${changed}/${files.length} HTML files; robots.txt + sitemap.xml rewritten.`);
