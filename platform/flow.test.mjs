import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { handleAdmin, handleCalendar } from "./http.mjs";

const ready = {
  title: "Night Owl",
  startsAt: "2026-12-11T20:00",
  endsAt: "2026-12-11T23:00",
  doorsAt: "2026-12-11T19:00",
  description: "Live music in the showroom.",
  performers: "Night Owl",
  ageRule: "All ages",
  accessibilityNotes: "Step-free entrance from the courtyard.",
  parkingNotes: "Street parking on Commercial Street.",
  refundPolicy: "All sales are final unless Stone House cancels or changes the date.",
  primaryAudience: "Nevada City music fans",
  marketingGoal: "Sell the room",
  adSpendBudget: "200.00",
  adEndsAt: "2026-12-11T19:00",
  heroImageUrl: "/assets/stone-house-logo.png",
  rightsConfirmed: "yes",
  ownerName: "Jordan",
  ticketName: "General admission",
  ticketPrice: "35.00",
  ticketFood: "no",
  ticketAlcohol: "no",
  ticketCapacity: "80",
  ticketSaleStart: "2026-11-01T09:00",
  ticketSaleEnd: "2026-12-11T19:00",
  intent: "publish",
};

test("a draft stays off the public calendar until it is published", async () => {
  const file = path.join(os.tmpdir(), `stone-house-events-${Date.now()}.json`);
  process.env.PLATFORM_DATA_FILE = file;
  try {
    const draft = await handleAdmin({
      method: "POST",
      host: "127.0.0.1:8787",
      body: new URLSearchParams({ ...ready, intent: "draft" }).toString(),
      queryId: "",
      local: true,
    });
    assert.equal(draft.status, 303);
    const id = new URL(draft.headers.location, "http://127.0.0.1").searchParams.get("id");

    const hidden = await handleCalendar({ host: "127.0.0.1:8787" });
    assert.equal(hidden.body.includes("Night Owl"), false);

    const published = await handleAdmin({
      method: "POST",
      host: "127.0.0.1:8787",
      body: new URLSearchParams({ ...ready, id, slug: "night-owl" }).toString(),
      queryId: "",
      local: true,
    });
    assert.equal(published.status, 303, published.body);

    const calendar = await handleCalendar({ host: "127.0.0.1:8787" });
    assert.match(calendar.body, /Night Owl/);
    assert.match(calendar.body, /From \$35\.00/);

    const page = await handleCalendar({ host: "127.0.0.1:8787", slug: "night-owl" });
    assert.match(page.body, /"price":"35.00"/);
    assert.match(page.body, /107 Sacramento Street/);

    const checkout = await handleCalendar({ host: "127.0.0.1:8787", slug: "night-owl", checkout: true });
    assert.match(checkout.body, /Card checkout is not open yet/);
    assert.doesNotMatch(checkout.body, /card number/i);
  } finally {
    delete process.env.PLATFORM_DATA_FILE;
    await fs.rm(file, { force: true });
  }
});

test("hosted admin stays closed until staff login exists", async () => {
  const result = await handleAdmin({
    method: "GET",
    host: "stone-house-nevada-city.vercel.app",
    body: "",
    queryId: "",
    local: false,
  });
  assert.equal(result.status, 403);
  assert.match(result.body, /Staff login is not connected/);
});
