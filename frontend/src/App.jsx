

import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

import Acceuil from "./pages/acceuil";
import AuthPage from "./pages/AuthPage";

import Panier from "./pages/Panier";
import Commande from "./pages/Commande";
import EcoommercePage from "./pages/EcommercePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Acceuil />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/cart" element={<Panier />} />
        <Route path="/confirmation" element={<Commande/>} />
        <Route path="/all-products" element= {<EcoommercePage/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;