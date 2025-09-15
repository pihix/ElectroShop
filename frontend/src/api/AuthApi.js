import axios from "axios";

const BASE = "http://localhost:8000";
const AUTH_URL = `${BASE}/auth`;

export const loginUser = async (username, password) => {
  try {
    const formData = new URLSearchParams();
    formData.append("username", username);
    formData.append("password", password);

    const response = await axios.post(`${AUTH_URL}/login`, formData, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    console.log("LOGIN RESPONSE ===>", response.data); 
    return response.data; 
  } catch (error) {
    console.error("LOGIN ERROR ===>", error.response?.data || error.message);
    throw error.response?.data || { detail: "Erreur lors de la connexion" };
  }
};
/**
 * Signup — envoie JSON
 */
export const signupUser = async (userData) => {
  try {
    const res = await axios.post(`${AUTH_URL}/signup`, userData, {
      headers: { "Content-Type": "application/json" },
    });
    return res.data;
  } catch (err) {
    if (err.response?.data) throw err.response.data;
    throw { detail: err.message || "Erreur lors de l'inscription" };
  }
};
