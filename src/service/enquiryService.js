import axios from 'axios';
import configURL from '../Configurations/configURL';

const {
  addEnquiryURL,
  getEnquiriesURL,
  deleteEnquiryURL
} = configURL;

const addEnquiry = async (data) => await axios.post(addEnquiryURL, data);
const getEnquiries = async () => await axios.get(getEnquiriesURL);
const deleteEnquiry = async (id) => await axios.delete(`${deleteEnquiryURL}?id=${id}`);

export default {
  addEnquiry,
  getEnquiries,
  deleteEnquiry
};
