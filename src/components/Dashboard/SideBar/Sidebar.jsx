import React, { useState, useEffect } from "react";
import "./Sidebar.css";
import Logo from "../../../imgs/logo.png";
import { UilSignOutAlt, UilBars } from "@iconscout/react-unicons";
import { SidebarData } from "../../../data/Data";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const owner = JSON.parse(localStorage.getItem('owner'));

  // INITIALLY set expanded to false and determine device later
  const [expanded, setExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Set correct expanded state based on screen size on mount AND resize
  useEffect(() => {
    const handleResize = () => {
      const isNowMobile = window.innerWidth <= 768;
      setIsMobile(isNowMobile);
      setExpanded(!isNowMobile); // Always collapse on mobile, expand on desktop
    };

    handleResize(); // Call once on mount
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const sidebarVariants = {
    expanded: { left: 0 },
    collapsed: { left: '-199%' }
  };

  return (
    <>
      {isMobile && (
        <div className="bars" onClick={() => setExpanded(prev => !prev)}>
          <UilBars />
        </div>
      )}

      <motion.div
        className="sidebar"
        variants={sidebarVariants}
        animate={isMobile ? (expanded ? "expanded" : "collapsed") : ""}
      >
        <div className="logo2">
          <img src={Logo} alt="logo2" />
          <span>{owner?.businessName}</span>
        </div>

        <div className="menu2">
          {SidebarData.map((item, index) => (
            <div
              key={index}
              className={`menuItem2 ${location.pathname === item.path ? "active" : ""}`}
              onClick={() => {
                navigate(item.path);
                if (isMobile) setExpanded(false);
              }}
            >
              <item.icon />
              <span>{item.heading}</span>
            </div>
          ))}

          <div
            className="menuItem2"
            onClick={() => {
              localStorage.clear();
              navigate("/");
              if (isMobile) setExpanded(false);
            }}
          >
            <UilSignOutAlt />
            Log Out
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default Sidebar;
