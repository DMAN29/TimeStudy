import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { TextField, Button, Box, Stack } from "@mui/material";
import config from "../config";

export default function OperationDetails() {
    const navigate = useNavigate();
    const location = useLocation();

    // Retrieve lapCount from navigation state, defaulting to 10 if undefined
    const lapCount = location.state?.lapCount || 10;

    const [formData, setFormData] = useState({
        name: "",
        operatorId: "",
        operation: "",
        section: "",
        lapCount: lapCount, // Store retrieved lap count
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Function to check if operator ID exists in the database
    const checkIfOperatorExists = async (operatorId) => {
        try {
            const response = await fetch(`${config.API_BASE_URL}/exists/${operatorId}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            return data; // Should return true if exists, false otherwise
        } catch (error) {
            console.error("Error checking operator ID:", error);
            return false; // Default to false in case of an error
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.operatorId.trim()) {
            alert("Operator ID cannot be empty.");
            return;
        }

        try {
            const exists = await checkIfOperatorExists(formData.operatorId);

            if (exists) {
                alert("User data already exists. Either delete that first or enter details of another person.");
            } else {
                // Navigate only if operator ID is NOT found
                navigate("/stopwatch", { state: { ...formData } });
            }
        } catch (error) {
            console.error("Error during submission:", error);
            alert("Something went wrong. Please try again.");
        }
    };

    return (
        <Box component="form" sx={{ maxWidth: 600, mx: "auto", mt: 4, p: 2 }} onSubmit={handleSubmit}>
            <Stack spacing={2}>
                <TextField label="Name" name="name" value={formData.name} onChange={handleChange} required fullWidth />
                <TextField label="Operator ID" name="operatorId" value={formData.operatorId} onChange={handleChange} required fullWidth />
                <TextField label="Operation" name="operation" value={formData.operation} onChange={handleChange} required fullWidth />
                <TextField label="Section" name="section" value={formData.section} onChange={handleChange} required fullWidth />
                
                {/* Lap Count (Read-Only) */}
                <TextField label="Lap Count" value={formData.lapCount} disabled fullWidth />

                <Button type="submit" variant="contained" color="primary" fullWidth>
                    Submit
                </Button>
            </Stack>
        </Box>
    );
}
