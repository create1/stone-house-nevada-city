/** Convert a dollar field to integer cents. Rejects more than two decimal places. */
export function dollarsToCents(input) {
  const raw = String(input ?? "").trim().replace(/[$,\s]/g, "");
  if (!raw) return null;
  if (!/^\d+(\.\d{1,2})?$/.test(raw)) return null;
  const [dollars, fraction = ""] = raw.split(".");
  const cents = Number(dollars) * 100 + Number(fraction.padEnd(2, "0"));
  if (!Number.isSafeInteger(cents)) return null;
  return cents;
}

export function formatDollars(cents) {
  return `$${(cents / 100).toFixed(2)}`;
}
