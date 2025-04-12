import axios from "axios";
import configURL from "../config/configURL";

const { registerOwnerURL, loginOwnerAdminURL } = configURL;

// ✅ Register a gym owner (no token required)
const registerOwner = async (ownerData) => {
  const response = await axios.post(registerOwnerURL, ownerData);
  return response.data; // Usually returns a message or registered user info
};

// 🔐 Login as Owner or Admin (no token required)
const login = async (credentials) => {
  const response = await axios.post(loginOwnerAdminURL, credentials);
  return response.data; // Expected to return { token, role, ... }
};

export default {
  registerOwner,
  login,
};
