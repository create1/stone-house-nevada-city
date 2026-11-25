/**
 * Fail if same-site page hrefs still use .html (extensionless preferred).
 * Skips mailto/tel/http/assets/# and utility pages.
 * Exit 1 on violations.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const SKIP_DIR = new Set(["node_modules", "studio", "dist", ".git", "tools"]);
const SKIP_FILES = new Set([
  "START-HERE.html",
  "other-event-pricing-pamphlet.html",
  "wedding-pricing-pamphlet.html",
]);

function walk(dir, out = []) {
  for (const name of fs.readdirSync(dir)) {
    if (SKIP_DIR.has(name)) continue;
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) walk(p, out);
    else if (name.endsWith(".html") && !SKIP_FILES.has(name)) out.push(p);
  }
  return out;
}

const bad = [];
const re = /href=(["'])([^"']+)\1/gi;
for (const file of walk(root)) {
  // inventory assets themselves may self-link; skip under assets/
  if (file.includes(`${path.sep}assets${path.sep}`)) continue;
  const html = fs.readFileSync(file, "utf8");
  let m;
  while ((m = re.exec(html))) {
    const href = m[2];
    if (!href.toLowerCase().includes(".html")) continue;
    if (/^(mailto:|tel:|https?:|data:|javascript:|#)/i.test(href)) continue;
    if (href.includes("assets/") || href.startsWith("/assets/")) continue;
    bad.push(`${path.relative(root, file)}: ${href}`);
  }
}

if (bad.length) {
  console.error(`lint-hrefs: ${bad.length} same-site .html href(s):\n${bad.join("\n")}`);
  process.exit(1);
}
console.log("lint-hrefs: OK");
