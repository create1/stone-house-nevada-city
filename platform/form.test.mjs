import assert from "node:assert/strict";
import test from "node:test";
import { dollarsToCents } from "./money.mjs";
import { isoToZonedInput, zonedToIso } from "./time.mjs";
import { parseEventForm } from "./form.mjs";

test("dollar fields become fee-inclusive cents", () => {
  assert.equal(dollarsToCents("35"), 3500);
  assert.equal(dollarsToCents("$35.50"), 3550);
  assert.equal(dollarsToCents("35.501"), null);
});

test("event times are stored in Pacific time", () => {
  const iso = zonedToIso("2026-12-11T20:00", "America/Los_Angeles");
  assert.equal(iso, "2026-12-12T04:00:00.000Z");
  assert.equal(isoToZonedInput(iso, "America/Los_Angeles"), "2026-12-11T20:00");
});

test("a food and beverage ticket keeps both amounts", () => {
  const params = new URLSearchParams({
    title: "Night Owl",
    adSpendBudget: "0",
    ticketName: "Dinner and show",
    ticketPrice: "85.00",
    ticketFood: "yes",
    ticketIncluded: "Family-style dinner",
    ticketAdmission: "45.00",
    ticketFoodAmount: "40.00",
    ticketAlcohol: "yes",
    ticketCapacity: "80",
    ticketSaleStart: "2026-11-01T09:00",
    ticketSaleEnd: "2026-12-11T19:00",
  });
  const parsed = parseEventForm(params);
  assert.equal(parsed.errors.length, 0);
  assert.equal(parsed.input.ticketTypes[0].priceCents, 8500);
  assert.equal(parsed.input.ticketTypes[0].admissionCents, 4500);
  assert.equal(parsed.input.ticketTypes[0].foodAndBeverageCents, 4000);
  assert.equal(parsed.input.ticketTypes[0].taxProfile, "split");
  assert.equal(parsed.input.ticketTypes[0].includesAlcohol, true);
});
