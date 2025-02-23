"use client";

import {  useState } from "react";
import { TextField, Button, Typography, Grid, Card, CardContent } from "@mui/material";
import { apiRequest } from "@/utils/api";

const CreateEvent = () => {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        date: "",
        location: "",
        entryTypes: [{ name: "", amount: "", count: "" }],
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleEntryTypeChange = (index: number, field: string, value: string) => {
        const updatedEntryTypes = [...formData.entryTypes];
        updatedEntryTypes[index] = { ...updatedEntryTypes[index], [field]: value };
        setFormData((prev) => ({ ...prev, entryTypes: updatedEntryTypes }));
    };

    const addEntryType = () => {
        setFormData((prev) => ({
            ...prev,
            entryTypes: [...prev.entryTypes, { name: "", amount: "", count: "" }],
        }));
    };

    const removeEntryType = (index: number) => {
        const updatedEntryTypes = formData.entryTypes.filter((_, i) => i !== index);
        setFormData((prev) => ({ ...prev, entryTypes: updatedEntryTypes }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setLoading(true);

        console.log(formData);
    
        try {
            // Retrieve the token from localStorage (or another secure location)
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("You must be logged in to create an event.");
            }
    
            // Use the `apiRequest` function to send the request
            const response = await apiRequest<{ message: string }>(
                "/api/events/create-event",
                "POST",
                formData,
                token
            );
    
            setSuccess(response.message);
            setFormData({
                name: "",
                description: "",
                date: "",
                location: "",
                entryTypes: [{ name: "", amount: "", count: "" }],
            });
        } catch (err: any) {
            setError(err.message || "Failed to create event.");
        } finally {
            setLoading(false);
        }
    };
    
    

    return (
        <Grid container justifyContent="center" alignItems="center" style={{ minHeight: "100vh" }}>
            <Grid item xs={12} sm={8} md={6}>
                <Card>
                    <CardContent>
                        <Typography variant="h5" gutterBottom>
                            Create New Event
                        </Typography>
                        {error && <Typography color="error">{error}</Typography>}
                        {success && <Typography color="success.main">{success}</Typography>}

                        <form onSubmit={handleSubmit} noValidate>
                            <TextField
                                label="Event Name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                fullWidth
                                required
                                margin="normal"
                            />
                            <TextField
                                label="Description"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                fullWidth
                                multiline
                                rows={3}
                                margin="normal"
                            />
                            <TextField
                                label="Event Date"
                                name="date"
                                value={formData.date}
                                onChange={handleInputChange}
                                type="datetime-local"
                                fullWidth
                                required
                                margin="normal"
                                InputLabelProps={{ shrink: true }}
                            />
                            <TextField
                                label="Location"
                                name="location"
                                value={formData.location}
                                onChange={handleInputChange}
                                fullWidth
                                required
                                margin="normal"
                            />

                            <Typography variant="h6" gutterBottom>
                                Entry Types
                            </Typography>
                            {formData.entryTypes.map((entryType, index) => (
                                <Grid container spacing={2} key={index}>
                                    <Grid item xs={4}>
                                        <TextField
                                            label="Name"
                                            value={entryType.name}
                                            onChange={(e) =>
                                                handleEntryTypeChange(index, "name", e.target.value)
                                            }
                                            fullWidth
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={4}>
                                        <TextField
                                            label="Amount"
                                            type="number"
                                            value={entryType.amount}
                                            onChange={(e) =>
                                                handleEntryTypeChange(index, "amount", e.target.value)
                                            }
                                            fullWidth
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={3}>
                                        <TextField
                                            label="Count"
                                            type="number"
                                            value={entryType.count}
                                            onChange={(e) =>
                                                handleEntryTypeChange(index, "count", e.target.value)
                                            }
                                            fullWidth
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={1}>
                                        <Button
                                            color="error"
                                            onClick={() => removeEntryType(index)}
                                            disabled={formData.entryTypes.length === 1}
                                        >
                                            Remove
                                        </Button>
                                    </Grid>
                                </Grid>
                            ))}
                            <Button
                                onClick={addEntryType}
                                variant="outlined"
                                color="primary"
                                style={{ marginTop: "16px" }}
                            >
                                Add Entry Type
                            </Button>

                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                fullWidth
                                style={{ marginTop: "16px" }}
                                disabled={loading}
                            >
                                {loading ? "Creating..." : "Create Event"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
};

export default CreateEvent;
