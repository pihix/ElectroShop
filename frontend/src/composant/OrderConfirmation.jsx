import React from "react";
import { FaCheckCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import "../assets/css/OrderConfirmation.css";

const OrderConfirmation = () => {
  return (
    <div className="confirmation-page">
      <div className="confirmation-card">
        <FaCheckCircle className="confirmation-icon" />
        <h1 className="confirmation-title">🎉 Commande validée !</h1>
        <p className="confirmation-message">
          Nous avons bien reçu votre commande.<br />
          Elle est en cours de préparation et sera expédiée très bientôt.<br /><br />
          Merci pour votre confiance!
        </p>
        <Link to="/" className="confirmation-btn">
          Continuer vos achats
        </Link>
      </div>
    </div>
  );
};

export default OrderConfirmation;
