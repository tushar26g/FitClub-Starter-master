import axios from 'axios';
import configURL from '../Configurations/configURL';

const {
  addMemberURL,
  getMembersByGymOwnerURL,
  deleteMemberURL,
  updateMembershipStatusURL,
  updateMemberURL
} = configURL;

const addMember = async (data) => await axios.post(addMemberURL, data);
const getMembers = async () => await axios.get(getMembersByGymOwnerURL);
const deleteMember = async (memberId) => await axios.delete(`${deleteMemberURL}?id=${memberId}`);
const updateStatus = async (data) => await axios.post(updateMembershipStatusURL, data);
const updateMember = async (data) => await axios.put(updateMemberURL, data);

export default {
  addMember,
  getMembers,
  deleteMember,
  updateStatus,
  updateMember
};
