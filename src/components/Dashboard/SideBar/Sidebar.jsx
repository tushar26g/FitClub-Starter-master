import React, { useState, useEffect } from "react";
import "./Sidebar.css";
import Logo from "../../../imgs/logo.png";
import { UilSignOutAlt, UilBars } from "@iconscout/react-unicons";
import { SidebarData } from "../../../data/Data";
import { motion } from "framer-motion";

const Sidebar = () => {
  const owner = JSON.parse(localStorage.getItem('owner'));
  const [selected, setSelected] = useState(0);
  const [expanded, setExpanded] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      const isNowMobile = window.innerWidth <= 768;
      setIsMobile(isNowMobile);
      if (!isNowMobile) setExpanded(true); // always expanded on desktop
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const sidebarVariants = {
    expanded: {
      left: 0
    },
    collapsed: {
      left: '-77%'
    }
  };

  return (
    <>
      {isMobile && (
        <div
          className="bars"
          onClick={() => setExpanded((prev) => !prev)}
        >
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
          {/* <span>Sh<span>o</span>ps</span> */}
          <span>{owner?.businessName}</span>
        </div>

        <div className="menu2">
          {SidebarData.map((item, index) => (
            <div
              className={`menuItem2 ${selected === index ? "active" : ""}`}
              key={index}
              onClick={() => setSelected(index)}
            >
              <item.icon />
              <span>{item.heading}</span>
            </div>
          ))}

          <div className="menuItem2">
            <UilSignOutAlt /> Log Out
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default Sidebar;
