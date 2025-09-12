import React, { createContext, useState, useEffect } from "react";

// Création du contexte du panier
export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // Charger le panier depuis localStorage au démarrage
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(savedCart);
  }, []);

  // Sauvegarder le panier dans localStorage à chaque modification
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Ajouter un produit au panier
  const addToCart = (product, quantity = 1) => {
    const existing = cart.find((p) => p.id === product.id);
    if (existing) {
      // Si le produit existe déjà, on incrémente sa quantité
      setCart(
        cart.map((p) =>
          p.id === product.id ? { ...p, quantity: p.quantity + quantity } : p
        )
      );
    } else {
      // Sinon, on l’ajoute au panier
      setCart([...cart, { ...product, quantity }]);
    }
  };

  // Mettre à jour la quantité d’un produit
  const updateQuantity = (id, newQty) => {
    setCart(
      cart.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(newQty, 1) } : item
      )
    );
  };

  // Supprimer un produit du panier
  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  // Compteur total pour l’icône panier
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, updateQuantity, removeFromCart, cartCount }}
    >
      {children}
    </CartContext.Provider>
  );
};
