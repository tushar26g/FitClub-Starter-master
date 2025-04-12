import React, { useState, useEffect } from "react";
import "./Header.css";
import Logo from "../../../assets/logo.png";
import Bars from "../../../assets/bars.png";
import { Link } from "react-scroll";

const Header = ({ onOpenLogin }) => {
  const [menuOpened, setMenuOpened] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile) setMenuOpened(false);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const menuItems = [
    { to: "header", label: "Home" },
    { to: "programs", label: "Features" },
    { to: "reasons", label: "Why Us" },
    { to: "plans", label: "Plans" },
    { to: "contactUs", label: "Contact us" },
  ];

  return (
    <header className="header" id="header">
      <img src={Logo} alt="Logo" className="logo" />

      {/* Sign In Button */}
      
      <button className="btn login-btn2" onClick={onOpenLogin}>
        Sign In
      </button>

      {/* Mobile Menu Icon */}
      {isMobile && !menuOpened ? (
        <div className="menu-icon" onClick={() => setMenuOpened(true)}>
          <img src={Bars} alt="Menu" />
        </div>
      ) : (
        <ul className="header-menu">
          {menuItems.map((item) => (
            <li key={item.to}>
              <Link
                to={item.to}
                spy={true}
                smooth={true}
                duration={500}
                onClick={() => setMenuOpened(false)}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
};

export default Header;
