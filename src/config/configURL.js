// All the Service URLs are to be included here...
const baseURL = 'http://localhost:8080/api';

const configURL = {
  // Auth URLs
  registerOwnerURL: `${baseURL}/auth/register`,
  loginOwnerAdminURL: `${baseURL}/auth/login`,
  publicContactURL: `${baseURL}/auth/contact`,

  // Admin URLs
  getAllOwnersURL: `${baseURL}/admin/owners`,
  adminGrowthAnalysisURL: `${baseURL}/admin/analysis`,

  // Enquiry URLs
  addEnquiryURL: `${baseURL}/enquiries`,
  getEnquiriesURL: `${baseURL}/enquiries`,
  deleteEnquiryURL: `${baseURL}/enquiries/delete`,

  // Member URLs
  addMemberURL: `${baseURL}/members/add`,
  getMembersByOwnerURL: `${baseURL}/members/by-owner`,
  deleteMemberURL: `${baseURL}/members/delete`,
  updateMembershipStatusURL: `${baseURL}/members/update-status`,
  updateMemberURL: `${baseURL}/members/update`,
  importMembersURL: `${baseURL}/members/import-members`,
  analysisMemberURL: `${baseURL}/members/analysis`,

  // Attendance URLs
  markAttendanceURL: `${baseURL}/attendance/mark`,
  markLeaveRangeURL: `${baseURL}/attendance/mark-leave`,
  getAttendanceHistoryURL: `${baseURL}/attendance/history`,
  getStaffAttendanceURL: `${baseURL}/attendance/staff/{staffId}/attendance`, // use /{staffId}/attendance when calling

  // Staff URLs
  addStaffURL: `${baseURL}/staff/add`,
  updateStaffURL: `${baseURL}/staff/update`,
  deleteStaffURL: `${baseURL}/staff/delete`,
  updateStaffStatusURL: `${baseURL}/staff/update-status`,
  getStaffByOwnerURL: `${baseURL}/staff/by-owner`,
};

export default configURL;
