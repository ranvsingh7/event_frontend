"use client";

import {
  Button,
  Dialog,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import React, {  useEffect,  useState } from "react";
import { Event as EventType } from "../../../types/types";
import { apiRequest } from "@/utils/api";
import Pass from "../../components/Pass";
import PaymentButton from "../../components/PaymentButton";
import toast from "react-hot-toast";
import PublicNav from "../../components/PublicNav";
import Image from "next/image";
import Loading from "../../components/ui/Loading";

interface BookingResponse {
  name: string;
  email: string;
  eventName: string;
  eventDate: string;
  _id: string;
  passCount: number;
}

const Events = () => {
  const [events, setEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
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

  const formatDate = (dateString: string) => {
        const date = new Date(dateString);
    
        const options: Intl.DateTimeFormatOptions = {
          weekday: "short",
          day: "numeric",
          month: "long",
          year: "numeric",
        };
    
        return new Intl.DateTimeFormat("en-US", options).format(date);
      }


  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      // setError(null);
      try {
        const data = await apiRequest<EventType[]>("/api/events", "GET");
        // filter the data if isLive is true then only set the events
        const ongoingEvents = data.filter(event => event.isLive);
        setEvents(ongoingEvents);
      } catch (err: any) {
        console.log(err);
        // setError(err.message);
      } finally {
        setLoading(false);
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
console.log(bookEventDetails)
  const handleBookSave = async (paymentDetails: any) => {
  const { selectValue, ...bookingData } = bookEventDetails;
  console.log(selectValue);

  if (!paymentDetails) return;
  setLoading(true);

  try {
    // Combine booking and payment details
    const data = { ...bookingData, paymentDetails };

    // Create the booking
    const response = await apiRequest(`/api/bookings/create-booking`, "POST", data) as BookingResponse;

    console.log(response);

    // Notify the user of success
    toast.success("Pass Booked Successfully");

    // Update the UI state
    setBookDialogOpen(false);
    setPassDetails(response);
    setDigitalPassOpen(true);

    // Prepare email details
    const emailDetails = {
      userName: response.name,
      userEmail: response.email,
      eventName: response.eventName,
      eventDate: formatDate(response.eventDate),
      bookingId: response._id,
      passCount: response.passCount,
    };

    // Send an email using the backend API
    await apiRequest(`/api/email-service`, "POST", emailDetails);

    toast.success("Confirmation Email Sent Successfully");
  } catch (err: any) {
    alert(err.message || "Failed to book the pass.");
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="w-screen h-screen">
      <img className="absolute inset-0 w-full h-full object-cover" alt="background"  src="https://res.cloudinary.com/dsluib7tj/image/upload/f_auto/q_auto/v1/event-pulse/hero-ticket_j0ccun?_a=DAJCwlWIZAA0" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/80 to-blue-900/70"></div>
      <div className="absolute inset-0">
      <PublicNav />

      <div className="px-10 min-[850px]:pt-[50px] pb-10 overflow-auto h-[90vh]">
        <h1 className="text-pink-600 min-[850px]:pb-4 text-center text-[56px] font-semibold">Ongoing Events</h1>
        <div>
          <Loading loading={loading}/>
          {events.length <= 0 && !loading && <div className="bg-[#060a13]  text-white p-4 w-full min-[1024px]:w-[820px] mt-5 rounded-xl flex flex-col gap-6 items-center">
          <p className="text-[46px] font-[900] italic">No Upcoming Events, Stay Tuned.</p>
          <Image src="/logo/coming-soon.jpg" width={400} height={200} alt="logo"/>
        </div>}
        <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center items-start">
          {events.map((event, i)=>(
      <div
  className={`${
    i % 2 === 0 ? "bg-gradient-to-r from-blue-500 to-blue-600" : "bg-gradient-to-r from-gray-500 to-gray-600"
  } text-white p-6 rounded-lg shadow-lg w-full`}
  key={event._id}
>
  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
    <div className="w-full md:w-2/3">
      <p className="text-[24px] md:text-[32px] font-bold">{event.name}</p>
      <p className="text-sm md:text-base mt-2">{event.description}</p>
    </div>
    <div className="w-full md:w-1/3 text-right">
      <p className="text-sm md:text-base font-semibold">Event Date:</p>
      <p className="text-sm">{new Date(event.date).toLocaleString()}</p>
      <p className="text-sm md:text-base font-semibold mt-2">Location:</p>
      <p className="text-sm">{event.location}</p>
    </div>
  </div>

  <div className="mt-4">
  <p className="font-semibold text-lg mb-2">Entry Types:</p>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {event.entryTypes.map((entryType) => (
      <div
        key={entryType.name}
        className="flex justify-between items-center bg-white text-gray-800 px-4 py-3 rounded-lg shadow"
      >
        <span className="font-medium">{entryType.name}</span>
        <span className="font-bold text-blue-600">₹{entryType.amount}</span>
      </div>
    ))}
  </div>
</div>


  <div className="flex justify-center mt-6">
    <Button
      variant="contained"
      sx={{
        backgroundColor: "#FFD700", // Gold color for button
        "&:hover": { backgroundColor: "#FFC107" }, // Slightly darker gold
        color: "black",
        fontSize: "1rem",
        fontWeight: "bold",
        textTransform: "capitalize",
        padding: "0.5rem 2rem",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      }}
      onClick={() => handleBookOpen(event)}
    >
      Book Now
    </Button>
  </div>
</div>




          ))
          }
          </div>
          <Dialog
  open={bookDialogOpen}
  maxWidth="sm"
  onClose={() => setBookDialogOpen(false)}
>
  <div className="p-6 rounded-lg bg-white shadow-xl max-w-md mx-auto">
    {/* Header Section */}
    <div className="text-center mb-6">
      <h2 className="text-2xl font-bold text-gray-800">Book Your Pass</h2>
      <p className="text-gray-500 mt-2">{bookEvent?.name}</p>
      <p className="text-sm text-gray-400">{bookEvent?.location}</p>
    </div>

    {/* Input Fields */}
    <div className="space-y-4">
      <TextField
        label="Name"
        fullWidth
        variant="outlined"
        value={bookEventDetails?.name || ""}
        onChange={(e) => handleBookInputChange("name", e.target.value)}
      />
      <TextField
        label="Email"
        fullWidth
        variant="outlined"
        value={bookEventDetails?.email || ""}
        onChange={(e) => handleBookInputChange("email", e.target.value)}
      />
      <TextField
        label="Mobile"
        fullWidth
        variant="outlined"
        value={bookEventDetails?.mobile || ""}
        onChange={(e) => handleBookInputChange("mobile", e.target.value)}
      />
      <div>
        <p className="text-sm font-semibold text-gray-600 mb-2">Select Entry</p>
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
      </div>
    </div>

    {/* Actions */}
    <div className="flex justify-end items-center mt-6 space-x-4">
      <Button
        variant="outlined"
        color="error"
        onClick={() => setBookDialogOpen(false)}
        className="py-2 px-4"
      >
        Cancel
      </Button>
      <PaymentButton
        amount={amount}
        paymentSuccess={(value: object) => handleBookSave(value)}
        customerData={{
          customer_name: bookEventDetails.name,
          customer_email: bookEventDetails.email,
          customer_phone: bookEventDetails.mobile,
          customer_id: bookEventDetails.mobile,
        }}
        // className="py-2 px-6 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600"
      />
    </div>
  </div>
</Dialog>

          <Pass open={digitalPassOpen} passData={passDetails} dialogClose={()=>{
            setDigitalPassOpen(false);
            setPassDetails(null)
          }} />
        </div>
      </div>
    </div>
      </div>
  );
};

export default Events;

{/* <div>
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
          <PaymentButton amount={amount} paymentSuccess={(value:string)=>{handleBookSave(value)}} />
        </DialogActions>
      </Dialog>
          <Pass open={digitalPassOpen} passData={passDetails} dialogClose={()=>{
            setDigitalPassOpen(false);
            setPassDetails(null)
          }} />
          <div/>
</div> */}