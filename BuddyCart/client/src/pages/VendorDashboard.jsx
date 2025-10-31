import React, { useEffect, useState } from "react";
import http from "../config/api";
import { useAuth } from "../context/AuthContext";

export default function VendorDashboard() {
  const { user, token } = useAuth();

 
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
    stock: "",
    thumbnail: "",
  });
  const [editingId, setEditingId] = useState(null); 

 
  const fetchProducts = async () => {
    try {
      setLoading(true);
     
      const res = await http.get("/products?owner=me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(res.data?.products || []);
    } catch (err) {
      console.error("Failed to fetch vendor products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  
  }, []);

 
  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      category: "",
      price: "",
      stock: "",
      thumbnail: "",
    });
    setEditingId(null);
  };


  const handleSubmit = async () => {
    if (!form.title || form.price === "") {
      return alert("Title 和 Price 必填");
    }
    const payload = {
      ...form,
      price: Number(form.price || 0),
      stock: Number(form.stock || 0),
    };

    try {
      if (editingId) {
        
        await http.put(`/products/${editingId}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("✅ Updated!");
      } else {
       
        await http.post("/products", payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("✅ Created!");
      }
      resetForm();
      fetchProducts();
    } catch (err) {
      console.error("Save failed:", err);
      alert("❌ Save failed");
    }
  };


  const handleEdit = (item) => {
    setEditingId(item._id);
    setForm({
      title: item.title || "",
      description: item.description || "",
      category: item.category || "",
      price: item.price ?? "",
      stock: item.stock ?? "",
      thumbnail: item.thumbnail || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

 
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await http.delete(`/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchProducts();
    } catch (err) {
      console.error("Delete failed:", err);
      alert("❌ Delete failed");
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Vendor Dashboard</h1>

      {/* Profile */}
      <div style={styles.profileCard}>
        <img
          src={user?.profileImage || "https://placekitten.com/100/100"}
          alt="Profile"
          style={styles.avatar}
        />
        <div>
          <p>
            <b>Name:</b> {user?.name}
          </p>
          <p>
            <b>Email:</b> {user?.email}
          </p>
          <p>
            <b>Role:</b> {user?.role}
          </p>
        </div>
      </div>

  
      <h2 style={{ marginTop: "2rem" }}>
        {editingId ? "Edit Product" : "Create Product"}
      </h2>
      <div style={styles.form}>
        <input
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <input
          placeholder="Price"
          value={form.price}
          onChange={(e) =>
            setForm({ ...form, price: e.target.value.replace(/[^\d.]/g, "") })
          }
        />
        <input
          placeholder="Stock"
          value={form.stock}
          onChange={(e) =>
            setForm({ ...form, stock: e.target.value.replace(/[^\d]/g, "") })
          }
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
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={handleSubmit}>
            {editingId ? "Update" : "Create"}
          </button>
          {editingId ? (
            <button
              type="button"
              onClick={resetForm}
              style={{ background: "#9e9e9e", color: "#fff" }}
            >
              Cancel
            </button>
          ) : null}
        </div>
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
                style={{
                  width: 80,
                  height: 80,
                  objectFit: "cover",
                  borderRadius: 6,
                }}
              />
              <div style={{ flex: 1 }}>
                <h4 style={{ margin: 0 }}>{p.title}</h4>
                <p style={{ margin: "4px 0" }}>
                  €{Number(p.price || 0).toFixed(2)}
                  {typeof p.stock === "number" ? ` · stock: ${p.stock}` : ""}
                </p>
                <p style={{ color: "#666", margin: 0 }}>{p.category}</p>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => handleEdit(p)}>Edit</button>
                <button
                  style={styles.deleteBtn}
                  onClick={() => handleDelete(p._id)}
                >
                  Delete
                </button>
              </div>
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
    maxWidth: 480,
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
