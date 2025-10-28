import React, { createContext, useContext, useMemo, useState } from "react";
import productId from "../utils/productId"
export const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    const pid=productId(product); if(!pid)return;
    setCart((prev) => {
      const existing=prev.find((c)=>productId(c.product)===pid);

      if (existing) {
        return prev.map((c)=>productId(c.product)===pid?{ ...c, quantity:c.quantity+1}:c);
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const increaseQuantity=(id)=>{
    setCart((prev) =>
      prev.map((c) =>
       productId(c.product)===String(id)?{ ...c, quantity: c.quantity + 1 } : c
      )
    );
  };

  const decreaseQuantity=(id)=>{
    setCart((prev)=>
      prev
        .map((c) =>
         productId(c.product)===String(id)?{ ...c, quantity: c.quantity-1}:c)
        .filter((c)=>c.quantity>0)
    );
  };

  const removeItem = (id) => setCart((prev) => prev.filter((c) =>productId(c.product)!==String(id)));
  const clearCart = () => setCart([]);
  const getTotal = () => cart.reduce((acc, c) => acc + c.quantity * c.product.price, 0);


  const value = useMemo(() => ({
    cart, addToCart, increaseQuantity, decreaseQuantity,
    removeItem, removeFromCart: removeItem, clearCart, getTotal,
  }), [cart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within <CartProvider>");
  }
  return ctx;
};
