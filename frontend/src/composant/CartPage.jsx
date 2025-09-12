import React, { useContext } from "react";
import { FaPlus, FaMinus, FaTrash } from "react-icons/fa";
import "../assets/css/CartPage.css";
import { Link } from "react-router-dom";
import { CartContext } from "./CartContext";

const CartPage = () => {
  const { cart, updateQuantity, removeFromCart } = useContext(CartContext);

  // Calculs
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const subTotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const delivery = 0;
  const total = subTotal + delivery;

  return (
    <div className="cart-page">
      <div className="cart-container">
        {/* Liste des produits */}
        <div className="cart-products">
          <h2>🛒 Mon Panier</h2>
          {cart.length === 0 ? (
            <p className="empty-cart">Votre panier est vide.</p>
          ) : (
            cart.map((item, index) => (
              <div key={`${item.id}-${index}`} className="cart-product">
                <img
                  src={item.image || "/placeholder.jpg"}
                  alt={item.name}
                  className="product-image"
                />
                <div className="product-info">
                  <span className="product-name">{item.name}</span>
                  <span className="product-unit-price">
                    {Number(item.price).toFixed(2)} €
                  </span>
                </div>
                <div className="quantity-control">
                  <button
                    onClick={() =>
                      updateQuantity(item.id, item.quantity > 1 ? item.quantity - 1 : 1)
                    }
                    className="qty-btn"
                  >
                    <FaMinus />
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="qty-btn"
                  >
                    <FaPlus />
                  </button>
                </div>
                <span className="product-total">
                  {(Number(item.price) * item.quantity).toFixed(2)} €
                </span>
                <button
                  className="remove-btn"
                  onClick={() => removeFromCart(item.id)}
                >
                  <FaTrash />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Résumé du panier */}
        <div className="cart-summary">
          <h2>Résumé</h2>
          <div className="summary-item">
            <span>Articles :</span>
            <span>{totalItems}</span>
          </div>
          <div className="summary-item">
            <span>Sous-total :</span>
            <span>{subTotal.toFixed(2)} €</span>
          </div>
          <div className="summary-item">
            <span>Livraison :</span>
            <span>{delivery === 0 ? "Gratuite" : `${delivery.toFixed(2)} €`}</span>
          </div>
          <div className="summary-item total">
            <span>Total :</span>
            <span>{total.toFixed(2)} €</span>
          </div>
          <Link to="/confirmation" className="checkout-btn">
            Valider la commande
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
