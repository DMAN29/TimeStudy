import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Box,
  Typography,
} from "@mui/material";

export default function OperationTable({ operations = [], allowance = 0, onDelete, lapCount = 0 }) {
  // Function to handle delete button click
  const handleDelete = (operatorId) => {
    if (onDelete) {
      onDelete(operatorId);
    } else {
      console.error("onDelete function is not provided");
    }
  };

  return (
    <Box sx={{ mt: 3, width: "100%", overflowX: "auto" }}>
      {/* Table Container */}
      <TableContainer component={Paper}>
        <Table sx={{ tableLayout: "auto", minWidth: "100%" }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold", minWidth: "80px" }}>S. No</TableCell>
              <TableCell sx={{ fontWeight: "bold", minWidth: "150px" }}>Operator ID</TableCell>
              <TableCell sx={{ fontWeight: "bold", minWidth: "150px" }}>Name</TableCell>
              <TableCell sx={{ fontWeight: "bold", minWidth: "150px" }}>Operation</TableCell>
              <TableCell sx={{ fontWeight: "bold", minWidth: "150px" }}>Section</TableCell>

              {/* Fixed Lap Headers */}
              {Array.from({ length: lapCount }).map((_, index) => (
                <TableCell key={index} sx={{ fontWeight: "bold", minWidth: "100px" }}>
                  Lap {index + 1}
                </TableCell>
              ))}

              <TableCell sx={{ fontWeight: "bold", minWidth: "150px" }}>Avg Time</TableCell>
              <TableCell sx={{ fontWeight: "bold", minWidth: "150px" }}>
                Allowance Time ({allowance}%)
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", minWidth: "150px" }}>PPH</TableCell>
              <TableCell sx={{ fontWeight: "bold", minWidth: "150px" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {operations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5 + lapCount + 4} sx={{ textAlign: "center", py: 3 }}>
                  <Typography variant="h6" color="gray">Table is empty</Typography>
                </TableCell>
              </TableRow>
            ) : (
              operations.map((operation, index) => (
                <TableRow key={operation.operatorId || index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{operation.operatorId}</TableCell>
                  <TableCell>{operation.name}</TableCell>
                  <TableCell>{operation.operation}</TableCell>
                  <TableCell>{operation.section}</TableCell>

                  {/* Ensure the table always displays `lapCount` laps */}
                  {Array.from({ length: lapCount }).map((_, lapIndex) => (
                    <TableCell key={lapIndex}>
                      {operation.laps && operation.laps[lapIndex] !== undefined
                        ? operation.laps[lapIndex]
                        : "-"}
                    </TableCell>
                  ))}

                  <TableCell>{operation.avgTime || "-"}</TableCell>
                  <TableCell>{operation.allowanceTime || "-"}</TableCell>
                  <TableCell>{operation.pph || "-"}</TableCell>
                  <TableCell>
                    <Button variant="contained" color="error" onClick={() => handleDelete(operation.operatorId)}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
