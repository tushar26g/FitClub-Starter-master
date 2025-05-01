import axios from "axios";
import configURL from "../config/configURL";

const {
  loginOwnerAdminURL,
  getAllOwnersURL,
  adminAnalysisURL,
} = configURL;

// 🔐 Admin or Owner Login (returns token)
const login = async (credentials) => {
  const response = await axios.post(loginOwnerAdminURL, credentials);
  return response.data; // { token, role, ... }
};

// 📋 Get All Gym Owners (requires token)
const getAllOwners = async (token) => {
  const response = await axios.get(getAllOwnersURL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// 📈 Get Admin Analytics / Growth Data (requires token)
const getAdminAnalysis = async (token) => {
  const response = await axios.get(adminAnalysisURL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export default {
  login,
  getAllOwners,
  getAdminAnalysis,
};
