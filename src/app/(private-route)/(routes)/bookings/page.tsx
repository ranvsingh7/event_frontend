"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button, Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
import { Booking, CustomJwtPayload } from "@/types/types";
import { apiRequest } from "@/utils/api";
import { jwtDecode } from "jwt-decode";
import Pass from "@/app/components/Pass";
import Loading from "@/app/components/ui/Loading";
import { CalendarMonth, Close, ConfirmationNumber, Email, LocalPhone, Search } from "@mui/icons-material";

interface BookingListResponse {
    bookings: Booking[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasMore: boolean;
    };
}

const PAGE_SIZE = 20;

const BookingPage = () => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState<string>("");
    const [digitalPassOpen, setDigitalPassOpen] = useState<boolean>(false)
    const [passDetails, setPassDetails] = useState<any>(null);
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [token, setToken] = useState<string>("");
    const [page, setPage] = useState<number>(1);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [loadingMore, setLoadingMore] = useState<boolean>(false);
    const loadMoreRef = useRef<HTMLDivElement | null>(null);

    const fetchBookings = useCallback(
        async (pageToLoad: number, append: boolean) => {
            if (!userId || !token) return;

            if (append) {
                setLoadingMore(true);
            } else {
                setLoading(true);
            }

            try {
                const data = await apiRequest<BookingListResponse | Booking[]>(
                    `/api/bookings/${userId}?page=${pageToLoad}&limit=${PAGE_SIZE}`,
                    "GET",
                    undefined,
                    token
                );

                const incomingBookings = Array.isArray(data) ? data : data.bookings || [];
                const incomingPagination = Array.isArray(data)
                    ? {
                          hasMore: incomingBookings.length === PAGE_SIZE,
                          page: pageToLoad,
                      }
                    : {
                          hasMore: data.pagination?.hasMore ?? false,
                          page: data.pagination?.page ?? pageToLoad,
                      };

                setBookings((prev) => (append ? [...prev, ...incomingBookings] : incomingBookings));
                setHasMore(incomingPagination.hasMore);
                setPage(incomingPagination.page);
                setError(null);
            } catch (err: any) {
                setError(err.message || "Failed to fetch bookings.");
            } finally {
                setLoading(false);
                setLoadingMore(false);
            }
        },
        [token, userId]
    );

    useEffect(() => {
        const cookieToken = document.cookie.replace(
            /(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/,
            "$1"
        );

        try {
            const decoded = cookieToken ? jwtDecode<CustomJwtPayload>(cookieToken) : null;
            if (!decoded?.id || !cookieToken) {
                setError("User ID or token is missing.");
                setLoading(false);
                return;
            }

            setToken(cookieToken);
            setUserId(decoded.id);
        } catch (err) {
            console.error("Error decoding token:", err);
            setError("Authentication failed. Please log in again.");
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!userId || !token) return;
        fetchBookings(1, false);
    }, [userId, token, fetchBookings]);

    useEffect(() => {
        if (!hasMore || loading || loadingMore || !loadMoreRef.current) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const first = entries[0];
                if (first.isIntersecting) {
                    fetchBookings(page + 1, true);
                }
            },
            { root: null, rootMargin: "220px", threshold: 0.1 }
        );

        observer.observe(loadMoreRef.current);

        return () => observer.disconnect();
    }, [hasMore, loading, loadingMore, page, fetchBookings]);

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

    const filteredBookings = (bookings || []).filter((booking) =>
        booking.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#060a15] via-[#0b1220] to-[#1a1230] p-4 sm:p-6">
            <div className="mx-auto w-full max-w-7xl">
                <div className="mb-6">
                    <p className="inline-flex rounded-full border border-cyan-300/30 bg-cyan-300/10 px-3 py-1 text-xs font-semibold tracking-[0.16em] text-cyan-100">
                        BOOKINGS OVERVIEW
                    </p>
                    <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-5xl">My Bookings</h1>
                </div>

                <div className="relative mb-6 w-full sm:max-w-md">
                    <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-cyan-300" fontSize="small" />
                    <input
                        placeholder="Search by Name"
                        value={search}
                        onChange={handleSearch}
                        className="w-full rounded-full border border-cyan-500/40 bg-slate-900/60 py-3 pl-11 pr-4 text-sm font-medium text-slate-100 placeholder-slate-400 transition-all duration-300 focus:border-cyan-500 focus:bg-slate-900/80 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                    />
                </div>

            {loading ? (
                <Loading loading={loading}/>
            ) : error ? (
                <div className="mt-5 flex w-full flex-col items-center gap-4 rounded-2xl border border-red-400/30 bg-red-500/10 p-6 text-white backdrop-blur-sm">
                    <p className="text-center text-lg font-semibold text-red-200">{error}</p>
                </div>
            ) : filteredBookings.length === 0 ? (
                <div className="mt-5 flex w-full flex-col items-center gap-6 rounded-2xl border border-white/15 bg-black/25 p-6 text-white backdrop-blur-sm">
                    <p className="text-center text-2xl font-black sm:text-3xl">No bookings found.</p>
                </div>
            ) : (
                <>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {filteredBookings.map((booking) => (
                        <div
                            key={booking._id}
                            className="relative overflow-hidden rounded-2xl border border-white/15 bg-gradient-to-br from-[#0b1220] via-[#101a2f] to-[#1a1230] p-5 text-white shadow-[0_20px_60px_rgba(0,0,0,0.45)]"
                        >
                            <div className="pointer-events-none absolute inset-0">
                                <div className="absolute -right-14 -top-14 h-32 w-32 rounded-full bg-fuchsia-500/20 blur-3xl" />
                                <div className="absolute -left-10 bottom-0 h-28 w-28 rounded-full bg-cyan-400/15 blur-3xl" />
                            </div>

                            <div className="relative z-10">
                                <div className="flex items-start justify-between gap-3">
                                    <p className="text-xl font-extrabold tracking-tight text-white">{booking.name}</p>
                                    <Button
                                        onClick={() => setSelectedBooking(booking)}
                                        className="!min-w-0 !shrink-0 !rounded-full !border !border-cyan-400/60 !bg-cyan-500/10 !px-3 !py-1.5 !text-[10px] !font-semibold !tracking-[0.08em] !text-cyan-200"
                                    >
                                        Show Details
                                    </Button>
                                </div>

                                <div className="mt-4 grid grid-cols-1 gap-x-4 gap-y-3 text-sm sm:grid-cols-2">
                                    <div className="flex items-start gap-3 rounded-xl bg-white/[0.04] px-3 py-2 text-slate-200">
                                        <Email fontSize="small" className="text-cyan-300" />
                                        <span className="break-all">{booking.email}</span>
                                    </div>
                                    <div className="flex items-start gap-3 rounded-xl bg-white/[0.04] px-3 py-2 text-slate-200">
                                        <LocalPhone fontSize="small" className="text-cyan-300" />
                                        <span>{booking.mobile}</span>
                                    </div>
                                    <div className="flex items-start gap-3 rounded-xl bg-white/[0.04] px-3 py-2 text-slate-200">
                                        <ConfirmationNumber fontSize="small" className="text-fuchsia-300" />
                                        <span>Entry: {booking.entryTitle}</span>
                                    </div>
                                    <div className="flex items-start gap-3 rounded-xl bg-white/[0.04] px-3 py-2 text-slate-300">
                                        <CalendarMonth fontSize="small" className="text-amber-300" />
                                        <span>{new Date(booking.createdAt).toLocaleString()}</span>
                                    </div>
                                </div>

                                <Button
                                    onClick={() => {
                                        handleGetPass(booking._id);
                                    }}
                                    className="!mt-5 !w-full !rounded-full !bg-gradient-to-r !from-cyan-500 !to-sky-600 !py-2.5 !text-xs !font-semibold !tracking-[0.08em] !text-white"
                                >
                                    Show Pass
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
                <div ref={loadMoreRef} className="h-10 w-full" />
                {loadingMore && (
                    <div className="mt-2 flex w-full justify-center">
                        <Loading loading={loadingMore} />
                    </div>
                )}
                {!hasMore && bookings.length > 0 && (
                    <p className="mt-3 text-center text-xs text-slate-400">You’ve reached the end of bookings.</p>
                )}
                </>
            )}
            <Pass open={digitalPassOpen} passData={passDetails} dialogClose={()=>{
            setDigitalPassOpen(false);
            setPassDetails(null)
          }} />

            <Dialog
                open={Boolean(selectedBooking)}
                onClose={() => setSelectedBooking(null)}
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
                <DialogTitle className="!pr-12 !text-xl !font-extrabold !tracking-tight">Booking Details</DialogTitle>
                <IconButton
                    onClick={() => setSelectedBooking(null)}
                    className="!absolute !right-2 !top-2 !text-slate-300"
                >
                    <Close />
                </IconButton>
                <DialogContent>
                    {selectedBooking && (
                        <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm">
                            <div className="rounded-lg bg-white/[0.04] px-3 py-2">
                                <p className="text-slate-400">Name</p>
                                <p className="font-semibold text-white">{selectedBooking.name}</p>
                            </div>
                            <div className="rounded-lg bg-white/[0.04] px-3 py-2">
                                <p className="text-slate-400">Entry Type</p>
                                <p className="font-semibold text-fuchsia-300">{selectedBooking.entryTitle}</p>
                            </div>
                            <div className="rounded-lg bg-white/[0.04] px-3 py-2">
                                <p className="text-slate-400">Total Entries</p>
                                <p className="font-semibold text-white">{selectedBooking.passCount}</p>
                            </div>
                            <div className="rounded-lg bg-white/[0.04] px-3 py-2">
                                <p className="text-slate-400">Remaining</p>
                                <p className="font-semibold text-emerald-300">{selectedBooking.remainingCount}</p>
                            </div>
                            <div className="rounded-lg bg-white/[0.04] px-3 py-2">
                                <p className="text-slate-400">Used</p>
                                <p className="font-semibold text-amber-300">{selectedBooking.passCount - selectedBooking.remainingCount}</p>
                            </div>
                            <div className="rounded-lg bg-white/[0.04] px-3 py-2">
                                <p className="text-slate-400">Amount</p>
                                <p className="font-semibold text-cyan-200">₹{selectedBooking.amount}</p>
                            </div>
                            <div className="col-span-2 rounded-lg bg-white/[0.04] px-3 py-2">
                                <p className="text-slate-400">Email</p>
                                <p className="font-semibold text-white break-all">{selectedBooking.email}</p>
                            </div>
                            <div className="col-span-2 rounded-lg bg-white/[0.04] px-3 py-2">
                                <p className="text-slate-400">Mobile</p>
                                <p className="font-semibold text-white">{selectedBooking.mobile}</p>
                            </div>
                            <div className="col-span-2 rounded-lg bg-white/[0.04] px-3 py-2">
                                <p className="text-slate-400">Event Date</p>
                                <p className="font-semibold text-cyan-100">{new Date(selectedBooking.eventDate).toLocaleString()}</p>
                            </div>
                            <div className="col-span-2 rounded-lg bg-white/[0.04] px-3 py-2">
                                <p className="text-slate-400">Booked At</p>
                                <p className="font-semibold text-slate-200">{new Date(selectedBooking.createdAt).toLocaleString()}</p>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
            </div>
        </div>
    );
};

export default BookingPage;