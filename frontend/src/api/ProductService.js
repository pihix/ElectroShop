import axios from "axios";

const API_BASE = "http://localhost:8000";
const TOKEN = localStorage.getItem("token"); // Token admin

if (!TOKEN) console.error("Token admin manquant");

export const getAllProducts = async (page = 1, limit = 10) => {
  const response = await axios.get(`${API_BASE}/products?page=${page}&limit=${limit}`, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  });
  return response.data.data;
};

export const createProduct = async (productData) => {
  const response = await axios.post(`${API_BASE}/products`, productData, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Content-Type": "application/json",
    },
  });
  console.log("Produit créé :", response.data);
  return response.data;
};

export const updateProduct = async (id, productData) => {
  const response = await axios.put(`${API_BASE}/products/${id}`, productData, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

export const deleteProduct = async (id) => {
  const response = await axios.delete(`${API_BASE}/products/${id}`, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  });
  return response.data;
};

export const getAllCategories = async () => {
  const response = await axios.get(`${API_BASE}/categories`, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  });
  return response.data.data;
};
