const BASE = "http://localhost:5000"; 

export async function fetchProducts({ page = 1, limit = 12 } = {}) {
  const r = await fetch(`${BASE}/api/products?page=${page}&limit=${limit}`);
  if (!r.ok) throw new Error("Failed to fetch products");
  return r.json();
}
