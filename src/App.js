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

function App() {
  const isAuthenticated = () => {
    return localStorage.getItem('token') !== null;
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/dashboard"
            element={isAuthenticated() ? <DashboardLayout /> : <Navigate to="/" />}
          >
            <Route index element={<MainDash />} />
            <Route path="add-member" element={<AddMem />} />
            <Route path="add-enquiry" element={<Enquiry />} />
            <Route path="add-staff" element={<AddStaffForm />} />
            <Route path="view-enquiry" element={<EnquiryTable />} />
            <Route path="view-staff" element={<StaffTable />} />
            <Route path="member-details/:id" element={<MemberDetailsPage />} />
            <Route path="import-members" element={<ImportMembersPage />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;