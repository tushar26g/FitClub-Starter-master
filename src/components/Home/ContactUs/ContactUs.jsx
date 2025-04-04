import React from "react";
import "./ContactUs.css";
import { Mail, Phone, MapPin } from "lucide-react";

const ContactUs = () => {
  return (
    <div className="contact-container" id="contactUs">
      <div className="contact-left">
        <h2>Contact Us</h2>
        <p>Have questions? We're here to help!</p>
        <div className="contact-info">
          <div className="info-item">
            <Mail size={20} />
            <span>support@yourwebsite.com</span>
          </div>
          <div className="info-item">
            <Phone size={20} />
            <span>+91 XXXXX XXXXX</span>
          </div>
          <div className="info-item">
            <MapPin size={20} />
            <span>Your Business Location</span>
          </div>
        </div>
      </div>
      
      <div className="contact-right">
        <form className="contact-form">
          <input type="text" placeholder="Your Name" required />
          <input type="email" placeholder="Your Email" required />
          <textarea placeholder="Your Message" rows="4" required></textarea>
          <button type="submit">Send Message</button>
        </form>
      </div>

      <div className="background-box box1"></div>
      <div className="background-box box2"></div>
    </div>
  );
};

export default ContactUs;