import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { API_BASE } from "../config/api";



export default function PaypalReturn() {
  const [sp] = useSearchParams(); 
  const navigate = useNavigate();
  const [msg, setMsg] = useState("Capturing payment…");

  useEffect(() => {
    const orderID = sp.get("token");
    if (!orderID) {
      setMsg("Missing orderID.");
      return;
    }

    (async () => {
      try {
        const r = await fetch(`${API_BASE.replace(/\/+$/, "")}/checkout/capture-order`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderID }),
        });
        const data = await r.json().catch(() => null);
        if (!r.ok) throw new Error(data?.error || `HTTP ${r.status}`);
        setMsg("Payment captured! Redirecting…");
        setTimeout(() => navigate("/"), 1200); 
      } catch (e) {
        setMsg(`Capture failed: ${e.message}`);
      }
    })();
  }, []);

  return <div style={{ padding: 24 }}>{msg}</div>;
};
