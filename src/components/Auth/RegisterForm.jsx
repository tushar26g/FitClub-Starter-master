import React, { useState } from "react";
import {
  TextField,
  Button,
  MenuItem,
  Avatar,
  Box,
} from "@mui/material";
import { useSnackbar } from "notistack";
import gymOwnerService from "../../service/authService";
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";

function GymOwnerRegistrationForm() {
  const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();
const [errorDialog, setErrorDialog] = useState({
  open: false,
  message: "",
});

  const [formData, setFormData] = useState({
    fullName: "",
    mobileNumber: "",
    email: "",
    password: "",
    businessName: "",
    address: "",
    AccountStatus: "TRIAL",
    profilePhoto: null,
  });

  const [errors, setErrors] = useState({});
  const [showTrialPopup, setShowTrialPopup] = useState(false);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: false }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, profilePhoto: e.target.files[0] }));
  };

  const validate = () => {
    const newErrors = {
      fullName: !formData.fullName.trim(),
      mobile: !/^\d{10}$/.test(formData.mobile),
    email: !formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email),
      password: !formData.password.trim(),
      businessName: !formData.businessName.trim(),
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  const handleSubmit = async () => {
    if (!validate()) {
      enqueueSnackbar("Please fix errors before submitting", {
        variant: "warning",
        anchorOrigin: { vertical: "top", horizontal: "center" },
      });
      return;
    }

    try {
      const dto = {
        fullName: formData.fullName,
        mobileNumber: formData.mobile,
        email: formData.email || null,
        password: formData.password,
        businessName: formData.businessName || null,
        address: formData.address || null,
        AccountStatus: "TRIAL",
      };

      const submissionData = new FormData();
      submissionData.append(
        "dto",
        new Blob([JSON.stringify(dto)], { type: "application/json" })
      );
      if (formData.profilePhoto) {
        submissionData.append("profilePhoto", formData.profilePhoto);
      }

      const res = await gymOwnerService.registerOwner(submissionData);

      const { accessToken, refreshToken, owner } = res;
      if (res.success) {
        enqueueSnackbar("Registration successful", {
          variant: "success",
          anchorOrigin: { vertical: "top", horizontal: "center" },
        });
        // ✅ Store tokens and user
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('owner', JSON.stringify(owner));
        setShowTrialPopup(true);
  
        // Automatically redirect after 3 seconds
        setTimeout(() => {
          setShowTrialPopup(false);
          navigate("/dashboard");
        }, 2500);
      } else {
        setErrorDialog({
  open: true,
  message: res.message || "Registration failed",
});

      }
    } catch (err) {
      setErrorDialog({
  open: true,
  message: "Something went wrong. Please try again.",
});

      console.error(err);
    }
  };

  const compactInputStyle = {
    backgroundColor: "white",
    width: "100%",
    mt: 1,
    "& .MuiInputBase-root": {
      fontSize: "0.85rem",
      height: 36,
    },
    "& .MuiInputBase-input": {
      padding: "8px 10px",
    },
    "& .MuiFormHelperText-root": {
      marginTop: "2px",
    },
  };

  return (
    <div>
      <h3 style={{ marginBottom: "1rem", alignContent: "center" }}>Register Gym Owner</h3>

      <Box textAlign="center" my={1}>
        <Avatar
          src={
            formData.profilePhoto
              ? URL.createObjectURL(formData.profilePhoto)
              : ""
          }
          sx={{ width: 64, height: 64, margin: "auto" }}
        />
        <Button variant="outlined" component="label" sx={{ mt: 1, fontSize: "0.75rem", padding: "4px 10px", color: "var(--orange)", borderColor: "var(--orange)" }}>
          Upload Photo
          <input type="file" hidden accept="image/*" onChange={handleFileChange} />
        </Button>
      </Box>

      <TextField
        label="Full Name*"
        value={formData.fullName}
        onChange={(e) => handleChange("fullName", e.target.value)}
        error={errors.fullName}
        helperText={errors.fullName ? "Full Name is required" : ""}
        size="small"
        sx={compactInputStyle}
      />

      <TextField
        label="Mobile*"
        value={formData.mobile}
        onChange={(e) => handleChange("mobile", e.target.value)}
        error={errors.mobile}
        helperText={errors.mobile ? "Enter valid 10-digit mobile number" : ""}
        size="small"
        inputProps={{ maxLength: 10 }}
        sx={compactInputStyle}
      />

      <TextField
  label="Email*"
  value={formData.email}
  onChange={(e) => handleChange("email", e.target.value)}
  error={errors.email}
  helperText={errors.email ? "Valid email is required" : ""}
  size="small"
  sx={compactInputStyle}
/>


      <TextField
        label="Password*"
        type="password"
        value={formData.password}
        onChange={(e) => handleChange("password", e.target.value)}
        error={errors.password}
        helperText={errors.password ? "Password is required" : ""}
        size="small"
        sx={compactInputStyle}
      />

<TextField
  label="Club/Business Name*"
  value={formData.businessName}
  onChange={(e) => handleChange("businessName", e.target.value)}
  error={errors.businessName}
  helperText={errors.businessName ? "Business name is required" : ""}
  size="small"
  sx={compactInputStyle}
/>


      <TextField
        label="Address"
        multiline
        rows={2}
        value={formData.address}
        onChange={(e) => handleChange("address", e.target.value)}
        size="small"
        sx={{ ...compactInputStyle }}
      />

      <Box mt={2} textAlign="center">
        <Button
          variant="contained"
          onClick={handleSubmit}
          sx={{
            backgroundColor: "var(--orange)",
            color: "white",
            padding: "6px 16px",
            fontSize: "0.85rem",
            "&:hover": { backgroundColor: "#e07e0f" },
          }}
        >
          Register
        </Button>
      </Box>
      <Dialog
  open={showTrialPopup}
  maxWidth="xs"
  fullWidth
  sx={{
    "& .MuiPaper-root": {
      backgroundColor: "#FFDEE9",
      backgroundImage: "linear-gradient(0deg, #FFDEE9 0%, #B5FFFC 100%)",
    },
  }}
>
  <DialogTitle textAlign="center" sx={{ fontWeight: 'bold' }}>
    Welcome!
  </DialogTitle>
  <DialogContent sx={{ textAlign: "center", fontSize: "1rem", paddingBottom: 3 }}>
    🎉 Enjoy <strong>30 days</strong> of free trial!
    <Box mt={2} fontSize="0.9rem" color="gray">
      Redirecting to dashboard...
    </Box>
  </DialogContent>
</Dialog>

<Dialog open={errorDialog.open} onClose={() => setErrorDialog({ open: false, message: "" })}>
  <DialogTitle sx={{ fontWeight: 'bold', color: 'red' }}>Registration Error</DialogTitle>
  <DialogContent sx={{ fontSize: "0.95rem" }}>
    {errorDialog.message}
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setErrorDialog({ open: false, message: "" })} sx={{ color: "var(--orange)" }}>
      Close
    </Button>
  </DialogActions>
</Dialog>

    </div>
  );
}

export default GymOwnerRegistrationForm;
