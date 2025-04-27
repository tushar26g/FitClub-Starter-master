import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  TextField,
  Button
} from "@mui/material";
import { useSnackbar } from 'notistack'; // Move the hook here
import SearchIcon from "@mui/icons-material/Search";
import DownloadIcon from "@mui/icons-material/Download";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import "./Table.css";
import memberService from "../../../service/memberService";
import MemberDetailPopup from "../Members/MemberDetailPopup";

const getStatusStyle = (status) => {
  switch (status) {
    case "ACTIVE":
      return { background: "rgba(145, 254, 159, 0.47)", color: "green" };
    case "SUSPENDED":
      return { background: "#ffadad8f", color: "red" };
    default:
      return { background: "#59bfff", color: "white" };
  }
};

export default function BasicTable() {
  const { enqueueSnackbar } = useSnackbar(); // Use hook here
  const [selectedMember, setSelectedMember] = useState(null);
  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const updateMemberHandler = async (updatedData) => {
    try {
      const formData = new FormData();
      formData.append('dto', new Blob([JSON.stringify(updatedData)], { type: 'application/json' }));
      if (updatedData.profilePhoto) {
        formData.append('profilePhoto', updatedData.profilePhoto);
      }

      const response = await memberService.updateMember(formData); // your API call
      if (response.success) {
        enqueueSnackbar(response.message, { variant: "success" });
        // alert(response.message || "Member updated successfully");
        // Close the pop-ups after successful update
        setSelectedMember(null);  // Close the MemberDetailPopup
      } else {
        enqueueSnackbar(response.message, { variant: "error" });
        // alert(response.message || "Failed to update member");
      }

      // Fetch the updated list of members after the update operation
      fetchMembers();

    } catch (error) {
      console.error("Update failed:", error);
      enqueueSnackbar("Update failed. Please try again later.", { variant: "error" });
    }
  };

  const fetchMembers = async () => {
    try {
      const response = await memberService.getMembers();
      if (response.data.success) {
        setMembers(response.data.data);
        setFilteredMembers(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching members", error);
    }
  };

  useEffect(() => {
    fetchMembers(); // Initial data fetch when the component mounts
  }, []);

  useEffect(() => {
    const filtered = members.filter((m) =>
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.mobileNumber.includes(searchTerm)
    );
    setFilteredMembers(filtered);
  }, [searchTerm, members]);

  const exportToExcel = () => {
    const sheetData = filteredMembers.map((member) => ({
      Name: member.name,
      "Mobile Number": member.mobileNumber,
      "Join Date": member.joiningDate,
      "Membership Renew Date": member.renewDate,
      "Membership End Date": member.membershipEndDate,
      "Amount Paid": member.amountPaid,
      "Payment Method": member.paymentMethod,
      Status: member.membershipStatus,
      "Email": member.email,
      "Height": member.height,
      "Weight": member.weight,
      "Gender": member.Gender,
    }));

    const worksheet = XLSX.utils.json_to_sheet(sheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Members");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array"
    });

    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "members.xlsx");
  };

  return (
    <div className="Table">
      <div className="table-header">
        <h3>My Members</h3>

        <div className="table-actions">
          <TextField
            size="small"
            placeholder="Search by name or mobile"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon />
            }}
          />
          <Button
            variant="contained"
            style={{ backgroundColor: "var(--orange)", color: "white", marginLeft: "1rem" }}
            startIcon={<DownloadIcon />}
            onClick={exportToExcel}
          >
            Export
          </Button>
        </div>
      </div>

      <TableContainer component={Paper} className="tableContainer">
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Photo</TableCell>
              <TableCell align="left">Name</TableCell>
              <TableCell align="left">Mobile Number</TableCell>
              <TableCell align="left">Expire Date</TableCell>
              <TableCell align="left">Status</TableCell>
              <TableCell align="left">Details</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredMembers.map((member, index) => (
              <TableRow
                key={member.id}
                onClick={() => setSelectedMember(member)}
                sx={{
                  backgroundColor: index % 2 === 0 ? "#f0f4f8" : "#ffffff",
                  "&:hover": {
                    backgroundColor: "#e1f5fe",
                    cursor: "pointer"
                  },
                  transition: "background-color 0.3s ease"
                }}
              >
                <TableCell>
                  <Avatar
                    alt={member.name}
                    src={
                      member.profilePhoto
                        ? `data:image/jpeg;base64,${member.profilePhoto}`
                        : "/default-profile.png"
                    }
                    sx={{ width: 40, height: 40 }}
                  />
                </TableCell>
                <TableCell align="left">{member.name}</TableCell>
                <TableCell align="left">{member.mobileNumber}</TableCell>
                <TableCell align="left">{member.membershipEndDate}</TableCell>
                <TableCell align="left">
                  <span className="status" style={getStatusStyle(member.membershipStatus)}>
                    {member.membershipStatus?.toUpperCase() === "SUSPENDED" ? "Expired" : member.membershipStatus}
                  </span>
                </TableCell>
                <TableCell align="left" className="Details">
                  Details
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {selectedMember && (
        <MemberDetailPopup
          member={selectedMember}
          onClose={() => setSelectedMember(null)}
          onUpdate={updateMemberHandler}
        />
      )}
    </div>
  );
}
