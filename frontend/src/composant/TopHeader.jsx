import React, { useState, useEffect, useContext } from "react";

import { FaSearch, FaUser, FaShoppingCart, FaStore } from "react-icons/fa";
import "../assets/css/TopHeader.css";
import { Link } from "react-router-dom";
import { CartContext } from "./CartContext";


function TopHeader() {
  const [username, setUsername] = useState("");
 const { cartCount } = useContext(CartContext);
  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

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
          {username ? (
            <span>
              <FaUser /> <span>{username}</span>
            </span>
          ) : (
            <Link to="/auth" className="action">
              <FaUser /> <span>Connexion</span>
            </Link>
          )}
        </div>

        <div className="action">
          <Link to="/cart" className="action">
            <FaShoppingCart /> <span>Panier ({cartCount})</span>
          </Link>
        </div>
      </div>
    </header>
  );
}

export default TopHeader;





