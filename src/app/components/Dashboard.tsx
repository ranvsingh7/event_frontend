"use client";

import { useEffect, useState } from "react";
import {
  Typography,
  Grid,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Select,
  MenuItem,
} from "@mui/material";
import { CustomJwtPayload, Event as EventType } from "../../types/types";
import { apiRequest } from "@/utils/api";
import { Add, Remove } from "@mui/icons-material";
import { jwtDecode } from "jwt-decode";
import Pass from "./Pass";
import Loading from "./ui/Loading";
import Link from "next/link";

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

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return;

    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/,
      "$1"
    );
    if (!token) {
      alert("Authentication token not found. Please log in again.");
      return;
    }

    try {
      await apiRequest(`/api/events/${id}`, "DELETE", undefined, token);
      setEvents((prevEvents) => prevEvents.filter((event) => event._id !== id));
      alert("Event deleted successfully.");
    } catch (err: any) {
      alert(err.message || "Failed to delete the event.");
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

    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/,
      "$1"
    );
    if (!token) {
      alert("Authentication token not found. Please log in again.");
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
      alert("Event updated successfully.");
      handleEditClose();
    } catch (err: any) {
      alert(err.message || "Failed to update the event.");
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
      const entryType = bookEvent?.entryTypes.find(
        (entryType) => entryType.name === value
      );
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
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/,
      "$1"
    )

    const paymentDetails={
      success: true,
      paymentMode: "cash",
    }

    const data = {
      ...bookingData, paymentDetails
    }

    console.log(data)

    try {
      setLoading(true);
      const response = await apiRequest(
        `/api/bookings/auth/create-booking`,
        "POST",
        data,token
      );
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
    <div className="container p-6">
      <h1 className="text-white text-[50px] font-bold">My Events</h1>
        <div>
          <Loading loading={loading}/>
          {events.length <= 0 && !loading && <div className="bg-[#060a13]  text-white p-4 w-[820px] mt-5 rounded-xl flex flex-col gap-6 items-center">
          <p className="text-[46px] font-[900] italic">No Events Found, <span className="text-[#f96982]"><Link href="/create-event">Create Now!</Link></span></p>
          {/* <Image src="/logo/404.jpg" width={400} height={200} alt="logo"/> */}
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
              <div className="flex gap-2 justify-center">
              <Button
                  variant="contained"
                  color="primary"
                  sx={{ mt: 2 }}
                  onClick={() => handleBookOpen(event)}
                >
                  BOOK NOW
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  sx={{ mt: 2 }}
                  onClick={() => handleEditOpen(event)}
                >
                  Update Event
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  sx={{ mt: 2 }}
                  onClick={() => handleDelete(event._id)}
                >
                  Delete Event
                </Button>
              </div>
            </div>
          ))
          }
          </div>

      <Dialog
        open={editDialogOpen}
        onClose={handleEditClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit Event</DialogTitle>
        <Button onClick={()=>setDemoPassOpen(true)}>Show Demo Pass</Button>
                        <Pass open={demoPassOpen} dialogClose={()=>{setDemoPassOpen(false)}} passData={{
                            eventName: editEvent?.name,
                            eventDesc: editEvent?.description
                        }} demoPass />
        <DialogContent>
          <TextField
            margin="dense"
            label="Name"
            fullWidth
            value={editEvent?.name || ""}
            onChange={(e) => handleInputChange("name", e.target.value)}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            value={editEvent?.description || ""}
            onChange={(e) => handleInputChange("description", e.target.value)}
            multiline
            rows={6}
          />
          <TextField
            margin="dense"
            label="Date"
            type="date"
            fullWidth
            value={
              editEvent?.date
                ? new Date(editEvent.date).toISOString().slice(0, 10) // Format to "yyyy-MM-dd"
                : "" // Empty if no date is set
            }
            onChange={(e) => handleInputChange("date", e.target.value)} // Handle changes
          />

          <TextField
            margin="dense"
            label="Location"
            fullWidth
            value={editEvent?.location || ""}
            onChange={(e) => handleInputChange("location", e.target.value)}
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
            variant="outlined"
            color="success"
            sx={{ mt: 2 }}
            onClick={addEntryType}
          >
            <Add /> Add Entry Type
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose} color="warning">
            Cancel
          </Button>
          <Button onClick={handleEditSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={bookDialogOpen}
        maxWidth="sm"
        onClose={() => setBookDialogOpen(false)}
      >
        <div className="p-4 max-w-[400px]">
        <div className="mb-6">
        <p className="text-[30px] font-bold text-center">Book Pass</p>
          <p className="text-[18px] font-semibold text-center">{bookEvent?.name}</p>
          <p className="text-[14px] font-semibold text-center">
            Location: {bookEvent?.location}
          </p>
        </div>
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
          <Button color="secondary" onClick={()=>setBookDialogOpen(false)}>Cancel</Button>
          <Button color="primary" onClick={handleBookSave}>
            Book
          </Button>
        </DialogActions>
        </div>
      </Dialog>

      {/* Digital Pass Dialog */}
      <Pass open={digitalPassOpen} passData={passDetails} dialogClose={()=>{
            setDigitalPassOpen(false);
            setPassDetails(null)
          }} />
    </div>
  );
};

export default Dashboard;
