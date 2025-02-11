import React from "react";
import { Button, Box } from "@mui/material";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import RestoreIcon from '@mui/icons-material/Restore';
import FlagIcon from '@mui/icons-material/Flag';

function ControlButtons({ active, isPaused, handleStart, handlePauseResume, handleReset, handleLap, lapCount, laps }) {
	return (
		<Box sx={{ mt: 2, display: "flex", justifyContent: "center", gap: 2 }}>
			{!active ? (
				<Button variant="contained" color="success" onClick={handleStart}>
					Start
				</Button>
			) : (
				<>
					<Button variant="contained" color={isPaused ? "primary" : "warning"} onClick={handlePauseResume}>
						{isPaused ? <PlayArrowIcon/> : <PauseIcon/>}
					</Button>
					<Button
						variant="contained"
						color="info"
						onClick={handleLap}
						disabled={isPaused || laps.length >= lapCount} // Disable if paused or max laps reached
					>
						<FlagIcon/>
					</Button>
					<Button variant="contained" color="secondary" onClick={handleReset}>
						<RestoreIcon/>
					</Button>
				</>
			)}
		</Box>
	);
}

export default ControlButtons;
