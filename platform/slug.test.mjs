import assert from "node:assert/strict";
import test from "node:test";
import { assertSlug, slugify } from "./slug.mjs";

test("slugify makes a calendar link from an event name", () => {
  assert.equal(slugify("Night Owl & The Pines"), "night-owl-and-the-pines");
  assert.equal(slugify("  Café Session!! "), "cafe-session");
});

test("duplicate slugs are rejected", () => {
  const result = assertSlug("night-owl", ["night-owl"]);
  assert.equal(result.ok, false);
  assert.equal(result.errors[0].field, "slug");
});

test("blank and unsafe slugs are rejected", () => {
  assert.equal(assertSlug("").ok, false);
  assert.equal(assertSlug("Night Owl").ok, false);
  assert.equal(assertSlug("-leading").ok, false);
});
