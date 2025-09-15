<<<<<<< HEAD


import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
=======
import { AuthProvider, AuthContext } from "./composant/AuthContext.jsx";
import React, { useContext } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
>>>>>>> b00c15d9fb1abe2b7e2b2a088a70eb71b4541158
import "./App.css";

import Acceuil from "./pages/acceuil";
import AuthPage from "./pages/AuthPage";
<<<<<<< HEAD

import Panier from "./pages/Panier";
import Commande from "./pages/Commande";
import EcoommercePage from "./pages/EcommercePage";
=======
import AuthAdmin from "./pages/AuthAdmin";
import Panier from "./pages/Panier";
import Commande from "./pages/Commande";
import EcoommercePage from "./pages/EcommercePage";
import { CartProvider } from "./composant/CartContext";

>>>>>>> b00c15d9fb1abe2b7e2b2a088a70eb71b4541158
import Dashbord from "./pages/Admin/dashbord";
import TableauBord from "./composant/Admin/TableauBord";
import Clients from "./composant/Admin/Client";
import Produits from "./composant/Admin/Produits";
import Commandes from "./composant/Admin/Commande";
<<<<<<< HEAD



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Acceuil />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/cart" element={<Panier />} />
        <Route path="/confirmation" element={<Commande/>} />
        <Route path="/all-products" element= {<EcoommercePage/>} />
        {/* <Route path="/admin" element={<Dashbord/>} /> */}
        <Route path="/dashbord" element={<TableauBord/>} />
        <Route path="/clients" element={<Clients/>} />
        <Route path="/produits" element={<Produits/>} />
        <Route path="/list_commandes" element={<Commandes/>} />

      </Routes>
    </BrowserRouter>
=======
import Categorie from "./composant/Admin/Categorie";

function RoutesWrapper() {
  const { token, role } = useContext(AuthContext);

  const AdminRoute = ({ children }) => {
    if (!token || role !== "admin") return <Navigate to="/auth/admin" />;
    return children;
  };

  const ClientRoute = ({ children }) => {
    if (!token || role !== "user") return <Navigate to="/auth" />;
    return children;
  };

  return (
    <Routes>
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/auth/admin" element={<AuthAdmin />} />

      <Route path="/" element={<ClientRoute><Acceuil /></ClientRoute>} />
      <Route path="/cart" element={<ClientRoute><Panier /></ClientRoute>} />
      <Route path="/confirmation" element={<ClientRoute><Commande /></ClientRoute>} />
      <Route path="/all-products" element={<ClientRoute><EcoommercePage /></ClientRoute>} />

      <Route path="/admin" element={<AdminRoute><Dashbord /></AdminRoute>} />
      <Route path="/dashbord" element={<AdminRoute><TableauBord /></AdminRoute>} />
      <Route path="/clients" element={<AdminRoute><Clients /></AdminRoute>} />
      <Route path="/produits" element={<AdminRoute><Produits /></AdminRoute>} />
      <Route path="/list_commandes" element={<AdminRoute><Commandes /></AdminRoute>} />
      <Route path="/categories" element={<AdminRoute><Categorie /></AdminRoute>} />

      <Route
        path="*"
        element={
          token ? (
            role === "admin" ? <Navigate to="/admin" /> : <Navigate to="/" />
          ) : (
            <Navigate to="/auth" />
          )
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <RoutesWrapper />
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
>>>>>>> b00c15d9fb1abe2b7e2b2a088a70eb71b4541158
  );
}

export default App;
