"use client";

import { useEffect, useState } from "react";
import {
    Typography,
    Grid,
    Card,
    CardContent,
    CircularProgress,
    TextField,
    // Button,
} from "@mui/material";
import { Booking, CustomJwtPayload } from "@/types/types";
import { apiRequest } from "@/utils/api";
import { jwtDecode } from "jwt-decode";

const BookingPage = () => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState<string>("");

    useEffect(() => {
        const fetchBookings = async () => {
            const token = localStorage.getItem("token");
            let userId = null;

            try {
                const decoded = token ? jwtDecode<CustomJwtPayload>(token) : null;
                userId = decoded?.id;
            } catch (error) {
                console.error("Error decoding token:", error);
            }

            if (!userId || !token) {
                setError("User ID or token is missing.");
                setLoading(false);
                return;
            }

            try {
                // Pass token in headers
                const data = await apiRequest<Booking[]>(
                    `/api/bookings/${userId}`,
                    "GET",
                    undefined,
                    token
                );
                setBookings(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, []);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    };

    const filteredBookings = bookings.filter((booking) =>
        booking.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="container">
            <Typography variant="h4" gutterBottom>
                Bookings
            </Typography>

            <TextField
                label="Search by Name"
                fullWidth
                margin="dense"
                value={search}
                onChange={handleSearch}
            />

            {loading ? (
                <CircularProgress />
            ) : error ? (
                <Typography color="error">{error}</Typography>
            ) : filteredBookings.length === 0 ? (
                <Typography>No bookings found.</Typography>
            ) : (
                <Grid container spacing={3}>
                    {filteredBookings.map((booking) => (
                        <Grid item xs={12} sm={6} md={4} key={booking._id}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6">{booking.name}</Typography>
                                    <Typography variant="body2">Email: {booking.email}</Typography>
                                    <Typography variant="body2">Mobile: {booking.mobile}</Typography>
                                    {/* <Typography variant="body2">Event: {booking.eventName}</Typography> */}
                                    <Typography variant="body2">
                                        Entry Type: {booking.entryType}
                                    </Typography>
                                    <Typography variant="body2">
                                        Date: {new Date(booking.date).toLocaleString()}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </div>
    );
};

export default BookingPage;