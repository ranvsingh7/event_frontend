"use client";

import { Button, Card, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, Grid, MenuItem, Select, TextField, Typography } from '@mui/material'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import {  Event as EventType } from "../../types/types";
import { apiRequest } from '@/utils/api';
import { QRCodeSVG } from 'qrcode.react';
// import Image from 'next/image';
import { toPng } from 'html-to-image';

const Events = () => {
    const [events, setEvents] = useState<EventType[]>([]);
    const [bookEvent, setBookEvent] = useState<EventType | null>(null);
    const [bookDialogOpen, setBookDialogOpen] = useState<boolean>(false);
    const [digitalPassOpen, setDigitalPassOpen] = useState<boolean>(false);
    const [passDetails, setPassDetails] = useState<any>(null);
    const [bookEventDetails, setBookEventDetails] = useState({
        eventId: "",
        name: "",
        eventName:"",
        eventDesc:"",
        eventDate:"",
        email: "",
        mobile: "",
        entryType: "",
        selectValue:"",
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
      };

    const ref = useRef<HTMLDivElement>(null)

  const onButtonClick = useCallback(() => {
    if (ref.current === null) {
      return
    }

    toPng(ref.current, { cacheBust: true, })
      .then((dataUrl) => {
        const link = document.createElement('a')
        link.download = 'my-pass.png'
        link.href = dataUrl
        link.click()
      })
      .catch((err) => {
        console.log(err)
      })
  }, [ref])

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
            eventName:event.name,
            eventDesc:event.description,
            eventDate:event.date,
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

            <Dialog open={digitalPassOpen} onClose={() => setDigitalPassOpen(false)} maxWidth="lg">
                <DialogContent>
                    {passDetails ? (
                        // <Card>
                        //     <CardContent>
                        //         <Typography variant="h6">Digital Pass</Typography>
                        //         <Typography variant="body1">
                        //             <strong>Name:</strong> {passDetails.name}
                        //         </Typography>
                        //         <Typography variant="body1">
                        //             <strong>Email:</strong> {passDetails.email}
                        //         </Typography>
                        //         <Typography variant="body1">
                        //             <strong>Mobile:</strong> {passDetails.mobile}
                        //         </Typography>
                        //         <Typography variant="body1">
                        //             <strong>Event:</strong> {passDetails.eventId?.name}
                        //         </Typography>
                        //         <Typography variant="body1">
                        //             <strong>Entry Type:</strong> {passDetails.entryTitle}
                        //         </Typography>
                        //         <Typography variant="body1">
                        //             <strong>Date:</strong>{" "}
                        //             {new Date(passDetails.date).toLocaleString()}
                        //         </Typography>
                        //         <Typography variant="body1">
                        //             <strong>Amount:</strong> ₹ {passDetails.amount}
                        //         </Typography>

                        //         {/* QR Code */}
                        //         <div style={{ marginTop: "1rem", textAlign: "center" }}>
                        //             <QRCodeSVG value={JSON.stringify(passDetails._id)} size={150} />
                        //         </div>
                        //     </CardContent>
                        // </Card>
                        <>
                        
                        <div className='border w-[700px] h-[250px] rounded-md overflow-hidden flex' ref={ref}>
                <div>
                    <div className='w-[18px] h-[62.5px] bg-[#f6c549]'></div>
                    <div className='w-[18px] h-[62.5px] bg-[#41924a]'></div>
                    <div className='w-[18px] h-[62.5px] bg-[#e73431]'></div>
                    <div className='w-[18px] h-[62.5px] bg-[#3473bf]'></div>
                </div>
                
                <div className='w-full p-6 relative bg-white'>
                    <div className='w-[80px] h-[80px] top-4 right-4 absolute'>
                    <QRCodeSVG value={JSON.stringify(passDetails._id)} size={80} />
                    </div>
                    {/* <Image src="/logo/logo.png" className='absolute bottom-6 right-4' alt="Logo" width={100} height={100} /> */}
                    {/* <div className='w-[150px] h-[150px] border absolute top-0 right-0 '></div> */}
                    <p className='text-3xl font-bold'>{passDetails.eventName}</p>
                    <p className='text-wrap max-w-[410px] text-md leading-[22px] mt-2'>{passDetails.eventDesc}</p>

                    <div className='flex w-[400px] h-[90px] absolute bottom-6 border border-black mt-4'>
                        <div className='w-[40%] h-full'>
                            <div className='flex justify-center items-center h-[60%] border-r border-black text-lg font-semibold'>E-Ticket</div>
                            <div className='h-[40%] border-t border-r border-black flex justify-center items-center text-sm'>{formatDate(passDetails.eventDate)}</div>
                        </div>
                        <div className='w-[60%]'>
                        <div className='flex flex-col justify-center pl-4 h-[60%]'>
                            <p className='text-sm font-semibold'>Name: <span className='font-normal'>{passDetails.name}</span></p>
                            <p className='text-sm font-semibold'>Id: <span className='font-normal'>467889</span></p>
                        </div>
                        <div className='h-[40%] border-t border-black flex pl-4 items-center text-sm'>
                            <p><span className='font-semibold'>Entry:</span> {passDetails.passCount} | <span className='font-semibold'>Available:</span> {passDetails.remainingCount}</p>
                        </div>
                        </div>
                    </div>
                </div>
                <div className='h-full w-[180px] bg-[#3473bf] relative'>
                    <div className='-rotate-90 text-white w-[150px] absolute bottom-[48px] left-[-16px] text-sm'>
                    <p className='w-[164px]'>Please present this ticket at the entrance</p>
                    <hr className='my-2' />
                    <p>Contact: 7877763051</p>
                    <div className='w-[50px] h-[50px] bg-white absolute rounded-full top-[92px] left-[82px]'></div>
                    {/* <div className='w-[100px] h-[100px] border absolute top-0 left-0'></div> */}
                    {/* <Image src="/logo/logo.png" className='absolute top-6 right-10' alt="Logo" width={100} height={100} /> */}
                    </div>
                </div>
            </div>
            <div className='w-full mt-6 flex'><Button variant='contained' onClick={onButtonClick}>Download Pass</Button></div>
            </>
                    ) : (
                        <Typography>Loading pass details...</Typography>
                    )}
                </DialogContent>
            </Dialog>
            </div>
  )
}

export default Events