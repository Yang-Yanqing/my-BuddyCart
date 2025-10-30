export function normalizeImage(url) {
    if (!url) return "https://placekitten.com/120/120";

  const clean = String(url).trim();

  if (/^https?:\/\//i.test(clean) || clean.startsWith("data:image")) {
    return clean;
  }

  const base=process.env.REACT_APP_API_BASE_URL|| "";
  if (base) {
    return `${base.replace(/\/$/, "")}/${clean.replace(/^\//, "")}`;
  }

  return "https://placekitten.com/120/120";
};
