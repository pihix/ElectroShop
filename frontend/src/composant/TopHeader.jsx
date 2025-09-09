import React from "react";
import { FaSearch, FaUser, FaShoppingCart, FaBars, FaStore } from "react-icons/fa";
import "../assets/css/TopHeader.css";
import { Link } from "react-router-dom";


function TopHeader() {
  return (
    <header className="top-header">
      {/* Logo */}
      <div className="logo">
        <FaStore className="icon" />
        <Link to="/" className="action"> 
              <h2>ElectroSHop</h2>
        </Link>
      </div>

      {/* Barre de recherche */}
      <div className="search-bar">
        <input type="text" placeholder="Rechercher ordinateur, téléphone ..." />
        <FaSearch className="search-icon" />
      </div>

     

      {/* Actions utilisateur */}
      <div className="actions">
        <div className="action">
          <Link to="/auth" className="action">
            <FaUser /> <span>Connexion</span>
          </Link>
        </div>
        <div className="action">
           <Link to="/cart" className="action">
             <FaShoppingCart /> <span>Panier</span>
          </Link>
        </div>
      </div>
    </header>
  );
}

export default TopHeader;
