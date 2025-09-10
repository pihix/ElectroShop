import React, { useState, useEffect } from "react";
import "../assets/css/AuthPage.css";
import { useNavigate } from "react-router-dom";
import { loginUser, signupUser } from "../api/AuthApi";
import axios from "axios";

const AuthPage = () => {
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
  

  // Si token déjà présent (rafraîchissement de page), on configure axios
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
        
        const data = await loginUser(form.username, form.password);

        // Sauvegarde du token
        localStorage.setItem("token", data.access_token);

        // Sauvegarde du role s'il est présent (sinon on met "user" par défaut)
         const type = data.data?.role ?? "user";
        localStorage.setItem("role", type);

        // S'assurer qu'axios a l'header Authorization (au cas où)
        axios.defaults.headers.common["Authorization"] = `Bearer ${data.access_token}`;


        // Sauvegarde du token et rôle
        localStorage.setItem("token", data.access_token);

        const role= data.data?.role ?? "user";
        localStorage.setItem("role", role);

        // Sauvegarde du username pour afficher dans le header
        localStorage.setItem("username", form.username);
        
        if (role === "admin") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      } else {
        // --------------------
        // SIGNUP
        // --------------------
        await signupUser({
          username: form.username,
          email: form.email,
          full_name: form.full_name,
          password: form.password,
        });

        alert("Compte créé avec succès 🎉 — Connecte-toi maintenant");
        setIsLogin(true);
        // Optionnel : vider le password
        setForm({ ...form, password: "" });
      }
    } catch (err) {
      // err peut être { detail: "..."} ou un objet plus complexe
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
        <h1 className="auth-title">Bienvenue chez ElectroShop</h1>
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
            <label htmlFor="username">Nom d'utilisateur</label>
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
            {loading ? (isLogin ? "Connexion..." : "Création...") : isLogin ? "Se connecter" : "Créer mon compte"}
          </button>
        </form>

        <p className="toggle-text">
          {isLogin ? "Pas encore de compte ?" : "Déjà un compte ?"}{" "}
          <span onClick={toggleForm} className="toggle-link" style={{ cursor: "pointer" }}>
            {isLogin ? "Créer un compte" : "Se connecter"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
