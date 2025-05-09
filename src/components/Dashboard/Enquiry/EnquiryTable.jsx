import React, { useEffect, useState } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, TextField, Button, MenuItem, Snackbar, Avatar
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import DownloadIcon from "@mui/icons-material/Download";
import DeleteIcon from "@mui/icons-material/Delete";
import MuiAlert from "@mui/material/Alert";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import enquiryService from "../../../service/enquiryService";
import DeleteConfirmationPopup from "../Table/DeleteConfirmationPopup";
import "../Table/Table.css"; // CSS remains
import { formatExcelDateTime } from "../../../Utils/utils";
import { useNavigate } from "react-router-dom";

export default function EnquiryTable() {
  const navigate = useNavigate();
  const [enquiries, setEnquiries] = useState([]);
  const [filteredEnquiries, setFilteredEnquiries] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [interestFilter, setInterestFilter] = useState("ALL");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const fetchEnquiries = async () => {
    try {
      const response = await enquiryService.getEnquiries("", "ALL"); // Always fetch full data
      if (response.data.success) {
        setEnquiries(response.data.data); // only setEnquiries
      }
    } catch (error) {
      console.error("Error fetching enquiries", error);
      if (error.response && error.response.status === 403) {
        setTimeout(() =>
        {
          localStorage.clear();
        },5000)
        navigate("/");
        window.location.href = "/";
      }
    }
  };
  

  useEffect(() => {
    let filtered = enquiries.filter((e) =>
      e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.mobileNumber.includes(searchTerm)
    );
  
    if (interestFilter !== "ALL") {
      filtered = filtered.filter(e => e.interestLevel === interestFilter);
    }
  
    setFilteredEnquiries(filtered);
  }, [searchTerm, interestFilter, enquiries]);
  

  const applyFilters = () => {
    let filtered = enquiries.filter((e) => 
      e.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.mobileNumber?.includes(searchTerm)
    );

    if (interestFilter !== "ALL") {
      filtered = filtered.filter((e) => e.interestLevel === interestFilter);
    }

    setFilteredEnquiries(filtered);
  };

  const handleDeleteClick = (enquiry) => {
    setSelectedItem(enquiry);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await enquiryService.deleteEnquiry(selectedItem.id);
      setDeleteDialogOpen(false);
      setSnackbarMessage(`${selectedItem.name} deleted successfully!`);
      setSnackbarOpen(true);
      fetchEnquiries(); // No need to reset searchTerm
    } catch (error) {
      console.error('Deletion failed', error);
      setSnackbarMessage('Something went wrong. Please try again.');
      setSnackbarOpen(true);
    }
  };

  const formatDateTime = (iso) => {
    if (!iso) return "-";
    const date = new Date(iso);
    return `${date.getDate().toString().padStart(2, "0")}/
            ${String(date.getMonth() + 1).padStart(2, "0")}/
            ${date.getFullYear()} ${date.getHours().toString().padStart(2, "0")}:
            ${date.getMinutes().toString().padStart(2, "0")}`;
  };

  const exportToExcel = () => {
    const sheetData = filteredEnquiries.map((e) => ({
      Name: e.name,
      "Mobile Number": e.mobileNumber,
      Email: e.email,
      "Interest Level": e.interestLevel || "-",
      "Enquiry Date": formatExcelDateTime(e.createdAt) // using util function
    }));
  
    const worksheet = XLSX.utils.json_to_sheet(sheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Enquiries");
  
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array"
    });
  
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "enquiries.xlsx");
  };  

  return (
    <div className="Table">
      {/* Header */}
      <div className="table-header">
        <h1>Enquiries</h1>
        <div className="table-actions">
          <TextField
            size="small"
            placeholder="Search name or mobile"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon />,
              sx: {
                "& fieldset": { borderColor: "var(--orange)" },
                "&:hover fieldset": { borderColor: "var(--orange)" },
                "&.Mui-focused fieldset": { borderColor: "var(--orange)" },
              },
            }}
            style={{ marginRight: "1rem", minWidth: "220px" }}
          />
          <TextField
            select
            size="small"
            label="Interest"
            value={interestFilter}
            onChange={(e) => setInterestFilter(e.target.value)}
            style={{ width: 140, marginRight: "1rem" }}
            InputProps={{
              sx: {
                "& fieldset": { borderColor: "var(--orange)" },
                "&:hover fieldset": { borderColor: "var(--orange)" },
                "&.Mui-focused fieldset": { borderColor: "var(--orange)" },
              },
            }}
          >
            <MenuItem value="ALL">All</MenuItem>
            <MenuItem value="HIGH">High</MenuItem>
            <MenuItem value="MODERATE">Moderate</MenuItem>
            <MenuItem value="LOW">Low</MenuItem>
          </TextField>

          <Button
            variant="contained"
            style={{ backgroundColor: "var(--orange)", color: "white" }}
            startIcon={<DownloadIcon />}
            onClick={exportToExcel}
          >
            Export
          </Button>
        </div>
      </div>

      {/* Table */}
      <TableContainer component={Paper} className="tableContainer">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Avatar</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Mobile</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Interest</TableCell>
              <TableCell>Enquiry Date</TableCell>
              <TableCell>Delete</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredEnquiries.map((enquiry, index) => {
              const initials = enquiry.name?.charAt(0).toUpperCase() || "?";
              return (
                <TableRow
                  key={enquiry.id}
                  sx={{
                    backgroundColor: index % 2 === 0 ? "#f0f4f8" : "#ffffff",
                    "&:hover": { backgroundColor: "#e1f5fe", cursor: "pointer" },
                    transition: "background-color 0.3s ease",
                  }}
                >
                  <TableCell>
                    <Avatar sx={{ width: 40, height: 40 }}>{initials}</Avatar>
                  </TableCell>
                  <TableCell>{enquiry.name}</TableCell>
                  <TableCell>{enquiry.mobileNumber}</TableCell>
                  <TableCell>{enquiry.email}</TableCell>
                  <TableCell>{enquiry.interestLevel || "N/A"}</TableCell>
                  <TableCell>{formatDateTime(enquiry.createdAt)}</TableCell>
                  <TableCell align="left" onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteClick(enquiry);
                  }}>
                    <DeleteIcon sx={{ color: "var(--orange)", cursor: "pointer" }} />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Snackbar */}
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
          name={selectedItem.name}
          photo={selectedItem.profilePhoto ? `data:image/jpeg;base64,${selectedItem.profilePhoto}` : '/default-profile.png'}
        />
      )}
    </div>
  );
}
