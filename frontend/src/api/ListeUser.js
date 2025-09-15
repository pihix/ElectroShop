import axios from "axios";

export const getAllUsers = async () => {
  const token = localStorage.getItem("token"); // récupère le token admin
  if (!token) throw new Error("Token admin manquant");

  const response = await axios.get("http://localhost:8000/admin/users", {
    headers: {
      Authorization: `Bearer ${token}`, 
    },
  });

  console.log("Users fetched:", response.data);

  return response.data.data; // ResponseHandler renvoie {success, data, message}
};
