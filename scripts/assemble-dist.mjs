import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const dist = path.join(root, "dist");
const studioDist = path.join(root, "studio", "dist");

function cp(src, dest) {
  fs.cpSync(src, dest, { recursive: true });
}

fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist, { recursive: true });

const topLevel = ["index.html", "styles.css", "app.js", "floor-plans.html", "assets", "docs"];
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
  fs.writeFileSync(indexOut, html);
}

if (!fs.existsSync(studioDist)) {
  console.error("Missing studio/dist. Run: cd studio && npm run build");
  process.exit(1);
}

fs.mkdirSync(path.join(dist, "studio"), { recursive: true });
cp(studioDist, path.join(dist, "studio"));

console.log("dist/ ready: static site + /studio");
