import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Avatar } from '@mui/material';

const DeleteConfirmationPopup = ({ open, member, onClose, onConfirm }) => {
  return (
    <Dialog open={open} onClose={onClose} sx={{
        "& .MuiPaper-root": {
          backgroundColor: "#FFDEE9",
          backgroundImage: "linear-gradient(0deg, #FFDEE9 0%, #B5FFFC 100%)",
        },
      }}>
  <DialogTitle
    color="var(--orange)"
    align="center"
    sx={{ fontWeight: "bold" }}
  >
    Confirm Deletion
  </DialogTitle>
  <DialogContent sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
    {/* Centered photo */}
    <Avatar
      alt={member.name}
      src={member.profilePhoto ? `data:image/jpeg;base64,${member.profilePhoto}` : "/default-profile.png"}
      sx={{ width: 80, height: 80 }} // Slightly larger photo for better visibility
    />
    {/* Centered question */}
    <p style={{ textAlign: "center" }}>
      Do you want to delete <strong>{member.name}</strong>?
    </p>
  </DialogContent>
  <DialogActions sx={{ justifyContent: "center", gap: 2 }}>
    {/* Centered Buttons */}
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
      onClick={() => onConfirm(member.id)}
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
