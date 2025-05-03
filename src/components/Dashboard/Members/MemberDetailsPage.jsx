import React, { useState, useEffect } from "react";
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

  const { data, type } = location.state || {};
  const [editData, setEditData] = useState(data || {});

  const isMember = type === "member";

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
    try {
      const formData = new FormData();
      formData.append("dto", new Blob([JSON.stringify(editData)], { type: "application/json" }));

      if (editData.profilePhoto instanceof File) {
        formData.append("profilePhoto", editData.profilePhoto);
      }

      const response = isMember
        ? await memberService.updateMember(formData)
        : await staffService.updateStaff(formData);

      if (response.success) {
        enqueueSnackbar(response.message || "Profile updated successfully", { variant: "success" });
        navigate(-1);
      } else {
        enqueueSnackbar(response.message || "Update failed", { variant: "error" });
      }
    } catch (error) {
      console.error("Update failed:", error);
      enqueueSnackbar("Something went wrong. Please try again.", { variant: "error" });
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
        InputProps={{ style: { backgroundColor: "white", height: "3rem"  } }}
      />
      <TextField
        fullWidth
        margin="normal"
        label="Mobile Number"
        value={editData.mobileNumber || ""}
        onChange={(e) => handleInputChange("mobileNumber", e.target.value)}
        InputProps={{ style: { backgroundColor: "white", height: "3rem"  } }}
      />
      <TextField
        fullWidth
        margin="normal"
        label="Email"
        value={editData.email || ""}
        onChange={(e) => handleInputChange("email", e.target.value)}
        InputProps={{ style: { backgroundColor: "white", height: "3rem"  } }}
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
        InputProps={{ style: { backgroundColor: "white", height: "3rem"  } }}
      />

      {isMember && (
        <>
          <TextField
            fullWidth
            margin="normal"
            label="Height (in cm)"
            value={editData.height || ""}
            onChange={(e) => handleInputChange("height", e.target.value)}
            InputProps={{ style: { backgroundColor: "white", height: "3rem"  } }}
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
          variant="outlined"
          onClick={handleUpdateProfile}
          sx={{ color: "var(--orange)", borderColor: "var(--orange)" }}
        >
          Update Profile
        </Button>
      </Box>
    </div>
  );
}

export default MemberDetailsPage;
