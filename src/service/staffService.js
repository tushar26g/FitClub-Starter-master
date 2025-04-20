import axios from 'axios';
import configURL from '../config/configURL';

const {
  addStaffURL,
  updateStaffURL,
  deleteStaffURL,
  updateStaffStatusURL,
  getStaffByGymOwnerURL
} = configURL;

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    Authorization: `Bearer ${token}`
  };
};

  const addStaff = async (formData) => {
    const token = localStorage.getItem('token');
    return await axios.post(addStaffURL, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    });
  };

  const getStaffList = async (search = "", interestLevel = "") => {
    const token = localStorage.getItem("token");
  
    const params = new URLSearchParams();
    if (search) params.append("search", search);
  
    return await axios.get(`${getStaffByGymOwnerURL}?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });
  };

const deleteStaff = async (staffId) => {
  const token = localStorage.getItem("token");
  return await axios.delete(`${deleteStaffURL}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    data: { enquiryId }
  });
};
const updateStatus = async (data) => {
  return await axios.post(updateStaffStatusURL, data, {
    headers: getAuthHeaders()
  });
};

const updateStaff = async (data) => {
  return await axios.put(updateStaffURL, data, {
    headers: getAuthHeaders()
  });
};

export default {
  addStaff,
  getStaffList,
  deleteStaff,
  updateStatus,
  updateStaff
};
