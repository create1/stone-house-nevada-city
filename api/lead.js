import { Client } from "@notionhq/client";
import { Resend } from "resend";

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const resend = new Resend(process.env.RESEND_API_KEY);
const LEADS_DB = process.env.NOTION_LEADS_DB_ID;

// --- CORS ---
const ALLOWED_ORIGINS = [
  "https://stonehouse.io",
  "https://www.stonehouse.io",
  "https://stone-house-nevada-city.vercel.app",
];

function getAllowedOrigin(req) {
  const origin = req.headers.origin || "";
  // Allow exact matches and Vercel preview URLs
  if (ALLOWED_ORIGINS.includes(origin)) return origin;
  if (origin.match(/^https:\/\/stone-house-nevada-city[a-z0-9-]*\.vercel\.app$/)) return origin;
  return null;
}

function setCors(req, res) {
  const origin = getAllowedOrigin(req);
  if (origin) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
  }
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

// --- Rate limiting (in-memory, per serverless instance) ---
const rateMap = new Map();
const RATE_WINDOW_MS = 60 * 1000; // 1 minute
const RATE_LIMIT = 5; // max 5 submissions per IP per minute

function isRateLimited(ip) {
  const now = Date.now();
  const entry = rateMap.get(ip);
  if (!entry || now - entry.windowStart > RATE_WINDOW_MS) {
    rateMap.set(ip, { windowStart: now, count: 1 });
    return false;
  }
  entry.count++;
  if (entry.count > RATE_LIMIT) return true;
  return false;
}

// Clean up stale entries periodically (prevent memory leak)
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of rateMap) {
    if (now - entry.windowStart > RATE_WINDOW_MS * 2) rateMap.delete(ip);
  }
}, RATE_WINDOW_MS * 2);

export default async function handler(req, res) {
  setCors(req, res);

  // CORS preflight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Rate limiting
  const ip = req.headers["x-forwarded-for"]?.split(",")[0]?.trim() || req.socket?.remoteAddress || "unknown";
  if (isRateLimited(ip)) {
    return res.status(429).json({ error: "Too many requests. Please try again later." });
  }

  try {
    const { name, email, date, guests, source, _honeypot } = req.body;

    // Honeypot — if this hidden field has a value, it's a bot
    if (_honeypot) {
      // Return 200 so bots think it worked, but do nothing
      return res.status(200).json({ ok: true, results: { notion: "ok", notifyEmail: "ok", autoReply: "ok" } });
    }

    if (!email || !email.includes("@")) {
      return res.status(400).json({ error: "Valid email required" });
    }

    // Basic email format validation
    if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: "Valid email required" });
    }

    const results = { notion: null, notifyEmail: null, autoReply: null };

    // 1. Write to Notion leads database (non-blocking — don't kill the whole request)
    if (LEADS_DB && process.env.NOTION_API_KEY) {
      try {
        const properties = {
          Name: { title: [{ text: { content: (name || "Unknown").slice(0, 200) } }] },
          Email: { email: email.slice(0, 254) },
          "Lead Source": { select: { name: (source || "Website - Date Checker").slice(0, 100) } },
          Status: { select: { name: "New" } },
        };
        if (date) {
          properties["Event Date"] = { date: { start: date } };
        }
        if (guests) {
          properties["Guest Count"] = { rich_text: [{ text: { content: guests } }] };
        }

        await notion.pages.create({ parent: { database_id: LEADS_DB }, properties });
        results.notion = "ok";
      } catch (notionErr) {
        console.error("Notion write failed:", notionErr.code, notionErr.message);
        results.notion = `error: ${notionErr.code || notionErr.message}`;
      }
    } else {
      results.notion = "skipped (no DB ID or API key)";
    }

    // 2. Send notification email to bookings team
    const fromAddr = process.env.RESEND_FROM_EMAIL || "Stone House <admin@stonehouse.io>";

    if (process.env.RESEND_API_KEY) {
      try {
        await resend.emails.send({
          from: fromAddr,
          to: "bookings@stonehouse.io",
          subject: `New Lead: ${(name || "Unknown").slice(0, 50)} — ${(source || "Website").slice(0, 30)}`,
          html: `
            <h2>New Lead from stonehouse.io</h2>
            <p><strong>Name:</strong> ${name || "Not provided"}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Date:</strong> ${date || "Not specified"}</p>
            <p><strong>Guests:</strong> ${guests || "Not specified"}</p>
            <p><strong>Source:</strong> ${source || "Website"}</p>
            <p style="color:#888;font-size:12px;">Submitted ${new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles" })}</p>
          `,
        });
        results.notifyEmail = "ok";
      } catch (emailErr) {
        console.error("Notification email failed:", emailErr.message);
        results.notifyEmail = `error: ${emailErr.message}`;
      }

      // 3. Auto-reply to the lead
      try {
        await resend.emails.send({
          from: fromAddr,
          to: email,
          subject: "Thanks for your interest in Stone House — we'll be in touch!",
          html: `
            <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;color:#1a1714;">
              <h1 style="font-size:24px;font-weight:300;color:#1a1714;">Stone House</h1>
              <p>Hi ${(name || "there").slice(0, 100)},</p>
              <p>Thank you for reaching out about Stone House. We've received your inquiry and our team will respond within 24 hours with availability and next steps.</p>
              ${date ? `<p>You asked about: <strong>${date}</strong></p>` : ""}
              <p>In the meantime, feel free to explore our <a href="https://stonehouse.io" style="color:#C9A84C;">spaces and venue details</a>.</p>
              <p style="margin-top:24px;">Warm regards,<br>The Stone House Team<br>107 Sacramento Street, Nevada City<br>(530) 265-5050</p>
            </div>
          `,
        });
        results.autoReply = "ok";
      } catch (replyErr) {
        console.error("Auto-reply email failed:", replyErr.message);
        results.autoReply = `error: ${replyErr.message}`;
      }
    } else {
      results.notifyEmail = "skipped (no API key)";
      results.autoReply = "skipped (no API key)";
    }

    // Return 200 with details — the lead was captured even if some steps failed
    return res.status(200).json({ ok: true, results });
  } catch (err) {
    console.error("Lead API unexpected error:", err);
    return res.status(500).json({ error: "Internal error" });
  }
}
