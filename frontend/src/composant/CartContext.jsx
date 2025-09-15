// src/composant/CartContext.jsx
import React, { createContext, useState, useEffect } from "react";

// Création du contexte
export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // Charger le panier depuis localStorage
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(savedCart);
  }, []);

  // Sauvegarder le panier à chaque modification
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Ajouter un produit
  const addToCart = (product, quantity = 1) => {
    const existing = cart.find((p) => p.id === product.id);
    if (existing) {
      setCart(
        cart.map((p) =>
          p.id === product.id ? { ...p, quantity: p.quantity + quantity } : p
        )
      );
    } else {
      setCart([...cart, { ...product, quantity }]);
    }
  };

  // Mettre à jour la quantité
  const updateQuantity = (id, newQty) => {
    setCart(
      cart.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(newQty, 1) } : item
      )
    );
  };

  // Supprimer un produit
  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  // Compteur total
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // ✅ Fournir aussi setCart pour PayPalCheckout
  return (
    <CartContext.Provider
      value={{ cart, setCart, addToCart, updateQuantity, removeFromCart, cartCount }}
    >
      {children}
    </CartContext.Provider>
  );
};
