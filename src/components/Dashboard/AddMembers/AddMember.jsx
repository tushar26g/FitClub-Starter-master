import React, { useState, useEffect } from "react";
import memberService from "../../../service/memberService";
import "./AddMember.css";
import { motion } from "framer-motion";

const AddMember = ({ onMemberAdded }) => {
  const today = new Date().toISOString().split("T")[0];
  const [formData, setFormData] = useState({
    name: "",
    mobileNumber: "",
    paymentStatus: "COMPLETED",
    amountPaid: "",
    email: "",
    paymentMethod: "CASH",
    packageName: "1 Month",
    joiningDate: today,
    membershipEndDate: today,
    weight: "",
    height: "",
  });
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [bmi, setBmi] = useState(null);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const packages = ["1 Month", "3 Months", "6 Months", "12 Months"];

  useEffect(() => {
    if (formData.weight && formData.height) {
      const heightInMeters = formData.height / 100;
      const bmiValue = (formData.weight / (heightInMeters ** 2)).toFixed(2);
      setBmi(bmiValue);
    } else {
      setBmi(null);
    }
  }, [formData.weight, formData.height]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePackageChange = (e) => {
    const packageName = e.target.value;
    const months = parseInt(packageName);
    const startDate = new Date(formData.joiningDate);
    const endDate = new Date(startDate);
    endDate.setMonth(startDate.getMonth() + months);
    setFormData({
      ...formData,
      packageName,
      membershipEndDate: endDate.toISOString().split("T")[0],
    });
  };

  const handlePhotoChange = (e) => {
    setProfilePhoto(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.mobileNumber || !formData.paymentStatus || !formData.amountPaid) {
      setError("Please fill in all required fields.");
      return;
    }
  
    try {
      const submissionData = new FormData();
      const dto = { ...formData };
      if (bmi) dto.bmi = bmi;
  
      submissionData.append("dto", new Blob([JSON.stringify(dto)], { type: "application/json" }));
      if (profilePhoto) {
        submissionData.append("profilePhoto", profilePhoto);
      }
  
      await memberService.addMember(submissionData);
  
      setMessage("Member added successfully!");
      setError("");
      setFormData({
        name: "",
        mobileNumber: "",
        paymentStatus: "COMPLETED",
        amountPaid: "",
        email: "",
        paymentMethod: "CASH",
        packageName: "1 Month",
        joiningDate: today,
        membershipEndDate: today,
        weight: "",
        height: "",
      });
      setProfilePhoto(null);
      setBmi(null);
      onMemberAdded();
    } catch (err) {
      console.error(err);
      setMessage("");
      setError("Failed to add member. Try again.");
    }
  };  

  return (
    <motion.div
      className="add-member-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h2>Add New Member</h2>
      {message && <div className="success-msg">{message}</div>}
      {error && <div className="error-msg">{error}</div>}

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <label>
          Name<span className="required">*</span>
          <input type="text" name="name" value={formData.name} onChange={handleChange} />
        </label>

        <label>
          Mobile Number<span className="required">*</span>
          <input type="text" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} />
        </label>

        <label>
          Email
          <input type="email" name="email" value={formData.email} onChange={handleChange} />
        </label>

        <label>
          Amount Paid<span className="required">*</span>
          <input type="number" name="amountPaid" value={formData.amountPaid} onChange={handleChange} />
        </label>

        <label>
          Payment Method
          <select name="paymentMethod" value={formData.paymentMethod} onChange={handleChange}>
            <option value="CASH">Cash</option>
            <option value="UPI">UPI</option>
            <option value="CARD">Card</option>
          </select>
        </label>

        <label>
          Package<span className="required">*</span>
          <select name="packageName" value={formData.packageName} onChange={handlePackageChange}>
            {packages.map((p, i) => (
              <option key={i} value={p}>{p}</option>
            ))}
          </select>
        </label>

        <label>
          Joining Date
          <input type="date" name="joiningDate" value={formData.joiningDate} onChange={handleChange} />
        </label>

        <label>
          Membership End Date
          <input type="date" name="membershipEndDate" value={formData.membershipEndDate} onChange={handleChange} />
        </label>

        <label>
          Payment Status<span className="required">*</span>
          <select name="paymentStatus" value={formData.paymentStatus} onChange={handleChange}>
            <option value="COMPLETED">Completed</option>
            <option value="PENDING">Pending</option>
          </select>
        </label>

        <label>
          Weight (kg)
          <input type="number" name="weight" value={formData.weight} onChange={handleChange} />
        </label>

        <label>
          Height (cm)
          <input type="number" name="height" value={formData.height} onChange={handleChange} />
        </label>

        {bmi && (
          <div className="bmi-display">
            <strong>BMI:</strong> {bmi}
          </div>
        )}

        <label>
          Profile Photo
          <input type="file" accept="image/*" onChange={handlePhotoChange} />
        </label>

        <button type="submit" className="submit-button">Add Member</button>
      </form>
    </motion.div>
  );
};

export default AddMember;
