import React, { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, TextField, Button, MenuItem
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import DownloadIcon from "@mui/icons-material/Download";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import enquiryService from "../../../service/staffService";
import "../Table/Table.css";
import DeleteIcon from "@mui/icons-material/Delete";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { Avatar } from "@mui/material";

export default function StaffTable () {
      const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  
    const [enquiries, setEnquiries] = useState([]);
    const [filteredEnquiries, setFilteredEnquiries] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [interestFilter, setInterestFilter] = useState("ALL");
  
    const handleDelete = async (id) => {
      try {
        const response = await enquiryService.deleteEnquiry(id);
        if (response.data.success) {
          setSnackbarMessage("Enquiry deleted successfully");
          setSnackbarOpen(true);
          // Re-fetch enquiries after deletion
          const refreshed = await enquiryService.getEnquiries(searchTerm, interestFilter);
          if (refreshed.data.success) {
            setFilteredEnquiries(refreshed.data.data);
          }
        }
      } catch (error) {
        console.error("Delete failed:", error);
      }
    };  
  
    useEffect(() => {
      const fetchEnquiries = async () => {
        try {
          const response = await enquiryService.getEnquiries(searchTerm, interestFilter);
          if (response.data.success) {
            setEnquiries(response.data.data); // <-- Add this line
          }
        } catch (error) {
          console.error("Error fetching enquiries", error);
        }
      };
    
      fetchEnquiries();
    }, [searchTerm]);  
    
  
    useEffect(() => {
      let filtered = enquiries.filter((e) =>
        e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.mobileNumber.includes(searchTerm)
      );
  
      setFilteredEnquiries(filtered);
    }, [searchTerm, enquiries]);
  
    const formatDateTime = (iso) => {
      if (!iso) return "-";
      const date = new Date(iso);
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      return `${day}/${month}/${year} ${hours}:${minutes}`;
    };  
  
    const exportToExcel = () => {
      const sheetData = filteredEnquiries.map((e) => ({
        Name: e.name,
        "Mobile Number": e.mobileNumber,
        Email: e.email,
        "Interest Level": e.interestLevel || "-",
        "Created At": formatDateTime(e.createdAt)
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
        "& fieldset": {
          borderColor: "var(--orange)"
        },
        "&:hover fieldset": {
          borderColor: "var(--orange)"
        },
        "&.Mui-focused fieldset": {
          borderColor: "var(--orange)"
        }
      }
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
        "& fieldset": {
          borderColor: "var(--orange)"
        },
        "&:hover fieldset": {
          borderColor: "var(--orange)"
        },
        "&.Mui-focused fieldset": {
          borderColor: "var(--orange)"
        }
      }
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
      const initials = enquiry.name.charAt(0)
        .toUpperCase();
  
      return (
        <TableRow key={enquiry.id}
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
            <Avatar sx={{ width: 40, height: 40 }}>
              {initials}
            </Avatar>
          </TableCell>
          <TableCell>{enquiry.name}</TableCell>
          <TableCell>{enquiry.mobileNumber}</TableCell>
          <TableCell>{enquiry.email}</TableCell>
          <TableCell>{enquiry.interestLevel || "N/A"}</TableCell>
          <TableCell>
          {formatDateTime(enquiry.createdAt)}
          </TableCell>
          <TableCell>
          <DeleteIcon
    onClick={() => handleDelete(enquiry.id)}
    style={{ color: "var(--orange)", cursor: "pointer" }}
  />
          </TableCell>
        </TableRow>
      );
    })}
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
  
      </div>
    );
  }
  