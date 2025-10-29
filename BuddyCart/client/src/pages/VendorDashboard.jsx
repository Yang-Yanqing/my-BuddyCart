import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function VendorDashboard() {
  const { user, token } = useAuth();
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
    stock: "",
    thumbnail: "",
  });
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/vendor/my-shop", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(res.data.products || []);
    } catch (err) {
      console.error("Failed to fetch vendor products:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!form.title || !form.price) return alert("Title and price required.");
    try {
      await axios.post("/api/vendor/my-shop", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("✅ Product created!");
      setForm({ title: "", description: "", category: "", price: "", stock: "", thumbnail: "" });
      fetchProducts();
    } catch (err) {
      console.error("Create product failed:", err);
      alert("❌ Failed to create product.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await axios.delete(`/api/vendor/my-shop/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchProducts();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Vendor Dashboard</h1>

      <div style={styles.profileCard}>
        <img
          src={user?.profileImage || "https://placekitten.com/100/100"}
          alt="Profile"
          style={styles.avatar}
        />
        <div>
          <p><b>Name:</b> {user?.name}</p>
          <p><b>Email:</b> {user?.email}</p>
          <p><b>Role:</b> {user?.role}</p>
        </div>
      </div>

      <h2 style={{ marginTop: "2rem" }}>Create Product</h2>
      <div style={styles.form}>
        <input
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <input
          placeholder="Price"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
        />
        <input
          placeholder="Category"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        />
        <input
          placeholder="Thumbnail URL"
          value={form.thumbnail}
          onChange={(e) => setForm({ ...form, thumbnail: e.target.value })}
        />
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <button onClick={handleCreate}>Create</button>
      </div>

      <h2 style={{ marginTop: "2rem" }}>My Products</h2>
      {loading ? (
        <p>Loading...</p>
      ) : products.length === 0 ? (
        <p>No products yet.</p>
      ) : (
        <div>
          {products.map((p) => (
            <div key={p._id} style={styles.productCard}>
              <img
                src={p.thumbnail || "https://placehold.co/80x80"}
                alt={p.title}
                style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 6 }}
              />
              <div style={{ flex: 1 }}>
                <h4>{p.title}</h4>
                <p>${p.price}</p>
                <p style={{ color: "#666" }}>{p.category}</p>
              </div>
              <button style={styles.deleteBtn} onClick={() => handleDelete(p._id)}>
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { padding: "2rem", maxWidth: 900, margin: "auto" },
  title: { textAlign: "center", marginBottom: "1.5rem" },
  profileCard: {
    display: "flex",
    gap: "1rem",
    alignItems: "center",
    background: "#fafafa",
    border: "1px solid #ddd",
    borderRadius: 8,
    padding: "1rem",
  },
  avatar: { width: 80, height: 80, borderRadius: "50%" },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    maxWidth: 400,
  },
  productCard: {
    display: "flex",
    gap: "1rem",
    alignItems: "center",
    background: "#fff",
    border: "1px solid #ddd",
    borderRadius: 6,
    padding: "1rem",
    marginBottom: "1rem",
  },
  deleteBtn: {
    background: "#f44336",
    color: "#fff",
    padding: "6px 12px",
    border: "none",
    borderRadius: 4,
    cursor: "pointer",
  },
};
