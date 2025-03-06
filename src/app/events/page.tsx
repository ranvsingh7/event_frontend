"use client";

import {
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React, {  useEffect,  useState } from "react";
import { Event as EventType } from "../../types/types";
import { apiRequest } from "@/utils/api";
import Pass from "../components/Pass";
import PaymentButton from "../components/PaymentButton";
import toast from "react-hot-toast";

const Events = () => {
  const [events, setEvents] = useState<EventType[]>([]);
  const [bookEvent, setBookEvent] = useState<EventType | null>(null);
  const [bookDialogOpen, setBookDialogOpen] = useState<boolean>(false);
  const [digitalPassOpen, setDigitalPassOpen] = useState<boolean>(false);
  const [passDetails, setPassDetails] = useState<any>(null);
  const [amount, setAmount] = useState<number>(0)
  const [bookEventDetails, setBookEventDetails] = useState({
    eventId: "",
    name: "",
    eventName: "",
    eventDesc: "",
    eventDate: "",
    email: "",
    mobile: "",
    amount: 0,
    entryType: "",
    selectValue: "",
  });


  useEffect(() => {
    const fetchEvents = async () => {
      // setLoading(true);
      // setError(null);
      try {
        const data = await apiRequest<EventType[]>("/api/events", "GET");
        setEvents(data);
      } catch (err: any) {
        console.log(err);
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
    console.log(event);
    console.log(event.createdBy._id);
    setBookEventDetails({
      eventId: event._id,
      // eventUserId: event.createdBy._id,
      eventName: event.name,
      eventDesc: event.description,
      eventDate: event.date,
      name: "",
      email: "",
      mobile: "",
      entryType: "",
      amount:0,
      selectValue: "",
    });
  };

  const handleBookInputChange = (
    field: keyof typeof bookEventDetails,
    value: any
  ) => {
    // console.log(value, field);
    if (field === "selectValue") {
      const entryType = bookEvent?.entryTypes.find(
        (entryType) => entryType.name === value
      );
      console.log(entryType);
      // console.log(value)
      if (entryType?._id) {
        setAmount(entryType.amount)
        setBookEventDetails({
          ...bookEventDetails,
          entryType: entryType._id,
          selectValue: value,
          amount: entryType.amount
        });
      }
      return;
    }
    if (bookEventDetails) {
      setBookEventDetails({ ...bookEventDetails, [field]: value });
    }
  };

  const handleBookSave = async (value:string) => {
    const { selectValue, ...bookingData } = bookEventDetails;
    console.log(selectValue)
    try {
      const paymentDetails = await apiRequest(
        `/api/razorpay/payment-status/${value}`,
        "GET",
      )
      const data = {...bookingData, paymentDetails}
      // capture payment 
      const capturedData = {
        amount: bookEventDetails.amount,
        paymentId: value
      }
      const capturePayment = await apiRequest(
        `/api/razorpay/capture-payment`,
        "POST",
        capturedData
      )
      console.log(capturePayment)
      const response = await apiRequest(
        `/api/bookings/create-booking`,
        "POST",
        data,
      );
      toast.success("Pass Book Successfully")
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
                  <Typography key={entryType.name} variant="body2">
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
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Dialog
        open={bookDialogOpen}
        maxWidth="sm"
        onClose={() => setBookDialogOpen(false)}
      >
        <DialogTitle>Book Pass</DialogTitle>
        <DialogContent>
          <Typography variant="h6">{bookEvent?.name}</Typography>
          <Typography variant="body2">
            Location: {bookEvent?.location}
          </Typography>
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
          <Button color="secondary">Cancel</Button>
          {/* <Button color="primary" onClick={handleBookSave}>
            Book
          </Button> */}
          <PaymentButton amount={amount} paymentSuccess={(value:string)=>{handleBookSave(value)}} />
        </DialogActions>
      </Dialog>
          <Pass open={digitalPassOpen} passData={passDetails} dialogClose={()=>{
            setDigitalPassOpen(false);
            setPassDetails(null)
          }} />
      
    </div>
  );
};

export default Events;
