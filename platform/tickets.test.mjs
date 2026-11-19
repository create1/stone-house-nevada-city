import assert from "node:assert/strict";
import test from "node:test";
import { requiresAlcoholAgeGate, validateTicketType } from "./tickets.mjs";

const publishWindow = {
  capacity: 120,
  saleStartsAt: "2026-11-01T00:00:00.000Z",
  saleEndsAt: "2026-12-01T00:00:00.000Z",
};

test("a fee-inclusive ticket publishes with no service fee", () => {
  const result = validateTicketType(
    {
      name: "General admission",
      priceCents: 4500,
      serviceFeeCents: 0,
      includesFoodAndBeverage: false,
      taxProfile: "admission",
      ...publishWindow,
    },
    "publish",
  );
  assert.equal(result.ok, true);
});

test("a service fee is rejected", () => {
  const result = validateTicketType({
    name: "General admission",
    priceCents: 4500,
    serviceFeeCents: 300,
  });
  assert.equal(result.ok, false);
  assert.ok(result.errors.some((error) => error.field === "serviceFeeCents"));
});

test("food and beverage tickets require the included items and a split that matches the price", () => {
  const missing = validateTicketType({
    name: "Dinner and show",
    priceCents: 8500,
    includesFoodAndBeverage: true,
  });
  assert.equal(missing.ok, false);

  const mismatched = validateTicketType({
    name: "Dinner and show",
    priceCents: 8500,
    includesFoodAndBeverage: true,
    includedItems: "Family-style dinner and one drink",
    admissionCents: 4000,
    foodAndBeverageCents: 4000,
    taxProfile: "split",
    ...publishWindow,
  }, "publish");
  assert.equal(mismatched.ok, false);

  const matched = validateTicketType({
    name: "Dinner and show",
    priceCents: 8500,
    includesFoodAndBeverage: true,
    includedItems: "Family-style dinner and one drink",
    admissionCents: 4500,
    foodAndBeverageCents: 4000,
    includesAlcohol: true,
    taxProfile: "split",
    ...publishWindow,
  }, "publish");
  assert.equal(matched.ok, true);
});

test("alcohol tickets require 21+ ad targeting", () => {
  assert.equal(requiresAlcoholAgeGate([{ includesAlcohol: false }, { includesAlcohol: true }]), true);
  assert.equal(requiresAlcoholAgeGate([{ includesAlcohol: false }]), false);
});
