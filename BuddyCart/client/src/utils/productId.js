export default function productId(p, fallback) {
const v = p?._id ?? p?.id ?? p?.externalId ?? fallback ?? "";
return String(v);
}