import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar
} from "@mui/material";
import "./Table.css";
import memberService from "../../../service/memberService";

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
  const [members, setMembers] = useState([]);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await memberService.getMembers();
        if (response.data.success) {
          setMembers(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching members", error);
      }
    };

    fetchMembers();
  }, []);

  return (
    <div className="Table">
      <h3>My Members</h3>
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
            {members.map((member) => (
              <TableRow key={member.id}>
                <TableCell>
                  <Avatar
                    alt={member.name}
                    src={member.profilePhotoUrl}
                    sx={{ width: 40, height: 40 }}
                  />
                </TableCell>
                <TableCell align="left">{member.name}</TableCell>
                <TableCell align="left">{member.mobileNumber}</TableCell>
                <TableCell align="left">{member.membershipEndDate}</TableCell>
                <TableCell align="left">
                  <span className="status" style={getStatusStyle(member.membershipStatus)}>
                    {member.membershipStatus}
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
    </div>
  );
}
