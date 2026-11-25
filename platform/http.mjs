import { randomUUID } from "node:crypto";
import { validateEvent } from "./events.mjs";
import { validateTicketType } from "./tickets.mjs";
import { eventToFormValues, parseEventForm, bodyToParams } from "./form.mjs";
import { renderAdmin, renderCalendar, renderCheckout, renderEvent } from "./pages.mjs";
import { listEvents, saveEvent } from "./store.mjs";

const HTML = { "content-type": "text/html; charset=utf-8" };

function html(status, body, extra = {}) {
  return { status, headers: { ...HTML, ...extra }, body };
}

export async function handleCalendar({ host, slug = "", past = false, checkout = false }) {
  const events = await listEvents();
  if (!slug) {
    return html(200, renderCalendar({ host, events, past }), {
      "x-robots-tag": hostAllowsIndex(host) ? "index, follow" : "noindex, nofollow",
    });
  }
  const event = events.find((item) => item.slug === slug && item.status !== "draft");
  if (!event) {
    return html(404, "<!doctype html><title>Event not found</title><p>That event is not public.</p><p><a href=\"/calendar\">Calendar</a></p>");
  }
  const body = checkout ? renderCheckout({ host, event }) : renderEvent({ host, event });
  return html(200, body);
}

export async function handleAdmin({ method, host, body, queryId, local }) {
  if (!local) {
    return html(
      403,
      renderAdmin({
        host,
        events: [],
        values: eventToFormValues(null),
        notice: "Staff login is not connected on the hosted site yet. Open the admin from this computer with npm run dev:platform.",
      }),
      { "x-robots-tag": "noindex, nofollow" },
    );
  }

  const events = await listEvents();
  if (method === "GET") {
    const current = events.find((event) => event.id === queryId);
    return html(200, renderAdmin({ host, events, values: eventToFormValues(current || null) }), {
      "x-robots-tag": "noindex, nofollow",
    });
  }

  if (method !== "POST") return html(405, "Method not allowed", { "content-type": "text/plain; charset=utf-8" });

  const params = bodyToParams(body);
  const intent = params.get("intent") === "publish" ? "publish" : "draft";
  const parsed = parseEventForm(params);
  const existing = events.find((event) => event.id && event.id === parsed.input.id);
  const nextStatus =
    intent === "publish" || existing?.status === "published" ? "published" : "draft";
  const result = validateEvent(parsed.input, {
    mode: nextStatus === "published" ? "publish" : "draft",
    existing: events,
  });
  const draftTicketErrors = [];
  if (nextStatus !== "published") {
    parsed.input.ticketTypes.forEach((ticket, index) => {
      for (const error of validateTicketType(ticket, "draft").errors) {
        draftTicketErrors.push({ ...error, field: `ticketTypes.${index}.${error.field}` });
      }
    });
  }
  const errors = [...parsed.errors, ...result.errors, ...draftTicketErrors];
  if (errors.length) {
    return html(422, renderAdmin({ host, events, values: { ...parsed.values, status: existing?.status || "draft" }, errors }), {
      "x-robots-tag": "noindex, nofollow",
    });
  }

  const saved = {
    ...result.event,
    id: existing?.id || randomUUID(),
    status: nextStatus,
    ownerName: parsed.values.ownerName,
    updatedAt: new Date().toISOString(),
    createdAt: existing?.createdAt || new Date().toISOString(),
  };
  try {
    await saveEvent(saved);
  } catch {
    return html(
      500,
      renderAdmin({
        host,
        events,
        values: parsed.values,
        errors: [{ message: "The event could not be saved on this computer." }],
      }),
    );
  }
  return {
    status: 303,
    headers: { location: `/admin/events?id=${saved.id}` },
    body: "",
  };
}

function hostAllowsIndex(host) {
  const name = String(host ?? "").split(":")[0];
  return name === "stonehouse.io" || name === "www.stonehouse.io";
}

export function isLocalHost(host) {
  const name = String(host ?? "").split(":")[0];
  return name === "localhost" || name === "127.0.0.1";
}
