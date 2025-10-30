import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { API_BASE } from "../config/api";

export default function MyShopPage() {
  const {token}=useAuth();
  const [shop,setShop]=useState(null);
  const [form,setForm]=useState({ name: "", description: "", logoUrl: "" });
  const BASE=useMemo(() => API_BASE.replace(/\/+$/, ""), []);
  const headers = useMemo(() => {
    const h = {"Content-Type": "application/json"};
    if (token) h.Authorization=`Bearer ${token}`;
    return h;
  }, [token]);

  useEffect(() => {
    if (!token) return;
    fetch(`${BASE}/api/shops/me`, { headers })
      .then((r) => (r.ok ? r.json() : null))
      .then((s) => {
        if (s) {
          setShop(s);
          setForm({
            name: s.name||"",
            description: s.description||"",
            logoUrl: s.logoUrl||"",
          });
        }
      })
      .catch(() => {});
  }, [BASE, headers, token]);

  const save = async () => {
    const method = shop ? "PATCH" : "POST";
    const res = await fetch(`${BASE}/api/shops/me`, {
      method,
      headers,
      body: JSON.stringify(form),
    });
    const data = await res.json().catch(() => null);
    if (res.ok && data) setShop(data);
  };

  return (
    <div>
      <h2>My Shop</h2>
      <input
        placeholder="Shop name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />
      <input
        placeholder="Logo URL"
        value={form.logoUrl}
        onChange={(e) => setForm({ ...form, logoUrl: e.target.value })}
      />
      <textarea
        placeholder="Description"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      />
      <button onClick={save}>{shop ? "Update" : "Create"}</button>
    </div>
  );
}
