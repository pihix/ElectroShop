import React, { useContext, useMemo, useState } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { CartContext } from "../composant/CartContext";
import { useNavigate } from "react-router-dom";

const PayPalCheckout = () => {
  const { cart, setCart } = useContext(CartContext);
  const [commandeId, setCommandeId] = useState(null);
  const navigate = useNavigate();

  // Calcul du total
  const total = useMemo(() => {
    return cart
      .reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0)
      .toFixed(2);
  }, [cart]);

  // Préparer les lignes de commande
  const lignes_commande = useMemo(
    () =>
      cart.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
        prix_unitaire: parseFloat(item.price),
      })),
    [cart]
  );

  if (cart.length === 0) return null;

  // Création de la commande côté backend avec vérification du stock
  const createCommandeBackend = async () => {
    try {
      const response = await fetch("http://34.236.156.56:8000/commandes/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ lignes_commande }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Stock insuffisant ou autre erreur côté backend
        throw new Error(data.error || "Erreur lors de la création de la commande");
      }

      setCommandeId(data.data.id);
      return data.data.id;
    } catch (error) {
      console.error("Erreur création commande:", error);
      throw error;
    }
  };

  return (
    <PayPalScriptProvider
      options={{
        "client-id":
          "AfsEaJAzdCyVecPy56j_joe-4Rs2Zg7VNCXF12vgAfUKcTDlXY209Xiwr5FrGLG5iGsgGGVM6pb2mLsO",
        currency: "EUR",
        intent: "capture",
      }}
    >
      <PayPalButtons
        style={{ layout: "vertical", color: "blue", shape: "rect", label: "paypal" }}
        createOrder={async (data, actions) => {
          // Vérifier le stock côté backend avant de créer le paiement
          try {
            await createCommandeBackend();
          } catch (err) {
            alert(err.message);
            throw err; // Stoppe la création du paiement
          }

          return actions.order.create({
            purchase_units: [{ amount: { value: total } }],
          });
        }}
        onApprove={async (data, actions) => {
          const order = await actions.order.capture();
          console.log("Paiement réussi :", order);

          try {
            // Confirmer le paiement côté backend
            await fetch(`http://34.236.156.56:8000/commandes/${commandeId}/confirmer-paiement`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            });

            // Sauvegarder le panier pour la page de confirmation
            sessionStorage.setItem("lastCart", JSON.stringify(cart));

            alert("Paiement confirmé et commande validée !");
            navigate("/confirmation", { state: { cart } });
            setCart([]); // Vider le panier
          } catch (err) {
            console.error(err);
            alert("Erreur lors de la confirmation de la commande !");
          }
        }}
        onError={(err) => {
          console.error("Erreur PayPal :", err);
          alert(
            "Erreur lors du paiement PayPal. Vérifiez votre panier et réessayez. Le stock peut avoir changé."
          );
        }}
      />
    </PayPalScriptProvider>
  );
};

export default PayPalCheckout;
