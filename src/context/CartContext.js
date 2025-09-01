// context/CartContext.js
import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    // Load cart from localStorage on init
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Add a product to the cart
  const addToCart = (product) => {
    const exists = cart.find(p => p.id === product.id);
    if (exists) {
      setCart(cart.map(p => p.id === product.id ? { ...p, qty: p.qty + 1 } : p));
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
  };

  // Increase quantity of a product
  const increaseQty = (id) => {
    setCart(cart.map(p => p.id === id ? { ...p, qty: p.qty + 1 } : p));
  };

  // Decrease quantity of a product
  const decreaseQty = (id) => {
    setCart(cart.map(p => p.id === id && p.qty > 1 ? { ...p, qty: p.qty - 1 } : p));
  };

  // Remove a product from the cart
  const removeFromCart = (id) => {
    setCart(cart.filter(p => p.id !== id));
  };

  // Clear the entire cart
  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        increaseQty,
        decreaseQty,
        removeFromCart,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Custom hook for consuming the cart context
export const useCart = () => useContext(CartContext);
