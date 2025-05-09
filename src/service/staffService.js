import axios from 'axios';
import configURL from '../config/configURL';
import api from "./api";
import { isMembershipExpired } from "../Utils/membershipUtils";

const {
  addStaffURL,
  updateStaffURL,
  deleteStaffURL,
  updateStaffStatusURL,
  getStaffByOwnerURL
} = configURL;

const authService = {
  login: (data) => api.post("/auth/login", data),
  getProfile: () => api.get("/user/profile"), // will auto attach token
};

const getAuthHeaders = () => {
  const ownerData = JSON.parse(localStorage.getItem('owner'));
  
    if (isMembershipExpired(ownerData)) {
      console.log("Membership expired. Redirecting to renew page.");
      window.location.href = '/renew-owner';
      return;
    }
  const token = localStorage.getItem('accessToken');
  return {
    Authorization: `Bearer ${token}`
  };
};

  const addStaff = async (formData) => {
    const ownerData = JSON.parse(localStorage.getItem('owner'));
    
      if (isMembershipExpired(ownerData)) {
        console.log("Membership expired. Redirecting to renew page.");
        window.location.href = '/renew-owner';
        return;
      }
    const token = localStorage.getItem('accessToken');
    return await axios.post(addStaffURL, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    });
  };

  const getStaffList = async (search = "", status = "BOTH") => {
    const ownerData = JSON.parse(localStorage.getItem('owner'));
    
      if (isMembershipExpired(ownerData)) {
        console.log("Membership expired. Redirecting to renew page.");
        window.location.href = '/renew-owner';
        return;
      }
    const token = localStorage.getItem("accessToken");
  
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (status) params.append("status", status); // Add status param
  
    return await axios.get(`${getStaffByOwnerURL}?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });
  };
  

const deleteStaff = async (staffId) => {
  const ownerData = JSON.parse(localStorage.getItem('owner'));
  
    if (isMembershipExpired(ownerData)) {
      console.log("Membership expired. Redirecting to renew page.");
      window.location.href = '/renew-owner';
      return;
    }
  const token = localStorage.getItem("accessToken");
  return await axios.delete(`${deleteStaffURL}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    data: { staffId }
  });
};
const updateStatus = async (data) => {
  const ownerData = JSON.parse(localStorage.getItem('owner'));
  
    if (isMembershipExpired(ownerData)) {
      console.log("Membership expired. Redirecting to renew page.");
      window.location.href = '/renew-owner';
      return;
    }
  return await axios.post(updateStaffStatusURL, data, {
    headers: getAuthHeaders()
  });
};

const updateStaff = async (data) => {
  const ownerData = JSON.parse(localStorage.getItem('owner'));
  
    if (isMembershipExpired(ownerData)) {
      console.log("Membership expired. Redirecting to renew page.");
      window.location.href = '/renew-owner';
      return;
    }
  return await axios.put(updateStaffURL, data, {
    headers: getAuthHeaders()
  });
};

export default {
  addStaff,
  getStaffList,
  deleteStaff,
  updateStatus,
  updateStaff,
  authService
};
