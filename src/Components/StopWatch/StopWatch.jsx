import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Timer from "./Timer";
import ControlButtons from "./ControlButtons";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";

function StopWatch() {
  const navigate = useNavigate();
  const location = useLocation();
  const lapCount = location.state?.lapCount || 10; // Default 10 laps
  const { name, operatorId, section,operation } = location.state || {};

  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [time, setTime] = useState(0);
  const [laps, setLaps] = useState([]);
  const [lapsMS, setLapsMS] = useState([]);

  // Stop timer when all laps are completed
  const allLapsCompleted = laps.length >= lapCount;

  useEffect(() => {
    let interval = null;

    if (isActive && !isPaused && !allLapsCompleted) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 10);
      }, 10);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isActive, isPaused, allLapsCompleted]);

  const handleStart = () => {
    setIsActive(true);
    setIsPaused(false);
  };

  const handlePauseResume = () => {
    setIsPaused(!isPaused);
  };

  const handleReset = () => {
    setIsActive(false);
    setTime(0);
    setLaps([]);
    setLapsMS([]);
  };

  const handleLap = () => {
    if (laps.length < lapCount) {
      const newLaps = [...laps, time];
      setLaps(newLaps);

      // Calculate lap differences (lapsMS)
      const lapDiff =
        newLaps.length === 1
          ? time
          : time - newLaps[newLaps.length - 2];

      setLapsMS([...lapsMS, lapDiff]);
    }
  };

  const handleSubmit = async () => {
    const payload = {
      name,
      operatorId,
      section,
	  operation,
      lapsMS, // Lap differences in milliseconds
    };

    try {
		console.log(payload);
      const response = await fetch("http://localhost:8080/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        console.log("Data submitted successfully");
        navigate("/");
      } else {
        console.error("Failed to submit data");
      }
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  return (
    <Box sx={{ textAlign: "center", mt: 4, position: "relative" }}>
      <Timer time={time} />

      {/* Hide Control Buttons when all laps are completed */}
      {!allLapsCompleted && (
        <ControlButtons
          active={isActive}
          isPaused={isPaused}
          handleStart={handleStart}
          handlePauseResume={handlePauseResume}
          handleReset={handleReset}
          handleLap={handleLap}
          lapCount={lapCount}
          laps={laps}
        />
      )}

      {/* Lap Table */}
      <TableContainer component={Paper} sx={{ maxWidth: 450, mt: 3, mx: "auto" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center"><b>S.No.</b></TableCell>
              <TableCell align="center"><b>Lap Time</b></TableCell>
              <TableCell align="center"><b>Lap Difference (ms)</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {laps.map((lap, index) => (
              <TableRow key={index}>
                <TableCell align="center">{index + 1}</TableCell>
                <TableCell align="center">{(lap / 1000).toFixed(2)}</TableCell>
                <TableCell align="center">{(lapsMS[index] / 1000).toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Show Submit & Reset only when all laps are recorded */}
      {allLapsCompleted && (
        <Box sx={{ mt: 3, display: "flex", justifyContent: "center", gap: 2 }}>
          <Button variant="contained" color="secondary" onClick={handleReset}>
            Reset
          </Button>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Submit
          </Button>
        </Box>
      )}
    </Box>
  );
}

export default StopWatch;
