import axios from 'axios';
import configURL from '../config/configURL';

const {
  addMemberURL,
  getMembersByOwnerURL, // ✅ Fixed name
  deleteMemberURL,
  updateMembershipStatusURL,
  updateMemberURL
} = configURL;

const addMember = async (formData) => {
  const token = localStorage.getItem('token');
  return await axios.post(addMemberURL, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data'
    }
  });
};


const getMembers = async () => {
  const token = localStorage.getItem('token');
  return await axios.get(getMembersByOwnerURL, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

const deleteMember = async (memberId) => {
  const token = localStorage.getItem('token');
  try {
    const response = await axios.delete(`${deleteMemberURL}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      data: { memberId }, // Important: Send memberId in the body (for DELETE)
    });
    return response;
  } catch (error) {
    console.error("Error deleting member:", error);
    throw error;
  }
};

const updateStatus = async (data) => {
  const token = localStorage.getItem('token');
  return await axios.post(updateMembershipStatusURL, data, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

const updateMember = async (data) => {
  const token = localStorage.getItem('token');
  return await axios.put(updateMemberURL, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data'
    }
  });
};

export default {
  addMember,
  getMembers,
  deleteMember,
  updateStatus,
  updateMember
};
