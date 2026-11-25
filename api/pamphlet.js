// The wedding pamphlet is a web page now (api/wedding-pamphlet.js), so prices live in one
// place. Old PDF links in emails and bookmarks land there and pass through its form/key gate.
export default function handler(req, res) {
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.statusCode = 405;
    res.setHeader("Allow", "GET, HEAD");
    return res.end("Method Not Allowed");
  }

  let key = null;
  try {
    key = new URL(req.url, "https://www.stonehouse.io").searchParams.get("k");
  } catch {
    /* redirect without a key */
  }

  res.statusCode = 302;
  res.setHeader(
    "Location",
    key ? `/wedding-pamphlet?k=${encodeURIComponent(key)}` : "/wedding-pamphlet"
  );
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Robots-Tag", "noindex, nofollow");
  return res.end();
}
