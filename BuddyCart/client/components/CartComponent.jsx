import { useCart } from "../context/CartContext";
import CheckoutButton from "./CheckoutButton";

function toNumber(v, fallback = 0) {
  if (typeof v === "number") return Number.isFinite(v) ? v : fallback;
  if (v == null) return fallback;
  const cleaned = String(v)
    .replace(",", ".")
    .replace(/[^0-9.-]/g, "");
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : fallback;
}

export default function Cart() {
  const { cart, increaseQuantity, decreaseQuantity, removeItem, clearCart } =
    useCart();

  const normalized = cart.map((entry, idx) => {
    const product = entry.product;
    const id = product?.id ?? `tmp_${idx}`;
    const title = product?.title ?? product?.name ?? "Unknown Product";

    let unit = toNumber(product?.price, 0);
    const qty = toNumber(entry?.quantity, 1);
    const subtotal = unit * qty;

    return { id, title, unit, qty, subtotal };
  });

  const total = normalized.reduce(
    (sum, i) => sum + (Number.isFinite(i.subtotal) ? i.subtotal : 0),
    0
  );

  const productsForCheckout = normalized.map(({ title, unit, qty }) => ({
    name: title,
    price: Number.isFinite(unit) ? unit : 0,
    quantity: Number.isFinite(qty) ? qty : 1,
  }));

  return (
    <div style={{ padding: 20 }}>
      <h2>Your Cart:</h2>

      {normalized.length === 0 ? (
        <p>Your cart is empty!</p>
      ) : (
        <>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {normalized.map((i, idx) => (
              <li
                key={`${i.id}-${idx}`}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr auto auto auto",
                  gap: 12,
                  alignItems: "center",
                  marginBottom: 12,
                  paddingBottom: 12,
                  borderBottom: "1px solid #eee",
                }}
              >
                <div>
                  <strong>{i.title}</strong>
                  <div style={{ fontSize: 12, color: "#666" }}>
                    ${Number.isFinite(i.unit) ? i.unit.toFixed(2) : "0.00"} each
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <button onClick={() => decreaseQuantity(i.id)}>-</button>
                  <span>{Number.isFinite(i.qty) ? i.qty : 1}</span>
                  <button onClick={() => increaseQuantity(i.id)}>+</button>
                </div>

                <div style={{ minWidth: 120, textAlign: "right" }}>
                  $
                  {Number.isFinite(i.subtotal) ? i.subtotal.toFixed(2) : "0.00"}
                </div>

                <button onClick={() => removeItem(i.id)}>Remove</button>
              </li>
            ))}
          </ul>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 16,
            }}
          >
            <h3 style={{ margin: 0 }}>Total: ${total.toFixed(2)}</h3>

            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={clearCart}>Clear Cart</button>
              <CheckoutButton products={productsForCheckout} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
