import fs from "node:fs";
import path from "node:path";

const COOKIE = "sh_pamphlet_wedding";
const FILE_NAME = "wedding-pricing-pamphlet.pdf";

function hasUnlockCookie(req) {
  const raw = req.headers.cookie || "";
  return new RegExp(`(?:^|;\\s*)${COOKIE}=1(?:;|$)`).test(raw);
}

function hasDownloadKey(req) {
  const envKey = process.env.PAMPHLET_DOWNLOAD_KEY;
  if (!envKey) return false;
  try {
    const host = req.headers.host || "www.stonehouse.io";
    const proto = req.headers["x-forwarded-proto"] || "https";
    const url = new URL(req.url, `${proto}://${host}`);
    return url.searchParams.get("k") === envKey;
  } catch {
    return false;
  }
}

function findPdf() {
  const candidates = [
    path.join(process.cwd(), "assets", FILE_NAME),
    path.join(process.cwd(), "dist", "assets", FILE_NAME),
    path.join(process.cwd(), "..", "assets", FILE_NAME),
  ];
  for (const p of candidates) {
    try {
      if (fs.existsSync(p)) return p;
    } catch {
      /* continue */
    }
  }
  return null;
}

export default function handler(req, res) {
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.statusCode = 405;
    res.setHeader("Allow", "GET, HEAD");
    return res.end("Method Not Allowed");
  }

  if (!hasUnlockCookie(req) && !hasDownloadKey(req)) {
    res.statusCode = 302;
    res.setHeader("Location", "/pricing-pamphlet");
    res.setHeader("Cache-Control", "no-store");
    return res.end();
  }

  const filePath = findPdf();
  if (!filePath) {
    res.statusCode = 404;
    res.setHeader("Cache-Control", "no-store");
    return res.end("Pamphlet not found");
  }

  const buf = fs.readFileSync(filePath);
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    'inline; filename="Stone-House-Wedding-Pricing-Pamphlet.pdf"'
  );
  res.setHeader("Cache-Control", "private, no-store");
  res.setHeader("X-Robots-Tag", "noindex, nofollow");
  if (req.method === "HEAD") return res.end();
  return res.end(buf);
}
