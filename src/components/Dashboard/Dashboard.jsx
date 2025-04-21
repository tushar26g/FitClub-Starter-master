import React from 'react';
import './DashBoard.css';
import Sidebar from './SideBar/Sidebar';
import MainDash from './MainDash/MainDash';
import AddMem from './AddMembers/AddMember';
import AddStaffForm from './Staff/AddStaffForm';
import Enquiry from './Enquiry/Enquiry';
import EnquiryTable from './Enquiry/EnquiryTable';
import StaffTable from './Staff/StaffTable';
import { useLocation } from 'react-router-dom';

const Dashboard = () => {
  const owner = JSON.parse(localStorage.getItem('owner'));
  const location = useLocation();

  const path = location.pathname;

  const renderPage = () => {
    switch (path) {
      case "/dashboard":
        return <MainDash />;
      case "/dashboard/add-member":
        return <AddMem />;
      case "/dashboard/add-enquiry":
        return <Enquiry />;
      case "/dashboard/add-staff":
        return <AddStaffForm />;
      case "/dashboard/view-enquiry":
        return <EnquiryTable />;
      case "/dashboard/view-staff":
        return <StaffTable />;
      default:
        return <MainDash />;
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-container">
        <Sidebar />
        <div className="dashboard-content">
          {renderPage()}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
