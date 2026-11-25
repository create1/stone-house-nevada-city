import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { handleAdmin, handleCalendar, isLocalHost } from "../platform/http.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const port = Number(process.env.PORT || 8787);

const types = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".pdf": "application/pdf",
};

function blocked(relative) {
  const normalized = relative.replaceAll("\\", "/");
  return (
    normalized.startsWith(".git") ||
    normalized.startsWith("node_modules") ||
    normalized.startsWith("platform/data") ||
    normalized.includes("/.env") ||
    path.basename(normalized).startsWith(".env")
  );
}

function staticFile(pathname) {
  const relative = decodeURIComponent(pathname).replace(/^\/+/, "");
  const candidates = relative ? [relative, `${relative}.html`] : ["index.html"];
  for (const candidate of candidates) {
    if (candidate.includes("..") || blocked(candidate)) continue;
    const full = path.resolve(root, candidate);
    if (!full.startsWith(root + path.sep) && full !== root) continue;
    if (fs.existsSync(full) && fs.statSync(full).isFile()) return full;
  }
  return null;
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on("data", (chunk) => {
      size += chunk.length;
      if (size > 200_000) {
        reject(new Error("too large"));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

function send(res, result) {
  res.statusCode = result.status;
  for (const [key, value] of Object.entries(result.headers || {})) res.setHeader(key, value);
  res.end(result.body || "");
}

const server = http.createServer(async (req, res) => {
  try {
    const host = req.headers.host || "127.0.0.1";
    const url = new URL(req.url || "/", `http://${host}`);
    const pathname = url.pathname.replace(/\/+$/, "") || "/";
    const parts = pathname.split("/").filter(Boolean);

    if (pathname === "/calendar" || (parts[0] === "calendar" && parts.length <= 3)) {
      const slug = parts[1] && parts[1] !== "past" ? parts[1] : "";
      send(res, await handleCalendar({
        host,
        slug,
        past: parts[1] === "past",
        checkout: parts[2] === "checkout",
      }));
      return;
    }

    if (pathname === "/admin/events") {
      const body = req.method === "POST" ? await readBody(req) : "";
      send(res, await handleAdmin({
        method: req.method,
        host,
        body,
        queryId: url.searchParams.get("id") || "",
        local: isLocalHost(host),
      }));
      return;
    }

    const file = staticFile(pathname === "/" ? "/index.html" : pathname);
    if (!file) {
      res.statusCode = 404;
      res.end("Not found");
      return;
    }
    res.setHeader("content-type", types[path.extname(file).toLowerCase()] || "application/octet-stream");
    fs.createReadStream(file).pipe(res);
  } catch {
    res.statusCode = 500;
    res.end("Something went wrong.");
  }
});

server.listen(port, "127.0.0.1", () => {
  console.log(`Event platform preview at http://127.0.0.1:${port}/admin/events`);
});
