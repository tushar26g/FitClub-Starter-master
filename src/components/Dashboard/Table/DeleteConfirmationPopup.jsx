import React from 'react';
import {
  Dialog, DialogActions, DialogContent, DialogTitle, Button, Avatar
} from '@mui/material';
import { useTheme } from '../../../context/ThemeContext'; // Use your app's ThemeContext

const DeleteConfirmationPopup = ({
  open, onClose, onConfirm, title, description, name, photo
}) => {
  // Detect the theme
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  // Gradients for dark/light
  const gradient = isDarkMode
    ? 'linear-gradient(120deg, #232526 0%, #414345 100%)'
    : 'linear-gradient(0deg, #FFDEE9 0%, #B5FFFC 100%)';

  const paperStyle = {
    backgroundColor: isDarkMode ? "#232526" : "#FFDEE9",
    backgroundImage: gradient,
    color: isDarkMode ? "#fff" : "#222",
    boxShadow: isDarkMode ? '0 8px 32px 0 #0002' : undefined,
    border: isDarkMode ? '1px solid #444' : 'none',
    transition: "all .2s"
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      sx={{
        "& .MuiPaper-root": paperStyle,
      }}
    >
      <DialogTitle
        align="center"
        sx={{
          fontWeight: "bold",
          color: 'var(--orange)',
          fontSize: "1.15rem"
        }}
      >
        {title || "Confirm Deletion"}
      </DialogTitle>

      <DialogContent
        sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}
      >
        {photo && (
          <Avatar
            alt={name}
            src={photo}
            sx={{ width: 80, height: 80, boxShadow: isDarkMode ? "0 0 0 2px #fff5" : undefined }}
          />
        )}
        <p style={{
          textAlign: "center",
          margin: "8px 0 0",
          color: isDarkMode ? "#eee" : "#222",
          fontSize: "1.08rem"
        }}>
          {description || "Are you sure you want to delete this item?"}
        </p>
      </DialogContent>

      <DialogActions sx={{ justifyContent: "center", gap: 2 }}>
        <Button
          onClick={onClose}
          sx={{
            fontSize: "1rem",
            fontWeight: "bold",
            color: isDarkMode ? "#ccc" : undefined,
            background: isDarkMode ? "#4449" : "#fff",
            borderRadius: 2,
            ":hover": {
              background: isDarkMode ? "#555b" : "#f7f7f7"
            }
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          sx={{
            fontSize: "1rem",
            fontWeight: "bold",
            color: "#fff",
            background: "linear-gradient(90deg, #e44 60%, #e67e22 100%)",
            boxShadow: isDarkMode ? "0 2px 6px #0005" : undefined,
            borderRadius: 2,
            ":hover": {
              background: "linear-gradient(90deg, #c00 60%, #ff9922 90%)"
            }
          }}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmationPopup;