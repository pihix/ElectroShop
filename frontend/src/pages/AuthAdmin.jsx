import React, { useState, useEffect, useContext } from "react";
import "../assets/css/AuthPage.css";
import { useNavigate } from "react-router-dom";
import { loginUser, signupUser } from "../api/AuthApiAdmin";
import axios from "axios";
import { AuthContext } from "../composant/AuthContext.jsx";

const AuthAdmin = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({
    username: "",
    email: "",
    full_name: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const { setToken, setRole } = useContext(AuthContext);

  // Configure axios si token déjà présent (rafraîchissement de page)
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }, []);

  const toggleForm = () => {
    setError(null);
    setIsLogin(!isLogin);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isLogin) {
        // --------------------
        // LOGIN ADMIN
        // --------------------
        const data = await loginUser(form.username, form.password);
        const token = data.access_token;
        const role = data.data?.role ?? "admin";

        // 🔥 Mise à jour immédiate du contexte
        setToken(token);
        setRole(role);

        // Configurer axios pour les prochaines requêtes
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        // Sauvegarde dans localStorage (persistance après refresh)
        localStorage.setItem("token", token);
        localStorage.setItem("role", role);
        localStorage.setItem("username", form.username);

        console.log("role :", role);

        // Redirection
        if (role === "admin") {
          navigate("/dashbord");
        } else {
          navigate("/");
        }
      } else {
        // --------------------
        // SIGNUP ADMIN
        // --------------------
        await signupUser({
          username: form.username,
          email: form.email,
          full_name: form.full_name,
          password: form.password,
        });

        alert("Compte admin créé avec succès 🎉 — Connecte-toi maintenant");
        setIsLogin(true);
        setForm({ ...form, password: "" }); // Reset mot de passe
      }
    } catch (err) {
      const message =
        err?.detail ??
        err?.message ??
        (typeof err === "string" ? err : "Erreur inconnue");
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">Connexion Administrateur</h1>
        <h2>{isLogin ? "Connexion" : "Créer un compte"}</h2>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="full_name">Nom complet</label>
              <input
                type="text"
                id="full_name"
                placeholder="Votre nom"
                required
                value={form.full_name}
                onChange={handleChange}
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="username">Nom Admin</label>
            <input
              type="text"
              id="username"
              placeholder="Nom d'utilisateur"
              required
              value={form.username}
              onChange={handleChange}
            />
          </div>

          {!isLogin && (
            <div className="form-group">
              <label htmlFor="email">Adresse email</label>
              <input
                type="email"
                id="email"
                placeholder="exemple@email.com"
                required
                value={form.email}
                onChange={handleChange}
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="password">Mot de passe</label>
            <input
              type="password"
              id="password"
              placeholder="********"
              required
              autoComplete={isLogin ? "current-password" : "new-password"}
              value={form.password}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading
              ? isLogin
                ? "Connexion..."
                : "Création..."
              : isLogin
              ? "Se connecter"
              : "Créer un compte"}
          </button>
        </form>

        <p className="toggle-text">
          {isLogin ? "Pas encore de compte ?" : "Déjà un compte ?"}{" "}
          <span
            onClick={toggleForm}
            className="toggle-link"
            style={{ cursor: "pointer" }}
          >
            {isLogin ? "Créer un compte" : "Se connecter"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default AuthAdmin;