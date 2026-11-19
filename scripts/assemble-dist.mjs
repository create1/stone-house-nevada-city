import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const dist = path.join(root, "dist");
const studioDist = path.join(root, "studio", "dist");

/** Live GTM container for www.stonehouse.io (override via env if needed). */
const GTM_ID = (process.env.NEXT_PUBLIC_GTM_ID || "GTM-5J6XJRS").trim();

function cp(src, dest) {
  fs.cpSync(src, dest, { recursive: true });
}

function walkHtmlFiles(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    // Skip CMS studio UI, vendored trees, and asset tooling HTML (not public pages)
    if (entry.isDirectory()) {
      if (
        entry.name === "studio" ||
        entry.name === "node_modules" ||
        entry.name === "assets" ||
        entry.name === "docs"
      ) {
        continue;
      }
      walkHtmlFiles(full, out);
    } else if (entry.isFile() && entry.name.endsWith(".html")) {
      out.push(full);
    }
  }
  return out;
}

function gtmHeadSnippet(id) {
  return `<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${id}');</script>
<!-- End Google Tag Manager -->
`;
}

function gtmBodySnippet(id) {
  return `<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${id}"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->
`;
}

/**
 * Inject one GTM install (head + body noscript) per HTML page.
 * Idempotent: skips pages that already load this container.
 * Removes hardcoded gtag.js for GA4 so GA fires only via GTM (if configured there).
 */
function injectGtm(html, id) {
  if (!id || !html.includes("<html")) return html;
  if (html.includes(`googletagmanager.com/gtm.js?id=${id}`) || html.includes(`ns.html?id=${id}`)) {
    return html;
  }

  let out = html;

  // Drop direct GA4 gtag bootstrap so pageviews are not double-counted with GTM
  out = out.replace(
    /\s*<!--\s*GA4\s*-->\s*<script\s+async(?:="")?\s+src="https:\/\/www\.googletagmanager\.com\/gtag\/js\?id=G-[A-Z0-9]+"><\/script>\s*<script>\s*window\.dataLayer[\s\S]*?gtag\('config','G-[A-Z0-9]+'\);\s*<\/script>/gi,
    "\n"
  );
  out = out.replace(
    /\s*<script\s+async(?:="")?\s+src="https:\/\/www\.googletagmanager\.com\/gtag\/js\?id=G-[A-Z0-9]+"><\/script>\s*<script>\s*window\.dataLayer\s*=\s*window\.dataLayer\s*\|\|\s*\[\];\s*function\s+gtag\(\)\s*\{\s*dataLayer\.push\(arguments\);\s*\}\s*gtag\('js',\s*new Date\(\)\);\s*gtag\('config',\s*'G-[A-Z0-9]+'\);\s*<\/script>/gi,
    "\n"
  );

  const head = gtmHeadSnippet(id);
  if (/<head[^>]*>/i.test(out)) {
    out = out.replace(/<head([^>]*)>/i, `<head$1>\n${head}`);
  }

  const body = gtmBodySnippet(id);
  if (/<body[^>]*>/i.test(out)) {
    out = out.replace(/<body([^>]*)>/i, `<body$1>\n${body}`);
  }

  return out;
}

fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist, { recursive: true });

const topLevel = ["index.html", "styles.css", "app.js", "wedding-pamphlet-unlock.js", "check-your-date.html", "check-date-page.css", "contact.html", "contact-page.css", "other-event-pricing-pamphlet.html", "private-events.html", "wedding-pricing.html", "wedding-pricing-page.css", "facebook-wedding.html", "facebook-events.html", "inquire.html", "inquire-page.css", "pricing-pamphlet.html", "wedding-pricing-pamphlet.html", "pricing-pamphlet-lander.css", "pricing-pamphlet-modal.css", "floor-plans.html", "accommodations.html", "local-guide.html", "weather-guide.html", "timeline.html", "chef-story.html", "layouts.html", "vendors.html", "menus.html", "getting-ready.html", "elopement.html", "rehearsal-dinner.html", "brunch.html", "wedding-venue-cost-nevada-city.html", "private-buyout.html", "holiday-party-venue.html", "corporate-events.html", "press.html", "blog.html", "blog", "subpage-styles.css", "history-page.css", "pricing.html", "pricing-page.css", "catering.html", "catering-page.css", "events.html", "events-page.css", "calendar-page.css", "spaces.html", "spaces-page.css", "gallery.html", "gallery-page.css", "library.html", "library-page.css", "faq.html", "faq-page.css", "privacy.html", "vercel.json", "assets", "docs", "robots.txt", "sitemap.xml", "api"];
for (const name of topLevel) {
  const p = path.join(root, name);
  if (fs.existsSync(p)) {
    cp(p, path.join(dist, name));
  }
}

const sanityProject =
  process.env.SANITY_STUDIO_PROJECT_ID ||
  process.env.SANITY_PROJECT_ID ||
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ||
  "";
const sanityDataset =
  process.env.SANITY_STUDIO_DATASET ||
  process.env.SANITY_DATASET ||
  process.env.NEXT_PUBLIC_SANITY_DATASET ||
  "production";

const indexOut = path.join(dist, "index.html");
if (fs.existsSync(indexOut)) {
  let html = fs.readFileSync(indexOut, "utf8");
  html = html.replace(
    /data-sanity-project-id="[^"]*"/,
    `data-sanity-project-id="${sanityProject}"`
  );
  html = html.replace(
    /data-sanity-dataset="[^"]*"/,
    `data-sanity-dataset="${sanityDataset.replace(/"/g, "")}"`
  );

  // Inject GA4 measurement ID
  const ga4Id = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID || "";
  html = html.replace(
    /<meta name="ga4-id" content="">/,
    `<meta name="ga4-id" content="${ga4Id}">`
  );

  // Inject Meta Pixel ID
  const metaPixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID || "";
  html = html.replace(
    /<meta name="meta-pixel-id" content="">/,
    `<meta name="meta-pixel-id" content="${metaPixelId}">`
  );

  fs.writeFileSync(indexOut, html);
}

// Sitewide GTM (recommended install once per page; not applied to /studio)
if (GTM_ID) {
  const pages = walkHtmlFiles(dist);
  let injected = 0;
  for (const file of pages) {
    const before = fs.readFileSync(file, "utf8");
    const after = injectGtm(before, GTM_ID);
    if (after !== before) {
      fs.writeFileSync(file, after);
      injected += 1;
    }
  }
  console.log(`GTM ${GTM_ID}: injected/updated on ${injected}/${pages.length} HTML pages`);
}

if (!fs.existsSync(studioDist)) {
  console.error("Missing studio/dist. Run: cd studio && npm run build");
  process.exit(1);
}

fs.mkdirSync(path.join(dist, "studio"), { recursive: true });
cp(studioDist, path.join(dist, "studio"));

console.log("dist/ ready: static site + /studio");
