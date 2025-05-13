import axios from "axios";
import configURL from "../config/configURL";

const { registerOwnerURL, loginOwnerAdminURL, publicContactURL, forgotPasswordURL } = configURL;

// ✅ Register a gym owner (no token required)
const registerOwner = async (ownerData) => {
  const response = await axios.post(registerOwnerURL, ownerData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data; // Usually returns a message or registered user info
};

// 🔐 Login as Owner or Admin (no token required)
const login = async (credentials) => {
  const response = await axios.post(loginOwnerAdminURL, credentials);
  return response.data; // Expected to return { token, role, ... }
};

const sendContactQuery = async (data) => {
  const response = await axios.post(publicContactURL, data);
  return response.data;
};

const forgotPassword = async ({ mobileNumber }) => {
  const response = await axios.post(forgotPasswordURL, { mobileNumber });
  return response.data;
};

export default {
  registerOwner,
  login,
  sendContactQuery,
  forgotPassword,
};
