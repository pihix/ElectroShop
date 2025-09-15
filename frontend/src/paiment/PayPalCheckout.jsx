// src/composant/PayPalCheckout.jsx
import React, { useContext, useMemo } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { CartContext } from "../composant/CartContext"; // Vérifie le chemin

const PayPalCheckout = () => {
  const { cart, setCart } = useContext(CartContext);

  // Calcul du total
  const total = useMemo(() => {
    return cart.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0).toFixed(2);
  }, [cart]);

  if (cart.length === 0) return null;

  return (
    <PayPalScriptProvider
      options={{
        "client-id": "AfsEaJAzdCyVecPy56j_joe-4Rs2Zg7VNCXF12vgAfUKcTDlXY209Xiwr5FrGLG5iGsgGGVM6pb2mLsO",
        currency: "EUR",
        intent: "capture",
      }}
    >
      <PayPalButtons
        style={{ layout: "vertical", color: "blue", shape: "rect", label: "paypal" }}
        createOrder={(data, actions) => {
          return actions.order.create({
            purchase_units: [
              { amount: { value: total } }
            ],
          });
        }}
        onApprove={async (data, actions) => {
          const order = await actions.order.capture();
          console.log("Paiement réussi :", order);
          alert("Paiement simulé avec succès !");
          setCart([]); // Vider le panier après paiement
        }}
        onError={(err) => {
          console.error("Erreur PayPal :", err);
          alert("Erreur lors du paiement PayPal !");
        }}
      />
    </PayPalScriptProvider>
  );
};

export default PayPalCheckout;
