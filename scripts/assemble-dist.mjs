import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const dist = path.join(root, "dist");

function cp(src, dest) {
  fs.cpSync(src, dest, { recursive: true });
}

fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist, { recursive: true });

const topLevel = ["index.html", "styles.css", "app.js", "floor-plans.html", "accommodations.html", "local-guide.html", "weather-guide.html", "timeline.html", "nevada-city-wedding-venue.html", "gold-country-venues.html", "chef-story.html", "layouts.html", "vendors.html", "menus.html", "getting-ready.html", "elopement.html", "rehearsal-dinner.html", "brunch.html", "press.html", "blog.html", "blog", "subpage-styles.css", "vercel.json", "assets", "docs", "robots.txt", "sitemap.xml", "venue-pricing", "wedding-pricing", "private-events", "corporate-events", "contact", "privacy-policy", "terms", "privacy.html", "weddings", "seasonal-menu", "llms.txt", ".well-known"];
for (const name of topLevel) {
  const p = path.join(root, name);
  if (fs.existsSync(p)) {
    cp(p, path.join(dist, name));
  }
}

console.log("dist/ ready: static site");
