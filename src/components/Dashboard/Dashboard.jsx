import React from 'react';
import './DashBoard.css';
import Sidebar from './SideBar/Sidebar';
import MainDash from './MainDash/MainDash';
import RightSide from './RigtSide/RightSide';
import AddMem from './AddMembers/AddMember'
import AddStaffForm from './Staff/AddStaffForm';

const Dashboard = () => {
  const owner = JSON.parse(localStorage.getItem('owner'));

  return (
    <div className="dashboard">
      <div className="dashboard-container">
        <Sidebar />
        <AddStaffForm />
        <RightSide />
      </div>
    </div>
  );
};

export default Dashboard;
