import axios from 'axios';
import configURL from '../config/configURL';
import api from "./api";

const {
  addEnquiryURL,
  getEnquiriesURL,
  deleteEnquiryURL
} = configURL;

const authService = {
  login: (data) => api.post("/auth/login", data),
  getProfile: () => api.get("/user/profile"), // will auto attach token
};

const addEnquiry = async (data) => {
  const token = localStorage.getItem("accessToken");
  return await axios.post(addEnquiryURL, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });
};

// enquiryService.js
const getEnquiries = async (search = "", interestLevel = "") => {
  const token = localStorage.getItem("accessToken");

  const params = new URLSearchParams();
  if (search) params.append("search", search);
  if (interestLevel && interestLevel !== "ALL") params.append("interestLevel", interestLevel);

  return await axios.get(`${getEnquiriesURL}?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });
};

const deleteEnquiry = async (enquiryId) => {
  const token = localStorage.getItem("accessToken");
  return await axios.delete(`${deleteEnquiryURL}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    data: { enquiryId }
  });
};

export default {
  addEnquiry,
  getEnquiries,
  deleteEnquiry,
  authService
};
