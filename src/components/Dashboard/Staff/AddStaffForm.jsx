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
    <motion.div
      className="add-member-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h1 className="addMember-heading">Add New Member</h1>
      {message && <div className="success-msg">{message}</div>}
      {error && <div className="error-msg">{error}</div>}

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
          <input type="email" name="email" value={formData.email} onChange={handleChange} />
        </label>

        {/* Gender */}
        <label>
          Gender
          <div className="gender-options">
            {["MALE", "FEMALE", "OTHER"].map((g) => (
              <label key={g} className={`gender-radio ${formData.gender === g ? "selected" : ""}`}>
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
          Joining Date
          <input type="date" name="joiningDate" value={formData.joiningDate} onChange={handleChange} />
        </label>

        <label>Date of Birth:</label>
<input
  type="date"
  value={dob}
  onChange={(e) => setDob(e.target.value)}
/>
{dob && <p>Age: {getAge(dob)} years</p>}

        <label>
          Profile Photo
          <input type="file" accept=".png,.jpg,.jpeg,.webp, .PNG" capture="environment" onChange={handlePhotoChange} />
        </label>

        <button type="submit" className="submit-button">
          Add Staff
        </button>
      </form>
    </motion.div>
  );
};

export default AddStaffForm;
