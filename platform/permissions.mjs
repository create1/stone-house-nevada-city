/** Staff roles from the event platform spec. */

export const ROLES = ["owner", "marketing", "event_manager", "finance", "door"];

const GRANTS = {
  create_event: ["owner", "marketing", "event_manager"],
  publish_page: ["owner", "marketing", "event_manager"],
  approve_campaign: ["owner", "marketing", "event_manager"],
  activate_paid_ads: ["owner"],
  raise_ad_budget: ["owner"],
  issue_refund: ["owner", "finance"],
  check_in: ["owner", "marketing", "event_manager", "door"],
  manage_integrations: ["owner"],
};

export function can(role, action) {
  const allowed = GRANTS[action];
  if (!allowed) return false;
  return allowed.includes(role);
}

/**
 * A higher ad budget needs the owner. Leaving the budget the same, or lowering it, does not.
 */
export function canChangeAdBudget(role, currentCents, nextCents) {
  if (!Number.isInteger(currentCents) || !Number.isInteger(nextCents)) return false;
  if (nextCents < 0) return false;
  if (nextCents <= currentCents) return can(role, "create_event");
  return can(role, "raise_ad_budget");
}
