import axios from "axios";

const API_BASE = "http://localhost:8000";
const TOKEN = localStorage.getItem("token"); // Token admin

if (!TOKEN) console.error("Token admin manquant");

export const getAllCategories = async () => {
  const response = await axios.get(`${API_BASE}/categories`, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  });
  return response.data.data;
};

export const createCategory = async (categoryData) => {
  const response = await axios.post(`${API_BASE}/categories/create`, categoryData, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Content-Type": "application/json",
    },
  });
  console.log("Données de la catégorie :", categoryData);
  console.log("Réponse du serveur :", response.data);
  return response.data;
};

export const updateCategory = async (id, categoryData) => {
  const response = await axios.put(`${API_BASE}/categories/${id}`, categoryData, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

export const deleteCategory = async (id) => {
  const response = await axios.delete(`${API_BASE}/categories/${id}`, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  });
  return response.data;
};
