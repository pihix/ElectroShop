import React from "react";
import { FaTags, FaTruck, FaPhone } from "react-icons/fa";
import "../assets/css/TopBarre.css";

function TopBarre() {
  return (
    <div className="top-barre">
      {/* Gauche */}
      <div className="left">
        <span>
          <FaTags className="icon" />
        </span>
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
          <span><FaTruck className="icon" /></span>
          
        </div>
        <div className="info">
          <p>+33 744816334</p>
          <span><FaPhone className="icon" /></span>
        </div>
      </div>
    </div>
  );
}

export default TopBarre;
