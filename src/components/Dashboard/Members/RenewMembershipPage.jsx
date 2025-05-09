import React, { useState } from "react";
import {
  TextField,
  Button,
  Box,
  MenuItem,
  Avatar,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import memberService from "../../../service/memberService";
import dayjs from "dayjs";

function RenewMembershipPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [errors, setErrors] = useState({
    package: false,
    amountPaid: false,
  });
  

  const { memberId , photo, name} = location.state || {};

  const today = dayjs().format("YYYY-MM-DD");

  const [formData, setFormData] = useState({
    membershipRenewDate: today,
    membershipEndDate: "",
    paymentStatus: "COMPLETED",
    paymentMethod: "CASH",
    membershipStatus: "ACTIVE",
    package: "",              // 🔧 FIXED: default to empty
    amountPaid: "",           // 🔧 FIXED: initialize to empty string
  });  

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [field]: false,
    }));    

    if (field === "package" && value) {
      const months = packageToMonths(value);
      const newExpireDate = dayjs(formData.membershipRenewDate)
        .add(months, "month")
        .format("YYYY-MM-DD");
    
      setFormData((prev) => ({
        ...prev,
        membershipEndDate: newExpireDate,
        package: value,
      }));
    }    

    if (field === "membershipRenewDate") {
      const months = packageToMonths(formData.package);
      const newExpireDate = dayjs(value).add(months, "month").format("YYYY-MM-DD");

      setFormData((prev) => ({
        ...prev,
        membershipRenewDate: value,
        membershipEndDate: newExpireDate,
      }));
    }
  };

  const packageToMonths = (pkg) => {
    switch (pkg) {
      case "1_MONTH":
        return 1;
      case "3_MONTH":
        return 3;
      case "6_MONTH":
        return 6;
      case "12_MONTH":
        return 12;
      default:
        return 1;
    }
  };

  const handleSubmit = async () => {
    const newErrors = {
      package: !formData.package,
      amountPaid:
        formData.amountPaid === "" ||
        isNaN(formData.amountPaid) ||
        Number(formData.amountPaid) <= 0,
    };
  
    setErrors(newErrors);
  
    if (newErrors.package) {
      enqueueSnackbar("Please select a membership package", {
        variant: "warning",
        anchorOrigin: { vertical: "top", horizontal: "center" },
      });
      return;
    }
  
    if (newErrors.amountPaid) {
      enqueueSnackbar("Please enter a valid amount", {
        variant: "warning",
        anchorOrigin: { vertical: "top", horizontal: "center" },
      });
      return;
    }

    try {
      if (!memberId) {
        enqueueSnackbar("Member ID is missing", {
          variant: "error",
          anchorOrigin: { vertical: "top", horizontal: "center" },
        });
        return;
      }

      // 🔄 In the FormData to backend:
const dto = {
  memberId,
  membershipRenewDate: formData.membershipRenewDate,
  membershipEndDate: formData.membershipEndDate,
  paymentStatus: formData.paymentStatus,
  paymentMethod: formData.paymentMethod,
  membershipStatus: formData.membershipStatus,
  amountPaid: parseFloat(formData.amountPaid),
};

      const submissionData = new FormData();
      submissionData.append(
        "dto",
        new Blob([JSON.stringify(dto)], { type: "application/json" })
      );

      const response = await memberService.updateMember(submissionData);

      if (response.data.success) {
        enqueueSnackbar(response.data.message || "Membership renewed!", {
          variant: "success",
          anchorOrigin: { vertical: "top", horizontal: "center" },
        });
        setTimeout(() => navigate(-1), 2000);
      } else {
        enqueueSnackbar(response.data.message || "Renewal failed", {
          variant: "error",
          anchorOrigin: { vertical: "top", horizontal: "center" },
        });
      }
    } catch (err) {
      enqueueSnackbar("Something went wrong. Try again.", {
        variant: "error",
        anchorOrigin: { vertical: "top", horizontal: "center" },
      });
      console.error("Renewal error:", err);
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "auto" }}>
      <h2>Renew Membership</h2>
      {/* {photo && ( */}
          <Avatar
            alt={name}
            src={photo ? `data:image/jpeg;base64,${photo}` : ""}
            sx={{ width: 80, height: 80, align: "center", margin: "auto" }}
          />
        {/* )} */}
<h3 style={{ textAlign: "center" }}>
          {name}
        </h3>
      <TextField
  fullWidth
  select
  margin="normal"
  label="Select a package*"
  value={formData.package}
  onChange={(e) => handleChange("package", e.target.value)}
  error={errors.package}
  helperText={errors.package ? "Please select a package" : ""}
  sx ={{ backgroundColor: "white", maxWidth: "5000px" }}
>
<MenuItem value="1_MONTH">1 Month</MenuItem>
  <MenuItem value="3_MONTH">3 Months</MenuItem>
  <MenuItem value="6_MONTH">6 Months</MenuItem>
  <MenuItem value="12_MONTH">12 Months</MenuItem>
</TextField>

<TextField
  fullWidth
  margin="normal"
  label="Amount Paid"
  type="number"
  value={formData.amountPaid}
  onChange={(e) => handleChange("amountPaid", e.target.value)}
  required
  error={errors.amountPaid}
  helperText={errors.amountPaid ? "Enter a valid positive amount" : ""}
  sx ={{ backgroundColor: "white", maxWidth: "5000px" }}
/>

      <TextField
        fullWidth
        margin="normal"
        label="Renewal Date"
        type="date"
        InputLabelProps={{ shrink: true, style: { color: "black" } }}
        value={formData.membershipRenewDate}
        onChange={(e) => handleChange("membershipRenewDate", e.target.value)}
        sx ={{ backgroundColor: "white", maxWidth: "5000px" }}
      />

      <TextField
        fullWidth
        margin="normal"
        label="Expire Date"
        type="date"
        InputLabelProps={{ shrink: true }}
        value={formData.membershipEndDate}
        onChange={(e) => handleChange("membershipEndDate", e.target.value)}
        sx ={{ backgroundColor: "white", maxWidth: "5000px" }}
      />

      <TextField
        fullWidth
        select
        margin="normal"
        label="Payment Status"
        value={formData.paymentStatus}
        onChange={(e) => handleChange("paymentStatus", e.target.value)}
        sx ={{ backgroundColor: "white", maxWidth: "5000px" }}
      >
        {["COMPLETED", "PARTIAL"].map((status) => (
          <MenuItem key={status} value={status}>
            {status}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        fullWidth
        select
        margin="normal"
        label="Payment Method"
        value={formData.paymentMethod}
        onChange={(e) => handleChange("paymentMethod", e.target.value)}
        sx ={{ backgroundColor: "white", maxWidth: "5000px" }}
      >
        {["CASH", "UPI", "CARD"].map((method) => (
          <MenuItem key={method} value={method}>
            {method}
          </MenuItem>
        ))}
      </TextField>

      <Box sx={{ mt: 3 }}>
        <Button
          variant="contained"
          onClick={handleSubmit}
          sx={{
            backgroundColor: "var(--orange)",
            color: "white",
            "&:hover": { backgroundColor: "#e07e0f" },
          }}
        >
          Renew Membership
        </Button>
      </Box>
    </div>
  );
}

export default RenewMembershipPage;
