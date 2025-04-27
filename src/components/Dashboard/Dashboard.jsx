import React from 'react';
import { Outlet } from 'react-router-dom'; // import Outlet
import './DashBoard.css';
import Sidebar from './SideBar/Sidebar';

const Dashboard = () => {
  return (
    <div className="dashboard">
      <div className="dashboard-container">
        <Sidebar />
        <div className="dashboard-content">
          <Outlet /> {/* Dynamically renders child pages like MainDash, AddMember, MemberDetailsPage */}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
