"use client";

import {
  Button,
  Dialog,
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
import CustomInput from "../../components/CustomInput";
import CustomSelect from "../../components/CustomSelect";

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
    isLive: false,
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
      isLive: event.isLive,
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
        (entryType) => entryType._id === value || entryType.name === value
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

  const handleBookSave = async (paymentDetails: any) => {
    // check if isLive is false then return
  if (!bookEventDetails.isLive) {
      toast.error("This event is not live yet.");
      return;
    }
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
    toast.error(err.message || "Failed to book the pass.");
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#060a15]">
      <img
        className="absolute inset-0 h-full w-full object-cover"
        alt="background"
        src="https://res.cloudinary.com/dsluib7tj/image/upload/f_auto/q_auto/v1/event-pulse/hero-ticket_j0ccun?_a=DAJCwlWIZAA0"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-[#02040b]/95 via-[#060a15]/90 to-[#0f172a]/85"></div>
      <div className="relative z-10 min-h-screen">
      <PublicNav />

      <div className="mx-auto h-[90vh] w-full max-w-7xl overflow-auto px-4 pb-10 pt-6 sm:px-6 lg:px-8 lg:pt-10">
        <div className="mb-8 text-center">
          <p className="inline-flex rounded-full border border-cyan-300/30 bg-cyan-300/10 px-3 py-1 text-xs font-semibold tracking-[0.16em] text-cyan-100">
            LIVE EXPERIENCES
          </p>
          <h1 className="mt-3 bg-gradient-to-r from-white via-cyan-200 to-fuchsia-200 bg-clip-text text-4xl font-black tracking-tight text-transparent sm:text-6xl">
            Ongoing Events
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-300 sm:text-base">
            Discover handpicked live events, choose your preferred entry type, and book instantly.
          </p>
        </div>

        <div>
          <Loading loading={loading}/>
          {events.length <= 0 && !loading && <div className="mt-5 flex w-full flex-col items-center gap-6 rounded-2xl border border-white/15 bg-black/25 p-6 text-white backdrop-blur-sm">
          <p className="text-center text-2xl font-black sm:text-4xl">No Upcoming Events, Stay Tuned.</p>
          <Image src="/logo/coming-soon.jpg" width={400} height={200} alt="logo" className="rounded-xl"/>
        </div>}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {events.map((event, i)=>(
      <div
  className="group relative flex h-full w-full overflow-hidden rounded-2xl border border-white/15 bg-gradient-to-br from-[#0b1220] via-[#101a2f] to-[#1a1230] p-6 text-white shadow-[0_20px_60px_rgba(0,0,0,0.45)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_25px_80px_rgba(6,182,212,0.22)]"
  key={event._id}
>
  <div className="pointer-events-none absolute inset-0">
    <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-fuchsia-500/20 blur-3xl" />
    <div className="absolute -left-14 bottom-0 h-36 w-36 rounded-full bg-cyan-400/15 blur-3xl" />
  </div>

  <div className="relative z-10 flex w-full flex-col">
    <div className="flex h-full flex-col gap-5">
      <div>
        <p className="text-2xl font-extrabold tracking-tight sm:text-3xl">{event.name}</p>
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-slate-300">{event.description}</p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-xl bg-white/[0.05] px-3 py-2">
          <p className="text-xs uppercase tracking-[0.12em] text-slate-400">Event Date</p>
          <p className="mt-1 text-sm font-semibold text-cyan-100">{formatDate(event.date)}</p>
        </div>
        <div className="rounded-xl bg-white/[0.05] px-3 py-2">
          <p className="text-xs uppercase tracking-[0.12em] text-slate-400">Location</p>
          <p className="mt-1 text-sm font-semibold text-slate-100">{event.location}</p>
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-fuchsia-200">Entry Types</p>
        <div className="grid grid-cols-1 gap-2">
          {event.entryTypes.map((entryType) => (
            <div
              key={entryType.name}
              className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2"
            >
              <span className="text-sm font-medium text-slate-100">{entryType.name}</span>
              <span className="rounded-full bg-cyan-500/15 px-2 py-0.5 text-sm font-bold text-cyan-200">₹{entryType.amount}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-auto pt-1">
        <Button
          variant="contained"
          onClick={() => handleBookOpen(event)}
          className="!w-full !rounded-full !bg-gradient-to-r !from-cyan-500 !to-sky-600 !py-2.5 !text-sm !font-semibold !tracking-[0.08em] !text-white"
        >
          Book Now
        </Button>
      </div>
    </div>
  </div>
</div>




          ))
          }
          </div>
          <Dialog
  open={bookDialogOpen}
  maxWidth={false}
  fullWidth
  onClose={() => setBookDialogOpen(false)}
  PaperProps={{
    sx: {
      borderRadius: 3,
      background: "linear-gradient(145deg, #0b1220 0%, #15112a 100%)",
      color: "#fff",
      border: "1px solid rgba(255,255,255,0.12)",
      width: "min(560px, 92vw)",
      maxWidth: "560px",
    },
  }}
>
  <div className="w-full p-6 text-white sm:p-8">
    {/* Header Section */}
    <div className="mb-7 text-center">
      <h2 className="text-3xl font-extrabold tracking-tight">Book Your Pass</h2>
      <p className="mt-2 text-base font-semibold text-cyan-100">{bookEvent?.name}</p>
      <p className="text-sm text-slate-300">{bookEvent?.location}</p>
    </div>

    {/* Input Fields */}
    <div className="space-y-5">
      <CustomInput
        label="Name"
        value={bookEventDetails?.name || ""}
        onChange={(e) => handleBookInputChange("name", e.target.value)}
      />
      <CustomInput
        label="Email"
        type="email"
        value={bookEventDetails?.email || ""}
        onChange={(e) => handleBookInputChange("email", e.target.value)}
      />
      <CustomInput
        label="Mobile"
        type="tel"
        value={bookEventDetails?.mobile || ""}
        onChange={(e) => handleBookInputChange("mobile", e.target.value)}
      />
      <CustomSelect
        label="Select Entry"
        value={bookEventDetails?.selectValue || ""}
        onChange={(e) => handleBookInputChange("selectValue", e.target.value)}
        placeholder="Choose entry type"
        options={
          bookEvent?.entryTypes.map((entryType) => ({
            value: entryType._id || entryType.name,
            label: `${entryType.name} - ₹${entryType.amount}`,
          })) || []
        }
      />
    </div>

    {/* Actions */}
    <div className="mt-8 flex flex-wrap items-center justify-end gap-3">
      <Button
        onClick={() => setBookDialogOpen(false)}
        className="!rounded-full !bg-slate-600 !px-4 !py-2.5 !text-white hover:!bg-slate-500"
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