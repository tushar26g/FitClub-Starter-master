import axios from 'axios';
import configURL from '../Configurations/configURL';

const {
  addStaffURL,
  updateStaffURL,
  deleteStaffURL,
  updateStaffStatusURL,
  getStaffByGymOwnerURL
} = configURL;

const addStaff = async (data) => await axios.post(addStaffURL, data);
const updateStaff = async (data) => await axios.put(updateStaffURL, data);
const deleteStaff = async (staffId) => await axios.delete(`${deleteStaffURL}?id=${staffId}`);
const updateStatus = async (data) => await axios.post(updateStaffStatusURL, data);
const getStaffList = async () => await axios.get(getStaffByGymOwnerURL);

export default {
  addStaff,
  updateStaff,
  deleteStaff,
  updateStatus,
  getStaffList
};
