import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import CheckoutButton from "../components/CheckoutButton";

function toNumber(v, fallback = 0) {
  if (typeof v === "number") return Number.isFinite(v) ? v : fallback;
  if (v == null) return fallback;
  const cleaned = String(v).replace(",", ".").replace(/[^0-9.-]/g, "");
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : fallback;
}

export default function CheckoutPage() {
  const { cart } = useCart();

  // Normalize cart entries to a stable, numeric structure
  const { items, total, productsForCheckout } = useMemo(() => {
    const items = (cart || []).map((entry, idx) => {
      const p = entry.product || {};
      const id = p.id ?? `tmp_${idx}`;
      const title = p.title ?? p.name ?? "Unknown Product";
      const unit = toNumber(p.price, 0);
      const qty = toNumber(entry?.quantity, 1);
      const subtotal = unit * qty;
      return { id, title, unit, qty, subtotal };
    });

    const total = items.reduce((s, i) => s + (Number.isFinite(i.subtotal) ? i.subtotal : 0), 0);

    const productsForCheckout = items.map(({ title, unit, qty }) => ({
      name: title,
      price: Number.isFinite(unit) ? unit : 0,
      quantity: Number.isFinite(qty) ? qty : 1,
    }));

    return { items, total, productsForCheckout };
  }, [cart]);

  if (!items.length) {
    return (
      <main style={{ maxWidth: 840, margin: "0 auto", padding: 16 }}>
        <div style={card}>
          <h2 style={{ marginTop: 0 }}>Your cart is empty</h2>
          <p>Add some products first, then proceed to checkout.</p>
          <Link to="/" style={linkBtn}>Continue shopping</Link>
        </div>
      </main>
    );
  }

  return (
    <main style={{ maxWidth: 960, margin: "0 auto", padding: 16 }}>
      <header style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
        <Link to="/cart" style={linkBtn}>← Back to cart</Link>
        <h1 style={{ margin: 0, fontSize: 20 }}>Checkout</h1>
      </header>

      <div style={card}>
        {/* Order items */}
        <section>
          <h3 style={{ margin: "0 0 10px", fontSize: 16 }}>Order summary</h3>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {items.map((i, idx) => (
              <li
                key={`${i.id}-${idx}`}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr auto auto",
                  gap: 12,
                  alignItems: "center",
                  padding: "8px 0",
                  borderTop: idx === 0 ? "none" : "1px solid #eee",
                }}
              >
                <div>
                  <strong>{i.title}</strong>
                  <div style={{ fontSize: 12, color: "#666" }}>
                    €{Number.isFinite(i.unit) ? i.unit.toFixed(2) : "0.00"} × {Number.isFinite(i.qty) ? i.qty : 1}
                  </div>
                </div>
                <div style={{ textAlign: "right", minWidth: 110 }}>€{Number.isFinite(i.subtotal) ? i.subtotal.toFixed(2) : "0.00"}</div>
              </li>
            ))}
          </ul>

          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 12 }}>
            <div style={{ minWidth: 220 }}>
              <div style={{ display: "flex" }}>
                <span style={{ color: "#666" }}>Total</span>
                <strong style={{ marginLeft: "auto" }}>€{total.toFixed(2)}</strong>
              </div>
              <div style={{ fontSize: 12, color: "#666", marginTop: 4 }}>
                Taxes & shipping (if any) handled by your payment session.
              </div>
            </div>
          </div>
        </section>

        {/* Minimal shipping/contact (optional, not sent to gateway here) */}
        <section style={{ marginTop: 16 }}>
          <h3 style={{ margin: "0 0 10px", fontSize: 16 }}>Contact & shipping (optional)</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <input placeholder="Full name" style={textbox} />
            <input type="email" placeholder="Email" style={textbox} />
            <input placeholder="Address line" style={{ ...textbox, gridColumn: "1 / span 2" }} />
            <input placeholder="City" style={textbox} />
            <input placeholder="ZIP" style={textbox} />
          </div>
          <p style={{ fontSize: 12, color: "#666", marginTop: 8 }}>
            This info is not submitted in the button below; collect and send it to your backend if needed.
          </p>
        </section>

        {/* Single, simple action: your existing CheckoutButton */}
        <div style={{ marginTop: 16, display: "flex", justifyContent: "flex-end" }}>
          <CheckoutButton products={productsForCheckout} />
        </div>
      </div>
    </main>
  );
}

const card = {
  padding: "14px 16px",
  border: "1px solid #eaeaea",
  borderRadius: 10,
  background: "#fff",
};

const textbox = {
  width: "100%",
  padding: "8px 10px",
  borderRadius: 8,
  border: "1px solid #e5e5e5",
  outline: "none",
};

const linkBtn = {
  display: "inline-block",
  padding: "6px 10px",
  border: "1px solid #ddd",
  borderRadius: 8,
  textDecoration: "none",
  color: "inherit",
};
