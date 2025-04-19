import React, { useState, useEffect, useRef } from "react";
import memberService from "../../../service/memberService";
import "./AddMember.css";
import { motion } from "framer-motion";

const AddMember = ({ onMemberAdded }) => {
   const fileInputRef = useRef(null);
  const [packageError, setPackageError] = useState(""); // for error handling
  const [dob, setDob] = useState('');
  const today = new Date().toISOString().split("T")[0];
  const [formData, setFormData] = useState({
    name: "",
    mobileNumber: "",
    gender: "",
    paymentStatus: "COMPLETED",
    amountPaid: "",
    email: "",
    paymentMethod: "CASH",
    packageName: "",
    joiningDate: today,
    membershipEndDate: "",
    weight: "",
    height: "",
    dob: "",
  });

  const [profilePhoto, setProfilePhoto] = useState(null);
  const [bmi, setBmi] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const packages = ["Select Package", "1 Month", "3 Months", "6 Months", "12 Months"];
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  // Set default membership end date (1 month from joining date)
  useEffect(() => {
    const defaultEndDate = new Date(today);
    defaultEndDate.setMonth(defaultEndDate.getMonth() + 1);
    setFormData((prev) => ({
      ...prev,
      membershipEndDate: defaultEndDate.toISOString().split("T")[0],
    }));
  }, []);

  useEffect(() => {
    if (message || error) {
      // Reset message or error after 3 seconds to allow for re-triggering
      setTimeout(() => {
        setMessage("");
        setError("");
      }, 3000);
    }
  }, [message, error]);
  

  useEffect(() => {
    if (formData.weight && formData.height) {
      const heightInMeters = parseFloat(formData.height) / 100;
      const bmiValue = parseFloat(formData.weight) / (heightInMeters * heightInMeters);
      setBmi(bmiValue.toFixed(1));
    } else {
      setBmi('');
    }
  }, [formData.weight, formData.height]);
  

  useEffect(() => {
    if (height && weight) {
      const heightInMeters = parseFloat(height) / 100;
      const bmiValue = parseFloat(weight) / (heightInMeters * heightInMeters);
      setBmi(bmiValue.toFixed(1));
    } else {
      setBmi('');
    }
  }, [height, weight]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Mobile number validation
    if (name === "mobileNumber" && (!/^\d{0,10}$/.test(value))) return;

    setFormData((prev) => ({ ...prev, [name]: value }));

      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    
      // Clear the packageError if the user selects a valid option
      if (name === "packageName" && value !== "Select Package") {
        setPackageError(""); // Clear error when a valid package is selected
      }
    
  };

  
  
  const handlePackageChange = (e) => {
    const selectedPackage = e.target.value;
    const startDate = new Date(formData.joiningDate);
    let endDate = new Date(startDate);
  
    if (selectedPackage === "1 Month") {
      endDate.setMonth(endDate.getMonth() + 1);
    } else if (selectedPackage === "3 Months") {
      endDate.setMonth(endDate.getMonth() + 3);
    } else if (selectedPackage === "6 Months") {
      endDate.setMonth(endDate.getMonth() + 6);
    } else if (selectedPackage === "12 Months") {
      endDate.setFullYear(endDate.getFullYear() + 1);
    } else {
      endDate = ""; // fallback
    }
  
    setFormData((prev) => ({
      ...prev,
      packageName: selectedPackage,
      membershipEndDate: endDate
        ? endDate.toISOString().split("T")[0]
        : "",
    }));
  };

  const handlePhotoChange = (e) => {
    setProfilePhoto(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name || !formData.mobileNumber || !formData.paymentStatus || !formData.amountPaid) {
      setError("Please fill in all required fields.");
      return;
    }
  
    // Validate mobile number
    if (!/^\d{10}$/.test(formData.mobileNumber)) {
      setError("Mobile number must be exactly 10 digits.");
      return;
    }

    if (!formData.packageName || formData.packageName === "Select Package") {
      setError("Please select a valid membership package");
      return;
    }
    
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    const oneMonthLater = nextMonth.toISOString().split("T")[0];

    try {
      // Prepare form data
      const submissionData = new FormData();
      const dto = { ...formData };
      if (bmi) dto.bmi = bmi;
  
      submissionData.append("dto", new Blob([JSON.stringify(dto)], { type: "application/json" }));
      if (profilePhoto) {
        submissionData.append("profilePhoto", profilePhoto);
      }
  
      // API call
      const response = await memberService.addMember(submissionData);
  
      // Handle success response from backend
      if (response?.data?.success) {
        setMessage(response.data.message || "Member added successfully!");
        setError("");
        setTimeout(() => setMessage(""), 3000);
  
        fileInputRef.current.value = ""; // 👈 Clear file input
        setProfilePhoto(null); 

        // Clear form
        setFormData({
          name: "",
          mobileNumber: "",
          gender: "",
          paymentStatus: "COMPLETED",
          amountPaid: "",
          email: "",
          paymentMethod: "CASH",
          packageName: "",
          joiningDate: today,
          membershipEndDate: oneMonthLater,
          weight: "",
          height: "",
          dob: "",
        });
        setProfilePhoto(null);
        setBmi(null);
  
        // Safely call parent callback
        if (typeof onMemberAdded === "function") {
          onMemberAdded();
        }
      } else {
        // If success is false but status 200 (edge case)
        setError(response?.data?.message || "Failed to add member.");
        setMessage("");
        setTimeout(() => setError(""), 3000);
      }
  
    } catch (err) {
      console.error("Add Member Error:", err);
  
      // If backend sends error with response (like 409 Conflict)
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Failed to add member. Try again.");
      }
  
      setMessage("");
      setTimeout(() => setError(""), 3000);
    }
  };
  

  const calculateBMI = () => {
    const h = parseFloat(height) / 100; // convert cm to meters
    const w = parseFloat(weight);
    if (h > 0 && w > 0) {
      const result = (w / (h * h)).toFixed(1);
      setBmi(result);
    }
  };

  const getBMIPosition = () => {
    const val = parseFloat(bmi);
    if (!val) return '0%';
    if (val < 18.5) return '10%';
    if (val < 25) return '40%';
    if (val < 30) return '70%';
    return '90%';
  };

  const getAge = (dob) => {
    if (!dob) return '';
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };
  

  return (
    <motion.div
      className="add-member-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h1 className="addMember-heading">Add New Member</h1>
      {message && (
  <div className="toast toast-success">{message}</div>
)}
{error && (
  <div className="toast toast-error">{error}</div>
)}


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
          <span>
          Amount Paid<span className="required"> *</span>
          </span>
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
          <span>
          Package<span className="required"> *</span>
          </span>
          <select
    name="packageName"
    value={formData.packageName}
    onChange={handlePackageChange}
    className={packageError ? "error" : ""}
  >
            {packages.map((p, i) => (
              <option key={i} value={p}>
                {p}
              </option>
            ))}
          </select>
          {packageError && <p className="error-message">{packageError}</p>}
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
          <span>
          Payment Status<span className="required"> *</span>
          </span>
          <select name="paymentStatus" value={formData.paymentStatus} onChange={handleChange}>
            <option value="COMPLETED">Completed</option>
            <option value="PARTIAL">Partial</option>
          </select>
        </label>

        <label>Date of Birth:</label>
        <input
  type="date"
  name="dob"
  value={formData.dob}
  onChange={handleChange}
/>
{dob && <p>Age: {getAge(dob)} years</p>}

<label>Height (cm):</label>
<input
  type="number"
  name="height"
  value={formData.height}
  onChange={(e) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      height: value === '' ? '' : parseFloat(value),
    }));
    setHeight(value); // Optional: only if you need this state separately
  }}
/>

<label>Weight (kg):</label>
<input
  type="number"
  name="weight"
  value={formData.weight}
  onChange={(e) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      weight: value === '' ? '' : parseFloat(value),
    }));
    setWeight(value); // Optional
  }}
/>

{bmi && (
  <div className="bmi-bar-container">
    <div className="bmi-bar">
      <div className="bmi-indicator" style={{ left: getBMIPosition() }}></div>
    </div>
    <p>Your BMI is: {bmi}</p>
  </div>
)}


        <label>
          Profile Photo
          <input type="file" accept=".png,.jpg,.jpeg,.webp, .PNG" capture="environment" onChange={handlePhotoChange}
            ref={fileInputRef} />
        </label>

        <button type="submit" className="submit-button">
          Add Member
        </button>
      </form>
    </motion.div>
  );
};

export default AddMember;
