import axios from 'axios';
import configURL from '../config/configURL';
import api from "./api";

const {
  markAttendanceURL,
  markLeaveRangeURL,
  attendanceHistoryURL,
  getStaffAttendanceURL
} = configURL;

const authService = {
  login: (data) => api.post("/auth/login", data),
  getProfile: () => api.get("/user/profile"), // will auto attach token
};

const markAttendance = async (data) => {
  const token = localStorage.getItem("accessToken");
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
  const token = localStorage.getItem("accessToken");
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
  getStaffAttendance,
  authService
};
