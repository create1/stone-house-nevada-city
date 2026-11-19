import { put, list } from "@vercel/blob";

const LOG_PREFIX = "leads/submissions-";

export async function logLeadSubmission(data) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.warn("BLOB_READ_WRITE_TOKEN not set — lead logging skipped");
    return { logged: false, reason: "no token" };
  }

  const entry = {
    id: `lead_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    timestamp: new Date().toISOString(),
    timestampPT: new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles" }),
    ...data,
  };

  try {
    const month = new Date().toISOString().slice(0, 7);
    const filename = `${LOG_PREFIX}${month}.jsonl`;

    let existingContent = "";
    try {
      const blobs = await list({ prefix: LOG_PREFIX });
      const existing = blobs.blobs.find((b) => b.pathname === filename);
      if (existing) {
        const res = await fetch(existing.url);
        if (res.ok) existingContent = await res.text();
      }
    } catch (fetchErr) {
      console.warn("Could not fetch existing log:", fetchErr.message);
    }

    const newContent = existingContent + JSON.stringify(entry) + "\n";

    await put(filename, newContent, {
      access: "public",
      addRandomSuffix: false,
      contentType: "application/x-ndjson",
    });

    console.log(`Lead logged: ${entry.id}`);
    return { logged: true, id: entry.id };
  } catch (err) {
    console.error("Lead logging failed:", err.message);
    return { logged: false, reason: err.message };
  }
}

export default async function handler(req, res) {
  if (req.method === "GET" && req.headers["x-admin-key"] === process.env.ADMIN_API_KEY) {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return res.status(500).json({ error: "Blob storage not configured" });
    }

    try {
      const { month, limit = 100, offset = 0 } = req.query;
      const blobs = await list({ prefix: LOG_PREFIX });

      if (month) {
        const targetFile = blobs.blobs.find((b) => b.pathname.includes(month));
        if (!targetFile) {
          return res.status(404).json({ error: `No logs for ${month}` });
        }
        const response = await fetch(targetFile.url);
        const text = await response.text();
        const entries = text
          .trim()
          .split("\n")
          .filter(Boolean)
          .map((line) => JSON.parse(line));
        return res.status(200).json({
          month,
          total: entries.length,
          entries: entries.slice(Number(offset), Number(offset) + Number(limit)),
        });
      }

      const summary = blobs.blobs
        .filter((b) => b.pathname.startsWith(LOG_PREFIX))
        .map((b) => ({
          month: b.pathname.replace(LOG_PREFIX, "").replace(".jsonl", ""),
          url: b.url,
          size: b.size,
          uploadedAt: b.uploadedAt,
        }));

      return res.status(200).json({ logs: summary });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
