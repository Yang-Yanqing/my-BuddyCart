import { Link } from "react-router-dom";
import styles from "../components/Sidebar.module.css";
import { useCart } from "../context/CartContext";
import CheckoutButton from "./CheckoutButton";
function Sidebar({ isOpen }) {
  const { cart, increaseQuantity, decreaseQuantity, removeItem, getTotal } =
    useCart();
  const productsForCheckout = cart.map(({ product, quantity }) => ({
    id: product.id,
    title: product.title,
    price: product.price,
    quantity,
  }));
  const NAVBAR_HEIGHT = 52;
  return (
    <nav
      className={styles.sideBar}
      style={{
        width: isOpen ? "300px" : "0px",
        transition: "width 0.3s",
        position: "fixed",
        right: 0,
        top: `${NAVBAR_HEIGHT}px`,
        height: `calc(100vh - ${NAVBAR_HEIGHT}px)`,
        backgroundColor: "#F4F4F4",
        boxShadow: "-2px 0 5px rgba(0,0,0,0.3)",
        zIndex: 9000,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div className={styles.sideBarHeader}>
        <Link className={styles.sideBarLink} to="/cart">
          View Cart
        </Link>
        <h2>Cart ({cart.length})</h2>
      </div>
      <aside className={styles.cartContent}>
        {cart.length === 0 ? (
          <p>Your cart is empty!</p>
        ) : (
          cart.map((c) => (
            <div key={c.product.id} className={styles.cartItem}>
              <div className={styles.itemHeader}>{c.product.title}</div>
              <div className={styles.quantityControl}>
                <button onClick={() => decreaseQuantity(c.product.id)}>
                  -
                </button>
                <span>{c.quantity}</span>
                <button onClick={() => increaseQuantity(c.product.id)}>
                  +
                </button>
              </div>
              <div>${c.product.price.toFixed(2)} each</div>
              <div>Subtotal: ${(c.product.price * c.quantity).toFixed(2)}</div>
              <button
                className={styles.removeBtn}
                onClick={() => removeItem(c.product.id)}
              >
                Remove
              </button>
            </div>
          ))
        )}
      </aside>
      <div className={styles.cartFooter}>
        <strong>Total: ${getTotal().toFixed(2)}</strong>
        <CheckoutButton
          className={styles.checkoutBtn}
          products={productsForCheckout}
        />
      </div>
    </nav>
  );
}
export default Sidebar;
