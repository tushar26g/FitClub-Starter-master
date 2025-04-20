import React, { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, TextField, Button, Snackbar, Avatar
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import SearchIcon from "@mui/icons-material/Search";
import DownloadIcon from "@mui/icons-material/Download";
import DeleteIcon from "@mui/icons-material/Delete";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import staffService from "../../../service/staffService";
import "../Table/Table.css";
import attendanceService from '../../../service/attendanceService';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './calendarStyles.css'; // you'll create this for custom date styling
import { Dialog, DialogTitle, DialogContent, IconButton, Tooltip, MenuItem, Select } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import './calendarStyles.css';

export default function StaffTable() {
    const [attendanceDialogOpen, setAttendanceDialogOpen] = useState(false);
const [selectedStaffId, setSelectedStaffId] = useState(null);
const [attendanceData, setAttendanceData] = useState([]);
    const [attendanceStatus, setAttendanceStatus] = useState({});
  const [staffs, setStaffs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleViewAttendance = async (staffId) => {
    try {
      setSelectedStaffId(staffId);
      const response = await attendanceService.getStaffAttendance(staffId);
      if (response.data.success) {
        setAttendanceData(response.data.data);
        setAttendanceDialogOpen(true);
      }
    } catch (error) {
      console.error("Error fetching attendance", error);
    }
  };
  
  const handleAttendanceChange = (staffId, status) => {
    setAttendanceStatus((prev) => ({ ...prev, [staffId]: status }));
  };
  
  const submitAttendance = async (staffId) => {
    const status = attendanceStatus[staffId];
    if (!status) {
      setSnackbarMessage("Please select attendance status");
      setSnackbarOpen(true);
      return;
    }
  
    try {
      const dto = {
        staffId,
        status,
        date: new Date().toISOString().split("T")[0],
      };
  
      const response = await attendanceService.markAttendance(dto);
  
      if (response.data.success) {
        setSnackbarMessage("Attendance marked successfully");
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error("Error marking attendance:", error);
      setSnackbarMessage("Failed to mark attendance");
      setSnackbarOpen(true);
    }
  };
  

  const fetchStaffs = async () => {
    try {
        const response = await staffService.getStaffList(searchTerm, "BOTH");

      if (response.data.success) {
        setStaffs(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching staff details", error);
    }
  };

  useEffect(() => {
    fetchStaffs();
  }, [searchTerm]);

  const handleDelete = async (id) => {
    try {
      const response = await staffService.deleteStaff(id);
      if (response.data.success) {
        setSnackbarMessage("Staff deleted successfully");
        setSnackbarOpen(true);
        fetchStaffs(); // Refresh after deletion
      }
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const formatDateTime = (timestamp) => {
    if (!timestamp) return "-";
    return new Date(timestamp).toLocaleString();
  };

  const filteredStaffs = staffs.filter((e) =>
    e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.mobileNumber.includes(searchTerm)
  );  

  const exportToExcel = () => {
    const sheetData = filteredStaffs.map((e) => ({
      Name: e.name,
      "Mobile Number": e.mobileNumber,
      Email: e.email,
      "Created At": formatDateTime(e.createdAt),
    }));

    const worksheet = XLSX.utils.json_to_sheet(sheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Staffs");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "staffs.xlsx");
  };

  return (
    <div className="Table">
      <div className="table-header">
        <h1>My staff</h1>

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
              <TableCell>Mark Attendance</TableCell>
              <TableCell>View Attendance</TableCell> 
              <TableCell>Delete</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredStaffs.map((staff, index) => {
              const initials = staff.name?.charAt(0).toUpperCase() || "?";
              return (
                <TableRow
                  key={staff.id}
                  sx={{
                    backgroundColor: index % 2 === 0 ? "#f0f4f8" : "#ffffff",
                    "&:hover": {
                      backgroundColor: "#e1f5fe",
                      cursor: "pointer",
                    },
                    transition: "background-color 0.3s ease",
                  }}
                >
                  <TableCell>
                    <Avatar
                                        alt={staff.name}
                                        src={
                                          staff.profilePhoto
                                            ? `data:image/jpeg;base64,${staff.profilePhoto}`
                                            : "/default-profile.png"
                                        }
                                        sx={{ width: 40, height: 40 }}
                                      />
                    {/* <Avatar sx={{ width: 40, height: 40 }}>{initials}</Avatar> */}
                  </TableCell>
                  <TableCell>{staff.name}</TableCell>
                  <TableCell>{staff.mobileNumber}</TableCell>
                  <TableCell>
    <select
      value={attendanceStatus[staff.id] || ""}
      onChange={(e) => handleAttendanceChange(staff.id, e.target.value)}
      style={{ marginRight: "0.5rem" }}
    >
      <option value="">Select</option>
      <option value="PRESENT">Present</option>
      <option value="ABSENT">Absent</option>
      <option value="LEAVE">Leave</option>
    </select>
    <Button
      variant="contained"
      size="small"
      onClick={() => submitAttendance(staff.id)}
      style={{ backgroundColor: "var(--orange)", color: "white" }}
    >
      Mark
    </Button>
  </TableCell>
  <TableCell>
  <Tooltip title="View Attendance">
    <IconButton onClick={() => handleViewAttendance(staff.id)} style={{ color: "var(--orange)" }}>
      <VisibilityIcon />
    </IconButton>
  </Tooltip>
</TableCell>

                  <TableCell>
                    <DeleteIcon
                      onClick={() => handleDelete(staff.id)}
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
      <Dialog open={attendanceDialogOpen} onClose={() => setAttendanceDialogOpen(false)} maxWidth="xs" fullWidth>
  <DialogTitle>Attendance Calendar</DialogTitle>
  <DialogContent>
    <Calendar
      tileContent={({ date }) => {
        const entry = attendanceData.find((a) => new Date(a.date).toDateString() === date.toDateString());
        if (!entry) return null;

        const statusMap = {
          PRESENT: { label: "P", color: "green" },
          ABSENT: { label: "A", color: "red" },
          LEAVE: { label: "L", color: "orange" },
        };

        const { label, color } = statusMap[entry.status];
        return (
          <div
            style={{
              fontSize: "0.8rem",
              fontWeight: "bold",
              color,
              textAlign: "center",
              marginTop: "4px",
            }}
          >
            {label}
          </div>
        );
      }}
    />
  </DialogContent>
</Dialog>

    </div>
  );
}
