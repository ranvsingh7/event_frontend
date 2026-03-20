"use client";

import { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { CustomJwtPayload, Event as EventType } from "../../types/types";
import { apiRequest } from "@/utils/api";
import { Add, Remove } from "@mui/icons-material";
import { jwtDecode } from "jwt-decode";
import Pass from "./Pass";
import Loading from "./ui/Loading";
import Link from "next/link";
import toast from "react-hot-toast";
import CustomInput from "./CustomInput";
import CustomSelect from "./CustomSelect";

interface BookingResponse {
  name: string;
  email: string;
  eventName: string;
  eventDate: string;
  _id: string;
  passCount: number;
}


const Dashboard = () => {
  const [events, setEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState<boolean>(false);
  const [editEvent, setEditEvent] = useState<EventType | null>(null);
  const [bookDialogOpen, setBookDialogOpen] = useState<boolean>(false);
  const [bookEvent, setBookEvent] = useState<EventType | null>(null);
  const [digitalPassOpen, setDigitalPassOpen] = useState<boolean>(false);
  const [passDetails, setPassDetails] = useState<any>(null);
  const [demoPassOpen, setDemoPassOpen] = useState<boolean>(false)
  const [bookEventDetails, setBookEventDetails] = useState({
    eventId: "",
    name: "",
    email: "",
    mobile: "",
    entryType: "",
    selectValue: "",
  });
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState<boolean>(false);
  const [eventToDelete, setEventToDelete] = useState<string | null>(null);

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
    const fetchEvents = async () => {
      try {
        const data = await apiRequest<EventType[]>("/api/events", "GET");
        const filterData = data.filter(
          (event) => event.createdBy._id === userId
        );
        setEvents(filterData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleDeleteClick = (id: string) => {
    setEventToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!eventToDelete) return;

    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/,
      "$1"
    );
    if (!token) {
      toast.error("Authentication token not found. Please log in again.");
      setDeleteConfirmOpen(false);
      setEventToDelete(null);
      return;
    }

    try {
      await apiRequest(`/api/events/${eventToDelete}`, "DELETE", undefined, token);
      setEvents((prevEvents) => prevEvents.filter((event) => event._id !== eventToDelete));
      toast.success("Event deleted successfully.");
      setDeleteConfirmOpen(false);
      setEventToDelete(null);
    } catch (err: any) {
      toast.error(err.message || "Failed to delete the event.");
      setDeleteConfirmOpen(false);
      setEventToDelete(null);
    }
  };

  const handleEditOpen = (event: EventType) => {
    setEditEvent(event);
    setEditDialogOpen(true);
  };

  const handleEditClose = () => {
    setEditDialogOpen(false);
    setEditEvent(null);
  };

  const handleEditSave = async () => {
    if (!editEvent) return;

    const today = new Date();
    const selectedDate = new Date(editEvent.date);

    // Reset time for comparison
    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      toast.error("Event date cannot be in the past.");
      return;
    }

    const token = document.cookie.replace(
        /(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/,
        "$1"
    );
    if (!token) {
      toast.error("Authentication token not found. Please log in again.");
      return;
    }

    try {
        const updatedEvent = await apiRequest<EventType>(
            `/api/events/edit-event/${editEvent._id}`,
            "PUT",
            editEvent,
            token
        );
        setEvents((prevEvents) =>
            prevEvents.map((event) =>
                event._id === updatedEvent._id ? updatedEvent : event
            )
        );
        toast.success("Event updated successfully.");
        handleEditClose();
    } catch (err: any) {
        toast.error(err.message || "Failed to update the event.");
    }
};


  const handleInputChange = (field: keyof EventType, value: any) => {
    if (editEvent) {
      setEditEvent({ ...editEvent, [field]: value });
    }
  };

  const handleEntryTypeChange = (
    index: number,
    field: string,
    value: string
  ) => {
    if (editEvent) {
      const updatedEntryTypes = [...editEvent.entryTypes];
      updatedEntryTypes[index] = {
        ...updatedEntryTypes[index],
        [field]: value,
      };
      setEditEvent({ ...editEvent, entryTypes: updatedEntryTypes });
    }
  };

  const addEntryType = () => {
    if (editEvent) {
      setEditEvent({
        ...editEvent,
        entryTypes: [
          ...editEvent.entryTypes,
          { name: "", amount: 0, count: 0 },
        ],
      });
    }
  };

  const removeEntryType = (index: number) => {
    if(editEvent?.entryTypes.length === 1){
      return
    }
    if (editEvent) {
      const updatedEntryTypes = editEvent.entryTypes.filter(
        (_, i) => i !== index
      );
      setEditEvent({ ...editEvent, entryTypes: updatedEntryTypes });
    }
  };

  // #################BOOKING######################

  const handleBookOpen = (event: EventType) => {
    setBookEvent(event);
    setBookDialogOpen(true);
    console.log(event);
    console.log(event.createdBy._id);
    setBookEventDetails({
      eventId: event._id,
      // eventUserId: event.createdBy._id,
      name: "",
      email: "",
      mobile: "",
      entryType: "",
      selectValue: "",
    });
  };
  console.log(error)

  const handleBookInputChange = (
    field: keyof typeof bookEventDetails,
    value: any
  ) => {
    // console.log(value, field);
    if (field === "selectValue") {
      const selectedEntry = bookEvent?.entryTypes.find(
        (entryType) => entryType._id === value || entryType.name === value
      );

      setBookEventDetails((prev) => ({
        ...prev,
        entryType: selectedEntry?._id || value,
        selectValue: value,
      }));
      return;
    }
    if (bookEventDetails) {
      setBookEventDetails({ ...bookEventDetails, [field]: value });
    }
  };

  const handleBookSave = async () => {
  const { selectValue, ...bookingData } = bookEventDetails;
  console.log(selectValue);

  const token = document.cookie.replace(
    /(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/,
    "$1"
  );

  const paymentDetails = {
    success: true,
    paymentMode: "cash",
  };

  const data = {
    ...bookingData,
    paymentDetails,
  };

  console.log(data);

  try {
    setLoading(true);

    // Step 1: Create the booking
     const response = (await apiRequest(
      `/api/bookings/auth/create-booking`,
      "POST",
      data,
      token
    )) as BookingResponse;

    setPassDetails(response);

    // Step 2: Prepare email details
    console.log(passDetails)
    const emailDetails = {
      userName: response.name,
      userEmail: response.email,
      eventName: response.eventName,
      eventDate: formatDate(response.eventDate),
      bookingId: response._id,
      passCount: response.passCount,
    };

    // Step 3: Send confirmation email
    await apiRequest(`/api/email-service`, "POST", emailDetails, token);
    toast.success("Pass Booked and Confirmation Email Sent Successfully!");
    setDigitalPassOpen(true);
    setBookDialogOpen(false);
  } catch (err: any) {
    toast.error(err.message || "Failed to book the pass.");
  } finally {
    setLoading(false);
  }
};


  const handleLive = (e: EventType) => {
    // Prevent events with past dates from going live
    const today = new Date();
    const eventDate = new Date(e.date);

    // Reset time for comparison
    today.setHours(0, 0, 0, 0);
    eventDate.setHours(0, 0, 0, 0);

    if (eventDate < today) {
      toast.error("The event date is in the past. It cannot go live.");
      return;
    }

    // Update isLive status of event
    const token = document.cookie.replace(
        /(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/,
        "$1"
    );
    if (!token) {
      toast.error("Authentication token not found. Please log in again.");
      return;
    }

    const updatedEvent = {
        ...e,
        isLive: !e.isLive,
    };

    apiRequest<EventType>(`/api/events/live-event/${e._id}`, "PUT", updatedEvent, token)
        .then((data) => {
            setEvents((prevEvents) =>
                prevEvents.map((event) =>
                    event._id === data._id ? data : event
                )
            );
            if (data.isLive) {
                toast.success("Event is now LIVE.");
            } else {
                toast.error("Event has been stopped.");
            }
        })
        .catch((err: any) => {
          toast.error(err.message || "Failed to update the event status.");
        });
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-[#060a15] via-[#0b1220] to-[#1a1230] p-4 pb-6 sm:p-6">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="inline-flex rounded-full border border-cyan-300/30 bg-cyan-300/10 px-3 py-1 text-xs font-medium tracking-[0.18em] text-cyan-100">
            EVENT MANAGEMENT DASHBOARD
          </p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-5xl">My Events</h1>
        </div>
      </div>
        <div className="flex flex-col gap-4 overflow-visible pb-3 md:max-h-[calc(100vh-200px)] md:overflow-y-auto md:pb-0 md:pr-1">
          <Loading loading={loading}/>
          {events.length <= 0 && !loading && <div className="mt-5 flex w-full flex-col items-center gap-6 rounded-2xl border border-white/15 bg-black/25 p-6 text-white backdrop-blur-sm md:col-span-2 lg:col-span-3">
          <p className="text-center text-2xl font-black italic sm:text-4xl">No Events Found, <span className="bg-gradient-to-r from-cyan-300 to-fuchsia-300 bg-clip-text text-transparent"><Link href="/create-event">Create Now!</Link></span></p>
          {/* <Image src="/logo/404.jpg" width={400} height={200} alt="logo"/> */}
        </div>}
          {events.map((event)=>(
    //         <div className="bg-[#060a13] text-white p-4 w-[600px] mt-5 rounded-xl relative" key={event._id}>
    //                     {
    //           event.isLive && (
    //             <div className="flex items-center space-x-2 absolute top-4 right-4">
    //   <div className="relative flex items-center justify-center">
    //     <div className="absolute inline-flex h-3 w-3 rounded-full bg-red-500 animate-ping"></div>
    //     <div className="relative inline-flex h-3 w-3 rounded-full bg-red-500"></div>
    //   </div>
    //   <span className="text-sm font-medium">Live</span>
    // </div>
    //           )
    //                     }
    //           <p className="text-[46px] font-[900] italic">{event.name}</p>
    //           <p className="max-w-[70%]">{event.description}</p>
    //           <div className="flex mt-6 justify-between ">
    //           <div className="italic font-bold">
    //           <p>{new Date(event.date).toLocaleString()}</p>
    //           <p>{event.location}</p>
    //           </div>
    //           <div className="text-right">
    //           <p className="font-bold text-[20px]">
    //               Entry Types:
    //             </p>
    //             {event.entryTypes.map((entryType) => (
    //               <p key={entryType.name} className="italic text-[14px]">
    //                 {entryType.name} - ₹{entryType.amount}
    //               </p>
    //             ))}
    //           </div>
    //           </div>
    //           <div className="flex gap-2 justify-center">
    //           <Button
    //               variant="contained"
    //               color={event.isLive ? "error" : "success"}
    //               sx={{ mt: 2 }}
    //               onClick={() => handleLive(event)}
    //             >
    //               {event.isLive ? "Stop Live" : "Go Live"}
    //             </Button>
    //           <Button
    //               variant="contained"
    //               color="primary"
    //               sx={{ mt: 2 }}
    //               onClick={() => handleBookOpen(event)}
    //             >
    //               BOOK NOW
    //             </Button>
    //             <Button
    //               variant="contained"
    //               color="secondary"
    //               sx={{ mt: 2 }}
    //               onClick={() => handleEditOpen(event)}
    //             >
    //               Update Event
    //             </Button>
    //             <Button
    //               variant="outlined"
    //               color="error"
    //               sx={{ mt: 2 }}
    //               onClick={() => handleDelete(event._id)}
    //             >
    //               Delete Event
    //             </Button>
    //           </div>
    //         </div>
    <div
      className="relative flex w-full items-center overflow-hidden rounded-2xl border border-white/15 bg-gradient-to-br from-[#0b1220] via-[#101a2f] to-[#1a1230] px-4 py-4 text-white shadow-[0_20px_60px_rgba(0,0,0,0.45)] sm:px-6 sm:py-5"
      key={event._id}
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-fuchsia-500/20 blur-3xl" />
        <div className="absolute -left-14 bottom-0 h-36 w-36 rounded-full bg-cyan-400/15 blur-3xl" />
      </div>
      
      <div className="relative z-10 flex w-full flex-col gap-4 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
        <div className="w-full min-w-0">
          {/* Event Name & Live Badge */}
          <div className="flex w-full items-start justify-between gap-3 lg:items-center">
            <p className="break-words text-lg font-extrabold text-white sm:text-xl">{event.name}</p>
            {event.isLive && (
              <div className="inline-flex shrink-0 self-start items-center space-x-1 rounded-full border border-red-400/30 bg-red-500/10 px-2 py-0.5 lg:self-center">
                <div className="relative flex items-center justify-center">
                  <div className="absolute inline-flex h-2 w-2 rounded-full bg-red-500 animate-ping"></div>
                  <div className="relative inline-flex h-2 w-2 rounded-full bg-red-500"></div>
                </div>
                <span className="text-xs font-medium">Live</span>
              </div>
            )}
          </div>

          {/* Description */}
          <p className="mt-2 break-words text-sm text-slate-300 lg:max-w-[420px]">{event.description}</p>

          {/* Meta */}
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:flex lg:flex-wrap lg:items-start lg:gap-6">
            <div>
              <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Date</p>
              <p className="mt-0.5 text-sm font-semibold text-slate-100">{new Date(event.date).toLocaleDateString()}</p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Venue</p>
              <p className="mt-0.5 break-words text-sm font-semibold text-cyan-200">{event.location}</p>
            </div>

            <div className="sm:col-span-2 lg:col-span-1">
              <p className="text-xs uppercase tracking-[0.14em] text-fuchsia-200">Entry Types</p>
              <div className="mt-0.5 text-xs font-medium text-slate-200">
                {event.entryTypes.map((et, i) => (
                  <p key={et.name} className={i > 0 ? "mt-0.5" : ""}>
                    {et.name} - ₹{et.amount}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:justify-end lg:w-auto lg:grid-cols-none lg:flex-nowrap">
          <Button
            variant="contained"
            color={event.isLive ? "error" : "success"}
            className={`!rounded-full !px-3 !py-1.5 !text-xs !font-semibold ${
              event.isLive
                ? "!bg-gradient-to-r !from-red-500 !to-rose-600"
                : "!bg-gradient-to-r !from-emerald-500 !to-green-600"
            }`}
            onClick={() => handleLive(event)}
          >
            {event.isLive ? "Stop" : "Live"}
          </Button>
          <Button
            variant="contained"
            color="primary"
            className="!rounded-full !bg-gradient-to-r !from-cyan-500 !to-sky-600 !px-3 !py-1.5 !text-xs !font-semibold"
            onClick={() => handleBookOpen(event)}
          >
            Book
          </Button>
          <Button
            variant="contained"
            color="secondary"
            className="!rounded-full !bg-gradient-to-r !from-amber-500 !to-orange-600 !px-3 !py-1.5 !text-xs !font-semibold"
            onClick={() => handleEditOpen(event)}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            color="error"
            className="!rounded-full !border-red-400/70 !px-3 !py-1.5 !text-xs !font-semibold !text-red-300"
            onClick={() => handleDeleteClick(event._id)}
          >
            Delete
          </Button>
        </div>
      </div>
    </div>

          ))
          }
          </div>

      <Dialog
        open={editDialogOpen}
        onClose={handleEditClose}
        maxWidth={false}
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            background: "linear-gradient(145deg, #0b1220 0%, #15112a 100%)",
            color: "#fff",
            border: "1px solid rgba(255,255,255,0.12)",
            width: "min(760px, 94vw)",
            maxWidth: "760px",
          },
        }}
      >
        <div className="w-full p-6 text-white sm:p-8">
          <div className="mb-6 sm:mb-8">
            <p className="text-center text-[28px] font-extrabold tracking-tight">Edit Event</p>
            <p className="text-center text-sm font-semibold text-cyan-100 sm:text-base">{editEvent?.name}</p>
          </div>

          <Button
            className="!mb-5 !w-fit !rounded-full !bg-gradient-to-r !from-cyan-500 !to-sky-600 !px-4 !text-white"
            onClick={() => setDemoPassOpen(true)}
          >
            Show Demo Pass
          </Button>

          <Pass
            open={demoPassOpen}
            dialogClose={() => {
              setDemoPassOpen(false);
            }}
            passData={{
              eventName: editEvent?.name,
              eventDesc: editEvent?.description,
            }}
            demoPass
          />

          <div className="space-y-5">
            <CustomInput
              label="Name"
              value={editEvent?.name || ""}
              onChange={(e) => handleInputChange("name", e.target.value)}
            />

            <div>
              <p className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-300">Description</p>
              <textarea
                value={editEvent?.description || ""}
                onChange={(e) => handleInputChange("description", e.target.value)}
                rows={5}
                className="w-full rounded-2xl border border-cyan-500/40 bg-slate-900/60 px-4 py-3 text-sm font-medium text-slate-100 transition-all duration-300 placeholder-slate-400 focus:border-cyan-500 focus:bg-slate-900/80 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
              />
            </div>

            <CustomInput
              label="Date"
              type="date"
              value={editEvent?.date ? new Date(editEvent.date).toISOString().slice(0, 10) : ""}
              onChange={(e) => handleInputChange("date", e.target.value)}
            />

            <CustomInput
              label="Location"
              value={editEvent?.location || ""}
              onChange={(e) => handleInputChange("location", e.target.value)}
            />

            <div className="pt-1">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-fuchsia-200">Entry Types</p>

              <div className="space-y-3">
                {editEvent?.entryTypes.map((entryType, index) => (
                  <div
                    key={index}
                    className="rounded-2xl border border-white/10 bg-slate-900/30 p-3 sm:p-4"
                  >
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-12 sm:items-end">
                      <div className="sm:col-span-5">
                        <p className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-300">Name</p>
                        <input
                          value={entryType.name}
                          onChange={(e) => handleEntryTypeChange(index, "name", e.target.value)}
                          className="w-full rounded-full border border-cyan-500/40 bg-slate-900/60 px-4 py-2.5 text-sm font-medium text-slate-100 transition-all duration-300 focus:border-cyan-500 focus:bg-slate-900/80 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                        />
                      </div>

                      <div className="sm:col-span-3">
                        <p className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-300">Amount</p>
                        <input
                          type="number"
                          value={entryType.amount}
                          onChange={(e) => handleEntryTypeChange(index, "amount", e.target.value)}
                          className="w-full rounded-full border border-cyan-500/40 bg-slate-900/60 px-4 py-2.5 text-sm font-medium text-slate-100 transition-all duration-300 focus:border-cyan-500 focus:bg-slate-900/80 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                        />
                      </div>

                      <div className="sm:col-span-3">
                        <p className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-300">Count</p>
                        <input
                          type="number"
                          value={entryType.count}
                          onChange={(e) => handleEntryTypeChange(index, "count", e.target.value)}
                          className="w-full rounded-full border border-cyan-500/40 bg-slate-900/60 px-4 py-2.5 text-sm font-medium text-slate-100 transition-all duration-300 focus:border-cyan-500 focus:bg-slate-900/80 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                        />
                      </div>

                      <div className="sm:col-span-1">
                        <Button
                          onClick={() => removeEntryType(index)}
                          className="!min-w-0 !rounded-full !border !border-red-400/60 !px-3 !py-2 !text-red-300"
                        >
                          <Remove />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Button
                onClick={addEntryType}
                className="!mt-3 !rounded-full !border !border-emerald-400/60 !bg-emerald-500/10 !px-4 !py-2 !text-emerald-200"
              >
                <Add /> Add Entry Type
              </Button>
            </div>
          </div>

          <div className="mt-8 flex gap-3">
            <Button
              onClick={handleEditClose}
              className="!flex-1 !rounded-full !bg-slate-600 !px-4 !py-2.5 !text-white hover:!bg-slate-500"
            >
              Cancel
            </Button>
            <Button
              onClick={handleEditSave}
              className="!flex-1 !rounded-full !bg-gradient-to-r !from-emerald-500 !to-green-600 !px-5 !py-2.5 !text-white"
            >
              Save
            </Button>
          </div>
        </div>
      </Dialog>

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
            width: "min(540px, 92vw)",
            maxWidth: "540px",
          },
        }}
      >
        <div className="w-full p-10 text-white">
        <div className="mb-8">
        <p className="text-center text-[30px] font-extrabold tracking-tight">Book Pass</p>
          <p className="text-center text-[18px] font-semibold text-cyan-100">{bookEvent?.name}</p>
          <p className="text-center text-[14px] font-semibold text-slate-300">
            Location: {bookEvent?.location}
          </p>
        </div>
        {/* select entry type and count of pass  */}
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
            name="mobile"
            type="tel"
            autoComplete="tel"
            inputMode="numeric"
            pattern="[0-9]*"
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
        <div className="mt-8 flex gap-3">
          <Button
            onClick={()=>setBookDialogOpen(false)}
            className="!rounded-full !flex-1 !bg-slate-600 !px-4 !py-2.5 !text-white hover:!bg-slate-500"
          >
            Cancel
          </Button>
          <Button
            onClick={handleBookSave}
            loading={loading}
            className="!rounded-full !flex-1 !bg-gradient-to-r !from-cyan-500 !to-sky-600 !px-4 !py-2.5 !text-white !font-semibold"
          >
            Book
          </Button>
        </div>
        </div>
      </Dialog>

      {/* Digital Pass Dialog */}
      <Pass open={digitalPassOpen} passData={passDetails} dialogClose={()=>{
            setDigitalPassOpen(false);
            setPassDetails(null)
          }} />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => {
          setDeleteConfirmOpen(false);
          setEventToDelete(null);
        }}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            background: "linear-gradient(145deg, #0b1220 0%, #15112a 100%)",
            color: "#fff",
            border: "1px solid rgba(255,255,255,0.12)",
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 800, letterSpacing: "0.04em" }}>Delete Event</DialogTitle>
        <DialogContent>
          <p className="text-slate-300">Are you sure you want to delete this event? This action cannot be undone.</p>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setDeleteConfirmOpen(false);
              setEventToDelete(null);
            }}
            className="!rounded-full !bg-slate-600 !px-4 !text-white hover:!bg-slate-500"
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            className="!rounded-full !bg-gradient-to-r !from-red-500 !to-rose-600 !px-5 !text-white"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Dashboard;
