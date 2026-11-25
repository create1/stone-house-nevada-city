import { handleAdmin } from "../platform/http.mjs";

function send(res, result) {
  res.statusCode = result.status;
  for (const [key, value] of Object.entries(result.headers || {})) res.setHeader(key, value);
  res.end(result.body || "");
}

export default async function handler(req, res) {
  send(res, await handleAdmin({
    method: req.method,
    host: req.headers.host || "",
    body: req.body ?? "",
    queryId: typeof req.query?.id === "string" ? req.query.id : "",
    local: false,
  }));
}
