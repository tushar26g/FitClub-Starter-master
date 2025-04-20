import axios from 'axios';
import configURL from '../config/configURL';

const {
  markAttendanceURL,
  markLeaveRangeURL,
  attendanceHistoryURL,
  getStaffAttendanceURL
} = configURL;

const markAttendance = async (data) => {
  const token = localStorage.getItem("token");
  return await axios.post(markAttendanceURL, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};
const markLeave = async (data) => await axios.post(markLeaveRangeURL, data);
const getHistory = async () => await axios.get(attendanceHistoryURL);
const getStaffAttendance = async (staffId) => {
  const token = localStorage.getItem("token");
  return await axios.get(getStaffAttendanceURL.replace("{staffId}", staffId), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export default {
  markAttendance,
  markLeave,
  getHistory,
  getStaffAttendance
};
