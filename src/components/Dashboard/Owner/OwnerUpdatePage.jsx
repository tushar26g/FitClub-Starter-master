import React, { useState, useEffect, useRef } from "react";
import {
  TextField,
  Button,
  Box,
  Avatar,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import ownerService from "../../../service/ownerService";

function OwnerUpdatePage() {
  const navigate = useNavigate();
    const mobileNumberRef = useRef();
  const { enqueueSnackbar } = useSnackbar();
  const [owner, setOwner] = useState(JSON.parse(localStorage.getItem("owner")));
  const [editData, setEditData] = useState(owner || {});
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

  const handleInputChange = (field, value) => {
    setEditData((prev) => ({
      ...prev,
      [field]: value,
    }));
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

  const handleUpdate = async () => {
    try {
      const submissionData = new FormData();
      const dto = { ...editData };
      dto.ownerId = dto.id;
      delete dto.profilePhoto;

      submissionData.append("dto", new Blob([JSON.stringify(dto)], { type: "application/json" }));
      if (editData.profilePhoto instanceof File) {
        submissionData.append("profilePhoto", editData.profilePhoto);
      }

      const res = await ownerService.updateOwner(submissionData);
      if (res.data.success) {
        enqueueSnackbar("Profile updated successfully", {
          variant: "success",
          anchorOrigin: { vertical: "top", horizontal: "center" },
        });

        const updatedOwner = res.data.updatedOwner;
        localStorage.setItem("owner", JSON.stringify(updatedOwner));
        // navigate("/dashboard");
      } else {
        enqueueSnackbar(res.data.message || "Update failed", {
          variant: "error",
          anchorOrigin: { vertical: "top", horizontal: "center" },
        });
      }
    } catch (err) {
      console.error(err);
      enqueueSnackbar("Update failed. Please try again.", {
        variant: "error",
        anchorOrigin: { vertical: "top", horizontal: "center" },
      });
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
    <div className="owner-details" style={{ padding: "2rem", maxWidth: "1000px", margin: "auto" }}>
      <h2>Update Profile</h2>
      <Box sx={{ textAlign: "center" }}>
        <label htmlFor="owner-upload">
          <Avatar
            src={
              editData.profilePhoto && !(editData.profilePhoto instanceof File)
                ? `data:image/jpeg;base64,${editData.profilePhoto}`
                : "/default-profile.png"
            }
            sx={{ width: 100, height: 100, margin: "0 auto", cursor: "pointer" }}
          />
        </label>
        <input hidden accept="image/*" type="file" id="owner-upload" onChange={handleFileChange} />
        <Button variant="outlined" htmlFor="owner-upload" component="label" 
        sx={{ mt: 1, color: "var(--orange)", borderColor: "var(--orange)" }}>
          Upload Photo
        </Button>
      </Box>

      <TextField
        fullWidth
        margin="normal"
        label="Full Name"
        value={editData.fullName || ""}
        onChange={(e) => handleInputChange("fullName", e.target.value)}
        InputProps={{ style: { backgroundColor: "white", height: "3rem" } }}
      />
      <TextField
        fullWidth
        margin="normal"
        label="Email"
        value={editData.email || ""}
        onChange={(e) => handleInputChange("email", e.target.value)}
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
        label="Business Name"
        value={editData.businessName || ""}
        onChange={(e) => handleInputChange("businessName", e.target.value)}
        InputProps={{ style: { backgroundColor: "white", height: "3rem" } }}
      />
<TextField
        fullWidth
        margin="normal"
        label="Address"
        value={editData.address || ""}
        onChange={(e) => handleInputChange("address", e.target.value)}
        InputProps={{ style: { backgroundColor: "white", height: "3rem" } }}
      />
      <Box sx={{ mt: 3 }}>
        <Button variant="contained" onClick={handleUpdate} sx={{ backgroundColor: "var(--orange)" }}>
          Update
        </Button>
      </Box>
    </div>
  );
}

export default OwnerUpdatePage;
