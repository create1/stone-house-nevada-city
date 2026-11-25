/**
 * Public event URLs use /calendar/{slug}.
 * Slugs are lowercase, hyphenated, and stable.
 */
export function slugify(value) {
  return String(value ?? "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-")
    .slice(0, 80)
    .replace(/-+$/g, "");
}

export function assertSlug(slug, existingSlugs = []) {
  const errors = [];
  if (!slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    errors.push({
      field: "slug",
      message: "The event link must use lowercase letters, numbers, and hyphens.",
    });
  }
  if (slug && existingSlugs.includes(slug)) {
    errors.push({
      field: "slug",
      message: "Another event already uses this link.",
    });
  }
  return { ok: errors.length === 0, errors };
}
