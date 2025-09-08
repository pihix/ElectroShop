import React, { useState } from "react";
import "../assets/css/AuthPage.css";
import { useNavigate } from "react-router-dom";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();


  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  const handleSubmit = (e) => {
  e.preventDefault();
  if (isLogin) {
    // TODO: login API call
    alert("Connexion réussie ✅");
    navigate("/"); 
  } else {
    // TODO: register API call
    alert("Compte créé avec succès 🎉");
    setIsLogin(true); 
  }
};


  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* Nouveau titre principal */}
        <h1 className="auth-title">Bienvenue chez ElectroShop</h1>

        <h2>{isLogin ? "Connexion" : "Créer un compte"}</h2>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="name">Nom complet</label>
              <input type="text" id="name" placeholder="Votre nom" required />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Adresse email</label>
            <input
              type="email"
              id="email"
              placeholder="exemple@email.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Mot de passe</label>
            <input
              type="password"
              id="password"
              placeholder="********"
              required
            />
          </div>

          <button type="submit" className="auth-btn">
            {isLogin ? "Se connecter" : "Créer mon compte"}
          </button>
        </form>

        <p className="toggle-text">
          {isLogin ? "Pas encore de compte ?" : "Déjà un compte ?"}{" "}
          <span onClick={toggleForm} className="toggle-link">
            {isLogin ? "Créer un compte" : "Se connecter"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
