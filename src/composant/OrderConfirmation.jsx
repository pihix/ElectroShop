import React from "react";
import { FaCheckCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import "../assets/css/OrderConfirmation.css";

const OrderConfirmation = () => {
  return (
    <div className="confirmation-page">
      <FaCheckCircle className="confirmation-icon" />
      <h1 className="confirmation-title">Commande validée !</h1>
      <p className="confirmation-message">
        Nous avons bien reçu votre commande.<br />
        Nous allons la traiter et l’expédier dans les plus brefs délais !<br /><br />
        Merci pour votre confiance.<br />
        Santé !
      </p>
      <Link to="/" className="confirmation-btn">
        Continuer vos achats
      </Link>
    </div>
  );
};

export default OrderConfirmation;