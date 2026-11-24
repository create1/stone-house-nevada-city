import { NextResponse } from "next/server";
import { Client } from "@notionhq/client";
import { Resend } from "resend";

function getNotion() {
  return new Client({ auth: process.env.NOTION_API_KEY });
}

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

// Stonehouse Leads database in Notion
const LEADS_DB = "899cfc177f8140c0bbd8117b68224e96";

interface LeadPayload {
  email: string;
  name?: string;
  eventDate?: string;
  source: string;
  asset: string;
}

export async function POST(request: Request) {
  try {
    const body: LeadPayload = await request.json();

    if (!body.email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
      return NextResponse.json({ error: "Valid email required" }, { status: 400 });
    }

    const notion = getNotion();

    // Create lead in existing Stonehouse Leads database
    await notion.pages.create({
      parent: { database_id: LEADS_DB },
      properties: {
        Name: { title: [{ text: { content: body.name || body.email } }] },
        Email: { email: body.email },
        "Lead Source": { select: { name: "Website" } },
        Status: { select: { name: "New" } },
        Notes: {
          rich_text: [
            {
              text: {
                content: `Lead capture: ${body.source} — ${body.asset}`,
              },
            },
          ],
        },
        ...(body.eventDate
          ? { "Event Date": { date: { start: body.eventDate } } }
          : {}),
      },
    });

    // Send the pricing guide if that's the asset requested
    if (body.asset === "pricing-guide") {
      const resend = getResend();
      await resend.emails.send({
        // TODO: Switch to admin@stonehouse.io once domain is verified in Resend
        from: "Stonehouse <onboarding@resend.dev>",
        to: body.email,
        subject: "Your 2026 Pricing Guide — Stonehouse",
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
            <h2 style="color:#0A0A0A">Here's your pricing guide</h2>
            <p>Thank you for your interest in Stonehouse! Attached is our 2026 pricing guide with venue rental rates, catering packages, and bar options.</p>
            <p>Ready to plan your event? <a href="https://stonehouse.io/inquiry" style="color:#C9A84C">Book a tour</a> or reply to this email with any questions.</p>
            <hr style="border:none;border-top:1px solid #E8E0D5;margin:24px 0">
            <p style="color:#666;font-size:14px">
              <strong>Stonehouse</strong><br>
              107 Sacramento St, Nevada City, CA 95959<br>
              (530) 265-5050
            </p>
          </div>
        `,
        // TODO: Attach actual PDF when hosted on Vercel Blob
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Lead capture error:", error);
    return NextResponse.json(
      { error: "Failed to capture lead" },
      { status: 500 },
    );
  }
}
