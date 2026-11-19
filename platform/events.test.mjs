import assert from "node:assert/strict";
import test from "node:test";
import { validateEvent } from "./events.mjs";

const ready = {
  title: "Night Owl",
  eventType: "music",
  venueId: "venue-1",
  venueName: "Stone House",
  startsAt: "2026-12-12T04:00:00.000Z",
  endsAt: "2026-12-12T08:00:00.000Z",
  doorsAt: "2026-12-12T03:00:00.000Z",
  timeZone: "America/Los_Angeles",
  description: "An evening of live music in the showroom.",
  performers: "Night Owl",
  ageRule: "All ages",
  accessibilityNotes: "Step-free entrance from the courtyard.",
  parkingNotes: "Street parking on Commercial Street.",
  refundPolicy: "All sales are final unless Stone House cancels or changes the date.",
  primaryAudience: "Public music listeners",
  marketingGoal: "Sell out the showroom",
  adSpendBudgetCents: 20000,
  adEndsAt: "2026-12-12T03:00:00.000Z",
  heroImageUrl: "https://stonehouse.io/assets/hero.jpg",
  rightsConfirmed: true,
  ownerUserId: "user-1",
  ticketTypes: [
    {
      name: "General admission",
      priceCents: 3500,
      includesFoodAndBeverage: false,
      taxProfile: "admission",
      capacity: 80,
      saleStartsAt: "2026-11-01T00:00:00.000Z",
      saleEndsAt: "2026-12-12T03:00:00.000Z",
    },
  ],
};

test("a draft needs a name and a valid budget", () => {
  const missing = validateEvent({ title: "", adSpendBudgetCents: 0 });
  assert.equal(missing.ok, false);

  const draft = validateEvent({ title: "Night Owl", adSpendBudgetCents: 0 });
  assert.equal(draft.ok, true);
  assert.equal(draft.event.slug, "night-owl");
});

test("publish requires the event facts, rights, and a valid ticket", () => {
  const result = validateEvent(ready, { mode: "publish" });
  assert.equal(result.ok, true, JSON.stringify(result.errors));
});

test("publish blocks a missing hero and unconfirmed photo rights", () => {
  const result = validateEvent(
    { ...ready, heroImageUrl: "", rightsConfirmed: false, ticketTypes: [] },
    { mode: "publish" },
  );
  assert.equal(result.ok, false);
  assert.ok(result.errors.some((error) => error.field === "heroImageUrl"));
  assert.ok(result.errors.some((error) => error.field === "rightsConfirmed"));
  assert.ok(result.errors.some((error) => error.field === "ticketTypes"));
});

test("duplicate name, venue, and start time is rejected", () => {
  const result = validateEvent(ready, {
    mode: "draft",
    existing: [{ id: "other", ...ready }],
  });
  assert.equal(result.ok, false);
  assert.ok(result.errors.some((error) => error.field === "title"));
});
