import React from 'react';
import { Outlet } from 'react-router-dom'; // import Outlet
import './DashBoard.css';
import Sidebar from './SideBar/Sidebar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTheme } from "../../context/ThemeContext";

const Dashboard = () => {
   // THEME STATE
  const { theme, toggleTheme } = useTheme();
  return (
    <div className="dashboard">
      <div className="dashboard-container">
        <Sidebar />
        <div className="dashboard-content">
          <Outlet /> {/* Dynamically renders child pages like MainDash, AddMember, MemberDetailsPage */}
          <ToastContainer
            position="top-center"   // ⬅️ Position it in the center
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
