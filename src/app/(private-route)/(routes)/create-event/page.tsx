"use client";

import {  useState } from "react";
import { TextField, Button, Typography, Grid, Card, CardContent, IconButton } from "@mui/material";
import { apiRequest } from "@/utils/api";
import toast from "react-hot-toast";
import { Add, Remove } from "@mui/icons-material";
import Pass from "@/app/components/Pass";

const CreateEvent = () => {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        date: "",
        location: "",
        entryTypes: [{ name: "", amount: "", count: "" }],
    });

    const [loading, setLoading] = useState(false);
    const [demoPassOpen, setDemoPassOpen] = useState(false)

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
        if(formData.entryTypes.length === 1){
            return
        }
        const updatedEntryTypes = formData.entryTypes.filter((_, i) => i !== index);
        setFormData((prev) => ({ ...prev, entryTypes: updatedEntryTypes }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const today = new Date();
    const selectedDate = new Date(formData.date);

    // Reset time for comparison
    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);

    console.log("Selected Date:", selectedDate);
    console.log("Today's Date:", today);

    if (selectedDate < today) {
        toast.error("Event date cannot be in the past.");
        setLoading(false);
        return;
    }

    try {
        // Retrieve the token from localStorage (or another secure location)
        const token = document.cookie.replace(
            /(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/,
            "$1"
        );
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
        toast.success(response.message);
        setFormData({
            name: "",
            description: "",
            date: "",
            location: "",
            entryTypes: [{ name: "", amount: "", count: "" }],
        });
    } catch (err: any) {
        toast.error(err.message);
    } finally {
        setLoading(false);
    }
};
    

    return (
        <Grid container justifyContent="center" alignItems="center" style={{ marginTop:"30px", width: "100%" }}>
            <Grid item xs={12} sm={8} md={6}>
                <Card>
                    <CardContent>
                        <Typography variant="h5" gutterBottom>
                            Create New Event
                        </Typography>
                        <Button onClick={()=>setDemoPassOpen(true)}>Show Demo Pass</Button>
                        <Pass open={demoPassOpen} dialogClose={()=>{setDemoPassOpen(false)}} passData={{
                            eventName: formData.name,
                            eventDesc: formData.description
                        }} demoPass />

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
                                type="date"
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

                            <Typography variant="h6" sx={{ mt: 2 }}>
                                                Entry Types
                                            </Typography>
                                            {formData?.entryTypes.map((entryType, index) => (
                                                <Grid container spacing={2} alignItems="center" style={{marginTop: "4px"}} key={index}>
                                                    <Grid item xs={4}>
                                                        <TextField
                                                            label="Name"
                                                            fullWidth
                                                            size="small"
                                                            value={entryType.name}
                                                            onChange={(e) =>
                                                                handleEntryTypeChange(index, "name", e.target.value)
                                                            }
                                                        />
                                                    </Grid>
                                                    <Grid item xs={3}>
                                                        <TextField
                                                            label="Amount"
                                                            type="number"
                                                            size="small"
                                                            fullWidth
                                                            value={entryType.amount}
                                                            onChange={(e) =>
                                                                handleEntryTypeChange(index, "amount", e.target.value)
                                                            }
                                                        />
                                                    </Grid>
                                                    <Grid item xs={3}>
                                                        <TextField
                                                            label="Count"
                                                            type="number"
                                                            size="small"
                                                            fullWidth
                                                            value={entryType.count}
                                                            onChange={(e) =>
                                                                handleEntryTypeChange(index, "count", e.target.value)
                                                            }
                                                        />
                                                    </Grid>
                                                    <Grid item xs={2}>
                                                        <IconButton
                                                            color="error"
                                                            onClick={() => removeEntryType(index)}
                                                        >
                                                            <Remove />
                                                        </IconButton>
                                                    </Grid>
                                                </Grid>
                                            ))}
                            <Button
                                onClick={addEntryType}
                                variant="outlined"
                                color="success"
                                size="small"
                                style={{ marginTop: "16px" }}
                            >
                                <Add /> Add Entry Type
                            </Button>

                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                fullWidth
                                style={{ marginTop: "16px" }}
                                disabled={loading}
                            >
                                {loading ? "Creatingjkh.." : "Create Event"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
};

export default CreateEvent;
