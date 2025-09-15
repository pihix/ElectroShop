<<<<<<< HEAD
import React from "react";
import { FaSearch, FaUser, FaShoppingCart, FaBars, FaStore } from "react-icons/fa";
import "../assets/css/TopHeader.css";
import { Link } from "react-router-dom";


function TopHeader() {
=======
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

>>>>>>> b00c15d9fb1abe2b7e2b2a088a70eb71b4541158
  return (
    <header className="top-header">
      {/* Logo */}
      <div className="logo">
        <FaStore className="icon" />
<<<<<<< HEAD
        <Link to="/" className="action"> 
              <h2>ElectroSHop</h2>
=======
        <Link to="/" className="action">
          <h2>ElectroSHop</h2>
>>>>>>> b00c15d9fb1abe2b7e2b2a088a70eb71b4541158
        </Link>
      </div>

      {/* Barre de recherche */}
      <div className="search-bar">
        <input type="text" placeholder="Rechercher ordinateur, téléphone ..." />
        <FaSearch className="search-icon" />
      </div>

<<<<<<< HEAD
     

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
=======
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
>>>>>>> b00c15d9fb1abe2b7e2b2a088a70eb71b4541158
          </Link>
        </div>
      </div>
    </header>
  );
}

export default TopHeader;
<<<<<<< HEAD
=======





>>>>>>> b00c15d9fb1abe2b7e2b2a088a70eb71b4541158
