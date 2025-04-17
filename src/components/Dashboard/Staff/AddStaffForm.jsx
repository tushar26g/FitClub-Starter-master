import React, { useState } from "react";
import staffService from "../../../service/staffService";
import "./AddStaffForm.css";

const AddStaffForm = () => {
  const [staff, setStaff] = useState({
    name: "",
    mobileNumber: "",
    email: "",
    joinDate: "",
    status: "ACTIVE",
    profilePhotoUrl: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStaff({ ...staff, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await addStaff(staff, token);
      alert("Staff added successfully!");
      setStaff({
        name: "",
        mobileNumber: "",
        email: "",
        joinDate: "",
        status: "ACTIVE",
        profilePhotoUrl: ""
      });
    } catch (error) {
      console.error("Error adding staff:", error);
      alert("Failed to add staff");
    }
  };

  return (
    <div className="add-staff-form-container">
      <form onSubmit={handleSubmit} className="add-staff-form">
        <h2>Add New Staff</h2>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={staff.name}
          onChange={handleChange}
          required
        />
        <input
          type="tel"
          name="mobileNumber"
          placeholder="Mobile Number"
          value={staff.mobileNumber}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={staff.email}
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="joinDate"
          value={staff.joinDate}
          onChange={handleChange}
          required
        />
        <select name="status" value={staff.status} onChange={handleChange}>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
        </select>
        <input
          type="text"
          name="profilePhotoUrl"
          placeholder="Profile Photo URL"
          value={staff.profilePhotoUrl}
          onChange={handleChange}
        />
        <button type="submit">Add Staff</button>
      </form>
    </div>
  );
};

export default AddStaffForm;
