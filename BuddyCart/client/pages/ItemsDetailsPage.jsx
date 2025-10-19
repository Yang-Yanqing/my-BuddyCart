import React, { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useItems } from "../context/ItemsContext";
import { useCart } from "../context/CartContext";

const ItemsDetailsPage = () => {
  const { itemId } = useParams();
  const { items } = useItems();
  const { addToCart } = useCart();

  const idNum = Number(itemId);
  const item = useMemo(() => items.find((p) => p.id === idNum), [items, idNum]);

  if (!item) return <p style={{ padding: 24 }}>Loading item…</p>;

  const images =
    Array.isArray(item.images) && item.images.length
      ? item.images
      : [item.thumbnail || ""];
  const discount =
    typeof item.discountPercentage === "number" ? item.discountPercentage : 0;
  const price = Number(item.price) || 0;
  const discountedPrice =
    discount > 0 ? (price * (1 - discount / 100)).toFixed(2) : price.toFixed(2);

  return (
    <div style={styles.page}>
      <div style={styles.topGrid}>
        <div style={styles.galleryCard}>
          <div style={styles.mainImageWrap}>
            <img
              src={images[0]}
              alt={item.title}
              style={styles.mainImage}
              loading="lazy"
            />
          </div>

          <div style={styles.thumbRow}>
            {images.slice(0, 6).map((src, idx) => (
              <div key={idx} style={styles.thumbBox}>
                <img
                  src={src}
                  alt={`${item.title} ${idx + 1}`}
                  style={styles.thumbImg}
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>

        <aside style={styles.buyCard}>
          <h1 style={styles.title}>{item.title}</h1>

          <div style={styles.metaRow}>
            {typeof item.rating === "number" && (
              <span title={`Rating: ${item.rating}`} style={styles.rating}>
                ★ {item.rating.toFixed(1)}
              </span>
            )}
            {item.brand && <span style={styles.metaDot}>•</span>}
            {item.brand && (
              <span style={styles.brand}>Brand: {item.brand}</span>
            )}
          </div>

          <div style={styles.priceBlock}>
            {discount > 0 ? (
              <>
                <div style={styles.priceRow}>
                  <span style={styles.priceNow}>${discountedPrice}</span>
                  <span style={styles.priceWas}>${price.toFixed(2)}</span>
                  <span style={styles.discountBadge}>-{discount}%</span>
                </div>
                <div style={styles.savingsLine}>
                  You save ${(price - Number(discountedPrice)).toFixed(2)}
                </div>
              </>
            ) : (
              <div style={styles.priceRow}>
                <span style={styles.priceNow}>${price.toFixed(2)}</span>
              </div>
            )}
          </div>

          <div style={styles.availabilityBlock}>
            <span
              style={{
                ...styles.stockPill,
                background: item.stock > 0 ? "#E8F5E9" : "#FDECEA",
                color: item.stock > 0 ? "#1B5E20" : "#B71C1C",
              }}
            >
              {item.stock > 0 ? "In stock" : "Out of stock"}
            </span>
            <span style={styles.stockCount}>({item.stock} units)</span>
          </div>

          <button
            onClick={() => addToCart(item)}
            disabled={item.stock <= 0}
            style={{
              ...styles.addBtn,
              opacity: item.stock <= 0 ? 0.7 : 1,
              cursor: item.stock <= 0 ? "not-allowed" : "pointer",
            }}
          >
            Add to Cart
          </button>

          <ul style={styles.quickList}>
            {item.shippingInformation && (
              <li>Shipping: {item.shippingInformation}</li>
            )}
            {item.returnPolicy && <li>Returns: {item.returnPolicy}</li>}
            {item.warrantyInformation && (
              <li>Warranty: {item.warrantyInformation}</li>
            )}
          </ul>
        </aside>
      </div>

      <section style={styles.detailsGrid}>
        <div style={styles.card}>
          <h2 style={styles.h2}>Description</h2>
          <p style={styles.description}>{item.description}</p>
        </div>

        <div style={styles.card}>
          <h2 style={styles.h2}>Details</h2>
          <ul style={styles.detailsList}>
            {item.brand && (
              <li>
                <strong>Brand:</strong> {item.brand}
              </li>
            )}
            {item.category && (
              <li>
                <strong>Category:</strong> {item.category}
              </li>
            )}
            {Array.isArray(item.tags) && item.tags.length > 0 && (
              <li>
                <strong>Tags:</strong> {item.tags.join(", ")}
              </li>
            )}
            {item.availabilityStatus && (
              <li>
                <strong>Availability:</strong> {item.availabilityStatus}
              </li>
            )}
          </ul>
        </div>
      </section>
    </div>
  );
};

const styles = {
  page: {
    background: "#f3f3f3",
    minHeight: "100vh",
    padding: "20px",
  },
  topGrid: {
    display: "grid",
    gridTemplateColumns: "1.3fr 1fr",
    gap: "24px",
  },
  galleryCard: {
    background: "#fff",
    borderRadius: 12,
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    padding: 16,
  },
  mainImageWrap: {
    width: "100%",
    height: 420,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#fff",
    borderRadius: 10,
    overflow: "hidden",
  },
  mainImage: {
    maxWidth: "100%",
    maxHeight: "100%",
    objectFit: "contain",
    display: "block",
  },
  thumbRow: {
    marginTop: 12,
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(64px, 1fr))",
    gap: 8,
  },
  thumbBox: {
    border: "1px solid #eee",
    borderRadius: 8,
    background: "#fff",
    padding: 6,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: 64,
    overflow: "hidden",
  },
  thumbImg: {
    maxWidth: "100%",
    maxHeight: "100%",
    objectFit: "contain",
    display: "block",
  },
  buyCard: {
    background: "#fff",
    borderRadius: 12,
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    padding: 20,
    alignSelf: "start",
    position: "sticky",
    top: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 700,
    margin: "0 0 8px 0",
    lineHeight: "1.2",
  },
  metaRow: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    color: "#555",
    marginBottom: 10,
    fontSize: 14,
  },
  metaDot: { opacity: 0.6 },
  brand: { color: "#333" },
  rating: { color: "#e39a1c", fontWeight: 600 },
  priceBlock: {
    borderTop: "1px solid #eee",
    borderBottom: "1px solid #eee",
    padding: "12px 0",
    margin: "8px 0 12px 0",
  },
  priceRow: {
    display: "flex",
    alignItems: "baseline",
    gap: 10,
  },
  priceNow: {
    color: "#B12704",
    fontWeight: 800,
    fontSize: 26,
  },
  priceWas: {
    color: "#666",
    textDecoration: "line-through",
    fontSize: 16,
  },
  discountBadge: {
    background: "#E8F5E9",
    color: "#1B5E20",
    borderRadius: 4,
    padding: "2px 6px",
    fontSize: 12,
    fontWeight: 700,
  },
  savingsLine: {
    marginTop: 6,
    fontSize: 13,
    color: "#1B5E20",
    fontWeight: 600,
  },
  availabilityBlock: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    margin: "8px 0 12px 0",
  },
  stockPill: {
    padding: "2px 8px",
    borderRadius: 999,
    fontWeight: 600,
    fontSize: 12,
  },
  stockCount: {
    color: "#666",
    fontSize: 13,
  },
  addBtn: {
    backgroundColor: "#FFD814",
    border: "1px solid #FCD200",
    borderRadius: 999,
    padding: "10px 16px",
    fontWeight: 700,
    width: "100%",
    transition: "background 0.2s",
  },
  quickList: {
    marginTop: 12,
    paddingLeft: 18,
    color: "#444",
    lineHeight: 1.5,
    fontSize: 14,
  },
  detailsGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 24,
    marginTop: 24,
  },
  card: {
    background: "#fff",
    borderRadius: 12,
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    padding: 20,
  },
  h2: {
    margin: "0 0 12px 0",
    fontSize: 18,
  },
  description: {
    color: "#333",
    lineHeight: 1.6,
  },
};

export default ItemsDetailsPage;
