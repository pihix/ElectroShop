import React from "react";
import { FaTags, FaTruck, FaPhone } from "react-icons/fa";
import "../assets/css/TopBarre.css";

function TopBarre() {
  return (
    <div className="top-barre">
      {/* Gauche */}
      <div className="left">
<<<<<<< HEAD
        <span>
          <FaTags className="icon" />
        </span>
=======
        <FaTags className="icon" />
>>>>>>> b00c15d9fb1abe2b7e2b2a088a70eb71b4541158
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
<<<<<<< HEAD
          <span><FaTruck className="icon" /></span>
          
        </div>
        <div className="info">
          <p>+33 744816334</p>
          <span><FaPhone className="icon" /></span>
=======
          <FaTruck className="icon" />
        </div>
        <div className="info">
          <p>+33 744816334</p>
          <FaPhone className="icon" />
>>>>>>> b00c15d9fb1abe2b7e2b2a088a70eb71b4541158
        </div>
      </div>
    </div>
  );
}

export default TopBarre;
