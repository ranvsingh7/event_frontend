"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  CircularProgress,
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
import { QRCodeSVG } from "qrcode.react";

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

    try {
      setLoading(true);
      const response = await apiRequest(
        `/api/bookings/create-booking`,
        "POST",
        bookingData
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
    <div className="container">
      <Typography variant="h4" gutterBottom>
        All Events
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
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
                  <Button
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
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog
        open={editDialogOpen}
        onClose={handleEditClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit Event</DialogTitle>
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
            <Grid container spacing={2} alignItems="center" key={index}>
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
            color="primary"
            sx={{ mt: 2 }}
            onClick={addEntryType}
          >
            <Add /> Add Entry Type
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose} color="secondary">
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
          <Button color="primary" onClick={handleBookSave}>
            Book
          </Button>
        </DialogActions>
      </Dialog>

      {/* Digital Pass Dialog */}
      <Dialog
        open={digitalPassOpen}
        onClose={() => setDigitalPassOpen(false)}
        fullWidth
      >
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
                  <QRCodeSVG
                    value={JSON.stringify(passDetails._id)}
                    size={150}
                  />
                </div>
              </CardContent>
            </Card>
          ) : (
            <Typography>Loading pass details...</Typography>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
