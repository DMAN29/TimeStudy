import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Box,
  TextField,
  Stack,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import axios from "axios";
import OperationTable from "./OperationTable";
import config from "../config";

export default function Home() {
  const navigate = useNavigate();
  const [allowance, setAllowance] = useState("");
  const [submittedAllowance, setSubmittedAllowance] = useState(null);
  const [operations, setOperations] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newAllowance, setNewAllowance] = useState("");
  const [openExportDialog, setOpenExportDialog] = useState(false);
  const [openLapDialog, setOpenLapDialog] = useState(false);

  // ✅ Persist lapCount across renders using localStorage
  const [lapCount, setLapCount] = useState(() => {
    return localStorage.getItem("lapCount")
      ? parseInt(localStorage.getItem("lapCount"), 10)
      : 10; // Default value
  });

  useEffect(() => {
    axios
      .get(`http://116.203.204.42:5000/`)
      .then((response) => setOperations(response.data))
      .catch((error) => console.error("Error fetching operations:", error));

    axios
      .get(`http://116.203.204.42:5000/allowance`)
      .then((response) => {
        setAllowance(response.data);
        setSubmittedAllowance(response.data);
        setNewAllowance(response.data);
      })
      .catch((error) => console.error("Error fetching allowance:", error));
  }, []);

  // ✅ Store lapCount in localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("lapCount", lapCount);
  }, [lapCount]);

  const handleAllowanceChange = (e) => {
    setNewAllowance(e.target.value);
  };

  const handleSubmit = () => {
    if (parseInt(newAllowance, 10) !== parseInt(submittedAllowance, 10)) {
      setOpenDialog(true);
    }
  };

  const handleConfirmUpdate = async () => {
    try {
      const updatedAllowance = parseInt(newAllowance, 10);
      const response = await axios.put(
        `http://116.203.204.42:5000/update-table/${updatedAllowance}`
      );

      setOperations(response.data);
      setAllowance(updatedAllowance);
      setSubmittedAllowance(updatedAllowance);
      setOpenDialog(false);
    } catch (error) {
      console.error("Error updating allowance:", error);
    }
  };

  const handleExportToExcel = async () => {
    try {
      const response = await axios.get(`http://116.203.204.42:5000/export-excel`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "OperationsData.xlsx");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error exporting to Excel:", error);
    }
  };

  const handleAddNewList = () => {
    if(operations.length>0){
      setOpenExportDialog(true);
    }
    else{
      setOpenLapDialog(true);
    }
  };

  const handleConfirmNewList = async () => {
    setOpenExportDialog(false);
    setOpenLapDialog(true);
  };

  const handleLapCountConfirm = async () => {
    try {
      const response = await axios.get(
        `http://116.203.204.42:5000/export-and-clear`,
        {
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "OperationsData.xlsx");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setOperations([]);
      setOpenLapDialog(false);
    } catch (error) {
      console.error("Error exporting and clearing database:", error);
    }
  };

  const handleDelete = async (operatorId) => {
    try {
      await axios.delete(`http://116.203.204.42:5000/delete/${operatorId}`);

      setOperations((prevOperations) =>
        prevOperations.filter(
          (operation) => operation.operatorId !== operatorId
        )
      );
    } catch (error) {
      console.error("Error deleting operation:", error);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minHeight: "100vh",
        px: 4,
        pt: 4,
      }}
    >
      <Stack
        direction="row"
        spacing={2}
        sx={{ width: "100%", justifyContent: "space-between" }}
      >
        <Button
          variant="contained"
          color="secondary"
          onClick={handleAddNewList}
        >
          Add New List
        </Button>

        <Button
          variant="contained"
          color="primary"
          onClick={() =>
            navigate("/operation-details", { state: { lapCount } })
          }
        >
          Add New Details
        </Button>

        <Box sx={{ display: "flex", gap: 2 }}>
          <TextField
            label="Allowance"
            type="number"
            variant="outlined"
            value={newAllowance}
            onChange={handleAllowanceChange}
          />
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Submit
          </Button>
        </Box>

        <Button
          variant="contained"
          color="success"
          onClick={handleExportToExcel}
        >
          Export to Excel
        </Button>
      </Stack>

      <Box sx={{ width: "100%", mt: 4 }}>
        <OperationTable
          operations={operations}
          setOperations={setOperations}
          allowance={allowance}
          lapCount={lapCount} // ✅ Ensure lapCount is passed correctly
          onDelete={handleDelete}
        />
      </Box>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Confirm Update</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Do you really want to change the allowance?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="secondary">
            No
          </Button>
          <Button onClick={handleConfirmUpdate} color="primary" autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openExportDialog} onClose={() => setOpenExportDialog(false)}>
        <DialogTitle>Confirm Export and Clear</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Do you want to save the file? If confirmed, the database will be
            cleared after downloading.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenExportDialog(false)} color="secondary">
            No
          </Button>
          <Button onClick={handleConfirmNewList} color="primary" autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openLapDialog} onClose={() => setOpenLapDialog(false)}>
        <DialogTitle>Select Lap Count</DialogTitle>
        <DialogContent>
          <FormControl fullWidth>
            <InputLabel>Lap Count</InputLabel>
            <Select
              value={lapCount}
              onChange={(e) => setLapCount(e.target.value)}
            >
              <MenuItem value={5}>5</MenuItem>
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={15}>15</MenuItem>
              <MenuItem value={20}>20</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleLapCountConfirm} color="primary" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
