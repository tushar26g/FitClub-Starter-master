import React, { useEffect, useState } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Avatar, TextField, Button, IconButton, Snackbar
} from "@mui/material";
import MuiAlert from '@mui/material/Alert';
import SearchIcon from "@mui/icons-material/Search";
import DownloadIcon from "@mui/icons-material/Download";
import DeleteIcon from "@mui/icons-material/Delete";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import ownerService from "../../service/adminService"; // Create this service
import DeleteConfirmationPopup from "../Dashboard/Table/DeleteConfirmationPopup";
import { useSnackbar } from "notistack";
import "../Dashboard/Table/Table.css";

export default function AdminDashboard() {
  const [owners, setOwners] = useState([]);
  const [filteredOwners, setFilteredOwners] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedOwner, setSelectedOwner] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    fetchOwners();
  }, []);

  const fetchOwners = async () => {
    try {
      const res = await ownerService.getAllOwners();
      if (res.data.success) {
        setOwners(res.data.data);
        setFilteredOwners(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching owners", error);
    }
  };

  const handleDeleteClick = (owner) => {
    setSelectedOwner(owner);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await ownerService.deleteOwner(selectedOwner.id);
      fetchOwners();
      setDeleteDialogOpen(false);
      setSnackbarMessage(`${selectedOwner.name} deleted successfully`);
      setSnackbarOpen(true);
    } catch (err) {
      setSnackbarMessage("Failed to delete owner");
      setSnackbarOpen(true);
    }
  };

  const exportToExcel = () => {
    const sheetData = filteredOwners.map((owner) => ({
      Name: owner.name,
      Email: owner.email,
      Mobile: owner.mobileNumber,
      Timezone: owner.timezone,
      CreatedAt: owner.createdAt
    }));
    const worksheet = XLSX.utils.json_to_sheet(sheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Owners");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "gym_owners.xlsx");
  };

  useEffect(() => {
    const filtered = owners.filter((o) =>
      o.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.mobileNumber.includes(searchTerm)
    );
    setFilteredOwners(filtered);
  }, [searchTerm, owners]);

  return (
    <div className="Table">
      <div className="table-header">
        <h3>All Gym Owners</h3>
        <div className="table-actions">
          <TextField
            size="small"
            placeholder="Search by name or mobile"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{ startAdornment: <SearchIcon /> }}
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

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Photo</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Mobile</TableCell>
              <TableCell>Timezone</TableCell>
              <TableCell>Delete</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredOwners.map((owner, index) => (
              <TableRow key={owner.id} sx={{ background: index % 2 ? "#f0f0f0" : "#ffffff" }}>
                <TableCell>
                  <Avatar
                    alt={owner.name}
                    src={
                      owner.profilePictureUrl
                        ? owner.profilePictureUrl
                        : "/default-profile.png"
                    }
                  />
                </TableCell>
                <TableCell>{owner.name}</TableCell>
                <TableCell>{owner.email}</TableCell>
                <TableCell>{owner.mobileNumber}</TableCell>
                <TableCell>{owner.timezone}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleDeleteClick(owner)}>
                    <DeleteIcon sx={{ color: "var(--orange)" }} />
                  </IconButton>
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
        <MuiAlert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ width: "100%" }}>
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>

      {selectedOwner && (
        <DeleteConfirmationPopup
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          onConfirm={handleDeleteConfirm}
          title="Delete Owner"
          description={`Are you sure you want to delete ${selectedOwner.name}?`}
          name={selectedOwner.name}
          photo={selectedOwner.profilePictureUrl || "/default-profile.png"}
        />
      )}
    </div>
  );
}
