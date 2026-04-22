import { Client } from "@notionhq/client";
import { Resend } from "resend";

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const resend = new Resend(process.env.RESEND_API_KEY);
const LEADS_DB = process.env.NOTION_LEADS_DB_ID;

export default async function handler(req, res) {
  // CORS preflight
  if (req.method === "OPTIONS") {
    return res.status(200)
      .setHeader("Access-Control-Allow-Origin", "*")
      .setHeader("Access-Control-Allow-Methods", "POST, OPTIONS")
      .setHeader("Access-Control-Allow-Headers", "Content-Type")
      .end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  res.setHeader("Access-Control-Allow-Origin", "*");

  try {
    const { name, email, date, guests, source } = req.body;

    if (!email || !email.includes("@")) {
      return res.status(400).json({ error: "Valid email required" });
    }

    const results = { notion: null, notifyEmail: null, autoReply: null };

    // 1. Write to Notion leads database (non-blocking — don't kill the whole request)
    if (LEADS_DB && process.env.NOTION_API_KEY) {
      try {
        const properties = {
          Name: { title: [{ text: { content: name || "Unknown" } }] },
          Email: { email: email },
          "Lead Source": { select: { name: source || "Website - Date Checker" } },
          Status: { select: { name: "New" } },
        };
        if (date) {
          properties["Event Date"] = { date: { start: date } };
        }
        if (guests) {
          properties["Guest Count"] = { number: Number(guests) || null };
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
          subject: `New Lead: ${name || "Unknown"} — ${source || "Website"}`,
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
              <p>Hi ${name || "there"},</p>
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
    return res.status(500).json({ error: "Internal error", detail: err.message });
  }
}
