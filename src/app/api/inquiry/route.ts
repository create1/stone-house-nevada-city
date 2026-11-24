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

interface InquiryPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  eventType: string;
  space: string;
  eventDate: string;
  guestCount: string;
  budget: string;
  hearAboutUs: string;
  message: string;
  requestTour: boolean;
}

export async function POST(request: Request) {
  try {
    const body: InquiryPayload = await request.json();

    // Basic server-side validation
    if (!body.firstName?.trim() || !body.lastName?.trim()) {
      return NextResponse.json(
        { error: "First and last name are required" },
        { status: 400 },
      );
    }
    if (!body.email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
      return NextResponse.json(
        { error: "A valid email is required" },
        { status: 400 },
      );
    }
    if (!body.eventType?.trim()) {
      return NextResponse.json(
        { error: "Event type is required" },
        { status: 400 },
      );
    }
    if (!body.message?.trim()) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 },
      );
    }

    const fullName = `${body.firstName} ${body.lastName}`;
    const notion = getNotion();
    const resend = getResend();

    // Build notes from message + metadata
    const notesContent = [
      body.message,
      body.hearAboutUs ? `\nHow heard: ${body.hearAboutUs}` : "",
      body.requestTour ? "\nTour requested: Yes" : "",
    ]
      .filter(Boolean)
      .join("")
      .slice(0, 2000);

    // ── Create Notion lead ──────────────────────
    // Schema matches existing Stonehouse Leads database
    await notion.pages.create({
      parent: { database_id: LEADS_DB },
      properties: {
        Name: { title: [{ text: { content: fullName } }] },
        Email: { email: body.email },
        Phone: { phone_number: body.phone || null },
        "Event Type": { select: { name: body.eventType } },
        Space: body.space ? { select: { name: body.space } } : { select: null },
        "Event Date": body.eventDate
          ? { date: { start: body.eventDate } }
          : { date: null },
        "Guest Count": {
          number: body.guestCount ? parseInt(body.guestCount, 10) : null,
        },
        Budget: {
          number: body.budget ? parseFloat(body.budget.replace(/[^0-9.]/g, "")) : null,
        },
        Notes: {
          rich_text: [{ text: { content: notesContent } }],
        },
        "Lead Source": { select: { name: "Website" } },
        Status: { select: { name: "New" } },
      },
    });

    // ── Send notification to bookings@stonehouse.io ──
    await resend.emails.send({
      // TODO: Switch to admin@stonehouse.io once domain is verified in Resend
      from: "Stonehouse Website <onboarding@resend.dev>",
      to: "bookings@stonehouse.io",
      subject: `New Inquiry: ${fullName} — ${body.eventType}`,
      html: `
        <h2>New Event Inquiry</h2>
        <table style="border-collapse:collapse;width:100%;max-width:600px">
          <tr><td style="padding:8px;font-weight:bold">Name</td><td style="padding:8px">${fullName}</td></tr>
          <tr><td style="padding:8px;font-weight:bold">Email</td><td style="padding:8px">${body.email}</td></tr>
          <tr><td style="padding:8px;font-weight:bold">Phone</td><td style="padding:8px">${body.phone || "—"}</td></tr>
          <tr><td style="padding:8px;font-weight:bold">Event Type</td><td style="padding:8px">${body.eventType}</td></tr>
          <tr><td style="padding:8px;font-weight:bold">Space</td><td style="padding:8px">${body.space || "—"}</td></tr>
          <tr><td style="padding:8px;font-weight:bold">Date</td><td style="padding:8px">${body.eventDate || "—"}</td></tr>
          <tr><td style="padding:8px;font-weight:bold">Guests</td><td style="padding:8px">${body.guestCount || "—"}</td></tr>
          <tr><td style="padding:8px;font-weight:bold">Budget</td><td style="padding:8px">${body.budget || "—"}</td></tr>
          <tr><td style="padding:8px;font-weight:bold">How Heard</td><td style="padding:8px">${body.hearAboutUs || "—"}</td></tr>
          <tr><td style="padding:8px;font-weight:bold">Tour?</td><td style="padding:8px">${body.requestTour ? "Yes" : "No"}</td></tr>
        </table>
        <h3>Message</h3>
        <p>${body.message.replace(/\n/g, "<br>")}</p>
      `,
    });

    // ── Send confirmation to the lead ───────────
    await resend.emails.send({
      // TODO: Switch to admin@stonehouse.io once domain is verified in Resend
      from: "Stonehouse <onboarding@resend.dev>",
      to: body.email,
      subject: "We received your inquiry — Stonehouse",
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
          <h2 style="color:#0A0A0A">Thank you, ${body.firstName}!</h2>
          <p>We've received your inquiry about hosting a <strong>${body.eventType}</strong> at Stonehouse.</p>
          <p>Our team will review the details and get back to you within <strong>24 hours</strong> with availability and next steps.</p>
          ${body.requestTour ? "<p>We noted you'd like to schedule a tour — we'll include available times in our response.</p>" : ""}
          <hr style="border:none;border-top:1px solid #E8E0D5;margin:24px 0">
          <p style="color:#666;font-size:14px">
            <strong>Stonehouse</strong><br>
            107 Sacramento St, Nevada City, CA 95959<br>
            (530) 265-5050 &middot; bookings@stonehouse.io
          </p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Inquiry submission error:", error);
    return NextResponse.json(
      { error: "Failed to submit inquiry. Please try again or contact us directly." },
      { status: 500 },
    );
  }
}
