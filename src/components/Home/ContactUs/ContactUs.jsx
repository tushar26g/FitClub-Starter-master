import React, { useState } from "react";
import "./ContactUs.css";
import { Mail, Phone, MapPin } from "lucide-react";
import authService from "../../../service/authService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    mobileNumber: "",
    query: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

    const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await authService.sendContactQuery(formData);
       toast.success("Message sent successfully!");
      setFormData({ name: "", mobileNumber: "", query: "" });
    } catch (error) {
      toast.error("Failed to send message.");
    }
  };

  return (
    <div className="contact-container" id="contactUs">
      <div className="contact-left">
        <h2>Contact Us</h2>
        <p>Have questions? We're here to help!</p>
        <div className="contact-info">
          <div className="info-item">
            <Mail size={20} />
            <span>krishnashinde33964@gmail.com</span>
          </div>
          <div className="info-item">
            <Phone size={20} />
            <span>+91 9604016475</span>
          </div>
          <div className="info-item">
            <MapPin size={20} />
            <span>Plot No. 27/28, Cidco Waluj Mahanagar-1, Chhatrapati Sambhaji Nagar, Maharashtra 431136</span>
          </div>
        </div>
      </div>

      <div className="contact-right">
        <form className="contact-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            required
            value={formData.name}
            onChange={handleChange}
          />
        <input
  type="text"
  name="mobileNumber"
  placeholder="Your Mobile Number"
  required
  maxLength={10}
  value={formData.mobileNumber}
  onChange={(e) => {
    const value = e.target.value;
    // Allow only digits and limit to 10
    if (/^\d{0,10}$/.test(value)) {
      setFormData({ ...formData, mobileNumber: value });
    }
  }}
  pattern="\d{10}"
  title="Mobile number must be exactly 10 digits"
/>
          <textarea
            name="query"
            placeholder="Your Message"
            rows="4"
            required
            value={formData.query}
            onChange={handleChange}
          ></textarea>
          <button type="submit">Send Message</button>
        </form>
      </div>

      <div className="background-box box1"></div>
      <div className="background-box box2"></div>

      <ToastContainer
  position="top-right"
  autoClose={4000}
  theme="colored"
/>

    </div>
  );
};

export default ContactUs;
