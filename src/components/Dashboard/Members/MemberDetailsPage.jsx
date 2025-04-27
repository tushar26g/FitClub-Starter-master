import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { TextField, Button, Box, Radio, FormControl, FormLabel, Avatar } from "@mui/material";
import { useSnackbar } from 'notistack';
import memberService from "../../../service/memberService"; // Assuming same service

function MemberDetailsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const { member } = location.state || {};

  const [editData, setEditData] = useState(member || {});

  if (!member) return <div>No member data available</div>;

  const handleInputChange = (field, value) => {
    setEditData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleUpdateProfile = async () => {
    try {
      const formData = new FormData();
      formData.append('dto', new Blob([JSON.stringify(editData)], { type: 'application/json' }));
      if (editData.profilePhoto) {
        formData.append('profilePhoto', editData.profilePhoto);
      }

      const response = await memberService.updateMember(formData);

      if (response.success) {
        enqueueSnackbar(response.message || "Profile updated successfully", { variant: "success" });
        navigate(-1); // Go back to previous page (members list)
      } else {
        enqueueSnackbar(response.message || "Failed to update profile", { variant: "error" });
      }
    } catch (error) {
      console.error("Update failed:", error);
      enqueueSnackbar("Update failed. Please try again later.", { variant: "error" });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () =>
        setEditData((prev) => ({
          ...prev,
          profilePhoto: reader.result.split(",")[1]
        }));
      reader.readAsDataURL(file);
    }
  };


  return (
    <div className="member-details" style={{ padding: "2rem", maxWidth: "600px", margin: "auto" }}>
      <h2>Edit Member Details</h2>
      <Box sx={{ display: "flex", gap: 2, mt: 4 }}>
  <Button variant="outlined" onClick={handleUpdateProfile} sx={{color: "var(--orange)", borderColor: "var(--orange)"}}>Update Profile</Button>
              <Button
                variant="contained"
                sx={{ backgroundColor: "var(--orange)", color: "white", "&:hover": { backgroundColor: "#e07e0f" } }}
                onClick={() => setEditMode(true)} // Reuse same form with renewMembershipDate added
              >
                Renew Membership
              </Button>
</Box>
      <Avatar
            src={
              editData.profilePhoto
                ? `data:image/jpeg;base64,${editData.profilePhoto}`
                : "/default-profile.png"
            }
            sx={{ width: 100, height: 100, margin: "0 auto" }}
          />
          <Button variant="outlined" component="label" sx={{ mt: 1, color: "var(--orange)", borderColor: "var(--orange)" }}>
                        Upload Photo
                        <input hidden accept="image/*" type="file" onChange={handleFileChange} />
                      </Button>
      <TextField
        fullWidth
        margin="normal"
        label="Name"
        value={editData.name || ""}
        onChange={(e) => handleInputChange("name", e.target.value)}
      />
      <TextField
        fullWidth
        margin="normal"
        label="Mobile Number"
        value={editData.mobileNumber || ""}
        onChange={(e) => handleInputChange("mobileNumber", e.target.value)}
      />
      <TextField
        fullWidth
        margin="normal"
        label="Email"
        value={editData.email || ""}
        onChange={(e) => handleInputChange("email", e.target.value)}
      />
      
      <FormControl component="fieldset" sx={{ mt: 2 }}>
        <FormLabel component="legend" sx={{ mb: 1 }}>Gender</FormLabel>
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
      />
      <TextField
        fullWidth
        margin="normal"
        label="Height (in cm)"
        value={editData.height || ""}
        onChange={(e) => handleInputChange("height", e.target.value)}
      />
      <TextField
        fullWidth
        margin="normal"
        label="Weight (in kg)"
        value={editData.weight || ""}
        onChange={(e) => handleInputChange("weight", e.target.value)}
      />

<Box sx={{ display: "flex", gap: 2, mt: 4 }}>
  <Button variant="outlined" onClick={handleUpdateProfile} sx={{color: "var(--orange)", borderColor: "var(--orange)"}}>Update Profile</Button>
              <Button
                variant="contained"
                sx={{ backgroundColor: "var(--orange)", color: "white", "&:hover": { backgroundColor: "#e07e0f" } }}
                onClick={() => setEditMode(true)} // Reuse same form with renewMembershipDate added
              >
                Renew Membership
              </Button>
</Box>
    </div>
  );
}

export default MemberDetailsPage;
