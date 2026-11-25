function zoneParts(date, timeZone) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const get = (type) => parts.find((part) => part.type === type)?.value ?? "";
  return {
    year: Number(get("year")),
    month: Number(get("month")),
    day: Number(get("day")),
    hour: Number(get("hour")),
    minute: Number(get("minute")),
  };
}

/** Interpret a datetime-local value in the venue time zone and return an ISO string. */
export function zonedToIso(localValue, timeZone) {
  const match = String(localValue ?? "").match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/);
  if (!match) return "";
  const [, year, month, day, hour, minute] = match.map(Number);
  let utc = Date.UTC(year, month - 1, day, hour, minute);
  for (let attempt = 0; attempt < 4; attempt += 1) {
    const shown = zoneParts(new Date(utc), timeZone);
    const shownUtc = Date.UTC(shown.year, shown.month - 1, shown.day, shown.hour % 24, shown.minute);
    const wanted = Date.UTC(year, month - 1, day, hour, minute);
    const delta = wanted - shownUtc;
    if (delta === 0) break;
    utc += delta;
  }
  return new Date(utc).toISOString();
}

export function isoToZonedInput(iso, timeZone) {
  if (!iso) return "";
  const shown = zoneParts(new Date(iso), timeZone);
  const hour = String(shown.hour % 24).padStart(2, "0");
  const minute = String(shown.minute).padStart(2, "0");
  const month = String(shown.month).padStart(2, "0");
  const day = String(shown.day).padStart(2, "0");
  return `${shown.year}-${month}-${day}T${hour}:${minute}`;
}

export function formatWhen(iso, timeZone) {
  if (!iso) return "";
  return new Intl.DateTimeFormat("en-US", {
    timeZone,
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(new Date(iso));
}
