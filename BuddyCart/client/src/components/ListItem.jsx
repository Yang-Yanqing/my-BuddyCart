import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useItems } from "../context/ItemsContext";
import { useCart } from "../context/CartContext";
import { useUser } from "../context/UserContext";

const ListItem = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(15);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const { items, setItems } = useItems();
  const { addToCart } = useCart();
  const { role, toggleRole } = useUser();

  const totalPages = Math.max(Math.ceil(total / limit), 1);

  useEffect(() => {
    let ignore = false;
    const fetchItems = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get("/api/products", {
          params: { page, limit, _: Date.now() }, 
          headers: { "Cache-Control": "no-cache" },
        });

        if (ignore) return;

        const list = data?.products ?? data?.items ?? data?.data ?? [];
        const count = data?.total ?? data?.totalDocs ?? data?.count ?? list.length;

        setItems(Array.isArray(list) ? list : []);
        setTotal(Number(count) || 0);
      } catch (error) {
        console.error("fetch products failed:", error);
        setItems([]);
        setTotal(0);
      } finally {
        if (!ignore) setLoading(false);
      }
    };
    fetchItems();
    return () => { ignore = true; };
  }, [page, limit, setItems, setTotal]);

  useEffect(() => {
    const tp = Math.max(Math.ceil(total / limit), 1);
    if (page > tp) setPage(tp);
  }, [total, limit]); 
 
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      await axios.delete(`/api/admin/products/${id}`);
      setItems((prev) => prev.filter((p) => (p?._id ?? p?.id) !== id));
      setTotal((t) => Math.max(t - 1, 0));
    } catch (err) {
      console.error("delete failed:", err);
      alert("Failed to delete item. Please try again later.");
    }
  };

  return (
    <div style={{ padding: 20 }}>
       <div
        style={{
          position: "sticky",
          top: 0,
          background: "#f8fafc",
          zIndex: 10,
          padding: "12px 16px",
          borderRadius: 10,
          marginBottom: 20,
          boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <button
          onClick={toggleRole}
          style={{
            padding: "8px 14px",
            borderRadius: 8,
            border: "none",
            cursor: "pointer",
            background: role === "admin" ? "#2563eb" : "#9ca3af",
            color: "white",
            fontWeight: 600,
            fontSize: 14,
          }}
        >
          Current Role: {role === "admin" ? "Admin" : "Customer"} (click to switch)
        </button>

        {role === "admin" && (
          <Link
            to="/items/new"
            style={{
              padding: "8px 12px",
              borderRadius: 8,
              background: "#2563eb",
              color: "#fff",
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            + New Item
          </Link>
        )}
      </div>

      {loading && <p>Loading…</p>}
      {!loading && (!items || items.length === 0) && <p>No items found.</p>}

      {!loading && items?.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: 16,
          }}
        >
          {items.map((item) => {
            const uid = String(item?._id ?? item?.id ?? "");
            if (!uid) return null;

            return (
              <div
                key={uid}
                style={{
                  backgroundColor: "#fff",
                  borderRadius: 10,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  padding: 15,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  transition: "transform 0.2s, boxShadow 0.2s",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "none";
                  e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
                }}
              >
                <Link
                  to={`/items/${uid}`}
                  style={{
                    textDecoration: "none",
                    color: "inherit",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 10,
                  }}
                  aria-label={`View details for ${item?.title ?? "item"}`}
                >
                  <img
                    src={item?.thumbnail}
                    alt={item?.title ?? "item thumbnail"}
                    style={{ width: "100%", height: 180, objectFit: "contain" }}
                    loading="lazy"
                  />
                  <h3
                    style={{
                      fontSize: 16,
                      fontWeight: 600,
                      textAlign: "center",
                      minHeight: 40,
                      lineHeight: "20px",
                      overflow: "hidden",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                    }}
                    title={item?.title}
                  >
                    {item?.title}
                  </h3>
                  <p style={{ color: "#743b3bff", fontWeight: "bold", fontSize: 18, margin: 0 }}>
                    {Number.isFinite(Number(item?.price)) ? `€${Number(item.price).toFixed(2)}` : "--"}
                  </p>
                </Link>

                <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                  <button
                    onClick={() => addToCart(item)}
                    style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid #ddd" }}
                  >
                    Add to Cart
                  </button>

                  {role === "admin" && (
                    <>
                      <Link
                        to={`/items/${uid}/edit`}
                        style={{ padding: "6px 10px", border: "1px solid #ddd", borderRadius: 6, textDecoration: "none", color: "#111" }}
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(uid)}
                        style={{ padding: "6px 10px", background: "#e11d48", color: "#fff", border: 0, borderRadius: 6 }}
                      >
                        Delete
                      </button>
                    </>
                  )}

                  <Link to="/cart" style={{ marginLeft: "auto" }}>
                    Go to Cart →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div style={{ marginTop: 20, textAlign: "center" }}>
        <button
          onClick={() => {
            setPage((p) => {
              const next = Math.max(p - 1, 1);
              if (next !== p) window.scrollTo({ top: 0, behavior: "smooth" });
              return next;
            });
          }}
          disabled={page === 1}
          style={{
            marginRight: 10,
            padding: "8px 14px",
            borderRadius: 5,
            border: "1px solid #ccc",
            backgroundColor: page === 1 ? "#eee" : "#fff",
            cursor: page === 1 ? "not-allowed" : "pointer",
          }}
        >
          ← Prev
        </button>

        <span style={{ margin: "0 10px", fontWeight: 500 }}>
          Page {page} / {totalPages} ({total} items)
        </span>

        <button
          onClick={() => {
            setPage((p) => {
              const tp = Math.max(Math.ceil(total / limit), 1);
              const next = Math.min(p + 1, tp);
              if (next !== p) window.scrollTo({ top: 0, behavior: "smooth" });
              return next;
            });
          }}
          disabled={page === totalPages}
          style={{
            marginLeft: 10,
            padding: "8px 14px",
            borderRadius: 5,
            border: "1px solid #ccc",
            backgroundColor: page === totalPages ? "#eee" : "#fff",
            cursor: page === totalPages ? "not-allowed" : "pointer",
          }}
        >
          Next →
        </button>

        <select
          value={limit}
          onChange={(e) => {
            setLimit(Number(e.target.value));
            setPage(1);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          style={{
            marginLeft: 12,
            padding: "6px 8px",
            borderRadius: 4,
            border: "1px solid #ccc",
          }}
          aria-label="Items per page"
        >
          {[12, 15, 20, 30, 50].map((n) => (
            <option key={n} value={n}>
              {n} / page
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default ListItem;