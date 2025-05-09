import axios from 'axios';
import configURL from '../config/configURL';
// import api from "./api";
import { isMembershipExpired } from "../Utils/membershipUtils";

const {
  addMemberURL,
  getMembersByOwnerURL,
  deleteMemberURL,
  updateMembershipStatusURL,
  updateMemberURL,
  importMembersURL,
  analysisMemberURL
} = configURL;

// const authService = {
//   login: (data) => api.post("/auth/login", data),
//   getProfile: () => api.get("/user/profile"), // will auto attach token
// };

const addMember = async (formData) => {
  const ownerData = JSON.parse(localStorage.getItem('owner'));

  if (isMembershipExpired(ownerData)) {
    console.log("Membership expired. Redirecting to renew page.");
    window.location.href = '/renew-owner';
    return;
  }
  const token = localStorage.getItem('accessToken');
  return await axios.post(addMemberURL, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data'
    }
  });
};

const getMembers = async () => {
  const ownerData = JSON.parse(localStorage.getItem('owner'));

  if (isMembershipExpired(ownerData)) {
    window.location.href = '/renew-owner'; // or use navigate()
    return;
  }
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
      console.log("Unauthorized or expired token. Logging out.");
      localStorage.clear();
    } 
throw error;
}
};

const deleteMember = async (memberId) => {
  const ownerData = JSON.parse(localStorage.getItem('owner'));

  if (isMembershipExpired(ownerData)) {
    console.log("Membership expired. Redirecting to renew page.");
    window.location.href = '/renew-owner';
    return;
  }
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
  const ownerData = JSON.parse(localStorage.getItem('owner'));

  if (isMembershipExpired(ownerData)) {
    console.log("Membership expired. Redirecting to renew page.");
    window.location.href = '/renew-owner';
    return;
  }
  const token = localStorage.getItem('accessToken');
  return await axios.post(updateMembershipStatusURL, data, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

const updateMember = async (data) => {
  const ownerData = JSON.parse(localStorage.getItem('owner'));

  if (isMembershipExpired(ownerData)) {
    console.log("Membership expired. Redirecting to renew page.");
    window.location.href = '/renew-owner';
    return;
  }
  const token = localStorage.getItem('accessToken');
  return await axios.put(updateMemberURL, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data'
    }
  });
};

const importMembers = async (jsonData) => {
  const ownerData = JSON.parse(localStorage.getItem('owner'));

  if (isMembershipExpired(ownerData)) {
    console.log("Membership expired. Redirecting to renew page.");
    window.location.href = '/renew-owner';
    return;
  }
  const token = localStorage.getItem('accessToken');
  return await axios.post(importMembersURL, jsonData, {
    headers: {
      Authorization: `Bearer ${token}`
      // ✅ DO NOT set 'Content-Type': 'multipart/form-data' manually
    }
  });
};

const analysisMembers = async () => {
  const ownerData = JSON.parse(localStorage.getItem('owner'));

  if (isMembershipExpired(ownerData)) {
    console.log("Membership expired. Redirecting to renew page.");
    window.location.href = '/renew-owner';
    return;
  }
  try {
  const token = localStorage.getItem('accessToken');
  const response = await axios.get(analysisMemberURL, {
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

export default {
  addMember,
  getMembers,
  deleteMember,
  updateStatus,
  updateMember,
  importMembers,
  analysisMembers,
};
