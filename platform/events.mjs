import { slugify, assertSlug } from "./slug.mjs";
import { validateTicketType } from "./tickets.mjs";

const PUBLISH_FIELDS = [
  ["eventType", "Event type is required."],
  ["venueName", "Venue is required."],
  ["startsAt", "Start time is required."],
  ["endsAt", "End time is required."],
  ["doorsAt", "Door time is required."],
  ["timeZone", "Time zone is required."],
  ["description", "Public description is required."],
  ["performers", "Performers or hosts are required."],
  ["ageRule", "Age rule is required."],
  ["accessibilityNotes", "Accessibility notes are required."],
  ["parkingNotes", "Parking notes are required."],
  ["refundPolicy", "Refund policy is required."],
  ["primaryAudience", "Primary audience is required."],
  ["marketingGoal", "Marketing goal is required."],
  ["adEndsAt", "Ad end time is required."],
  ["heroImageUrl", "An approved hero image is required."],
  ["ownerUserId", "An event owner is required."],
];

function blank(value) {
  return String(value ?? "").trim() === "";
}

export function prepareEvent(input) {
  const title = String(input?.title ?? "").trim();
  const slug = slugify(input?.slug || title);
  return { ...input, title, slug };
}

export function findDuplicate(event, existing = []) {
  const title = event.title.trim().toLowerCase();
  return (
    existing.find((item) => {
      if (item.id && event.id && item.id === event.id) return false;
      if (item.slug === event.slug) return true;
      return (
        item.venueId === event.venueId &&
        item.startsAt === event.startsAt &&
        String(item.title ?? "").trim().toLowerCase() === title
      );
    }) ?? null
  );
}

export function validateEvent(input, { mode = "draft", existing = [] } = {}) {
  const event = prepareEvent(input);
  const errors = [];

  if (!event.title) {
    errors.push({ field: "title", message: "Event name is required." });
  }

  const slugCheck = assertSlug(
    event.slug,
    existing
      .filter((item) => !(item.id && event.id && item.id === event.id))
      .map((item) => item.slug)
      .filter(Boolean),
  );
  if (event.title) errors.push(...slugCheck.errors);

  const duplicate = event.title ? findDuplicate(event, existing) : null;
  if (duplicate) {
    errors.push({
      field: "title",
      message: "An event with this name, venue, and start time already exists.",
    });
  }

  if (!Number.isInteger(event.adSpendBudgetCents) || event.adSpendBudgetCents < 0) {
    errors.push({
      field: "adSpendBudgetCents",
      message: "Ad spend budget must be zero or a positive amount in cents.",
    });
  }

  if (mode === "publish") {
    for (const [field, message] of PUBLISH_FIELDS) {
      if (blank(event[field])) errors.push({ field, message });
    }
    if (event.rightsConfirmed !== true) {
      errors.push({
        field: "rightsConfirmed",
        message: "Confirm photo rights before publishing.",
      });
    }
    if (event.startsAt && event.endsAt && new Date(event.endsAt) <= new Date(event.startsAt)) {
      errors.push({ field: "endsAt", message: "End time must be after the start time." });
    }
    if (event.startsAt && event.doorsAt && new Date(event.doorsAt) > new Date(event.startsAt)) {
      errors.push({ field: "doorsAt", message: "Door time must be at or before the start time." });
    }
    const tickets = Array.isArray(event.ticketTypes) ? event.ticketTypes : [];
    if (tickets.length === 0) {
      errors.push({ field: "ticketTypes", message: "Add at least one ticket type." });
    }
    tickets.forEach((ticket, index) => {
      const result = validateTicketType(ticket, "publish");
      for (const error of result.errors) {
        errors.push({ ...error, field: `ticketTypes.${index}.${error.field}` });
      }
    });
  }

  return { ok: errors.length === 0, errors, event };
}
