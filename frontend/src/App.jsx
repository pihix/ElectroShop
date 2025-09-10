
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";

// Pages
import Acceuil from "./pages/acceuil";
import AuthPage from "./pages/AuthPage";
import Panier from "./pages/Panier";
import Commande from "./pages/Commande";
import EcoommercePage from "./pages/EcommercePage";
import { CartProvider } from "./composant/CartContext";

// // Admin Pages
// import Dashbord from "./pages/Admin/dashbord";
// import TableauBord from "./composant/Admin/TableauBord";
// import Clients from "./composant/Admin/Client";
// import Produits from "./composant/Admin/Produits";
// import Commandes from "./composant/Admin/Commande";

function App() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // Route privée pour admin
  const AdminRoute = ({ children }) => {
    if (!token || role !== "admin") {
      return <Navigate to="/auth" />;
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
        {/* Authentification */}
        <Route path="/auth" element={<AuthPage />}/>

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

        {/* Pages admin
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
        /> */}

        {/* Redirection par défaut */}
        <Route
          path="*"
          element={
            token ? (
              role === "admin" ? (
                <Navigate to="/admin" />
              ) : (
                <Navigate to="/" />
              )
            ) : (
              <Navigate to="/auth" />
            )
          }
        />
      </Routes>
    </BrowserRouter>
    </CartProvider>
  );
}

export default App;
