import { escapeHtml, jsonLdScript } from "./html.mjs";
import { formatDollars } from "./money.mjs";
import { eventStructuredData } from "./structured-data.mjs";
import { formatWhen } from "./time.mjs";
import { STONE_HOUSE } from "./venue.mjs";
import { requiresAlcoholAgeGate } from "./tickets.mjs";

function robotsFor(host, { admin = false } = {}) {
  if (admin) return "noindex, nofollow";
  const name = String(host ?? "").split(":")[0];
  if (name === "stonehouse.io" || name === "www.stonehouse.io") return "index, follow";
  return "noindex, nofollow";
}

function layout({ title, description, canonical, robots, jsonLd = "", main }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(title)}</title>
<meta name="description" content="${escapeHtml(description)}">
<link rel="canonical" href="${escapeHtml(canonical)}">
<meta name="robots" content="${escapeHtml(robots)}">
<link rel="icon" href="/assets/favicon.ico" sizes="any">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400&family=Jost:wght@400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/calendar-page.css">
${jsonLd}
</head>
<body>
<a class="cal-skip" href="#content">Skip to content</a>
<header class="cal-nav">
  <a class="cal-brand" href="/">
    <img src="/assets/stone-house-logo.png" alt="" width="36" height="36">
    <span>Stone House</span>
  </a>
  <nav class="cal-nav-links" aria-label="Event pages">
    <a href="/calendar">Calendar</a>
    <a href="/events">Private events</a>
    <a href="/admin/events">Staff</a>
  </nav>
</header>
<main id="content">${main}</main>
<footer class="cal-foot">
  <p>107 Sacramento Street · Nevada City, California · Est. 1857</p>
  <p>Private buyouts stay on <a href="/events">Events</a>. Public music events are listed here.</p>
</footer>
</body>
</html>`;
}

function ticketFacts(ticket) {
  const bits = [formatDollars(ticket.priceCents)];
  if (ticket.includesFoodAndBeverage) {
    bits.push(
      `Includes ${ticket.includedItems}. Admission ${formatDollars(ticket.admissionCents)}, food and beverage ${formatDollars(ticket.foodAndBeverageCents)}.`,
    );
  }
  if (ticket.includesAlcohol) bits.push("Includes alcohol. Ads for this ticket stay 21+.");
  return bits.join(" ");
}

export function renderCalendar({ host, events, past = false }) {
  const upcoming = events.filter(isUpcoming);
  const archive = events.filter(isPast);
  const shown = past ? archive : upcoming;
  const cards = shown.length
    ? shown.map((event) => {
        const when = formatWhen(event.startsAt, event.timeZone || STONE_HOUSE.timeZone);
        const price = lowestPrice(event);
        return `<article class="cal-card">
          <a href="/calendar/${escapeHtml(event.slug)}">
            ${event.heroImageUrl ? `<img src="${escapeHtml(event.heroImageUrl)}" alt="">` : ""}
            <div>
              <p class="cal-kicker">${escapeHtml(when)}</p>
              <h2>${escapeHtml(event.title)}</h2>
              <p>${escapeHtml(event.performers || STONE_HOUSE.name)}</p>
              <p class="cal-price">${price ? escapeHtml(price) : "Tickets"} · ${escapeHtml(badge(event))}</p>
            </div>
          </a>
        </article>`;
      }).join("")
    : `<p class="cal-empty">${past ? "No past public events yet." : "No public music events are on sale yet."}</p>`;

  return layout({
    title: past ? "Past events — Stone House" : "Calendar — Stone House",
    description: "Public music events at Stone House Nevada City. Ticket prices include Stone House fees.",
    canonical: past ? "https://www.stonehouse.io/calendar/past" : "https://www.stonehouse.io/calendar",
    robots: robotsFor(host),
    main: `<section class="cal-wrap">
      <p class="cal-kicker">Public music</p>
      <h1>${past ? "Past events" : "Calendar"}</h1>
      <p class="cal-lede">One show at a time in the building. Prices include Stone House fees.</p>
      <p class="cal-switch"><a href="${past ? "/calendar" : "/calendar/past"}">${past ? "Upcoming" : "Past events"}</a></p>
      <div class="cal-list">${cards}</div>
    </section>`,
  });
}

export function renderEvent({ host, event }) {
  const zone = event.timeZone || STONE_HOUSE.timeZone;
  const pageUrl = `https://www.stonehouse.io/calendar/${event.slug}`;
  const data = eventStructuredData({
    pageUrl,
    event,
    venue: STONE_HOUSE,
    tickets: event.ticketTypes || [],
  });
  const tickets = (event.ticketTypes || [])
    .map((ticket) => `<li>
      <strong>${escapeHtml(ticket.name)}</strong>
      <span>${escapeHtml(formatDollars(ticket.priceCents))}</span>
      <p>${escapeHtml(ticketFacts(ticket))}</p>
      <p>${escapeHtml(String(ticket.capacity))} tickets · on sale ${escapeHtml(formatWhen(ticket.saleStartsAt, zone))}</p>
    </li>`)
    .join("");
  const status = event.status === "canceled" ? `<p class="cal-banner">This event is canceled. Tickets are refunded in full.</p>` : "";
  const alcohol = requiresAlcoholAgeGate(event.ticketTypes || [])
    ? `<p class="cal-note">This event includes alcohol. Related ads are limited to ages 21 and over.</p>`
    : "";

  return layout({
    title: `${event.title} — Stone House`,
    description: event.description,
    canonical: pageUrl,
    robots: robotsFor(host),
    jsonLd: jsonLdScript(data),
    main: `<article class="cal-event">
      ${event.heroImageUrl ? `<img class="cal-hero" src="${escapeHtml(event.heroImageUrl)}" alt="">` : ""}
      <div class="cal-wrap">
        ${status}
        <p class="cal-kicker">${escapeHtml(formatWhen(event.startsAt, zone))}</p>
        <h1>${escapeHtml(event.title)}</h1>
        <p class="cal-lede">${escapeHtml(event.performers)} · ${escapeHtml(STONE_HOUSE.name)}, ${escapeHtml(STONE_HOUSE.address)}</p>
        <p>Doors ${escapeHtml(formatWhen(event.doorsAt, zone))}</p>
        <p>${escapeHtml(event.description)}</p>
        <ul class="cal-facts">
          <li>Age: ${escapeHtml(event.ageRule)}</li>
          <li>Parking: ${escapeHtml(event.parkingNotes)}</li>
          <li>Access: ${escapeHtml(event.accessibilityNotes)}</li>
        </ul>
        ${alcohol}
        <h2>Tickets</h2>
        <ul class="cal-tickets">${tickets}</ul>
        <p class="cal-note">${escapeHtml(event.refundPolicy)}</p>
        <p><a class="cal-button" href="/calendar/${escapeHtml(event.slug)}/checkout">Continue to tickets</a></p>
      </div>
    </article>`,
  });
}

export function renderCheckout({ host, event }) {
  const pageUrl = `https://www.stonehouse.io/calendar/${event.slug}/checkout`;
  const tickets = (event.ticketTypes || [])
    .map(
      (ticket) => `<li><strong>${escapeHtml(ticket.name)}</strong> <span>${escapeHtml(formatDollars(ticket.priceCents))}</span>
        <p>${escapeHtml(ticketFacts(ticket))}</p></li>`,
    )
    .join("");
  return layout({
    title: `Tickets — ${event.title} — Stone House`,
    description: `Fee-inclusive tickets for ${event.title}. Card checkout is not open yet.`,
    canonical: pageUrl,
    robots: robotsFor(host),
    main: `<section class="cal-wrap">
      <p class="cal-kicker">Tickets</p>
      <h1>${escapeHtml(event.title)}</h1>
      <p class="cal-lede">Prices include Stone House fees. No service fee is added.</p>
      <ul class="cal-tickets">${tickets}</ul>
      <p class="cal-banner">Card checkout is not open yet. This page confirms the ticket and the price. Payment is the next phase.</p>
      <p><a href="/calendar/${escapeHtml(event.slug)}">Back to the event</a></p>
    </section>`,
  });
}

export function renderAdmin({ host, events, values, errors = [], notice = "" }) {
  const errorList = errors.length
    ? `<div class="cal-errors" role="alert"><p>Fix these before the page can go forward.</p><ul>${errors
        .map((error) => `<li>${escapeHtml(error.message)}</li>`)
        .join("")}</ul></div>`
    : "";
  const saved = events
    .map((event) => {
      const label = event.status === "published" ? "Public" : "Draft";
      return `<li><a href="/admin/events?id=${escapeHtml(event.id)}">${escapeHtml(event.title)}</a> <span>${label}</span></li>`;
    })
    .join("");
  const tickets = (values.tickets || []).map((ticket, index) => ticketFields(ticket, index)).join("");

  return layout({
    title: "Event admin — Stone House",
    description: "Staff event entry. Not for the public.",
    canonical: "https://www.stonehouse.io/admin/events",
    robots: robotsFor(host, { admin: true }),
    main: `<section class="cal-wrap cal-admin">
      <p class="cal-kicker">Staff</p>
      <h1>${values.id ? "Edit event" : "New music event"}</h1>
      <p class="cal-lede">This screen is on the event-platform branch. It does not change the live site until the branch is merged.</p>
      ${notice ? `<p class="cal-banner">${escapeHtml(notice)}</p>` : ""}
      ${errorList}
      <h2>Saved events</h2>
      <ul class="cal-saved">${saved || "<li>No events yet.</li>"}</ul>
      <form method="post" action="/admin/events">
        <input type="hidden" name="id" value="${escapeHtml(values.id)}">
        <input type="hidden" name="slug" value="${escapeHtml(values.slug)}">
        <label>Event name <input name="title" required value="${escapeHtml(values.title)}"></label>
        <label>Start <input type="datetime-local" name="startsAt" value="${escapeHtml(values.startsAt)}"></label>
        <label>End <input type="datetime-local" name="endsAt" value="${escapeHtml(values.endsAt)}"></label>
        <label>Doors <input type="datetime-local" name="doorsAt" value="${escapeHtml(values.doorsAt)}"></label>
        <label>Public description <textarea name="description" rows="4">${escapeHtml(values.description)}</textarea></label>
        <label>Performers or hosts <input name="performers" value="${escapeHtml(values.performers)}"></label>
        <label>Age rule
          <select name="ageRule">
            ${["All ages", "18+", "21+"].map((rule) => `<option${rule === values.ageRule ? " selected" : ""}>${escapeHtml(rule)}</option>`).join("")}
          </select>
        </label>
        <label>Accessibility <textarea name="accessibilityNotes" rows="2">${escapeHtml(values.accessibilityNotes)}</textarea></label>
        <label>Parking <textarea name="parkingNotes" rows="2">${escapeHtml(values.parkingNotes)}</textarea></label>
        <label>Refund policy <textarea name="refundPolicy" rows="4">${escapeHtml(values.refundPolicy)}</textarea></label>
        <label>Primary audience <input name="primaryAudience" value="${escapeHtml(values.primaryAudience)}"></label>
        <label>Marketing goal <input name="marketingGoal" value="${escapeHtml(values.marketingGoal)}"></label>
        <label>Approved ad budget in dollars <input name="adSpendBudget" inputmode="decimal" value="${escapeHtml(values.adSpendBudget)}"></label>
        <label>Ad end <input type="datetime-local" name="adEndsAt" value="${escapeHtml(values.adEndsAt)}"></label>
        <label>Hero image URL <input name="heroImageUrl" value="${escapeHtml(values.heroImageUrl)}" placeholder="https:// or /assets/..."></label>
        <label class="cal-check"><input type="checkbox" name="rightsConfirmed" value="yes"${values.rightsConfirmed ? " checked" : ""}> Photo rights are confirmed</label>
        <label>Event owner <input name="ownerName" value="${escapeHtml(values.ownerName)}"></label>
        <h2>Tickets</h2>
        <p class="cal-note">Enter one price. It already includes Stone House fees. If food and beverage is included, the two amounts must add up to that price.</p>
        <div id="tickets">${tickets}</div>
        <p><button type="button" id="add-ticket">Add ticket type</button></p>
        <div class="cal-actions">
          <button type="submit" name="intent" value="draft">Save draft</button>
          <button type="submit" name="intent" value="publish">Publish page</button>
        </div>
      </form>
    </section>
    <template id="ticket-template">${ticketFields(blankTicketValues(), 0)}</template>
    <script>
      document.getElementById("add-ticket").addEventListener("click", () => {
        const template = document.getElementById("ticket-template");
        document.getElementById("tickets").appendChild(template.content.cloneNode(true));
      });
    </script>`,
  });
}

function blankTicketValues() {
  return {
    name: "",
    price: "",
    includesFoodAndBeverage: "no",
    includedItems: "",
    admission: "",
    foodAndBeverage: "",
    includesAlcohol: "no",
    capacity: "",
    saleStartsAt: "",
    saleEndsAt: "",
  };
}

function ticketFields(ticket, index) {
  const food = ticket.includesFoodAndBeverage === "yes";
  const alcohol = ticket.includesAlcohol === "yes";
  return `<fieldset class="cal-ticket">
    <legend>Ticket ${index + 1}</legend>
    <label>Name <input name="ticketName" value="${escapeHtml(ticket.name)}"></label>
    <label>Fee-inclusive price <input name="ticketPrice" inputmode="decimal" value="${escapeHtml(ticket.price)}" placeholder="35.00"></label>
    <label>Includes food and beverage
      <select name="ticketFood">
        <option value="no"${food ? "" : " selected"}>No</option>
        <option value="yes"${food ? " selected" : ""}>Yes</option>
      </select>
    </label>
    <label>What is included <input name="ticketIncluded" value="${escapeHtml(ticket.includedItems)}"></label>
    <label>Admission amount <input name="ticketAdmission" inputmode="decimal" value="${escapeHtml(ticket.admission)}"></label>
    <label>Food and beverage amount <input name="ticketFoodAmount" inputmode="decimal" value="${escapeHtml(ticket.foodAndBeverage)}"></label>
    <label>Includes alcohol
      <select name="ticketAlcohol">
        <option value="no"${alcohol ? "" : " selected"}>No</option>
        <option value="yes"${alcohol ? " selected" : ""}>Yes</option>
      </select>
    </label>
    <label>Capacity <input name="ticketCapacity" inputmode="numeric" value="${escapeHtml(ticket.capacity)}"></label>
    <label>Sale start <input type="datetime-local" name="ticketSaleStart" value="${escapeHtml(ticket.saleStartsAt)}"></label>
    <label>Sale end <input type="datetime-local" name="ticketSaleEnd" value="${escapeHtml(ticket.saleEndsAt)}"></label>
  </fieldset>`;
}

function lowestPrice(event) {
  const prices = (event.ticketTypes || []).map((ticket) => ticket.priceCents).filter(Number.isInteger);
  if (!prices.length) return "";
  return `From ${formatDollars(Math.min(...prices))}`;
}

function badge(event) {
  if (event.status === "sold_out") return "Sold out";
  if (event.status === "canceled") return "Canceled";
  return "Tickets";
}

function isUpcoming(event) {
  if (event.status !== "published" && event.status !== "sold_out") return false;
  return new Date(event.endsAt).getTime() >= Date.now();
}

function isPast(event) {
  if (event.status === "draft") return false;
  if (event.status === "canceled" || event.status === "completed") return true;
  return new Date(event.endsAt).getTime() < Date.now();
}
