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
  return await axios.post(addStaffURL, formData, {
    headers: {
      ...getAuthHeaders(),
      'Content-Type': 'multipart/form-data'
    }
  });
};

const getStaffList = async () => {
  return await axios.get(getStaffByGymOwnerURL, {
    headers: getAuthHeaders()
  });
};

const deleteStaff = async (staffId) => {
  return await axios.delete(`${deleteStaffURL}?id=${staffId}`, {
    headers: getAuthHeaders()
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
