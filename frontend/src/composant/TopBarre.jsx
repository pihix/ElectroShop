import React from "react";
import { FaTags, FaTruck, FaPhone } from "react-icons/fa";
import "../assets/css/TopBarre.css";

function TopBarre() {
  return (
    <div className="top-barre">
      {/* Gauche */}
      <div className="left">
        <FaTags className="icon" />
        <p>
          Bienvenue chez <span>ElectroShop</span>
        </p>
      </div>

      {/* Droite */}
      <div className="right">
        <div className="info">
          <p>
            Livraison gratuite à <span>38100</span>
          </p>
          <FaTruck className="icon" />
        </div>
        <div className="info">
          <p>+33 744816334</p>
          <FaPhone className="icon" />
        </div>
      </div>
    </div>
  );
}

export default TopBarre;
