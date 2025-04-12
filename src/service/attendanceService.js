import axios from 'axios';
import configURL from '../Configurations/configURL';

const {
  markAttendanceURL,
  markLeaveRangeURL,
  attendanceHistoryURL,
  staffAttendanceURL
} = configURL;

const markAttendance = async (data) => await axios.post(markAttendanceURL, data);
const markLeave = async (data) => await axios.post(markLeaveRangeURL, data);
const getHistory = async () => await axios.get(attendanceHistoryURL);
const getStaffAttendance = async (staffId) =>
  await axios.get(`${staffAttendanceURL.replace('{staffId}', staffId)}`);

export default {
  markAttendance,
  markLeave,
  getHistory,
  getStaffAttendance
};
