import logo from "../assets/Logo-project.png";
import ShoppingCart from "../assets/Shopping-cart.png";
import styles from "../components/Navbar.module.css";
import { Link } from "react-router-dom";
import { divisions as divisionMap, fetchTaggedProducts } from "./CategoryData";
import React, { useState, useEffect, useMemo } from "react";
import { useCart } from "../context/CartContext";

function Navbar({ toggleSidebar }) {
  const [divisionsList, setDivisionsList] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(null);

  const { cart } = useCart();
  const cartQty = useMemo(
    () => cart.reduce((sum, c) => sum + c.quantity, 0),
    [cart]
  );

  useEffect(() => {
    async function loadDivisions() {
      try {
        await fetchTaggedProducts();
        const allDivisions = [...Object.keys(divisionMap)];
        setDivisionsList(allDivisions);
      } catch (error) {
        console.error("Error loading divisions:", error);
      }
    }
    loadDivisions();
  }, []);

  const handleMouseEnter = (div) => setOpenDropdown(div);
  const handleMouseLeave = () => setOpenDropdown(null);

  return (
    <div className={styles.navbar}>
      <Link to="/" aria-label="Home">
        <img className={styles.logo} src={logo} alt="Logo" />
      </Link>

      <ul className={styles.menu}>
        {divisionsList.map((div) => (
          <li
            key={div}
            className={styles.menuItem}
            onMouseEnter={() => handleMouseEnter(div)}
            onMouseLeave={handleMouseLeave}
          >
            {div}
            {openDropdown === div && (
              <ul className={styles.dropdown}>
                {(divisionMap[div] || []).map((tag) => (
                  <li key={tag} className={styles.dropdownItem}>
                    <Link to={`/tags/${tag}`}>{tag.replace(/-/g, " ")}</Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>

      <button
        className={styles.btnCart}
        onClick={toggleSidebar}
        aria-label="Open cart"
      >
        <img
          className={styles.shoppingCart}
          src={ShoppingCart}
          alt="Shopping Cart"
        />
        {cartQty > 0 && (
          <span
            className={styles.cartBadge}
            aria-label={`${cartQty} items in cart`}
          >
            {cartQty}
          </span>
        )}
      </button>
    </div>
  );
}

export default Navbar;
