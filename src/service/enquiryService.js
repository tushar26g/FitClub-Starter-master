import axios from 'axios';
import configURL from '../config/configURL';

const {
  addEnquiryURL,
  getEnquiriesURL,
  deleteEnquiryURL
} = configURL;


const addEnquiry = async (data) => {
  const token = localStorage.getItem("token");
  return await axios.post(addEnquiryURL, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });
};

// enquiryService.js
const getEnquiries = async (search = "", interestLevel = "") => {
  const token = localStorage.getItem("token");

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
  const token = localStorage.getItem("token");
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
  deleteEnquiry
};
