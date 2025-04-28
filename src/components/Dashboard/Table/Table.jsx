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
  Button,
  IconButton,
  Snackbar
} from "@mui/material";
import MuiAlert from '@mui/material/Alert';
import { useSnackbar } from 'notistack';
import SearchIcon from "@mui/icons-material/Search";
import DownloadIcon from "@mui/icons-material/Download";
import DeleteIcon from "@mui/icons-material/Delete";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import "./Table.css";
import memberService from "../../../service/memberService";
import { useNavigate } from "react-router-dom";
import DeleteConfirmationPopup from "./DeleteConfirmationPopup"; 

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
  const { enqueueSnackbar } = useSnackbar();
  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
const [selectedItem, setSelectedItem] = useState(null);
const [snackbarOpen, setSnackbarOpen] = useState(false);
const [snackbarMessage, setSnackbarMessage] = useState('');

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

  const handleDeleteClick = (member) => {
    setSelectedItem(member);
    setDeleteDialogOpen(true);
  };
  

  const handleDeleteConfirm = async () => {
    try {
      await memberService.deleteMember(selectedItem.id); 
      setDeleteDialogOpen(false);
      setSnackbarMessage(`${selectedItem.name} deleted successfully!`);
      setSnackbarOpen(true);
      fetchMembers(); // Refresh the table after deletion
    } catch (error) {
      console.error('Deletion failed', error);
      setSnackbarMessage('Something went wrong. Please try again.');
      setSnackbarOpen(true);
    }
  };  

  useEffect(() => {
    fetchMembers();
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
      Email: member.email,
      Height: member.height,
      Weight: member.weight,
      Gender: member.gender,
    }));

    const worksheet = XLSX.utils.json_to_sheet(sheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Members");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
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
              <TableCell align="left">Delete</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredMembers.map((member, index) => (
              <TableRow
                key={member.id}
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
                <TableCell align="left" onClick={() => navigate(`/dashboard/member-details/${member.id}`, { state: { member } })}>
                  {member.name}
                </TableCell>
                <TableCell align="left" onClick={() => navigate(`/dashboard/member-details/${member.id}`, { state: { member } })}>
                  {member.mobileNumber}
                </TableCell>
                <TableCell align="left" onClick={() => navigate(`/dashboard/member-details/${member.id}`, { state: { member } })}>
                  {member.membershipEndDate}
                </TableCell>
                <TableCell align="left" onClick={() => navigate(`/dashboard/member-details/${member.id}`, { state: { member } })}>
                  <span className="status" style={getStatusStyle(member.membershipStatus)}>
                    {member.membershipStatus?.toUpperCase() === "SUSPENDED" ? "Expired" : member.membershipStatus}
                  </span>
                </TableCell>
                <TableCell align="left" onClick={(e) => {
                  e.stopPropagation(); // Prevent row navigation on delete icon click
                  handleDeleteClick(member); // Show delete confirmation dialog
                }}>
                  <DeleteIcon sx={{ color: "var(--orange)", cursor: "pointer" }} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Snackbar
  open={snackbarOpen}
  autoHideDuration={3000}
  onClose={() => setSnackbarOpen(false)}
  anchorOrigin={{ vertical: "top", horizontal: "center" }}
>
  <MuiAlert
    onClose={() => setSnackbarOpen(false)}
    severity="success"
    sx={{ width: "100%" }}
  >
    {snackbarMessage}
  </MuiAlert>
</Snackbar>

      {/* Delete Confirmation Popup */}
      {selectedItem && (
  <DeleteConfirmationPopup
    open={deleteDialogOpen}
    onClose={() => setDeleteDialogOpen(false)}
    onConfirm={handleDeleteConfirm}
    title="Confirm Deletion"
    description={`Do you want to delete ${selectedItem.name}?`}
    name={`${selectedItem.name}`}
    photo={selectedItem.profilePhoto ? `data:image/jpeg;base64,${selectedItem.profilePhoto}` : '/default-profile.png'}
  />
)}

    </div>
  );
}
