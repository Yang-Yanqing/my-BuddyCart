export function normalizeImage(url) {
    if (!url) return "https://placekitten.com/120/120";

  const clean = String(url).trim();

  if (/^https?:\/\//i.test(clean) || clean.startsWith("data:image")) {
    return clean;
  }

  const base=import.meta.env.VITE_SERVER_URL|| "";
  if (base) {
    return `${base.replace(/\/$/, "")}/${clean.replace(/^\//, "")}`;
  }

  return "https://placekitten.com/120/120";
};
