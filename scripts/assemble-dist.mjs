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

if (!fs.existsSync(studioDist)) {
  console.error("Missing studio/dist. Run: cd studio && npm run build");
  process.exit(1);
}

fs.mkdirSync(path.join(dist, "studio"), { recursive: true });
cp(studioDist, path.join(dist, "studio"));

console.log("dist/ ready: static site + /studio");
