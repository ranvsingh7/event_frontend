// EditEventDialog.tsx
"use client";

import React from "react";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Button,
    Typography,
    Grid,
    IconButton,
} from "@mui/material";
import { Add, Remove } from "@mui/icons-material";
import { Event as EventType } from "../../types/types";

interface EditEventDialogProps {
    editEvent: EventType | null;
    open: boolean;
    onClose: () => void;
    onSave: () => void;
    onInputChange: (field: keyof EventType, value: any) => void;
    onEntryTypeChange: (index: number, field: string, value: string) => void;
    addEntryType: () => void;
    removeEntryType: (index: number) => void;
}

const EditEventDialog: React.FC<EditEventDialogProps> = ({
    editEvent,
    open,
    onClose,
    onSave,
    onInputChange,
    onEntryTypeChange,
    addEntryType,
    removeEntryType,
}) => {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Edit Event</DialogTitle>
            <DialogContent>
                <TextField
                    margin="dense"
                    label="Name"
                    fullWidth
                    value={editEvent?.name || ""}
                    onChange={(e) => onInputChange("name", e.target.value)}
                />
                <TextField
                    margin="dense"
                    label="Description"
                    fullWidth
                    value={editEvent?.description || ""}
                    onChange={(e) => onInputChange("description", e.target.value)}
                    multiline
                    rows={6}
                />
                <TextField
                    margin="dense"
                    label="Date"
                    type="datetime-local"
                    fullWidth
                    value={
                        editEvent?.date
                            ? new Date(editEvent.date).toISOString().slice(0, 16)
                            : ""
                    }
                    onChange={(e) => onInputChange("date", e.target.value)}
                />
                <TextField
                    margin="dense"
                    label="Location"
                    fullWidth
                    value={editEvent?.location || ""}
                    onChange={(e) => onInputChange("location", e.target.value)}
                />

                <Typography variant="h6" sx={{ mt: 2 }}>
                    Entry Types
                </Typography>
                {editEvent?.entryTypes.map((entryType, index) => (
                    <Grid container spacing={2} alignItems="center" style={{marginTop: "4px"}} key={index}>
                        <Grid item xs={4}>
                            <TextField
                                label="Name"
                                fullWidth
                                size="small"
                                value={entryType.name}
                                onChange={(e) =>
                                    onEntryTypeChange(index, "name", e.target.value)
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
                                    onEntryTypeChange(index, "amount", e.target.value)
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
                                    onEntryTypeChange(index, "count", e.target.value)
                                }
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <IconButton
                                color="error"
                                size="small"
                                onClick={() => removeEntryType(index)}
                            >
                                <Remove />
                            </IconButton>
                        </Grid>
                    </Grid>
                ))}
                <Button
                    variant="outlined"
                    color="primary"
                    sx={{ mt: 2 }}
                    onClick={addEntryType}
                >
                    <Add /> Add Entry Type
                </Button>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary">
                    Cancel
                </Button>
                <Button onClick={onSave} color="primary">
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditEventDialog;
