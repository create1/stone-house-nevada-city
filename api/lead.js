import fs from "node:fs";
import path from "node:path";
import { Client } from "@notionhq/client";
import { Resend } from "resend";

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const resend = new Resend(process.env.RESEND_API_KEY);
const LEADS_DB = process.env.NOTION_LEADS_DB_ID;

function findWeddingPdf() {
  const fileName = "wedding-pricing-pamphlet.pdf";
  const candidates = [
    path.join(process.cwd(), "assets", fileName),
    path.join(process.cwd(), "dist", "assets", fileName),
    path.join(process.cwd(), "..", "assets", fileName),
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

function getWeddingPdfAttachment() {
  const filePath = findWeddingPdf();
  if (!filePath) return null;
  try {
    return {
      filename: "Stone-House-Wedding-Pricing-Pamphlet.pdf",
      content: fs.readFileSync(filePath),
    };
  } catch {
    return null;
  }
}

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
  // Local preview
  if (origin.match(/^https?:\/\/(127\.0\.0\.1|localhost)(:\d+)?$/)) return origin;
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

/** Pamphlet PDF URL only after a successful lead POST (not in static HTML). */
function getPamphletDownloadUrl(source) {
  if (!/pricing pamphlet/i.test(source || "")) return null;
  if (/holiday|corporate|private events/i.test(source)) {
    return "https://services.msgsndr.com/urls/l/NltM0ui95a";
  }
  const base = "https://www.stonehouse.io/api/pamphlet";
  const key = process.env.PAMPHLET_DOWNLOAD_KEY;
  return key ? `${base}?k=${encodeURIComponent(key)}` : base;
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
    const {
      name,
      phone,
      email,
      source,
      preferredDate,
      backupDate,
      guestCount,
      occasion,
      notes,
      _honeypot,
    } = req.body;

    // Honeypot — if this hidden field has a value, it's a bot
    if (_honeypot) {
      // Return 200 so bots think it worked, but do nothing
      return res.status(200).json({ ok: true, results: { notion: "ok", notifyEmail: "ok", autoReply: "ok" } });
    }

    const cleanName = String(name || "").trim().slice(0, 200);
    const cleanPhone = String(phone || "").trim().slice(0, 40);
    const cleanEmail = String(email || "").trim().slice(0, 254);
    const phoneDigits = cleanPhone.replace(/\D/g, "");
    const cleanPreferred = String(preferredDate || "").trim().slice(0, 40);
    const cleanBackup = String(backupDate || "").trim().slice(0, 40);
    const cleanGuests = String(guestCount || "").trim().slice(0, 20);
    const cleanOccasion = String(occasion || "").trim().slice(0, 80);
    const cleanNotes = String(notes || "").trim().slice(0, 1200);
    const cleanSource = String(source || "Website - Contact Form").trim().slice(0, 100);
    const downloadUrl = getPamphletDownloadUrl(cleanSource);

    if (!cleanName) {
      return res.status(400).json({ error: "Name required" });
    }
    if (!cleanEmail || cleanEmail.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return res.status(400).json({ error: "Valid email required" });
    }
    if (phoneDigits.length > 0 && (phoneDigits.length < 10 || phoneDigits.length > 15)) {
      return res.status(400).json({ error: "Valid phone required" });
    }
    // Date checks only when a preferred date is supplied (Check Your Date form)
    if (cleanPreferred && !/^\d{4}-\d{2}-\d{2}$/.test(cleanPreferred)) {
      return res.status(400).json({ error: "Valid preferred date required" });
    }
    if (cleanBackup && !/^\d{4}-\d{2}-\d{2}$/.test(cleanBackup)) {
      return res.status(400).json({ error: "Valid backup date required" });
    }

    const dateSummary = [
      cleanPreferred ? `Preferred: ${cleanPreferred}` : null,
      cleanBackup ? `Backup: ${cleanBackup}` : null,
      cleanGuests ? `Guests: ${cleanGuests}` : null,
      cleanOccasion ? `Occasion: ${cleanOccasion}` : null,
      cleanNotes ? `Notes: ${cleanNotes}` : null,
    ]
      .filter(Boolean)
      .join("\n");

    const results = { notion: null, notifyEmail: null, autoReply: null };

    // 1. Write to Notion leads database (non-blocking — don't kill the whole request)
    if (LEADS_DB && process.env.NOTION_API_KEY) {
      try {
        const baseProps = {
          Name: { title: [{ text: { content: cleanName } }] },
          Email: { email: cleanEmail },
          "Lead Source": { select: { name: cleanSource } },
          Status: { select: { name: "New" } },
        };

        // Prefer Phone as phone_number; fall back to rich text; then omit if column missing
        // Optionally include a Notes/Details rich_text field when the DB has one
        const withPhone = phoneDigits.length
          ? [
              { ...baseProps, Phone: { phone_number: cleanPhone } },
              { ...baseProps, Phone: { rich_text: [{ text: { content: cleanPhone } }] } },
              baseProps,
            ]
          : [baseProps];
        const noteProps = dateSummary
          ? [
              { Notes: { rich_text: [{ text: { content: dateSummary.slice(0, 2000) } }] } },
              { Details: { rich_text: [{ text: { content: dateSummary.slice(0, 2000) } }] } },
              { Message: { rich_text: [{ text: { content: dateSummary.slice(0, 2000) } }] } },
              {},
            ]
          : [{}];

        let written = false;
        let lastErr = null;
        for (const phoneSet of withPhone) {
          for (const extra of noteProps) {
            try {
              await notion.pages.create({
                parent: { database_id: LEADS_DB },
                properties: { ...phoneSet, ...extra },
              });
              written = true;
              results.notion = phoneSet.Phone ? "ok" : "ok (phone not mapped in Notion)";
              break;
            } catch (err) {
              lastErr = err;
            }
          }
          if (written) break;
        }
        if (!written) {
          throw lastErr || new Error("Notion write failed");
        }
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
          subject: `New Lead: ${cleanName.slice(0, 50)} — ${cleanSource.slice(0, 40)}`,
          html: `
            <h2>New Lead from stonehouse.io</h2>
            <p><strong>Name:</strong> ${cleanName}</p>
            <p><strong>Phone:</strong> ${cleanPhone}</p>
            <p><strong>Email:</strong> ${cleanEmail}</p>
            ${cleanPreferred ? `<p><strong>Preferred date:</strong> ${cleanPreferred}</p>` : ""}
            ${cleanBackup ? `<p><strong>Backup date:</strong> ${cleanBackup}</p>` : ""}
            ${cleanGuests ? `<p><strong>Guest count:</strong> ${cleanGuests}</p>` : ""}
            ${cleanOccasion ? `<p><strong>Occasion:</strong> ${cleanOccasion}</p>` : ""}
            ${cleanNotes ? `<p><strong>Notes:</strong> ${cleanNotes.replace(/\n/g, "<br>")}</p>` : ""}
            <p><strong>Source:</strong> ${cleanSource}</p>
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
        const isPamphletLead = !!downloadUrl;
        const isWeddingPamphlet =
          isPamphletLead && !/holiday|corporate|private events/i.test(cleanSource);
        const firstName = cleanName.split(/\s+/)[0] || "there";
        const weddingAttachment = isWeddingPamphlet ? getWeddingPdfAttachment() : null;

        let bodyHtml;
        if (cleanPreferred) {
          bodyHtml = `<p>We received your request for <strong>${cleanPreferred}</strong>${cleanBackup ? ` (backup: ${cleanBackup})` : ""} and will confirm availability shortly.</p>
              <p>Our team will let you know if your date is available and share next steps.</p>`;
        } else if (isWeddingPamphlet) {
          bodyHtml = `
              <p style="font-size:16px;line-height:1.6;color:#5a5347;">Thank you for your interest in celebrating at Stone House. Your <em>Wedding Pricing Pamphlet</em> is attached${downloadUrl ? " — and you can also open it anytime with the button below" : ""}.</p>
              <p style="font-size:16px;line-height:1.6;color:#5a5347;">Inside you’ll find packages, rates, amenities, and a feel for the full private-buyout experience at our historic 1857 venue in Nevada City.</p>
              ${
                downloadUrl
                  ? `<p style="text-align:center;margin:32px 0;"><a href="${downloadUrl}" style="display:inline-block;background:#9a7d42;color:#ffffff;text-decoration:none;padding:14px 28px;border-radius:4px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:13px;letter-spacing:0.12em;text-transform:uppercase;">Open the Pamphlet</a></p>`
                  : ""
              }
              <p style="font-size:16px;line-height:1.6;color:#5a5347;">When you’re ready, reply to this email or inquire for a tour — we’d love to walk you through the spaces.</p>`;
        } else if (isPamphletLead) {
          bodyHtml = `<p>Thanks for requesting pricing — your pamphlet is ready below. Our team is also here if you'd like help planning dates or a tour.</p>
              <p><a href="${downloadUrl}" style="color:#C9A84C;">Open your pricing pamphlet →</a></p>`;
        } else {
          bodyHtml = `<p>We've received your inquiry and our team will respond within 24 hours with pricing and next steps.</p>`;
        }

        await resend.emails.send({
          from: fromAddr,
          to: cleanEmail,
          subject: cleanPreferred
            ? "Stone House — we've received your date request"
            : isWeddingPamphlet
              ? "Your Stone House Wedding Pricing Pamphlet"
              : isPamphletLead
                ? "Your Stone House pricing pamphlet"
                : "Thanks for your interest in Stone House — we'll be in touch!",
          attachments: weddingAttachment ? [weddingAttachment] : undefined,
          html: `
            <div style="font-family:Georgia,'Times New Roman',serif;max-width:600px;margin:0 auto;color:#1a1714;background:#faf7f2;padding:0;">
              <div style="background:#1a1714;padding:28px 32px;text-align:center;">
                <p style="margin:0;font-size:11px;letter-spacing:0.28em;text-transform:uppercase;color:#c9a86a;">Stone House</p>
                <p style="margin:8px 0 0;font-size:12px;letter-spacing:0.14em;text-transform:uppercase;color:rgba(245,240,232,0.65);">Nevada City · Est. 1857</p>
              </div>
              <div style="padding:36px 32px 28px;">
                <p style="font-size:16px;line-height:1.6;color:#1a1714;margin:0 0 16px;">Hi ${firstName.slice(0, 60)},</p>
                ${bodyHtml}
                <p style="margin-top:28px;font-size:15px;line-height:1.6;color:#1a1714;">Warm regards,<br><strong>The Stone House Team</strong><br>107 Sacramento Street, Nevada City<br><a href="tel:+15302655050" style="color:#9a7d42;text-decoration:none;">(530) 265-5050</a> · <a href="https://www.stonehouse.io" style="color:#9a7d42;text-decoration:none;">stonehouse.io</a></p>
              </div>
              <div style="padding:16px 32px 28px;border-top:1px solid rgba(154,125,66,0.2);text-align:center;">
                <p style="margin:0;font-size:12px;color:#8a8278;line-height:1.5;">Private buyouts only · One celebration at a time</p>
              </div>
            </div>
          `,
        });
        results.autoReply = "ok";
        if (weddingAttachment) results.pdfAttached = "ok";
      } catch (replyErr) {
        console.error("Auto-reply email failed:", replyErr.message);
        results.autoReply = `error: ${replyErr.message}`;
      }
    } else {
      results.notifyEmail = "skipped (no API key)";
      results.autoReply = "skipped (no API key)";
    }

    // Return 200 with details — the lead was captured even if some steps failed.
    // Pamphlet landers only show the download link using downloadUrl from this response.
    if (downloadUrl) {
      res.setHeader(
        "Set-Cookie",
        "sh_pamphlet_wedding=1; Path=/; Max-Age=86400; SameSite=Lax"
      );
    }
    return res.status(200).json({ ok: true, results, ...(downloadUrl ? { downloadUrl } : {}) });
  } catch (err) {
    console.error("Lead API unexpected error:", err);
    return res.status(500).json({ error: "Internal error" });
  }
}
