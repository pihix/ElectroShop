import React, { useState } from "react";
import { FaPlus, FaMinus, FaTrash } from "react-icons/fa";
import "../assets/css/CartPage.css";
import { Link } from "react-router-dom";

const initialCart = [
  {
    id: 1,
    name: "West Coast IPA",
    price: 6.3,
    quantity: 1,
    image: "https://via.placeholder.com/60x60/ffffff/000000?text=IPA",
  },
  {
    id: 2,
    name: "Syrah",
    price: 16.4,
    quantity: 2,
    image: "https://via.placeholder.com/60x60/ffffff/000000?text=Syrah",
  },
  {
    id: 3,
    name: "Blue Jamaica",
    price: 9.2,
    quantity: 1,
    image: "https://via.placeholder.com/60x60/ffffff/000000?text=Blue",
  },
];

const CartPage = () => {
  const [cart, setCart] = useState(initialCart);

  const increment = (id) => {
    setCart(
      cart.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decrement = (id) => {
    setCart(
      cart.map((item) =>
        item.id === id
          ? { ...item, quantity: item.quantity > 1 ? item.quantity - 1 : 1 }
          : item
      )
    );
  };

  const removeItem = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const subTotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const delivery = 0; // livraison gratuite
  const total = subTotal + delivery;

  return (
    <div className="cart-page">
      <div className="cart-container">
        {/* Liste des produits */}
        <div className="cart-products">
          <h2>PANIER</h2>
          {cart.map((item) => (
            <div key={item.id} className="cart-product">
              <img src={item.image} alt={item.name} className="product-image" />
              <div className="product-info">
                <span className="product-name">{item.name}</span>
                <span className="product-unit-price">{item.price.toFixed(2)} €</span>
              </div>
              <div className="quantity-control">
                <button onClick={() => decrement(item.id)}>-</button>
                <span>{item.quantity}</span>
                <button onClick={() => increment(item.id)}>+</button>
              </div>
              <span className="product-total">{(item.price * item.quantity).toFixed(2)} €</span>
              <button className="remove-btn" onClick={() => removeItem(item.id)}>
                <FaTrash />
              </button>
            </div>
          ))}
        </div>

        {/* Résumé du panier */}
        <div className="cart-summary">
          <h2>Total</h2>
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
          <div className="valide">
             <Link to="/confirmation" className="checkout-btn">VALIDER LA COMMANDE</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;