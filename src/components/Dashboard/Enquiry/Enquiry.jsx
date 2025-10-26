import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion"; // Make sure you import this if you're using motion
import enquiryService from "../../../service/enquiryService";
import { useNavigate } from "react-router-dom";

const Enquiry = ({ onMemberAdded }) => {
  const today = new Date().toISOString().split("T")[0];
  const fileInputRef = useRef(null);
    const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    mobileNumber: "",
    gender: "",
    email: "",
    enquiryDate: today,
    interestLevel: "MODERATE",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (message || error) {
      const timer = setTimeout(() => {
        setMessage("");
        setError("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message, error]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "mobileNumber" && !/^\d{0,10}$/.test(value)) return;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Required field validations
    if (!formData.name || !formData.mobileNumber) {
      setError("Please fill in all required fields.");
      return;
    }
  
    if (!/^\d{10}$/.test(formData.mobileNumber)) {
      setError("Mobile number must be exactly 10 digits.");
      return;
    }
  
    try {
      // Send plain JSON instead of FormData
      const response = await enquiryService.addEnquiry(formData);
  
      if (response?.data?.success) {
        setMessage(response.data.message || "Enquiry added successfully!");
        setError("");
  
        // Clear form
        setFormData({
          name: "",
          mobileNumber: "",
          gender: "",
          email: "",
          enquiryDate: today,
          interestLevel: "MODERATE",
        });
  
        if (typeof onMemberAdded === "function") {
          onMemberAdded();
        }
      } else {
        setError(response?.data?.message || "Failed to add enquiry.");
        setMessage("");
      }
    } catch (err) {
      console.error("Add Enquiry Error:", err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Failed to add enquiry. Try again.");
      }
      setMessage("");
      if (err.response && err.response.status === 403) {
        setTimeout(() =>
        {
          localStorage.clear();
        },5000)
        navigate("/");
        window.location.href = "/";
      }
    }
  };
  

  return (
    <motion.div
      className="add-member-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h1 className="addMember-heading">Add New Enquiry</h1>

      {message && <div className="toast toast-success">{message}</div>}
      {error && <div className="toast toast-error">{error}</div>}

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <label>
          <span>
            Name<span className="required"> *</span>
          </span>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </label>

        <label>
          <span>
            Mobile Number<span className="required"> *</span>
          </span>
          <input
            type="text"
            name="mobileNumber"
            value={formData.mobileNumber}
            onChange={handleChange}
            maxLength={10}
            pattern="\d{10}"
            title="Enter a valid 10-digit mobile number"
          />
        </label>

        <label>
          Email
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </label>

        <label>
          Gender
          <div className="gender-options">
            {["MALE", "FEMALE", "OTHER"].map((g) => (
              <label
                key={g}
                className={`gender-radio ${
                  formData.gender === g ? "selected" : ""
                }`}
              >
                <input
                  type="radio"
                  name="gender"
                  value={g}
                  checked={formData.gender === g}
                  onChange={handleChange}
                />
                {g}
              </label>
            ))}
          </div>
        </label>

        <label>
          Interest Level
          <select
            name="interestLevel"
            value={formData.interestLevel}
            onChange={handleChange}
          >
            <option value="HIGH">HIGH</option>
            <option value="MODERATE">MODERATE</option>
            <option value="LOW">LOW</option>
          </select>
        </label>

        <button type="submit" className="submit-button">
          Add Enquiry
        </button>
      </form>
    </motion.div>
  );
};

export default Enquiry;
