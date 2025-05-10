import React from "react";
import { NavLink } from "react-router-dom";
import { FaFacebook, FaTwitter, FaLinkedin } from "react-icons/fa";
import "./Footer.css"; // Make sure to create this CSS file for styles
import { Link } from "react-scroll";
const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-about">
          <h3>About Us</h3>
          <p>We provide the best services to our customers with top-notch quality.</p>
        </div>
        <div className="footer-contact">
          <h3>Contact Us</h3>
          <p>Email: krishnashinde33964@gmail.com</p>
          <p>Phone: +91 9604016475</p>
        </div>
        <div className="footer-social">
          <h3>Follow Us</h3>
          <div className="social-icons">
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
              <FaFacebook className="icon" />
            </a>
            <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
              <FaTwitter className="icon" />
            </a>
            <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">
              <FaLinkedin className="icon" />
            </a>
          </div>
        </div>
        <div className="footer-nav">
          <h3>Quick Links</h3>
          <ul>
            <li className="footer-li">
              <Link to="header"
              spy={true}
              smooth={true}
              duration={500}>Home</Link>
            </li>
            <li className="footer-li">
              <Link to="testimonials"
              spy={true}
              smooth={true}
              duration={500}>About Us</Link>
            </li>
            <li className="footer-li">
              <Link to="programs"
              spy={true}
              smooth={true}
              duration={500}>Services</Link>
            </li>
            <li className="footer-li">
              <Link to="contactUs"
              spy={true}
              smooth={true}
              duration={500}>Contact Us</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} OurCompany. All Rights Reserved.</p>
        Made with love <span className="heart">❤️</span> by ambitious people
      </div>
    </footer>
  );
};

export default Footer;
