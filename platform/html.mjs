export function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function jsonLdScript(data) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return `<script type="application/ld+json">${json}</script>`;
}

export function safeImageUrl(value) {
  const url = String(value ?? "").trim();
  if (!url) return "";
  if (url.startsWith("/assets/") && !url.includes("..")) return url;
  try {
    const parsed = new URL(url);
    if (parsed.protocol === "https:") return url;
  } catch {
    return "";
  }
  return "";
}
