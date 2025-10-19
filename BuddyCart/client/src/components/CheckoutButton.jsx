import { useState } from "react";

const API_BASE =
  import.meta.env.VITE_API_BASE ||
  (import.meta.env.DEV
    ? "http://localhost:5000"
    : "https://your-api.onrender.com");

export default function CheckoutButton({ products = [] }) {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    try {
      if (!products.length) {
        alert("Your cart is empty.");
        return;
      }
      setLoading(true);

      const res = await fetch(`${API_BASE}/create-checkout-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ products }),
      });

      let payload;
      try {
        payload = await res.json();
      } catch {
        throw new Error(`Unexpected response (HTTP ${res.status})`);
      }

      if (!res.ok)
        throw new Error(payload?.error || `Failed (HTTP ${res.status})`);
      if (!payload?.url)
        throw new Error("No checkout URL returned from server");

      window.location.assign(payload.url);
    } catch (err) {
      console.error("Checkout error:", err);
      alert(`Checkout error: ${err.message || "Something went wrong"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleCheckout}
      disabled={loading}
      style={{
        padding: "10px 20px",
        fontSize: "16px",
        background: loading ? "#3d3d3dff" : "#333333",
        color: "#fff",
        border: "none",
        borderRadius: "4px",
        cursor: loading ? "default" : "pointer",
        opacity: loading ? 0.8 : 1,
      }}
    >
      {loading ? "Redirecting…" : "Checkout"}
    </button>
  );
}
