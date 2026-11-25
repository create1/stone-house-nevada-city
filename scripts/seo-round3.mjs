/**
 * SEO Round 3 — markup/meta/schema/href fixes only (no visual redesign).
 * Safe, idempotent where possible. Run: node scripts/seo-round3.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const OG_DEFAULT =
  "https://www.stonehouse.io/assets/gallery/stone-house-nevada-city-courtyard-wedding-ceremony-hexagon-arch.jpg";
const PIXEL =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

const VENUE_BASE = {
  name: "Stone House Nevada City",
  telephone: "+1-530-265-5050",
  email: "bookings@stonehouse.io",
  image: OG_DEFAULT,
  priceRange: "$$$$",
  address: {
    "@type": "PostalAddress",
    streetAddress: "107 Sacramento Street",
    addressLocality: "Nevada City",
    addressRegion: "CA",
    postalCode: "95959",
    addressCountry: "US",
  },
  geo: { "@type": "GeoCoordinates", latitude: 39.2616, longitude: -121.0161 },
  maximumAttendeeCapacity: 300,
  foundingDate: "1857",
};

const SKIP_DIR = new Set(["node_modules", "studio", "dist", ".git", "assets", "tools"]);
const SKIP_FILES = new Set([
  "START-HERE.html",
  "other-event-pricing-pamphlet.html",
  "wedding-pricing-pamphlet.html",
  "layouts.html",
]);

/** slug -> { title?, desc?, schemaType, pageName, url? } */
const PAGE_META = {
  "index.html": {
    title: "Stone House Nevada City — Wedding & Event Venue",
    desc: "Nevada City wedding and private event venue in a handbuilt 1857 stone building. Seven spaces, private buyouts only, seed-oil-free catering included.",
    isHome: true,
  },
  "events.html": {
    title: "Weddings & Private Events — Stone House",
    desc: "Book a private wedding, corporate retreat, or holiday party at Stone House Nevada City. Full-building buyouts only at an 1857 Gold Country venue.",
    schema: "venue",
    pageName: "Events",
    url: "/events",
  },
  "spaces.html": {
    title: "Seven Event Spaces — Stone House Nevada City",
    desc: "Explore seven unique spaces at Stone House Nevada City — The Great Hall, Courtyard, Showroom, Parlor, Penthouse, Cave, and bridal suites for events.",
    schema: "venue",
    pageName: "Spaces",
    url: "/spaces",
  },
  "floor-plans.html": {
    title: "Floor Plans & Layouts | Stone House Nevada City",
    desc: "Wedding venue floor plans and reception layouts for Stone House Nevada City — capacities, room diagrams, and how spaces combine for your day.",
    schema: "venue",
    pageName: "Floor Plans",
    url: "/floor-plans",
  },
  "getting-ready.html": {
    title: "Getting Ready Spaces — Stone House Nevada City",
    desc: "Bridal and groom getting-ready suites at Stone House Nevada City — natural light, stone walls, and rooms ready for hair, makeup, and portraits.",
    schema: "venue",
    pageName: "Getting Ready",
    url: "/getting-ready",
  },
  "rehearsal-dinner.html": {
    title: "Rehearsal Dinners — Stone House Nevada City",
    desc: "Host your night-before rehearsal dinner at Stone House Nevada City — intimate spaces, seed-oil-free dining, and private buyout energy for close family.",
    schema: "venue",
    pageName: "Rehearsal Dinner",
    url: "/rehearsal-dinner",
  },
  "brunch.html": {
    title: "Day-After Brunch — Stone House Nevada City",
    desc: "Plan a day-after wedding brunch at Stone House Nevada City — relaxed gathering, seed-oil-free menus, and one last toast with overnight guests.",
    schema: "venue",
    pageName: "Brunch",
    url: "/brunch",
  },
  "gold-country-venues.html": {
    title: "Gold Country Wedding Venues | Stone House Hub",
    desc: "Compare Gold Country wedding venues across the Sierra Foothills — and why couples touring Grass Valley and Nevada City still book Stone House.",
    schema: "venue",
    pageName: "Gold Country Venues",
    url: "/gold-country-venues",
  },
  "catering.html": {
    title: "Seed-Oil-Free Catering & Craft Bar — Stone House",
    desc: "Seed-oil-free catering and craft bar packages for Stone House Nevada City private events — farm-to-table menus, tiers, and dietary flexibility.",
    schema: "catering",
    pageName: "Catering",
    url: "/catering",
  },
  "gallery.html": {
    title: "Wedding Gallery & Venue Photos — Stone House",
    desc: "Real weddings, historic spaces, and private celebrations at Stone House Nevada City — California wedding and event venue photo gallery online.",
    schema: "gallery",
    pageName: "Gallery",
    url: "/gallery",
  },
  "timeline.html": {
    title: "Wedding Day Timeline — Stone House Nevada City",
    desc: "Sample wedding day timelines for Stone House Nevada City — ceremony windows, dinner service, and reception pacing for private buyout events.",
    schema: "article",
    pageName: "Timeline",
    url: "/timeline",
  },
  "weather-guide.html": {
    title: "Nevada City Weather Guide for Weddings | Stone House",
    desc: "Seasonal weather and outdoor ceremony tips for Nevada City weddings — months, temperatures, and how Stone House outdoor spaces perform year-round.",
    schema: "article",
    pageName: "Weather Guide",
    url: "/weather-guide",
  },
  "press.html": {
    title: "Press & Media Kit — Stone House Nevada City",
    desc: "Press and media resources for Stone House Nevada City — historic 1857 venue facts, high-level story angles, and contact for reporters and planners.",
    schema: "org",
    pageName: "Press",
    url: "/press",
  },
  "privacy.html": {
    title: "Privacy Policy — Stone House Nevada City",
    desc: "How Stone House Nevada City collects, uses, and protects personal information from inquiries, tours, and private event bookings on stonehouse.io.",
    schema: "webpage",
    pageName: "Privacy Policy",
    url: "/privacy",
  },
  "library.html": {
    title: "Planning Library — Stone House Nevada City",
    desc: "Guides, floor plans, menus, vendor lists, and planning resources for Stone House Nevada City weddings and private buyout events for couples.",
    schema: "webpage",
    pageName: "Library",
    url: "/library",
  },
  "faq.html": {
    title: "Wedding Venue FAQ — Stone House Nevada City",
    desc: "Answers on venue hire, catering, bar packages, deposits, capacities, and policies at Stone House Nevada City for weddings and private events.",
  },
  "accommodations.html": {
    title: "Hotels Near Stone House Nevada City | Lodging",
    desc: "Where to stay near Stone House Nevada City — walkable hotels, inns, and guest lodging for wedding parties and destination private events nearby.",
  },
  "blog.html": {
    title: "Blog — Stone House Nevada City Stories",
    desc: "Stories from Stone House Nevada City — venue history, regenerative farming, elopement guides, and Gold Country wedding inspiration for couples.",
  },
  "chef-story.html": {
    title: "Our Culinary Story — Stone House Nevada City",
    desc: "The seed-oil-free kitchen philosophy at Stone House Nevada City — how our chefs source and cook for private wedding and event dining each night.",
  },
  "elopement.html": {
    title: "Nevada City Elopement Packages | Stone House",
    desc: "Elope in Nevada City at Stone House — intimate packages for 2–30 guests, historic stone spaces, and seed-oil-free dining in Gold Country nearby.",
  },
  "nevada-city-wedding-venue.html": {
    title: "Nevada City Wedding Venue | Stone House Est. 1857",
    desc: "Nevada City wedding venues start at Stone House: an 1857 private buyout venue downtown with seven spaces, seed-oil-free catering, and up to 300 guests.",
  },
  "nevada-county-wedding-venues.html": {
    title: "Nevada County Wedding Venues | Stone House",
    desc: "Large and outdoor-ready Nevada County wedding venues — Stone House offers full private buyouts, seven spaces, and capacity for up to 300 guests.",
  },
  "grass-valley-wedding-venues.html": {
    title: "Grass Valley Wedding Venues | Stone House",
    desc: "Grass Valley wedding venues nearby: Stone House in Nevada City is a short drive with a private buyout, seven spaces, and seed-oil-free catering.",
  },
  "menus.html": {
    title: "Sample Wedding Menus — Stone House Nevada City",
    desc: "Sample wedding menus and catering packages at Stone House Nevada City — seed-oil-free cuisine, reception tiers, and private event dining examples.",
  },
  "pricing.html": {
    title: "Wedding & Private Event Rates — Stone House",
    desc: "Wedding and private event rates at Stone House Nevada City — pamphlet downloads for couple celebrations and corporate or other private buyouts.",
  },
  "contact.html": {
    title: "Contact Stone House — Nevada City Event Venue",
    desc: "Contact Stone House Nevada City to tour the venue, check a date, or book a private wedding or event. Downtown Gold Country, Est. 1857 today.",
  },
  "private-events.html": {
    title: "Private Events Pricing | Stone House Nevada City",
    desc: "Private and corporate events pricing pamphlet for Stone House Nevada City — packages, amenities, and rates for non-wedding celebrations too.",
  },
  "wedding-pricing.html": {
    title: "Wedding Pricing & Packages | Stone House Nevada City",
    desc: "Wedding pricing packages for Stone House Nevada City — venue hire, catering options, and amenities in our historic 1857 private event venue.",
  },
  "vendors.html": {
    title: "Preferred Wedding Vendors | Stone House Nevada City",
    desc: "Preferred wedding vendors near Stone House Nevada City — photographers, florists, DJs, planners, and officiants trusted for Gold Country events.",
  },
  "check-your-date.html": {
    title: "Check Your Date — Stone House Nevada City",
    desc: "Check your preferred wedding or private event date at Stone House Nevada City and request a tour of our historic 1857 Gold Country venue today.",
  },
  "local-guide.html": {
    title: "Things to Do in Nevada City — Guest Guide",
    desc: "Things to do in Nevada City for wedding guests — downtown shops, rivers, hikes, dining, and ideas around Stone House in Gold Country nearby.",
  },
};

const BLOG_TITLE_SHORT = {
  "complete-guide-eloping-nevada-city":
    "Complete Guide to Eloping in Nevada City — Stone House",
  "what-to-expect-gold-country-wedding-spring":
    "Gold Country Wedding in Spring — Stone House",
  "seed-oil-free-kitchen-private-event-dining":
    "Seed-Oil-Free Kitchen Dining — Stone House",
  "how-to-choose-the-right-spaces":
    "How to Choose Spaces at Stone House — Stone House",
  "must-do-spring-activities-in-nevada-city":
    "Spring in Nevada City — Stone House",
  "the-rich-history-of-stone-house-a-legacy-of-innovation-gathering":
    "History of Stone House — Stone House",
  "the-dirt-on-stone-house-farms-stone-houses-bold-new-chapter":
    "Stone House Farms — Stone House",
  "100-years-of-ranching-one-goal-a-better-future-for-our-food-system":
    "100 Years of Ranching — Stone House",
};

const BLOG_DESC = {
  "complete-guide-eloping-nevada-city":
    "How to elope in Nevada City — licenses, spots, Stone House packages for 2–30 guests, photography timelines, and brunch ideas in Gold Country.",
  "what-to-expect-gold-country-wedding-spring":
    "What to expect at a Gold Country wedding in spring — wildflowers, weather windows, and the most-booked months at Stone House Nevada City venue.",
  "seed-oil-free-kitchen-private-event-dining":
    "Why Stone House seed-oil-free kitchen changes private event dining — olive oil, tallow, butter, and chef-driven menus for private venue buyouts.",
  "how-to-choose-the-right-spaces":
    "How to choose the right spaces at Stone House for your wedding — guest counts, vibes, and matching the Great Hall with the Courtyard layout plan.",
  "must-do-spring-activities-in-nevada-city":
    "Must-do spring activities in Nevada City — wildflower hikes, markets, art walks, Yuba River drives, and farm-to-table moments near Stone House.",
  "the-rich-history-of-stone-house-a-legacy-of-innovation-gathering":
    "The rich history of Stone House Nevada City — from 1857 Gold Rush brewery to modern private event venue in the Sierra Foothills of California.",
  "the-dirt-on-stone-house-farms-stone-houses-bold-new-chapter":
    "Stone House Farms grows chemical-free produce on regenerative land, supplying seasonal ingredients for private events at Stone House Nevada City.",
  "100-years-of-ranching-one-goal-a-better-future-for-our-food-system":
    "How Stemple Creek Ranch and Stone House partner to bring regenerative, grass-fed beef to private wedding and event dining in Nevada City, California.",
};

function walkHtml(dir, out = []) {
  for (const name of fs.readdirSync(dir)) {
    if (SKIP_DIR.has(name)) continue;
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) walkHtml(p, out);
    else if (name.endsWith(".html") && !SKIP_FILES.has(name)) out.push(p);
  }
  return out;
}

function pageSlugFromFile(file) {
  const rel = path.relative(root, file).replace(/\\/g, "/");
  if (rel === "index.html") return "/";
  if (rel.startsWith("blog/") && rel.endsWith("/index.html")) {
    return "/" + rel.replace(/\/index\.html$/, "");
  }
  return "/" + rel.replace(/\.html$/, "");
}

function pageNameFromSlug(slug) {
  if (slug === "/") return "Home";
  const bit = slug.split("/").filter(Boolean).pop() || "Page";
  return bit
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function fixHtmlHrefs(html) {
  return html.replace(/href=(["'])([^"']+)\1/gi, (full, q, href) => {
    if (!href) return full;
    const lower = href.toLowerCase();
    if (
      lower.startsWith("mailto:") ||
      lower.startsWith("tel:") ||
      lower.startsWith("http://") ||
      lower.startsWith("https://") ||
      lower.startsWith("data:") ||
      lower.startsWith("javascript:") ||
      lower.startsWith("#") ||
      href.startsWith("//")
    ) {
      return full;
    }
    // assets keep as-is (may be .html inventory — handled separately for nofollow)
    if (href.includes("assets/") || href.startsWith("/assets/")) return full;

    // relative blog/.../index.html
    let m = href.match(/^(?:\.\.\/)*(blog\/[^?#]+?)(?:\/index\.html|\.html)([?#].*)?$/i);
    if (m) {
      let p = m[1].replace(/\/$/, "");
      if (!p.startsWith("/")) p = "/" + p;
      return `href=${q}${p}${m[2] || ""}${q}`;
    }

    // any *.html page link (relative or root)
    m = href.match(/^(?:\.\/)?(?:\.\.\/)*([^?#]*?)\.html([?#].*)?$/i);
    if (m) {
      let p = m[1];
      if (p === "index" || p === "" || p.endsWith("/index")) {
        return `href=${q}/${m[2] || ""}${q}`.replace("//?", "/?").replace("//#", "/#") || `href=${q}/${q}`;
      }
      p = p.replace(/\/index$/i, "");
      if (!p.startsWith("/")) p = "/" + p;
      // strip accidental leading //
      p = p.replace(/\/{2,}/g, "/");
      return `href=${q}${p}${m[2] || ""}${q}`;
    }

    // blog listing relative paths: blog/slug -> /blog/slug
    m = href.match(/^(?:\.\.\/)*(blog\/[a-z0-9-]+)\/?([?#].*)?$/i);
    if (m && !href.startsWith("/")) {
      return `href=${q}/${m[1]}${m[2] || ""}${q}`;
    }

    return full;
  });
}

function fixEmptyImg(html) {
  return html
    .replace(/<img([^>]*\sid=["']lb-img["'][^>]*?)\ssrc=["']["']/gi, `<img$1 src="${PIXEL}"`)
    .replace(/<img([^>]*?)\ssrc=["']["']([^>]*\sid=["']lb-img["'])/gi, `<img$1 src="${PIXEL}"$2`)
    .replace(/<img id="lb-img" src="" alt="">/g, `<img id="lb-img" src="${PIXEL}" alt="">`);
}

function removeAggregateRating(html) {
  return html
    .replace(/,?\s*"aggregateRating"\s*:\s*\{[^}]*\}\s*/g, "")
    .replace(/,\s*\}/g, "\n}")
    .replace(/,\s*(\])/g, "$1");
}

function fixPriceRange(html) {
  // Use a function replacer — string replacements treat $$ as a single $
  return html.replace(/"priceRange"\s*:\s*"\$+"/g, () => '"priceRange": "$$$$"');
}

function setTitle(html, title) {
  if (!title) return html;
  return html.replace(/<title>[^<]*<\/title>/i, `<title>${escHtml(title)}</title>`);
}

function setMetaDescription(html, desc) {
  if (!desc) return html;
  if (/name=["']description["']/i.test(html)) {
    return html
      .replace(
        /(<meta\s+[^>]*name=["']description["'][^>]*content=["'])([^"']*)(["'])/i,
        `$1${escAttr(desc)}$3`
      )
      .replace(
        /(<meta\s+[^>]*content=["'])([^"']*)(["'][^>]*name=["']description["'])/i,
        `$1${escAttr(desc)}$3`
      );
  }
  // insert after title
  return html.replace(
    /<\/title>/i,
    `</title>\n<meta name="description" content="${escAttr(desc)}">`
  );
}

function escAttr(s) {
  return String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;");
}
function escHtml(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");
}

function ensureTwitterAndOg(html) {
  let out = html;
  if (!/twitter:card/i.test(out)) {
    out = out.replace(
      /<\/head>/i,
      `<meta name="twitter:card" content="summary_large_image">\n</head>`
    );
  }
  if (!/property=["']og:image["']/i.test(out) && !/property=["']og:image["']/i.test(out)) {
    // also name= form used rarely
  }
  if (!/og:image/i.test(out)) {
    out = out.replace(
      /<\/head>/i,
      `<meta property="og:image" content="${OG_DEFAULT}">\n</head>`
    );
  }
  return out;
}

function hasMarker(html, id) {
  return html.includes(`data-seo-block="${id}"`) || html.includes(`/*seo:${id}*/`);
}

function injectBeforeHeadClose(html, snippet) {
  if (!snippet) return html;
  return html.replace(/<\/head>/i, `${snippet}\n</head>`);
}

function venueSchema(url, name, description) {
  return {
    "@context": "https://schema.org",
    "@type": ["EventVenue", "LocalBusiness"],
    ...VENUE_BASE,
    name: VENUE_BASE.name,
    alternateName: name,
    description,
    url: `https://www.stonehouse.io${url}`,
  };
}

function jsonLd(obj, marker) {
  return `<script type="application/ld+json" data-seo-block="${marker}">\n${JSON.stringify(obj, null, 2)}\n</script>`;
}

function breadcrumbLd(items, marker = "breadcrumbs") {
  return jsonLd(
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: items.map((it, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: it.name,
        item: it.item.startsWith("http") ? it.item : `https://www.stonehouse.io${it.item}`,
      })),
    },
    marker
  );
}

function homepageGraph() {
  return jsonLd(
    {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": ["EventVenue", "LocalBusiness", "Organization"],
          "@id": "https://www.stonehouse.io/#organization",
          name: "Stone House Nevada City",
          url: "https://www.stonehouse.io/",
          telephone: VENUE_BASE.telephone,
          email: VENUE_BASE.email,
          image: OG_DEFAULT,
          logo: "https://www.stonehouse.io/assets/stone-house-logo.png",
          priceRange: "$$$$",
          address: VENUE_BASE.address,
          geo: VENUE_BASE.geo,
          foundingDate: "1857",
          sameAs: [
            "https://www.instagram.com/stonehousenevadacity/",
            "https://www.facebook.com/stonehousenevadacity/",
          ],
        },
        {
          "@type": "WebSite",
          "@id": "https://www.stonehouse.io/#website",
          url: "https://www.stonehouse.io/",
          name: "Stone House Nevada City",
          publisher: { "@id": "https://www.stonehouse.io/#organization" },
          inLanguage: "en-US",
        },
      ],
    },
    "org-website"
  );
}

function absUrlifyBlogLinks(html) {
  // blog.html card links: href="blog/..." -> href="/blog/..."
  return html.replace(/href="blog\//g, 'href="/blog/').replace(/href='blog\//g, "href='/blog/");
}

function processFile(file) {
  let html = fs.readFileSync(file, "utf8");
  const before = html;
  const rel = path.relative(root, file).replace(/\\/g, "/");
  const base = path.basename(file);
  const slug = pageSlugFromFile(file);

  html = fixHtmlHrefs(html);
  html = fixEmptyImg(html);
  html = removeAggregateRating(html);
  html = fixPriceRange(html);

  if (rel === "blog.html") html = absUrlifyBlogLinks(html);

  // Inventory HTML links → nofollow (keep path, headers handle noindex)
  html = html.replace(
    /href=(["'])((?:\.\/)?(?:\.\.\/)*(?:\/)?assets\/stonehouse[_-][^"']+\.html)(["'])/gi,
    (full, q, href, q2) => {
      // normalize to root-relative assets path
      const cleaned = href.replace(/^(?:\.\/)?(?:\.\.\/)*/, "").replace(/^\//, "");
      const pathHref = cleaned.startsWith("assets/") ? `/${cleaned}` : `/${cleaned}`;
      if (/rel=/.test(full)) return full;
      return `href=${q}${pathHref}${q2} rel="nofollow noopener" target="_blank"`;
    }
  );
  // Normalize inventory HTML anchors: single rel + single target
  html = html.replace(
    /<a\b([^>]*?)href=(["'])(\/assets\/stonehouse[^"']+\.html)\2([^>]*)>/gi,
    (full, before, q, href, after) => {
      let rest = `${before} ${after}`;
      rest = rest
        .replace(/\srel=(["'])[^"']*\1/gi, "")
        .replace(/\starget=(["'])[^"']*\1/gi, "")
        .replace(/\s+/g, " ")
        .trim();
      const extra = rest ? ` ${rest}` : "";
      return `<a href=${q}${href}${q} rel="nofollow noopener" target="_blank"${extra}>`;
    }
  );

  const meta = PAGE_META[base];
  if (meta) {
    if (meta.title) html = setTitle(html, meta.title);
    if (meta.desc) html = setMetaDescription(html, meta.desc);
  }

  // Blog posts
  if (rel.startsWith("blog/") && rel.endsWith("/index.html")) {
    const post = rel.split("/")[1];
    if (BLOG_TITLE_SHORT[post]) html = setTitle(html, BLOG_TITLE_SHORT[post]);
    if (BLOG_DESC[post]) html = setMetaDescription(html, BLOG_DESC[post]);
  }

  html = ensureTwitterAndOg(html);

  // Homepage: replace or augment LD+JSON with graph (keep EventVenue via graph)
  if (rel === "index.html") {
    if (!hasMarker(html, "org-website")) {
      // remove first simple EventVenue block if present, inject graph
      html = html.replace(
        /<script type="application\/ld\+json">[\s\S]*?<\/script>/,
        homepageGraph()
      );
      if (!hasMarker(html, "org-website")) {
        html = injectBeforeHeadClose(html, homepageGraph());
      }
    } else {
      // still fix priceRange already done
    }
  }

  // Page-specific schema
  if (meta?.schema && !hasMarker(html, meta.schema)) {
    const desc =
      meta.desc ||
      "Historic 1857 private event venue in Nevada City, California.";
    let snippet = "";
    if (meta.schema === "venue") {
      snippet = jsonLd(
        venueSchema(meta.url, meta.pageName, desc),
        "venue"
      );
    } else if (meta.schema === "catering") {
      snippet = jsonLd(
        {
          "@context": "https://schema.org",
          "@type": ["FoodService", "CateringService"],
          name: "Stone House Catering",
          description: desc,
          url: "https://www.stonehouse.io/catering",
          telephone: VENUE_BASE.telephone,
          areaServed: "Nevada City, CA",
          provider: {
            "@type": "EventVenue",
            name: "Stone House Nevada City",
            url: "https://www.stonehouse.io/",
          },
        },
        "catering"
      );
    } else if (meta.schema === "gallery") {
      const imgs = [
        "assets/gallery/stone-house-nevada-city-historic-exterior-archive-photograph.jpg",
        "assets/gallery/stone-house-nevada-city-courtyard-wedding-ceremony-hexagon-arch.jpg",
        "assets/gallery/stone-house-nevada-city-wedding-reception-toast-great-hall-guests.jpg",
        "assets/gallery/stone-house-nevada-city-great-hall-seated-dinner-private-event.jpg",
        "assets/gallery/stone-house-nevada-city-outdoor-wedding-ceremony-ivy-arch-floral.jpg",
        "assets/gallery/stone-house-nevada-city-wedding-couple-cave-entrance-candlelit.jpg",
        "assets/gallery/stone-house-nevada-city-bridal-suite-bedroom-stone-wall.jpg",
        "assets/gallery/stone-house-nevada-city-bridal-suite-copper-soaking-tub.jpg",
        "assets/gallery/stone-house-nevada-city-courtyard-garden-wedding-ceremony-string-lights.jpg",
        "assets/gallery/stone-house-nevada-city-bride-portrait-courtyard-floral-crown.jpg",
      ].map((s) => `https://www.stonehouse.io/${s}`);
      snippet = jsonLd(
        {
          "@context": "https://schema.org",
          "@type": "ImageGallery",
          name: "Stone House Nevada City Photo Gallery",
          description: desc,
          url: "https://www.stonehouse.io/gallery",
          image: imgs,
        },
        "gallery"
      );
    } else if (meta.schema === "article") {
      snippet = jsonLd(
        {
          "@context": "https://schema.org",
          "@type": "Article",
          headline: meta.pageName,
          name: meta.pageName,
          description: desc,
          url: `https://www.stonehouse.io${meta.url}`,
          author: { "@type": "Organization", name: "Stone House Nevada City" },
          publisher: {
            "@type": "Organization",
            name: "Stone House Nevada City",
            url: "https://www.stonehouse.io/",
          },
          mainEntityOfPage: `https://www.stonehouse.io${meta.url}`,
        },
        "article"
      );
    } else if (meta.schema === "org") {
      snippet = jsonLd(
        {
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Stone House Nevada City",
          url: "https://www.stonehouse.io/",
          logo: "https://www.stonehouse.io/assets/stone-house-logo.png",
          image: OG_DEFAULT,
          telephone: VENUE_BASE.telephone,
          email: VENUE_BASE.email,
          address: VENUE_BASE.address,
          sameAs: [
            "https://www.instagram.com/stonehousenevadacity/",
            "https://www.facebook.com/stonehousenevadacity/",
          ],
        },
        "org"
      );
    } else if (meta.schema === "webpage") {
      snippet = jsonLd(
        {
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: meta.pageName,
          description: desc,
          url: `https://www.stonehouse.io${meta.url}`,
          isPartOf: {
            "@type": "WebSite",
            name: "Stone House Nevada City",
            url: "https://www.stonehouse.io/",
          },
        },
        "webpage"
      );
    }
    if (snippet) html = injectBeforeHeadClose(html, snippet);
  }

  // Breadcrumbs JSON-LD only (non-home)
  if (slug !== "/" && !hasMarker(html, "breadcrumbs")) {
    let crumbs;
    if (slug.startsWith("/blog/") && slug !== "/blog") {
      const postName =
        BLOG_TITLE_SHORT[slug.split("/").pop()]?.replace(/ — Stone House$/, "") ||
        pageNameFromSlug(slug);
      crumbs = [
        { name: "Home", item: "/" },
        { name: "Blog", item: "/blog" },
        { name: postName, item: slug },
      ];
    } else {
      const name =
        meta?.pageName ||
        (html.match(/<title>([^<]+)<\/title>/i)?.[1] || "")
          .replace(/ — Stone House.*$/i, "")
          .replace(/ \| Stone House.*$/i, "")
          .replace(/&amp;/g, "&")
          .trim() ||
        pageNameFromSlug(slug);
      crumbs = [
        { name: "Home", item: "/" },
        { name: name, item: slug },
      ];
    }
    html = injectBeforeHeadClose(html, breadcrumbLd(crumbs));
  }

  // FAQ categories: h3.faq-cat → h2.faq-cat (same classes)
  if (rel === "faq.html") {
    html = html.replace(/<h3 class="faq-cat"/g, '<h2 class="faq-cat"');
    html = html.replace(/<\/h3>(\s*<\/?div|\s*<div class="faq-list")/g, "</h2>$1");
    // safer: close tags for faq-cat lines only
    html = html.replace(
      /(<h2 class="faq-cat"[^>]*>[\s\S]*?)<\/h3>/g,
      "$1</h2>"
    );
  }

  // Library: first res-cat-title as h2
  if (rel === "library.html") {
    if (!/<h2[\s>]/i.test(html)) {
      html = html.replace(
        '<h3 class="res-cat-title"><span class="res-cat-dot" aria-hidden="true"></span>Spaces &amp; Venue</h3>',
        '<h2 class="res-cat-title"><span class="res-cat-dot" aria-hidden="true"></span>Spaces &amp; Venue</h2>'
      );
    }
  }

  // Vendors: add visually hidden h2 if none
  if (rel === "vendors.html" && !/<h2[\s>]/i.test(html)) {
    html = html.replace(
      /(<h1[^>]*>[\s\S]*?<\/h1>)/i,
      `$1\n  <h2 class="visually-hidden" style="position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0">Preferred vendor categories</h2>`
    );
  }

  // Privacy: remove broken meta refresh; ensure h1
  if (rel === "privacy.html") {
    html = html.replace(/<meta http-equiv="refresh"[^>]*>\s*/i, "");
    if (!/<h1[\s>]/i.test(html)) {
      html = html.replace(
        /<p>Redirecting to <a href="\/privacy-policy\/">our privacy policy<\/a>\.\.\.<\/p>/i,
        `<div class="page-hero">
  <h1>Privacy Policy</h1>
  <p class="subtitle">How Stone House Nevada City handles information you share when you inquire, tour, or book.</p>
</div>
<div class="section" style="max-width:720px;margin:0 auto;padding:0 clamp(1rem,4vw,2rem) 3rem">
  <p>Stone House Nevada City ("we", "us") operates the website at www.stonehouse.io. This policy describes the limited personal information we may collect when you contact us, request a tour, submit a lead form, or communicate about private events.</p>
  <p>We collect contact details you provide (such as name, email, phone, event date, and guest count) and standard technical data that web servers and analytics tools may record (pages viewed, approximate location, device type). We use this information to respond to inquiries, schedule tours, prepare proposals, and improve the website.</p>
  <p>We do not sell personal information. Service providers who help us operate forms, email, hosting, or advertising may process data on our behalf under reasonable contractual safeguards. You may request access or deletion of contact data by emailing bookings@stonehouse.io. We may update this policy; continued use of the site after changes constitutes acceptance of the revised policy.</p>
  <p>For questions about privacy, email <a href="mailto:bookings@stonehouse.io">bookings@stonehouse.io</a> or call <a href="tel:+15302655050">(530) 265-5050</a>.</p>
</div>`
      );
    }
  }

  if (html !== before) {
    fs.writeFileSync(file, html);
    return true;
  }
  return false;
}

// robots.txt — remove inventroy Disallows; X-Robots-Tag still blocks indexing
const robots = `User-agent: *
Allow: /

# Internal / utility — not for search
Disallow: /studio/
Disallow: /api/
Disallow: /paypal-checkout
Disallow: /checkout
Disallow: /order-confirmation

# Asset HTML tools: crawlable but X-Robots-Tag noindex on Vercel (prefer headers over Disallow)

Sitemap: https://www.stonehouse.io/sitemap.xml
`;
fs.writeFileSync(path.join(root, "robots.txt"), robots);

// Patch seo-launch-fix so future runs don't re-add Disallow inventory
const launchFixPath = path.join(root, "scripts", "seo-launch-fix.mjs");
if (fs.existsSync(launchFixPath)) {
  let f = fs.readFileSync(launchFixPath, "utf8");
  f = f.replace(
    /Disallow: \/assets\/stonehouse_content_inventory_v2\.html\nDisallow: \/assets\/stonehouse-reception-packages\.html\n\n/,
    "\n"
  );
  fs.writeFileSync(launchFixPath, f);
}

const files = walkHtml(root);
let n = 0;
for (const file of files) {
  if (processFile(file)) n++;
}
console.log(`seo-round3: updated ${n}/${files.length} HTML files; robots.txt rewritten.`);
