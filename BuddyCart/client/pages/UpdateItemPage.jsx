import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useItems } from "../context/ItemsContext";

export default function ItemEditPage() {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const { setItems } = useItems();

  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const { data } = await axios.get(`https://dummyjson.com/products/${itemId}`);
        if (!ignore) {
          setForm({
            title: data.title ?? "",
            price: Number(data.price) ?? 0,
            description: data.description ?? "",
            category: data.category ?? "",
            brand: data.brand ?? "",
            thumbnail: data.thumbnail ?? ""
          });
        }
      } catch (err) {
        console.error(err);
        alert("Load failed");
        navigate(-1);
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => { ignore = true; };
  }, [itemId, navigate]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({
      ...f,
      [name]: name === "price" ? (value === "" ? "" : Number(value)) : value
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const payload = {
        ...form,
        price: Number(form.price) || 0
      };
      const { data } = await axios.put(`https://dummyjson.com/products/${itemId}`, payload);

          setItems((prev) =>
        prev.map((p) => (p.id === Number(itemId) ? { ...p, ...data } : p))
      );

      navigate(`/items/${itemId}`); 
    } catch (err) {
      console.error(err);
      alert("Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !form) {
    return <main className="container"><p>Loading…</p></main>;
  }

  return (
    <main className="container">
      <h2>Update Item #{itemId}</h2>
      <form onSubmit={onSubmit} className="form">
        <label>
          Title
          <input name="title" value={form.title} onChange={onChange} required />
        </label>

        <label>
          Price
          <input
            name="price"
            type="number"
            min={0}
            value={form.price}
            onChange={onChange}
            required
          />
        </label>

        <label>
          Description
          <input name="description" value={form.description} onChange={onChange} />
        </label>

        <label>
          Category
          <input name="category" value={form.category} onChange={onChange} />
        </label>

        <label>
          Brand
          <input name="brand" value={form.brand} onChange={onChange} />
        </label>

        <label>
          Thumbnail URL
          <input name="thumbnail" value={form.thumbnail} onChange={onChange} />
        </label>

        <div className="actions">
          <button type="button" onClick={() => navigate(-1)}>Cancel</button>
          <button type="submit" disabled={saving}>
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </form>
    </main>
  );
}
