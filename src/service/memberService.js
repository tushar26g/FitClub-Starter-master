import axios from 'axios';
import configURL from '../config/configURL';
import api from "./api";

const {
  addMemberURL,
  getMembersByOwnerURL,
  deleteMemberURL,
  updateMembershipStatusURL,
  updateMemberURL,
  importMembersURL
} = configURL;

const authService = {
  login: (data) => api.post("/auth/login", data),
  getProfile: () => api.get("/user/profile"), // will auto attach token
};

const addMember = async (formData) => {
  const token = localStorage.getItem('accessToken');
  return await axios.post(addMemberURL, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data'
    }
  });
};

const getMembers = async () => {
  try {
  const token = localStorage.getItem('accessToken');
  const response = await axios.get(getMembersByOwnerURL, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });  
  return response;
} catch (error) {
  if (error.response && error.response.status === 403) {
      console.warn("Unauthorized or expired token. Logging out.");
      localStorage.clear();
    } 
throw error;
}
};

const deleteMember = async (memberId) => {
  const token = localStorage.getItem('accessToken');
  try {
    const response = await axios.delete(`${deleteMemberURL}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      data: { memberId },
    });
    return response;
  } catch (error) {
    console.error("Error deleting member:", error);
    throw error;
  }
};

const updateStatus = async (data) => {
  const token = localStorage.getItem('accessToken');
  return await axios.post(updateMembershipStatusURL, data, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

const updateMember = async (data) => {
  const token = localStorage.getItem('accessToken');
  return await axios.put(updateMemberURL, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data'
    }
  });
};

const importMembers = async (jsonData) => {
  const token = localStorage.getItem('accessToken');
  return await axios.post(importMembersURL, jsonData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
};

export default {
  addMember,
  getMembers,
  deleteMember,
  updateStatus,
  updateMember,
  importMembers,
  authService
};
