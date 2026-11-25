import fs from "node:fs";
import path from "node:path";

// Unlocked by the cookie lead-forms.js sets after the wedding pamphlet form, or by the
// private ?k= link from the agent's email. A year covers a typical planning timeline.
const COOKIE = "sh_pamphlet_wedding";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;
const PAGE = path.join("gated", "wedding-pamphlet.html");

function hasUnlockCookie(req) {
  const raw = req.headers.cookie || "";
  return new RegExp(`(?:^|;\\s*)${COOKIE}=1(?:;|$)`).test(raw);
}

function matchingKey(req) {
  const envKey = process.env.PAMPHLET_DOWNLOAD_KEY;
  if (!envKey) return null;
  try {
    const host = req.headers.host || "www.stonehouse.io";
    const proto = req.headers["x-forwarded-proto"] || "https";
    const url = new URL(req.url, `${proto}://${host}`);
    return url.searchParams.get("k") === envKey ? envKey : null;
  } catch {
    return null;
  }
}

function pamphletUrlWithoutKey(req) {
  try {
    const url = new URL(req.url, "https://www.stonehouse.io");
    url.searchParams.delete("k");
    const query = url.searchParams.toString();
    return query ? `/wedding-pamphlet?${query}` : "/wedding-pamphlet";
  } catch {
    return "/wedding-pamphlet";
  }
}

function findPage() {
  const candidates = [
    path.join(process.cwd(), PAGE),
    path.join(process.cwd(), "..", PAGE),
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

  // Trade the key for the cookie and reload without it, so the key never sits in the
  // address bar, in links copied from it, or in page URLs sent to analytics and ad pixels.
  if (matchingKey(req)) {
    const secure = (req.headers["x-forwarded-proto"] || "https") === "https" ? "; Secure" : "";
    res.statusCode = 302;
    res.setHeader(
      "Set-Cookie",
      `${COOKIE}=1; Path=/; Max-Age=${COOKIE_MAX_AGE}; SameSite=Lax${secure}`
    );
    res.setHeader("Location", pamphletUrlWithoutKey(req));
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("X-Robots-Tag", "noindex, nofollow");
    return res.end();
  }

  if (!hasUnlockCookie(req)) {
    res.statusCode = 302;
    res.setHeader("Location", "/pricing-pamphlet");
    res.setHeader("Cache-Control", "no-store");
    return res.end();
  }

  const filePath = findPage();
  if (!filePath) {
    res.statusCode = 404;
    res.setHeader("Cache-Control", "no-store");
    return res.end("Pamphlet not found");
  }

  const html = fs.readFileSync(filePath, "utf8");
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "private, no-store");
  res.setHeader("X-Robots-Tag", "noindex, nofollow");
  if (req.method === "HEAD") return res.end();
  return res.end(html);
}
