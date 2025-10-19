import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useItems } from "../context/ItemsContext";

const empty = {
  title: "",
  price: 0,
  description: "",
  category: "",
  brand: "",
  thumbnail: ""
};

export default function ItemCreatePage() {
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const { setItems } = useItems();

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: name === "price" ? Number(value) || 0 : value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const { data } = await axios.post("https://dummyjson.com/products/add", form);

      
      setItems((prev) => [data, ...prev]);
      navigate("/"); 
    } catch (err) {
      console.error(err);
      alert("Creat Failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="container">
      <h2>Creat new Item</h2>
      <form onSubmit={onSubmit} className="form">
        <label>Title<input name="title" value={form.title} onChange={onChange} required /></label>
        <label>Price<input name="price" type="number" value={form.price} onChange={onChange} min={0} required /></label>
        <label>Description<input name="description" value={form.description} onChange={onChange} /></label>
        <label>Category<input name="category" value={form.category} onChange={onChange} /></label>
        <label>Brand<input name="brand" value={form.brand} onChange={onChange} /></label>
        <label>Thumbnail URL<input name="thumbnail" value={form.thumbnail} onChange={onChange} /></label>
        <div className="actions">
          <button type="button" onClick={() => navigate(-1)}>Cancel</button>
          <button type="submit" disabled={saving}>{saving ? "submitting..." : "submit"}</button>
        </div>
      </form>
    </main>
  );
}
