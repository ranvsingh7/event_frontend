"use client";

import { Button, Card, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, Grid, MenuItem, Select, TextField, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import {  Event as EventType } from "../../types/types";
import { apiRequest } from '@/utils/api';
import { QRCodeSVG } from 'qrcode.react';

const Events = () => {
    const [events, setEvents] = useState<EventType[]>([]);
    const [bookEvent, setBookEvent] = useState<EventType | null>(null);
    const [bookDialogOpen, setBookDialogOpen] = useState<boolean>(false);
    // const [loading, setLoading] = useState<boolean>(true);
    // const [error, setError] = useState<string | null>(null);
    const [digitalPassOpen, setDigitalPassOpen] = useState<boolean>(false);
    const [passDetails, setPassDetails] = useState<any>(null);
    const [bookEventDetails, setBookEventDetails] = useState({
        eventId: "",
        name: "",
        email: "",
        mobile: "",
        entryType: "",
        selectValue:"",
    });

    useEffect(() => {

        const fetchEvents = async () => {
            // setLoading(true);
            // setError(null);
                    try {
                        const data = await apiRequest<EventType[]>("/api/events", "GET");
                        setEvents(data);
                    } catch (err: any) {
                        console.log(err)
                        // setError(err.message);
                    } finally {
                        // setLoading(false);
                    }
                };
            fetchEvents();
        }, []);

    const handleBookOpen = (event: EventType) => {
        setBookEvent(event);
        setBookDialogOpen(true);
        console.log(event)
        console.log(event.createdBy._id);
        setBookEventDetails({
            eventId: event._id,
            // eventUserId: event.createdBy._id,
            name: "",
            email: "",
            mobile: "",
            entryType: "",
            selectValue:"",
        });
    };

    const handleBookInputChange = (field: keyof typeof bookEventDetails, value: any) => {
        // console.log(value, field);
      if(field === "selectValue"){
        const entryType = bookEvent?.entryTypes.find((entryType) => entryType.name === value);
        console.log(entryType);
        if (entryType?._id) {
            setBookEventDetails({
                ...bookEventDetails,
                entryType: entryType._id,
                selectValue: value,
            });
        }
        return;
      }
        if (bookEventDetails) {
            setBookEventDetails({ ...bookEventDetails, [field]: value });
        }
    };

    const handleBookSave = async () => {
        const { selectValue, ...bookingData } = bookEventDetails;
        console.log(selectValue);


        try {
            // setLoading(true);
            const response = await apiRequest(`/api/bookings/create-booking`, "POST", bookingData);
            setBookDialogOpen(false);
            setPassDetails(response);
            setDigitalPassOpen(true);
        } catch (err: any) {
            alert(err.message || "Failed to book the pass.");
        } finally {
            // setLoading(false);
        }
    };
  return (
    <div>
    <Grid container spacing={3}>
                    {events.map((event) => (
                        <Grid item xs={12} sm={6} md={4} key={event._id}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6">{event.name}</Typography>
                                    <Typography variant="body2">{event.description}</Typography>
                                    <Typography variant="body2">
                                        {new Date(event.date).toLocaleString()}
                                    </Typography>
                                    <Typography variant="body2">
                                        Location: {event.location}
                                    </Typography>

                                    <Typography variant="h6" color="primary">
                                        Entry Types:
                                    </Typography>
                                    {event.entryTypes.map((entryType) => (
                                        <Typography
                                            key={entryType.name}
                                            variant="body2"
                                        >
                                            {entryType.name} - ₹{entryType.amount}
                                        </Typography>
                                    ))}

                                    <Button
                                        variant="contained"
                                        color="primary"
                                        sx={{ mt: 2 }}
                                        onClick={() => handleBookOpen(event)}
                                    >
                                        Book Pass
                                    </Button>
                                    {/* <Button
                                        variant="outlined"
                                        color="secondary"
                                        sx={{ mt: 2, ml: 1 }}
                                        onClick={() => handleDelete(event._id)}
                                    >
                                        Delete
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        sx={{ mt: 2, ml: 1 }}
                                        onClick={() => handleEditOpen(event)}
                                    >
                                        Edit
                                    </Button> */}
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
                <Dialog open={bookDialogOpen} maxWidth="sm" onClose={() => setBookDialogOpen(false)}>
                <DialogTitle>Book Pass</DialogTitle>
                <DialogContent>
                    <Typography variant="h6">{bookEvent?.name}</Typography>
                    <Typography variant="body2">Location: {bookEvent?.location}</Typography>
                </DialogContent>
                {/* select entry type and count of pass  */}
                <TextField
                        margin="dense"
                        label="Name"
                        fullWidth
                        value={bookEventDetails?.name || ""}
                        onChange={(e) => handleBookInputChange("name", e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        label="Email"
                        fullWidth
                        value={bookEventDetails?.email || ""}
                        onChange={(e) => handleBookInputChange("email", e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        label="Mobile"
                        fullWidth
                        value={bookEventDetails?.mobile || ""}
                        onChange={(e) => handleBookInputChange("mobile", e.target.value)}
                    />
                <Select
    fullWidth
    value={bookEventDetails?.selectValue || ""}
    onChange={(e) => handleBookInputChange("selectValue", e.target.value)}
>
    {bookEvent?.entryTypes.map((entryType) => (
        <MenuItem key={entryType.name} value={entryType.name}>
            {entryType.name} - ₹{entryType.amount}
        </MenuItem>
    ))}
</Select>
                <DialogActions>
                    <Button  color="secondary">
                        Cancel
                    </Button>
                    <Button  color="primary" onClick={handleBookSave}>
                        Book
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={digitalPassOpen} onClose={() => setDigitalPassOpen(false)} fullWidth>
                <DialogContent>
                    {passDetails ? (
                        <Card>
                            <CardContent>
                                <Typography variant="h6">Digital Pass</Typography>
                                <Typography variant="body1">
                                    <strong>Name:</strong> {passDetails.name}
                                </Typography>
                                <Typography variant="body1">
                                    <strong>Email:</strong> {passDetails.email}
                                </Typography>
                                <Typography variant="body1">
                                    <strong>Mobile:</strong> {passDetails.mobile}
                                </Typography>
                                <Typography variant="body1">
                                    <strong>Event:</strong> {passDetails.eventId?.name}
                                </Typography>
                                <Typography variant="body1">
                                    <strong>Entry Type:</strong> {passDetails.entryTitle}
                                </Typography>
                                <Typography variant="body1">
                                    <strong>Date:</strong>{" "}
                                    {new Date(passDetails.date).toLocaleString()}
                                </Typography>
                                <Typography variant="body1">
                                    <strong>Amount:</strong> ₹ {passDetails.amount}
                                </Typography>

                                {/* QR Code */}
                                <div style={{ marginTop: "1rem", textAlign: "center" }}>
                                    <QRCodeSVG value={JSON.stringify(passDetails._id)} size={150} />
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <Typography>Loading pass details...</Typography>
                    )}
                </DialogContent>
            </Dialog>
            </div>
  )
}

export default Events