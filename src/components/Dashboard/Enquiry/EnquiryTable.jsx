import React, { useEffect, useState } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, TextField, Button, MenuItem, Snackbar, Avatar, useMediaQuery
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import DownloadIcon from "@mui/icons-material/Download";
import DeleteIcon from "@mui/icons-material/Delete";
import MuiAlert from "@mui/material/Alert";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import enquiryService from "../../../service/enquiryService";
import DeleteConfirmationPopup from "../Table/DeleteConfirmationPopup";
import { formatExcelDateTime } from "../../../Utils/utils";
import { useNavigate } from "react-router-dom";
import { useTheme } from '../../../context/ThemeContext';
import "./EnquiryTable.css"; // Import the CSS with .enquiry-table prefix

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
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';

  // Detect mobile for responsive layout
  const isMobile = useMediaQuery("(max-width:768px)");

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const fetchEnquiries = async () => {
    try {
      const response = await enquiryService.getEnquiries("", "ALL");
      if (response.data.success) {
        setEnquiries(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching enquiries", error);
      if (error.response && error.response.status === 403) {
        setTimeout(() => {
          localStorage.clear();
        }, 5000);
        navigate("/");
        window.location.href = "/";
      }
    }
  };

  useEffect(() => {
    let filtered = enquiries.filter((e) =>
      e.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.mobileNumber?.includes(searchTerm)
    );

    if (interestFilter !== "ALL") {
      filtered = filtered.filter(e => e.interestLevel === interestFilter);
    }

    setFilteredEnquiries(filtered);
  }, [searchTerm, interestFilter, enquiries]);

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
      fetchEnquiries();
    } catch (error) {
      console.error('Deletion failed', error);
      setSnackbarMessage('Something went wrong. Please try again.');
      setSnackbarOpen(true);
    }
  };

  const menuItemStyles = {
    backgroundColor: isDarkMode ? "#1e1e1e" : "var(--pageBackground)",
    color: isDarkMode ? "#f5f5f5" : "#222",
    "&.Mui-selected": {
      backgroundColor: isDarkMode ? "var(--orange)" : "#f97316",
      color: "#fff",
      "&:hover": {
        backgroundColor: isDarkMode ? "#d66a00" : "#ea580c",
      },
    },
    "&:hover": {
      backgroundColor: isDarkMode ? "#333" : "#f0f0f0",
    },
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
      "Enquiry Date": formatExcelDateTime(e.createdAt)
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
    <div className="enquiry-table">
      {/* Header */}
      <div className="enquiry-table-header" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem' }}>
        <h1 style={{
          flexBasis: isMobile ? '100%' : 'auto', marginBottom: isMobile ? '0.75rem' : '1rem',
          marginTop: isMobile ? '-7px' : '0.5rem'
        }}>Enquiries</h1>
        <div className="enquiry-table-actions" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', flexGrow: 1, justifyContent: isMobile ? 'stretch' : 'flex-end' }}>
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
                ...(isDarkMode
                  ? {
                    backgroundColor: "#1e1e1e",
                    color: "#f5f5f5",
                    "& input": {
                      color: "#f5f5f5",
                      backgroundColor: "#1e1e1e",
                      paddingTop: isMobile ? "6px" : undefined,   // reduced vertical padding
                      paddingBottom: isMobile ? "6px" : undefined,
                    },
                    "& .MuiSvgIcon-root": {
                      color: "#f5f5f5",
                    },
                  }
                  : {
                    backgroundColor: "var(--pageBackground)",
                    color: "#222",
                    "& input": {
                      color: "#222",
                      backgroundColor: "var(--pageBackground)",
                      paddingTop: isMobile ? "6px" : undefined,
                      paddingBottom: isMobile ? "6px" : undefined,
                    },
                    "& .MuiSvgIcon-root": {
                      color: "#222",
                    },
                  }),
              },
            }}
            style={{
              minWidth: isMobile ? '100%' : '220px',
              flexGrow: isMobile ? 1 : 0,
            }}
          />
          <TextField
            select
            size="small"
            label="Interest"
            value={interestFilter}
            onChange={(e) => setInterestFilter(e.target.value)}
            style={{
              width: isMobile ? '100%' : 140,
              color: isDarkMode ? "#f5f5f5" : "#222",
              background: isDarkMode ? "#1e1e1e" : "var(--pageBackground)",
            }}
            InputProps={{
              sx: {
                "& fieldset": { borderColor: "var(--orange)" },
                "&:hover fieldset": { borderColor: "var(--orange)" },
                "&.Mui-focused fieldset": { borderColor: "var(--orange)" },
                ...(isDarkMode
                  ? {
                    backgroundColor: "#1e1e1e",
                    color: "#f5f5f5",
                    "& .MuiInputBase-input": {
                      color: "#f5f5f5",
                      backgroundColor: "#1e1e1e",
                      paddingTop: isMobile ? "6px" : undefined,    // reduced vertical padding
                      paddingBottom: isMobile ? "6px" : undefined,
                    },
                    "& .MuiSvgIcon-root": {
                      color: "#f5f5f5",
                    },
                  }
                  : {
                    backgroundColor: "var(--pageBackground)",
                    color: "#222",
                    "& .MuiInputBase-input": {
                      color: "#222",
                      backgroundColor: "var(--pageBackground)",
                      paddingTop: isMobile ? "6px" : undefined,
                      paddingBottom: isMobile ? "6px" : undefined,
                    },
                    "& .MuiSvgIcon-root": {
                      color: "#222",
                    },
                  }),
              }
            }}
            InputLabelProps={{
              sx: {
                color: isDarkMode ? "#f5f5f5" : "#222",
                "&.Mui-focused": {
                  color: isDarkMode ? "#f5f5f5" : "var(--orange)"
                }
              }
            }}
            MenuProps={{
              PaperProps: {
                sx: {
                  backgroundColor: isDarkMode ? "#1e1e1e" : "var(--pageBackground)",
                  color: isDarkMode ? "#f5f5f5" : "#222",
                }
              }
            }}
          >
            <MenuItem value="ALL" sx={menuItemStyles}>All</MenuItem>
            <MenuItem value="HIGH" sx={menuItemStyles}>High</MenuItem>
            <MenuItem value="MODERATE" sx={menuItemStyles}>Moderate</MenuItem>
            <MenuItem value="LOW" sx={menuItemStyles}>Low</MenuItem>
          </TextField>
          <Button
            variant="contained"
            style={{
              backgroundColor: "var(--orange)",
              color: "white",
              minWidth: isMobile ? '100%' : 'auto',
              flexGrow: isMobile ? 1 : 0
            }}
            startIcon={<DownloadIcon />}
            onClick={exportToExcel}
          >
            Export
          </Button>
        </div>
      </div>

      {/* Responsive rendering of enquiry list */}
      {isMobile ? (
        <div style={{ marginTop: "1rem" }}>
          {filteredEnquiries.map((enquiry) => {
            const initials = enquiry.name?.charAt(0).toUpperCase() || "?";
            return (
              <div key={enquiry.id} className="enquiry-block" style={{
                backgroundColor: isDarkMode ? "#1e1e1e" : "#fafafa",
                borderRadius: "12px",
                padding: "1rem",
                marginBottom: "1rem",
                boxShadow: isDarkMode ? "0 2px 8px rgba(0,0,0,0.8)" : "0 2px 8px rgba(0,0,0,0.1)",
                color: isDarkMode ? "#f5f5f5" : "#222"
              }}
              >
                <div style={{ display: "flex", alignItems: "center", marginBottom: "0.5rem", gap: "1rem" }}>
                  <Avatar sx={{ width: 48, height: 48, fontSize: "1.5rem" }}>{initials}</Avatar>
                  <div style={{ fontWeight: 600, fontSize: "1.1rem", flexGrow: 1 }}>{enquiry.name}</div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem", fontSize: "0.95rem" }}>
                  <div><strong>Mobile:</strong> {enquiry.mobileNumber}</div>
                  <div><strong>Interest:</strong> {enquiry.interestLevel || "N/A"}</div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.95rem", alignItems: "center" }}>
                  <div><strong>Email:</strong> {enquiry.email}</div>
                  <DeleteIcon
                    sx={{ color: "var(--orange)", cursor: "pointer" }}
                    onClick={() => handleDeleteClick(enquiry)}
                    titleAccess="Delete"
                  />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <TableContainer component={Paper} className="enquiry-table-container" style={{ marginTop: "1rem" }}>
          <Table className="enquiry-table">
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
                      backgroundColor: index % 2 === 0 ? (isDarkMode ? "#2a2a2a" : "#f0f4f8") : (isDarkMode ? "#1e1e1e" : "#ffffff"),
                      "&:hover": {
                        backgroundColor: isDarkMode ? "#333" : "#e1f5fe",
                        cursor: "pointer",
                      },
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
                    <TableCell
                      align="left"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClick(enquiry);
                      }}
                    >
                      <DeleteIcon sx={{ color: "var(--orange)", cursor: "pointer" }} />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

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
