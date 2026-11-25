import assert from "node:assert/strict";
import test from "node:test";
import { can, canChangeAdBudget } from "./permissions.mjs";

test("owner can publish, activate ads, refund, and manage integrations", () => {
  assert.equal(can("owner", "publish_page"), true);
  assert.equal(can("owner", "activate_paid_ads"), true);
  assert.equal(can("owner", "issue_refund"), true);
  assert.equal(can("owner", "manage_integrations"), true);
});

test("event manager can publish and cannot activate ads or refund", () => {
  assert.equal(can("event_manager", "create_event"), true);
  assert.equal(can("event_manager", "publish_page"), true);
  assert.equal(can("event_manager", "approve_campaign"), true);
  assert.equal(can("event_manager", "activate_paid_ads"), false);
  assert.equal(can("event_manager", "issue_refund"), false);
  assert.equal(can("event_manager", "manage_integrations"), false);
});

test("marketing matches the event manager except neither can raise spend", () => {
  assert.equal(can("marketing", "approve_campaign"), true);
  assert.equal(can("marketing", "activate_paid_ads"), false);
  assert.equal(can("marketing", "check_in"), true);
});

test("finance refunds only, and door staff only check in", () => {
  assert.equal(can("finance", "issue_refund"), true);
  assert.equal(can("finance", "publish_page"), false);
  assert.equal(can("door", "check_in"), true);
  assert.equal(can("door", "create_event"), false);
});

test("only the owner can raise the approved ad budget", () => {
  assert.equal(canChangeAdBudget("owner", 10000, 15000), true);
  assert.equal(canChangeAdBudget("event_manager", 10000, 15000), false);
  assert.equal(canChangeAdBudget("event_manager", 10000, 10000), true);
  assert.equal(canChangeAdBudget("event_manager", 10000, 8000), true);
});
