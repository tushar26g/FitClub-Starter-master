import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  IconButton,
  TextField,
  Button,
  MenuItem
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Box } from "@mui/material";

import { getStatusStyle, formatDate } from "../../../Utils/utils"; // Assume reusable utility functions
import "./MemberDetailPopup.css";
import { FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from "@mui/material";

const genderOptions = ["MALE", "FEMALE", "OTHER"];

const MemberDetailPopup = ({ member, onClose, onUpdate }) => {
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({ ...member });
    const [bmi, setBmi] = useState(null);

  const handleInputChange = (field, value) => {
    setEditData((prev) => ({ ...prev, [field]: value }));
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

  const handleSave = () => {
    onUpdate(editData);
    setEditMode(false);
  };

useEffect(() => {
    if (member.weight && member.height) {
      const heightInMeters = parseFloat(member.height) / 100;
      const bmiValue = parseFloat(member.weight) / (heightInMeters * heightInMeters);
      setBmi(bmiValue.toFixed(1));
    } else {
      setBmi('');
    }
  }, [member.weight, member.height]);

  const getBMIPosition = () => {
    const val = parseFloat(bmi);
    if (!val) return '0%';
    if (val < 18.5) return '10%';
    if (val < 25) return '40%';
    if (val < 30) return '70%';
    return '90%';
  };

  return (
    <Dialog
      open={true}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        style: {
          backgroundColor: "#FFDEE9",
          backgroundImage: "linear-gradient(0deg, #FFDEE9 0%, #B5FFFC 100%)"
        }
      }}
    >
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        Member Details
        <IconButton onClick={onClose}><CloseIcon /></IconButton>
      </DialogTitle>

      <DialogContent>
        <div className="popup-content">
          <Avatar
            src={
              editData.profilePhoto
                ? `data:image/jpeg;base64,${editData.profilePhoto}`
                : "/default-profile.png"
            }
            sx={{ width: 100, height: 100, margin: "0 auto" }}
          />
          {editMode && (
            <Button variant="outlined" component="label" sx={{ mt: 1 }}>
              Upload Photo
              <input hidden accept="image/*" type="file" onChange={handleFileChange} />
            </Button>
          )}

          {editMode ? (
            <div className="member-details">
              <TextField
                fullWidth
                margin="normal"
                label="Name"
                value={editData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Mobile Number"
                value={editData.mobileNumber}
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
            </div>
          ) : (
            <div className="member-details">
              <h2 style={{ textAlign: "center", marginTop: "1rem" }}>{member.name}</h2>
              <p><strong>Mobile Number:</strong> {member.mobileNumber}</p>
              <p><strong>Email:</strong> {member.email || "N/A"}</p>
              <p><strong>Join Date:</strong> {formatDate(member.joiningDate)}</p>
              <p><strong>Membership Renew Date:</strong> {formatDate(member.renewDate)}</p>
              <p><strong>Membership End:</strong> {formatDate(member.membershipEndDate)}</p>
              <p>
                <strong>Status:</strong>{" "}
                <span className="status" style={getStatusStyle(member.membershipStatus)}>
                  {member.membershipStatus?.toUpperCase() === "SUSPENDED" ? "Expired" : member.membershipStatus}
                </span>
              </p>
              <p><strong>Gender:</strong> {member.gender || "N/A"}</p>
              <p><strong>Date of Birth:</strong> {formatDate(member.dob)}</p>
              <p><strong>Height:</strong> {member.height || "N/A"} cm</p>
              <p><strong>Weight:</strong> {member.weight || "N/A"} KG</p>
              {bmi && (
  <div className="bmi-bar-container">
    <p><strong>BMI:</strong>{bmi}</p>
    <div className="bmi-bar">
      <div className="bmi-indicator" style={{ left: getBMIPosition() }}></div>
    </div>
  </div>
)}
            </div>
          )}
        </div>
      </DialogContent>

      <DialogActions sx={{ justifyContent: "center", padding: "1.5rem" }}>
        {editMode ? (
          <>
            <Button variant="outlined" onClick={() => setEditMode(false)}>Cancel</Button>
            <Button variant="contained" sx={{ backgroundColor: "var(--orange)", color: "white" }} onClick={handleSave}>
              Update
            </Button>
          </>
        ) : (
          <>
            <Button variant="outlined" onClick={() => setEditMode(true)}>Edit Profile</Button>
            <Button
              variant="contained"
              sx={{ backgroundColor: "var(--orange)", color: "white", "&:hover": { backgroundColor: "#e07e0f" } }}
              onClick={() => setEditMode(true)} // Reuse same form with renewMembershipDate added
            >
              Renew Membership
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default MemberDetailPopup;
