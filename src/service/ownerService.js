import axios from "axios"; // Your base axios instance
import configURL from '../config/configURL';
import { isMembershipExpired } from "../Utils/membershipUtils";

const{
    updateMemberURL,
} = configURL;
const updateOwner = (formData) => {
    const ownerData = JSON.parse(localStorage.getItem('owner'));
    
      if (isMembershipExpired(ownerData)) {
        window.location.href = '/renew-owner'; // or use navigate()
        return;
      }
      try {
    const token = localStorage.getItem('accessToken');
  return axios.post(updateMemberURL, formData, {
    headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'multipart/form-data'
  }
  });
}
  catch (error) {
    if (error.response && error.response.status === 403) {
        console.log("Unauthorized or expired token. Logging out.");
        localStorage.clear();
      } 
    throw error;
  }
};

export default {
  updateOwner,
};
