import React, { useState, useEffect, useRef  } from "react";
import staffService from "../../../service/staffService";
import "./AddStaffForm.css";
import { motion } from "framer-motion";

const AddStaffForm = ({ onMemberAdded }) => {
  const today = new Date().toISOString().split("T")[0];
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    mobileNumber: "",
    gender: "",
    email: "",
    joinDate: today,
    dob: "",
    status: "ACTIVE", // default status
  });

  const [profilePhoto, setProfilePhoto] = useState(null);
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

  const handlePhotoChange = (e) => {
    setProfilePhoto(e.target.files[0]);
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
      const submissionData = new FormData();
      const dto = { ...formData };

      submissionData.append(
        "dto",
        new Blob([JSON.stringify(dto)], { type: "application/json" })
      );

      if (profilePhoto) {
        submissionData.append("profilePhoto", profilePhoto);
      }

      const response = await staffService.addStaff(submissionData);

      if (response?.data?.success) {
        setMessage(response.data.message || "Staff added successfully!");
        setError("");
        fileInputRef.current.value = ""; // 👈 Clear file input
        setProfilePhoto(null);           // Optional, clears from state too
        
        // Clear form
        setFormData({
          name: "",
          mobileNumber: "",
          gender: "",
          email: "",
          joinDate: today,
          dob: "",
          status: "ACTIVE",
        });
        setProfilePhoto(null);

        if (typeof onMemberAdded === "function") {
          onMemberAdded();
        }
      } else {
        setError(response?.data?.message || "Failed to add staff.");
        setMessage("");
      }
    } catch (err) {
      console.error("Add Staff Error:", err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Failed to add staff. Try again.");
      }
      setMessage("");
    }
  };

  return (
    <motion.div
      className="add-member-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h1 className="addMember-heading">Add New Staff</h1>

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
          Date of Birth
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            max={today}
          />
        </label>

        <label>
          Profile Photo
          <input
            type="file"
            accept=".png,.jpg,.jpeg,.webp,.PNG"
            capture="environment"
            onChange={handlePhotoChange}
            ref={fileInputRef}
          />
        </label>

        <button type="submit" className="submit-button">
          Add Staff
        </button>
      </form>
    </motion.div>
  );
};

export default AddStaffForm;
