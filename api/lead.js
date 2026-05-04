import { Client } from "@notionhq/client";
import { Resend } from "resend";
import { createHash } from "crypto";

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
const RATE_WINDOW_MS = 60 * 1000;
const RATE_LIMIT = 5;

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

setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of rateMap) {
    if (now - entry.windowStart > RATE_WINDOW_MS * 2) rateMap.delete(ip);
  }
}, RATE_WINDOW_MS * 2);

// --- Hashing for Meta CAPI (SHA-256, lowercase, trimmed) ---
function hashForMeta(value) {
  if (!value) return null;
  return createHash("sha256").update(value.trim().toLowerCase()).digest("hex");
}

// --- Meta Conversions API ---
async function sendMetaCAPI({ email, name, ip, userAgent, sourceUrl, fbc, fbp }) {
  const pixelId = process.env.META_PIXEL_ID;
  const accessToken = process.env.META_ACCESS_TOKEN;
  if (!pixelId || !accessToken) return "skipped (no credentials)";

  const eventData = {
    event_name: "Lead",
    event_time: Math.floor(Date.now() / 1000),
    event_source_url: sourceUrl || "https://stonehouse.io",
    action_source: "website",
    user_data: {
      em: [hashForMeta(email)],
      client_ip_address: ip,
      client_user_agent: userAgent,
    },
  };

  // Add hashed name if provided
  if (name) {
    const parts = name.trim().split(/\s+/);
    if (parts[0]) eventData.user_data.fn = [hashForMeta(parts[0])];
    if (parts.length > 1) eventData.user_data.ln = [hashForMeta(parts[parts.length - 1])];
  }

  // Add Facebook click ID and browser ID if present
  if (fbc) eventData.user_data.fbc = fbc;
  if (fbp) eventData.user_data.fbp = fbp;

  try {
    const resp = await fetch(
      `https://graph.facebook.com/v21.0/${pixelId}/events?access_token=${accessToken}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: [eventData] }),
      }
    );
    if (!resp.ok) {
      const err = await resp.text();
      console.error("Meta CAPI error:", err);
      return `error: ${resp.status}`;
    }
    return "ok";
  } catch (err) {
    console.error("Meta CAPI fetch failed:", err.message);
    return `error: ${err.message}`;
  }
}

// --- GoHighLevel Webhook ---
async function sendToGHL({ name, email, phone, date, guests, source, utm_source, utm_medium, utm_campaign, utm_content, utm_term }) {
  const webhookUrl = process.env.GHL_WEBHOOK_URL;
  if (!webhookUrl) return "skipped (no webhook URL)";

  const payload = {
    first_name: name ? name.trim().split(/\s+/)[0] : "",
    last_name: name && name.trim().split(/\s+/).length > 1 ? name.trim().split(/\s+/).slice(1).join(" ") : "",
    email: email,
    phone: phone || "",
    source: source || "Website",
    tags: ["stonehouse.io", source || "website-form"].map(t => t.toLowerCase().replace(/\s+/g, "-")),
    customField: {
      event_date: date || "",
      guest_count: guests || "",
      utm_source: utm_source || "",
      utm_medium: utm_medium || "",
      utm_campaign: utm_campaign || "",
      utm_content: utm_content || "",
      utm_term: utm_term || "",
    },
  };

  try {
    const resp = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!resp.ok) {
      console.error("GHL webhook error:", resp.status);
      return `error: ${resp.status}`;
    }
    return "ok";
  } catch (err) {
    console.error("GHL webhook failed:", err.message);
    return `error: ${err.message}`;
  }
}

export default async function handler(req, res) {
  setCors(req, res);

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const ip = req.headers["x-forwarded-for"]?.split(",")[0]?.trim() || req.socket?.remoteAddress || "unknown";
  if (isRateLimited(ip)) {
    return res.status(429).json({ error: "Too many requests. Please try again later." });
  }

  try {
    const {
      name, email, phone, date, guests, source, _honeypot,
      // UTM parameters
      utm_source, utm_medium, utm_campaign, utm_content, utm_term,
      // Meta tracking IDs (passed from client)
      fbc, fbp, source_url
    } = req.body;

    // Honeypot
    if (_honeypot) {
      return res.status(200).json({ ok: true, results: { notion: "ok", notifyEmail: "ok", autoReply: "ok" } });
    }

    if (!email || !email.includes("@")) {
      return res.status(400).json({ error: "Valid email required" });
    }
    if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: "Valid email required" });
    }

    const userAgent = req.headers["user-agent"] || "";
    const results = { notion: null, notifyEmail: null, autoReply: null, capi: null, ghl: null };

    // --- Run integrations in parallel ---
    const [notionResult, capiResult, ghlResult] = await Promise.allSettled([
      // 1. Notion
      (async () => {
        if (!LEADS_DB || !process.env.NOTION_API_KEY) return "skipped (no DB ID or API key)";
        const properties = {
          Name: { title: [{ text: { content: (name || "Unknown").slice(0, 200) } }] },
          Email: { email: email.slice(0, 254) },
          "Lead Source": { select: { name: (source || "Website - Date Checker").slice(0, 100) } },
          Status: { select: { name: "New" } },
        };
        if (date) properties["Event Date"] = { date: { start: date } };
        if (guests) properties["Guest Count"] = { rich_text: [{ text: { content: guests } }] };
        if (phone) properties["Phone"] = { phone_number: phone.slice(0, 20) };
        // Store UTM data in Notion
        if (utm_source) properties["UTM Source"] = { rich_text: [{ text: { content: utm_source.slice(0, 100) } }] };
        if (utm_medium) properties["UTM Medium"] = { rich_text: [{ text: { content: utm_medium.slice(0, 100) } }] };
        if (utm_campaign) properties["UTM Campaign"] = { rich_text: [{ text: { content: utm_campaign.slice(0, 200) } }] };

        await notion.pages.create({ parent: { database_id: LEADS_DB }, properties });
        return "ok";
      })(),

      // 2. Meta Conversions API
      sendMetaCAPI({ email, name, ip, userAgent, sourceUrl: source_url, fbc, fbp }),

      // 3. GoHighLevel CRM
      sendToGHL({ name, email, phone, date, guests, source, utm_source, utm_medium, utm_campaign, utm_content, utm_term }),
    ]);

    results.notion = notionResult.status === "fulfilled" ? notionResult.value : `error: ${notionResult.reason?.message}`;
    results.capi = capiResult.status === "fulfilled" ? capiResult.value : `error: ${capiResult.reason?.message}`;
    results.ghl = ghlResult.status === "fulfilled" ? ghlResult.value : `error: ${ghlResult.reason?.message}`;

    // 4. Notification + auto-reply emails (sequential — both use Resend)
    const fromAddr = process.env.RESEND_FROM_EMAIL || "Stone House Bookings <bookings@stonehouse.io>";

    if (process.env.RESEND_API_KEY) {
      // Notification to bookings team
      try {
        const utmInfo = utm_source ? `\n<p style="color:#666;font-size:11px;margin-top:12px;"><strong>Attribution:</strong> ${utm_source || ""}/${utm_medium || ""}/${utm_campaign || ""}</p>` : "";
        await resend.emails.send({
          from: fromAddr,
          to: "bookings@stonehouse.io",
          subject: `New Lead: ${(name || "Unknown").slice(0, 50)} — ${(source || "Website").slice(0, 30)}`,
          html: `
            <h2>New Lead from stonehouse.io</h2>
            <p><strong>Name:</strong> ${name || "Not provided"}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
            <p><strong>Date:</strong> ${date || "Not specified"}</p>
            <p><strong>Guests:</strong> ${guests || "Not specified"}</p>
            <p><strong>Source:</strong> ${source || "Website"}</p>
            ${utmInfo}
            <p style="color:#888;font-size:12px;">Submitted ${new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles" })}</p>
          `,
        });
        results.notifyEmail = "ok";
      } catch (emailErr) {
        console.error("Notification email failed:", emailErr.message);
        results.notifyEmail = `error: ${emailErr.message}`;
      }

      // Auto-reply to the lead
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

    return res.status(200).json({ ok: true, results });
  } catch (err) {
    console.error("Lead API unexpected error:", err);
    return res.status(500).json({ error: "Internal error" });
  }
}
