import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/Home/Home';
import DashboardLayout from './components/Dashboard/Dashboard';
import MainDash from './components/Dashboard/MainDash/MainDash';
import AddMem from './components/Dashboard/AddMembers/AddMember';
import Enquiry from './components/Dashboard/Enquiry/Enquiry';
import EnquiryTable from './components/Dashboard/Enquiry/EnquiryTable';
import AddStaffForm from './components/Dashboard/Staff/AddStaffForm';
import StaffTable from './components/Dashboard/Staff/StaffTable';
import MemberDetailsPage from './components/Dashboard/Members/MemberDetailsPage';
import ImportMembersPage from './components/Dashboard/Excel/ImportMembersPage';
import AdminDashboardPage from './components/Admin/AdminDashboard';
import { decodeToken, isTokenExpired, getUserRole } from './Utils/authHelper';

function App() {
  const isAuthenticated = () => {
    // if(localStorage == null) {
    //   return false;
    // }
    const token = localStorage.getItem('accessToken');
    return token != null && !isTokenExpired(token);
  };

  const getDefaultRedirect = () => {
    if (!localStorage.getItem("accessToken")) {
      return null; // Prevent redirection if no token exists
    }
    if (isAuthenticated()) {
      const role = getUserRole();
      return role === 'ADMIN' ? '/admin-dashboard' : '/dashboard';
    }
    return null;
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Root Route: Redirect to dashboard/admin if logged in */}
          <Route
            path="/"
            element={
              (() => {
                const redirectPath = getDefaultRedirect();
                const currentPath = window.location.pathname;
                if (redirectPath && currentPath === '/') {
                  return <Navigate to={redirectPath} />;
                }
                return <Home />;
              })()
            }
          />

          {/* Admin Dashboard */}
          <Route path="/admin-dashboard" element={<AdminDashboardPage />} />

          {/* Owner Dashboard and nested routes */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<MainDash />} />
            <Route path="add-member" element={<AddMem />} />
            <Route path="add-enquiry" element={<Enquiry />} />
            <Route path="add-staff" element={<AddStaffForm />} />
            <Route path="view-enquiry" element={<EnquiryTable />} />
            <Route path="view-staff" element={<StaffTable />} />
            <Route path="member-details" element={<MemberDetailsPage />} />
            <Route path="import-members" element={<ImportMembersPage />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
