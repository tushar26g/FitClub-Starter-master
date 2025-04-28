import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Avatar } from '@mui/material';

const DeleteConfirmationPopup = ({ open, onClose, onConfirm, title, description, name, photo }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      sx={{
        "& .MuiPaper-root": {
          backgroundColor: "#FFDEE9",
          backgroundImage: "linear-gradient(0deg, #FFDEE9 0%, #B5FFFC 100%)",
        },
      }}
    >
      <DialogTitle
        color="var(--orange)"
        align="center"
        sx={{ fontWeight: "bold" }}
      >
        {title || "Confirm Deletion"}
      </DialogTitle>

      <DialogContent sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
        {/* Centered photo if provided */}
        {photo && (
          <Avatar
            alt={name}
            src={photo}
            sx={{ width: 80, height: 80 }}
          />
        )}
        {/* Centered description */}
        <p style={{ textAlign: "center" }}>
          {description || "Are you sure you want to delete this item?"}
        </p>
      </DialogContent>

      <DialogActions sx={{ justifyContent: "center", gap: 2 }}>
        <Button
          onClick={onClose}
          sx={{
            fontSize: "1rem",
            fontWeight: "bold",
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          sx={{
            color: "red",
            fontSize: "1rem",
            fontWeight: "bold",
          }}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmationPopup;
