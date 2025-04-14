import React from 'react';
import './DashBoard.css';
import Sidebar from './SideBar/Sidebar';
import MainDash from './MainDash/MainDash';
import RightSide from './RigtSide/RightSide';
import AddMem from './AddMembers/AddMember'

const Dashboard = () => {
  const owner = JSON.parse(localStorage.getItem('owner'));

  return (
    <div className="dashboard">
      <div className="dashboard-container">
        <Sidebar />
        <MainDash />
        <RightSide />
      </div>
    </div>
  );
};

export default Dashboard;
