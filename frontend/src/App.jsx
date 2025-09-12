import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";

// Pages
import Acceuil from "./pages/acceuil";
import AuthPage from "./pages/AuthPage";
import AuthAdmin from "./pages/AuthAdmin";
import Panier from "./pages/Panier";
import Commande from "./pages/Commande";
import EcoommercePage from "./pages/EcommercePage";
import { CartProvider } from "./composant/CartContext";

// Admin Pages (décommenter si nécessaires)
import Dashbord from "./pages/Admin/dashbord";
import TableauBord from "./composant/Admin/TableauBord";
import Clients from "./composant/Admin/Client";
import Produits from "./composant/Admin/Produits";
import Commandes from "./composant/Admin/Commande";
import Categorie from "./composant/Admin/Categorie";

function App() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // Route privée pour admin
  const AdminRoute = ({ children }) => {
    if (!token || role !== "admin") {
      return <Navigate to="/auth/admin" />;
    }
    return children;
  };

  // Route privée pour client
  const ClientRoute = ({ children }) => {
    if (!token || role !== "user") {
      return <Navigate to="/auth" />;
    }
    return children;
  };

  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          {/* Pages de connexion */}
          <Route path="/auth" element={<AuthPage />} />       {/* Login utilisateur */}
          <Route path="/auth/admin" element={<AuthAdmin />} /> {/* Login admin */}

          {/* Pages clients */}
          <Route
            path="/"
            element={
              <ClientRoute>
                <Acceuil />
              </ClientRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <ClientRoute>
                <Panier />
              </ClientRoute>
            }
          />
          <Route
            path="/confirmation"
            element={
              <ClientRoute>
                <Commande />
              </ClientRoute>
            }
          />
          <Route
            path="/all-products"
            element={
              <ClientRoute>
                <EcoommercePage />
              </ClientRoute>
            }
          />

          {/* Pages admin */}
          {/* Décommenter quand les pages sont prêtes */}
          
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <Dashbord />
              </AdminRoute>
            }
          />
          <Route
            path="/dashbord"
            element={
              <AdminRoute>
                <TableauBord />
              </AdminRoute>
            }
          />
          <Route
            path="/clients"
            element={
              <AdminRoute>
                <Clients />
              </AdminRoute>
            }
          />
          <Route
            path="/produits"
            element={
              <AdminRoute>
                <Produits />
              </AdminRoute>
            }
          />
          <Route
            path="/list_commandes"
            element={
              <AdminRoute>
                <Commandes />
              </AdminRoute>
            }
          />


          <Route
            path="/categories"
            element={
              <AdminRoute>
                <Categorie />
              </AdminRoute>
            }
          />
         

          {/* Redirection par défaut */}
          <Route
            path="*"
            element={
              token ? (
                role === "admin" ? (
                  <Navigate to="/admin" />   // Redirection admin
                ) : (
                  <Navigate to="/" />        // Redirection user
                )
              ) : (
                <Navigate to="/auth" />      // Non connecté → page login user
              )
            }
          />
        </Routes>



        
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
