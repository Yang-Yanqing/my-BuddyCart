import { useState } from "react";
import axios from "axios";
import {API_BASE} from "../config/api";



export default function CheckoutButton({products=[],className}) {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    try {
      if (!products.length) {
        alert("Your cart is empty.");
        return;
      }
      setLoading(true);

      
      const { data } = await axios.post(
        `${API_BASE}/api/checkout/create-checkout-session`,
        { products },
        { headers: { "Content-Type": "application/json" } }
      );

      if (!data?.url) throw new Error("No checkout URL returned from server");

   
      window.location.assign(data.url);
    } catch (err) {
      console.error("Checkout error:", err);
      const msg =
        err.response?.data?.error ||
        err.message ||
        "Something went wrong during checkout";
      alert(`Checkout error: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleCheckout}
      disabled={loading}
      className={className}
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
