

import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

import Acceuil from "./pages/acceuil";
import AuthPage from "./pages/AuthPage";

import Panier from "./pages/Panier";
import Commande from "./pages/Commande";
import EcoommercePage from "./pages/EcommercePage";
import Dashbord from "./pages/Admin/dashbord";
import TableauBord from "./composant/Admin/TableauBord";
import Clients from "./composant/Admin/Client";
import Produits from "./composant/Admin/Produits";
import Commandes from "./composant/Admin/Commande";



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
  );
}

export default App;
