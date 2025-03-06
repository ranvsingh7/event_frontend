"use client";

import { useEffect, useState } from "react";
import {
    Typography,
    Grid,
    Card,
    CardContent,
    CircularProgress,
    TextField,
    Button,
    // Button,
} from "@mui/material";
import { Booking, CustomJwtPayload } from "@/types/types";
import { apiRequest } from "@/utils/api";
import { jwtDecode } from "jwt-decode";
import { motion } from 'framer-motion';
import { useTheme } from '@mui/material/styles';
import Pass from "@/app/components/Pass";

const BookingPage = () => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState<string>("");
    const [digitalPassOpen, setDigitalPassOpen] = useState<boolean>(false)
    const [passDetails, setPassDetails] = useState<any>(null);

    const theme = useTheme()

    useEffect(() => {
        const fetchBookings = async () => {
            const token = document.cookie.replace(
                /(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/,
                "$1"
            );
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
                console.log(data)
                setBookings(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, []);

    const handleGetPass = async (id:string)=>{
        const token = document.cookie.replace(
            /(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/,
            "$1"
        );
        const passData = await apiRequest<Booking[]>(
            `/api/bookings/pass/${id}`,
            "GET",
            undefined,
            token
        )
        setDigitalPassOpen(true);
        setPassDetails(passData)
    }

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    };

    const filteredBookings = bookings.filter((booking) =>
        booking.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="p-6 mt-4">
            <Typography variant="h4" gutterBottom>
                My Bookings
            </Typography>

            <TextField
                label="Search by Name"
                style={{width:"400px", marginBottom: "24px"}}
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
                <Grid item xs={12} sm={6} md={4} lg={3} key={booking._id}>
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Card
                            sx={{
                                background: `linear-gradient(135deg, ${theme.palette.primary.light}, ${theme.palette.secondary.main})`,
                                color: theme.palette.common.white,
                                boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
                                borderRadius: '15px',
                                overflow: 'hidden',
                                position: 'relative',
                            }}
                        >
                            {/* Vector Design */}
                            {/* <div
                                style={{
                                    position: 'absolute',
                                    top: '20px',
                                    right: '20px',
                                    opacity: 0.3,
                                    zIndex: 0,
                                }}
                            >
                                <div className="border w-10 h-10 bg-red-400 rounded-full"></div>
                            </div> */}

                            <CardContent sx={{ position: 'relative', zIndex: 1 }}>
                                <Typography variant="h6" gutterBottom>
                                    {booking.name}
                                </Typography>
                                <Typography variant="body2" gutterBottom>
                                    Email: {booking.email}
                                </Typography>
                                <Typography variant="body2" gutterBottom>
                                    Mobile: {booking.mobile}
                                </Typography>
                                <Typography variant="body2" gutterBottom>
                                    Entry Type: {booking.entryTitle}
                                </Typography>
                                <Typography variant="body2" gutterBottom>
                                    Created at: {new Date(booking.createdAt).toLocaleString()}
                                </Typography>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    onClick={() => {
                                        handleGetPass(booking._id);
                                    }}
                                    sx={{ mt: 2 }}
                                >
                                    Show Pass
                                </Button>
                            </CardContent>
                        </Card>
                    </motion.div>
                </Grid>
            ))}
        </Grid>
            )}
            <Pass open={digitalPassOpen} passData={passDetails} dialogClose={()=>{
            setDigitalPassOpen(false);
            setPassDetails(null)
          }} />
        </div>
    );
};

export default BookingPage;