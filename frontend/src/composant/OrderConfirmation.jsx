import React, { useState, useEffect, useMemo } from "react";

import { FaCheckCircle } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable"; 
import "../assets/css/OrderConfirmation.css";

const OrderConfirmation = () => {
  const location = useLocation();

  // Récupération du panier
  const cart =
    location.state?.cart || JSON.parse(sessionStorage.getItem("lastCart")) || [];

   const [username, setUsername] = useState("");
   useEffect(() => {
     const storedUsername = localStorage.getItem("username");
     if (storedUsername) {
       setUsername(storedUsername);
     }
   }, []);

  // Numéro de commande et date
  const orderNumber = useMemo(() => "CMD-" + Date.now(), []);
  const orderDate = useMemo(
    () =>
      new Date().toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
    []
  );

  const total = useMemo(() => {
    return cart
      .reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0)
      .toFixed(2);
  }, [cart]);

  const generatePDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Facture de commande", 14, 20);

    doc.setFontSize(12);
    doc.text(`Nom du client : ${username}`, 14, 26); // ✅ Ajout du nom
    doc.text(`Numéro de commande : ${orderNumber}`, 14, 32);
    doc.text(`Date : ${orderDate}`, 14, 38);

    const tableRows = cart.map((item) => [
      item.name || item.title || "Produit",
      item.quantity,
      parseFloat(item.price).toFixed(2) + " €",
      (item.quantity * parseFloat(item.price)).toFixed(2) + " €",
    ]);

    autoTable(doc, {
      startY: 48,
      head: [["Produit", "Quantité", "Prix unitaire", "Sous-total"]],
      body: tableRows,
      foot: [["", "", "TOTAL", `${total} €`]],
    });

    doc.save(`facture-${orderNumber}.pdf`);
  };

  return (
    <div className="confirmation-page">
      <div className="confirmation-card">
        <FaCheckCircle className="confirmation-icon" />
        <h1 className="confirmation-title">🎉 Commande validée !</h1>
        <p className="confirmation-message">
          Bonjour <strong>{username}</strong> 👋<br />
          Numéro de commande : <strong>{orderNumber}</strong>
          <br />
          Date : {orderDate}
        </p>

        {cart.length > 0 && (
          <div className="invoice">
            <h2>Facture</h2>
            <table
              className="invoice-table"
              style={{
                borderCollapse: "separate",
                borderSpacing: "0",
                width: "100%",
                borderRadius: "12px",
                overflow: "hidden",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
            >
              <thead style={{ backgroundColor: "#f4f4f4" }}>
                <tr>
                  <th style={{ border: "1px solid #ddd", padding: "12px" }}>
                    Produit
                  </th>
                  <th style={{ border: "1px solid #ddd", padding: "12px" }}>
                    Quantité
                  </th>
                  <th style={{ border: "1px solid #ddd", padding: "12px" }}>
                    Prix unitaire (€)
                  </th>
                  <th style={{ border: "1px solid #ddd", padding: "12px" }}>
                    Sous-total (€)
                  </th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item, index) => (
                  <tr
                    key={index}
                    style={{
                      backgroundColor: index % 2 === 0 ? "#fff" : "#fafafa",
                    }}
                  >
                    <td style={{ border: "1px solid #ddd", padding: "12px" }}>
                      {item.name}
                    </td>
                    <td
                      style={{
                        border: "1px solid #ddd",
                        padding: "12px",
                        textAlign: "center",
                      }}
                    >
                      {item.quantity}
                    </td>
                    <td
                      style={{
                        border: "1px solid #ddd",
                        padding: "12px",
                        textAlign: "right",
                      }}
                    >
                      {parseFloat(item.price).toFixed(2)}
                    </td>
                    <td
                      style={{
                        border: "1px solid #ddd",
                        padding: "12px",
                        textAlign: "right",
                      }}
                    >
                      {(item.quantity * parseFloat(item.price)).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr style={{ backgroundColor: "#f4f4f4" }}>
                  <td
                    colSpan={3}
                    style={{
                      textAlign: "right",
                      fontWeight: "bold",
                      border: "1px solid #ddd",
                      padding: "12px",
                    }}
                  >
                    Total :
                  </td>
                  <td
                    style={{
                      fontWeight: "bold",
                      border: "1px solid #ddd",
                      padding: "12px",
                      textAlign: "right",
                    }}
                  >
                    {total} €
                  </td>
                </tr>
              </tfoot>
            </table>

            <br />
            <button onClick={generatePDF} className="confirmation-btn">
              Télécharger la facture en PDF
            </button>
          </div>
        )}
        <br />
        <Link to="/" className="confirmation-btn">
          Continuer vos achats
        </Link>
      </div>
    </div>
  );
};

export default OrderConfirmation;


