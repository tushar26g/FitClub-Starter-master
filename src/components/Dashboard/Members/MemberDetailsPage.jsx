import React, { useState, useEffect,useRef  } from "react";
import {
  TextField,
  Button,
  Box,
  Radio,
  FormControl,
  FormLabel,
  Avatar,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import memberService from "../../../service/memberService";
import staffService from "../../../service/staffService";

function MemberDetailsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const mobileNumberRef = useRef();
  const { data, type } = location.state || {};
  const [editData, setEditData] = useState(data || {});
  const isMember = type === "member";
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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!data || !type) return <div>No data available</div>;

  const handleInputChange = (field, value) => {
    setEditData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleUpdateProfile = async () => {
    // Check if mobile number is 10 digits
    if (editData.mobileNumber && editData.mobileNumber.length !== 10) {
      setError("Please enter a valid 10-digit mobile number.");
      enqueueSnackbar("Please enter a valid 10-digit mobile number.", {
        variant: "error",
        anchorOrigin: { vertical: "top", horizontal: "center" },
      });
      if (mobileNumberRef.current) {
        mobileNumberRef.current.focus();
      }
      return;
    }
    
  
    try {
      const submissionData = new FormData();
      const dto = { ...editData };
      delete dto.profilePhoto;
  
      if (isMember) dto.memberId = dto.id;
      else dto.staffId = dto.id;
  
      submissionData.append("dto", new Blob([JSON.stringify(dto)], { type: "application/json" }));
  
      if (editData.profilePhoto instanceof File) {
        submissionData.append("profilePhoto", editData.profilePhoto);
      }
  
      const response = isMember
        ? await memberService.updateMember(submissionData)
        : await staffService.updateStaff(submissionData);
  
      if (response.data.success) {
        setMessage(response.data.message || "Staff added successfully!");
        setError("");
        enqueueSnackbar(response.data.message || "Profile updated successfully", {
          variant: "success",
          anchorOrigin: { vertical: "top", horizontal: "center" },
          autoHideDuration: 3000,
        });
        setTimeout(() => {
          navigate(-1);
        }, 1000); // Go back
      } else {
        setError(response?.data?.message || "Failed to add staff.");
        setMessage("");
        enqueueSnackbar(response.data.message || "Update failed", {
          variant: "error",
          anchorOrigin: { vertical: "top", horizontal: "center" },
        });
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Failed to add member. Try again.");
      }
      console.error("Update failed:", error);
      enqueueSnackbar("Something went wrong. Please try again.", {
        variant: "error",
        anchorOrigin: { vertical: "top", horizontal: "center" },
      });
    }
  };  

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditData((prev) => ({
        ...prev,
        profilePhoto: file,
      }));
    }
  };

  return (
    <div className="member-details" style={{
      padding: "2rem",
      maxWidth: "1500px",
      margin: "auto",
      overflowY: "auto",
      maxHeight: "90vh",
    }}>
{message && <div className="toast toast-success">{message}</div>}
{error && <div className="toast toast-error">{error}</div>}

      <h2>Edit {isMember ? "Member" : "Staff"} Details</h2>

      <Box sx={{ textAlign: "center" }}>
        <label htmlFor="profile-upload">
          <Avatar
            src={
              editData.profilePhoto && !(editData.profilePhoto instanceof File)
                ? `data:image/jpeg;base64,${editData.profilePhoto}`
                : "/default-profile.png"
            }
            sx={{ width: 100, height: 100, margin: "0 auto", cursor: "pointer" }}
          />
        </label>
        <input
          hidden
          accept="image/*"
          type="file"
          id="profile-upload"
          onChange={handleFileChange}
        />
        <Button
          variant="outlined"
          component="label"
          sx={{ mt: 1, color: "var(--orange)", borderColor: "var(--orange)" }}
          htmlFor="profile-upload"
        >
          Upload Photo
        </Button>
      </Box>

      <TextField
        fullWidth
        margin="normal"
        label="Name"
        value={editData.name || ""}
        onChange={(e) => handleInputChange("name", e.target.value)}
        InputProps={{ style: { backgroundColor: "white", height: "3rem" } }}
      />
      <TextField
  fullWidth
  margin="normal"
  label="Mobile Number"
  value={editData.mobileNumber || ""}
  onChange={(e) => handleInputChange("mobileNumber", e.target.value)}
  inputRef={mobileNumberRef}
  error={Boolean(error && error.toLowerCase().includes("mobile"))} // ✅ Only show red border if it's a mobile error
  helperText={
    error && error.toLowerCase().includes("mobile")
      ? "Mobile number must be exactly 10 digits"
      : ""
  }
  InputProps={{ style: { backgroundColor: "white", height: "3rem" } }}
  inputProps={{ maxLength: 10 }}
/>

      <TextField
        fullWidth
        margin="normal"
        label="Email"
        value={editData.email || ""}
        onChange={(e) => handleInputChange("email", e.target.value)}
        InputProps={{ style: { backgroundColor: "white", height: "3rem" } }}
      />

      <FormControl component="fieldset" sx={{ mt: 2 }}>
        <FormLabel component="legend" sx={{ mb: 1 }}>
          Gender
        </FormLabel>
        <Box sx={{ display: "flex", gap: 4 }}>
          {["MALE", "FEMALE", "OTHER"].map((g) => (
            <label key={g} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <Radio
                value={g}
                checked={editData.gender === g}
                onChange={(e) => handleInputChange("gender", e.target.value)}
              />
              {g}
            </label>
          ))}
        </Box>
      </FormControl>

      <TextField
        fullWidth
        margin="normal"
        label="Date of Birth"
        type="date"
        InputLabelProps={{ shrink: true }}
        value={editData.dob || ""}
        onChange={(e) => handleInputChange("dob", e.target.value)}
        InputProps={{ style: { backgroundColor: "white", height: "3rem" } }}
      />

      {isMember && (
        <>
          <TextField
            fullWidth
            margin="normal"
            label="Height (in cm)"
            value={editData.height || ""}
            onChange={(e) => handleInputChange("height", e.target.value)}
            InputProps={{ style: { backgroundColor: "white", height: "3rem" } }}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Weight (in kg)"
            value={editData.weight || ""}
            onChange={(e) => handleInputChange("weight", e.target.value)}
            InputProps={{ style: { backgroundColor: "white", height: "3rem" } }}
          />
        </>
      )}

      <Box sx={{ display: "flex", gap: 2, mt: 4 }}>
        <Button
          variant="contained"
          onClick={handleUpdateProfile}
          sx={{
            backgroundColor: "var(--orange)",
            color: "white",
            "&:hover": { backgroundColor: "#e07e0f" },
          }}
        >
          Update Profile
        </Button>
      </Box>
    </div>
  );
}

export default MemberDetailsPage;
