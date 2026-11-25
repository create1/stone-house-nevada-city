import { handleCalendar } from "../platform/http.mjs";

function send(res, result) {
  res.statusCode = result.status;
  for (const [key, value] of Object.entries(result.headers || {})) res.setHeader(key, value);
  res.end(result.body || "");
}

export default async function handler(req, res) {
  const slug = typeof req.query?.slug === "string" ? req.query.slug : "";
  send(res, await handleCalendar({
    host: req.headers.host || "",
    slug,
    past: req.query?.past === "1",
    checkout: req.query?.checkout === "1",
  }));
}
