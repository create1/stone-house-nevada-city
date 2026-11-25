import assert from "node:assert/strict";
import test from "node:test";
import { eventStructuredData } from "./structured-data.mjs";

test("structured data uses the fee-inclusive price and the venue address", () => {
  const data = eventStructuredData({
    pageUrl: "https://stonehouse.io/calendar/night-owl",
    event: {
      title: "Night Owl",
      status: "published",
      startsAt: "2026-12-12T04:00:00.000Z",
      endsAt: "2026-12-12T08:00:00.000Z",
      description: "Live music.",
      performers: "Night Owl, The Pines",
      heroImageUrl: "https://stonehouse.io/assets/hero.jpg",
    },
    venue: {
      name: "Stone House",
      address: "107 Sacramento Street",
    },
    tickets: [
      {
        name: "General admission",
        priceCents: 3500,
        saleStartsAt: "2026-11-01T00:00:00.000Z",
      },
    ],
  });

  assert.equal(data["@type"], "Event");
  assert.equal(data.name, "Night Owl");
  assert.equal(data.startDate, "2026-12-12T04:00:00.000Z");
  assert.equal(data.location["@type"], "Place");
  assert.equal(data.location.address.streetAddress, "107 Sacramento Street");
  assert.equal(data.offers[0].price, "35.00");
  assert.equal(data.offers[0].priceCurrency, "USD");
  assert.equal(data.performer.length, 2);
  assert.equal(data.eventStatus, "https://schema.org/EventScheduled");
});

test("a canceled event stays marked canceled for search", () => {
  const data = eventStructuredData({
    pageUrl: "https://stonehouse.io/calendar/night-owl",
    event: {
      title: "Night Owl",
      status: "canceled",
      startsAt: "2026-12-12T04:00:00.000Z",
      description: "Canceled.",
      performers: "",
    },
    venue: { name: "Stone House", address: "107 Sacramento Street" },
    tickets: [],
  });
  assert.equal(data.eventStatus, "https://schema.org/EventCancelled");
});
