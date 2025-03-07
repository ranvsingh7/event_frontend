"use client";

import {
  Button,
  Dialog,
  DialogActions,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import React, {  useEffect,  useState } from "react";
import { Event as EventType } from "../../types/types";
import { apiRequest } from "@/utils/api";
import Pass from "../components/Pass";
import PaymentButton from "../components/PaymentButton";
import toast from "react-hot-toast";
import PublicNav from "../components/PublicNav";
import Image from "next/image";
import Loading from "../components/ui/Loading";

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


  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      // setError(null);
      try {
        const data = await apiRequest<EventType[]>("/api/events", "GET");
        setEvents(data);
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

  const handleBookSave = async (value:string) => {
    const { selectValue, ...bookingData } = bookEventDetails;
    console.log(selectValue)
    setLoading(true);
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
      setLoading(false);
    }
  };
  return (
    <div className="w-screen h-screen">
      <img className="absolute inset-0 w-full h-full object-cover" alt="background"  src="https://res.cloudinary.com/dsluib7tj/image/upload/f_auto/q_auto/v1/event-pulse/hero-ticket_j0ccun?_a=DAJCwlWIZAA0" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/80 to-blue-900/70"></div>
      <div className="absolute inset-0">
      <PublicNav />

      <div className="pt-[100px] pl-[150px] overflow-auto h-[90vh]">
        <h1 className="bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent text-[56px] font-semibold">Ongoing Events</h1>
        <div>
          <Loading loading={loading}/>
          {events.length <= 0 && !loading && <div className="bg-[#060a13]  text-white p-4 w-[820px] mt-5 rounded-xl flex flex-col gap-6 items-center">
          <p className="text-[46px] font-[900] italic">No Upcoming Events, Stay Tuned.</p>
          <Image src="/logo/coming-soon.jpg" width={400} height={200} alt="logo"/>
        </div>}
          {events.map((event)=>(
            <div className="bg-[#060a13] text-white p-4 w-[600px] mt-5 rounded-xl" key={event._id}>
              <p className="text-[46px] font-[900] italic">{event.name}</p>
              <p className="max-w-[70%]">{event.description}</p>
              <div className="flex mt-6 justify-between ">
              <div className="italic font-bold">
              <p>{new Date(event.date).toLocaleString()}</p>
              <p>{event.location}</p>
              </div>
              <div className="text-right">
              <p className="font-bold text-[20px]">
                  Entry Types:
                </p>
                {event.entryTypes.map((entryType) => (
                  <p key={entryType.name} className="italic text-[14px]">
                    {entryType.name} - ₹{entryType.amount}
                  </p>
                ))}
              </div>
              </div>
              <div className="flex justify-center">
              <Button
                  variant="contained"
                  color="primary"
                  sx={{ mt: 2 }}
                  onClick={() => handleBookOpen(event)}
                >
                  BOOK NOW
                </Button>
              </div>
            </div>
          ))
          }
          <Dialog
        open={bookDialogOpen}
        maxWidth="sm"
        onClose={() => setBookDialogOpen(false)}
        style={{padding:"20px"}}
      >
        <div className="p-4 max-w-[400px]">
        <div className="mb-6">
        <p className="text-[30px] font-bold text-center">Book Pass</p>
          <p className="text-[18px] font-semibold text-center">{bookEvent?.name}</p>
          <p className="text-[14px] font-semibold text-center">
            Location: {bookEvent?.location}
          </p>
        </div>
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
        <p className="text-xs font-semibold mt-2">Select Entry</p>
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
          <Button color="secondary" onClick={()=>{
            setBookDialogOpen(false)
          }}>Cancel</Button>
          <PaymentButton amount={amount} paymentSuccess={(value:string)=>{handleBookSave(value)}} />
        </DialogActions>
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