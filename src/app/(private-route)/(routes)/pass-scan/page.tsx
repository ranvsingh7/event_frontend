"use client";

import { PassData } from "@/types/types";
import { apiRequest } from "@/utils/api";
import { Add, CheckCircleOutline, QrCodeScannerOutlined, Remove, RestartAlt } from "@mui/icons-material";
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, IconButton } from "@mui/material";
import { Scanner } from "@yudiel/react-qr-scanner";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";


const PassScan = () => {
    const [isClient, setIsClient] = useState(false);
    const [checkPassCount, setCheckPassCount] = useState(0);
    const [scanPass, setScanPass] = useState(false);
  const [bookingIdInput, setBookingIdInput] = useState("");

    useEffect(() => {
        setIsClient(true);
    }, []);

    const [data, setData] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [passData, setPassData] = useState<PassData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [checkInDialog, setCheckInDialog] = useState(false);

  const fetchPassData = async (passId: string) => {
    setLoading(true);
    setError(null);
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/,
      "$1"
  );

    try {
      const response = await apiRequest<PassData>(`/api/bookings/pass/${passId}`, "GET",undefined, token||"");
      setPassData(response);
      console.log("Pass Data:", response);
    } catch (err: any) {
      setError(err.message || "Failed to fetch pass data.");
    } finally {
      setLoading(false);
    }
  };

  const fetchPassDataByBookingId = async () => {
    const bookingId = bookingIdInput.trim().toUpperCase();
    if (!bookingId) {
      toast.error("Please enter booking ID");
      return;
    }

    setLoading(true);
    setError(null);

    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/,
      "$1"
    );

    try {
      const response = await apiRequest<PassData>(
        `/api/bookings/pass-by-booking-id/${encodeURIComponent(bookingId)}`,
        "GET",
        undefined,
        token || ""
      );
      setBookingIdInput(bookingId);
      setPassData(response);
      setData(response._id);
      setScanPass(false);
      toast.success("Pass fetched successfully");
    } catch (err: any) {
      setError(err.message || "Failed to fetch pass by booking ID.");
    } finally {
      setLoading(false);
    }
  };

  const handleResult = (result:any) => {
    const resultText = result[0].rawValue.replace(/['"]+/g, "");

    if (resultText) {
      setData(resultText);
      fetchPassData(resultText); 
    }

    if (error) {
      console.error("QR Reader Error:", error);
      setError("Failed to scan QR code. Please try again.");
    }
  };


//   ##################CHECK IN################# 


const handleCheckInDialog = () => {
    if ((passData?.remainingCount ?? 0) <= 0) {
      return;
    }
    setCheckInDialog(true);
}

const handleCheckIn = async () => {
    setError(null);
    setLoading(true);
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/,
      "$1"
    );

    try {
      const updatedPass = await apiRequest<PassData>(
            `/api/bookings/check-in/${passData?._id}`,
            "PUT",
            { checkPassCount: checkPassCount },
            token||""
        );
        setCheckPassCount(0);
      setPassData(updatedPass);
        setCheckInDialog(false);
      toast.success("Check-in successful");
    } catch (err: any) {
        setError(err.message || "Failed to check in pass.");
    } finally {
        setLoading(false);
    }
};

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

    return isClient ? (
        <div className="min-h-screen bg-gradient-to-br from-[#060a15] via-[#0b1220] to-[#1a1230] p-4 sm:p-6">
      <div className="mx-auto w-full max-w-4xl">
        <div className="mb-6">
          <p className="inline-flex rounded-full border border-cyan-300/30 bg-cyan-300/10 px-3 py-1 text-xs font-semibold tracking-[0.16em] text-cyan-100">
            PASS VERIFICATION
          </p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-5xl">Scan Pass</h1>
        </div>

      {loading ? (
        <div className="flex w-full justify-center rounded-2xl border border-white/10 bg-black/20 p-10">
          <CircularProgress />
        </div>
      ) : passData ? (
        <>
        <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-gradient-to-br from-[#0b1220] via-[#101a2f] to-[#1a1230] p-5 text-white shadow-[0_20px_60px_rgba(0,0,0,0.45)] sm:p-6">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-fuchsia-500/20 blur-3xl" />
            <div className="absolute -left-14 bottom-0 h-36 w-36 rounded-full bg-cyan-400/15 blur-3xl" />
          </div>

          <div className="relative z-10">
            <div className="mb-4 flex items-center justify-between gap-3">
              <p className="text-2xl font-extrabold tracking-tight">Pass Details</p>
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-300/30 bg-emerald-400/10 px-2.5 py-1 text-xs font-semibold text-emerald-200">
                <CheckCircleOutline fontSize="small" /> Verified
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
              <div className="rounded-xl border border-cyan-400/20 bg-cyan-500/10 px-3 py-3 sm:col-span-2">
                <p className="text-xs uppercase tracking-[0.12em] text-cyan-200">Scan Summary</p>
                <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  <div className="rounded-lg bg-white/[0.05] px-2 py-2 text-center">
                    <p className="text-[11px] text-slate-300">Total</p>
                    <p className="text-base font-extrabold text-white">{passData.passCount}</p>
                  </div>
                  <div className="rounded-lg bg-white/[0.05] px-2 py-2 text-center">
                    <p className="text-[11px] text-slate-300">Checked In</p>
                    <p className="text-base font-extrabold text-amber-300">{passData.checkedCount}</p>
                  </div>
                  <div className="rounded-lg bg-white/[0.05] px-2 py-2 text-center">
                    <p className="text-[11px] text-slate-300">Remaining</p>
                    <p className="text-base font-extrabold text-emerald-300">{passData.remainingCount}</p>
                  </div>
                  <div className="rounded-lg bg-white/[0.05] px-2 py-2 text-center">
                    <p className="text-[11px] text-slate-300">Used</p>
                    <p className="text-base font-extrabold text-fuchsia-300">{passData.passCount - passData.remainingCount}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl bg-white/[0.04] px-3 py-2 sm:col-span-2"><p className="text-slate-400">Pass ID</p><p className="break-all font-semibold text-slate-200">{passData._id}</p></div>
              <div className="rounded-xl bg-white/[0.04] px-3 py-2"><p className="text-slate-400">Name</p><p className="font-semibold text-white">{passData.name}</p></div>
              <div className="rounded-xl bg-white/[0.04] px-3 py-2"><p className="text-slate-400">Email</p><p className="break-all font-semibold text-white">{passData.email}</p></div>
              <div className="rounded-xl bg-white/[0.04] px-3 py-2"><p className="text-slate-400">Total Entry</p><p className="font-semibold text-white">{passData.passCount}</p></div>
              <div className="rounded-xl bg-white/[0.04] px-3 py-2"><p className="text-slate-400">Checked Entry</p><p className="font-semibold text-amber-300">{passData.checkedCount}</p></div>
              <div className="rounded-xl bg-white/[0.04] px-3 py-2"><p className="text-slate-400">Remaining Entry</p><p className="font-semibold text-emerald-300">{passData.remainingCount}</p></div>
              <div className="rounded-xl bg-white/[0.04] px-3 py-2"><p className="text-slate-400">Entry Type</p><p className="font-semibold text-fuchsia-300">{passData.entryTitle}</p></div>
              <div className="rounded-xl bg-white/[0.04] px-3 py-2 sm:col-span-2"><p className="text-slate-400">Event Date</p><p className="font-semibold text-cyan-100">{formatDate(passData.eventDate)}</p></div>
            </div>

            <Button
              onClick={handleCheckInDialog}
              disabled={(passData?.remainingCount ?? 0) <= 0}
              className="!mt-5 !w-full !rounded-full !bg-gradient-to-r !from-cyan-500 !to-sky-600 !py-2.5 !text-xs !font-semibold !tracking-[0.08em] !text-white"
            >
              {(passData?.remainingCount ?? 0) <= 0 ? "Checked In (Completed)" : "Check In"}
            </Button>
          </div>
        </div>


        <Dialog
          open={checkInDialog}
          maxWidth="sm"
          fullWidth
          onClose={() => setCheckInDialog(false)}
          PaperProps={{
            sx: {
              borderRadius: 3,
              background: "linear-gradient(145deg, #0b1220 0%, #15112a 100%)",
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.12)",
            },
          }}
        >
          <DialogContent className="!p-6">
            <p className="text-xl font-extrabold tracking-tight">Check In</p>
            <p className="mt-1 text-sm text-slate-300">Select how many entries you want to check in.</p>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <IconButton
                disabled={checkPassCount <= 0}
                onClick={() => checkPassCount > 0 && setCheckPassCount(checkPassCount - 1)}
                className="!rounded-full !border !border-red-400/50 !bg-red-500/10 !text-red-300"
              >
                <Remove />
              </IconButton>

              <div className="min-w-[90px] rounded-full border border-cyan-500/40 bg-slate-900/70 px-4 py-2 text-center text-lg font-bold text-cyan-200">
                {checkPassCount}
              </div>

              <IconButton
                disabled={passData.remainingCount <= checkPassCount}
                onClick={() => setCheckPassCount(checkPassCount + 1)}
                className="!rounded-full !border !border-emerald-400/50 !bg-emerald-500/10 !text-emerald-300"
              >
                <Add />
              </IconButton>

              <Button
                onClick={() => setCheckPassCount(passData.remainingCount)}
                className="!rounded-full !border !border-cyan-400/60 !px-4 !text-cyan-200"
              >
                Max
              </Button>
            </div>

            <p className="mt-3 text-xs text-slate-400">Remaining entries available: {passData?.remainingCount}</p>
          </DialogContent>
          <DialogActions className="!border-t !border-white/10 !p-4">
            <Button
              onClick={handleCheckIn}
              className="!rounded-full !bg-gradient-to-r !from-cyan-500 !to-sky-600 !px-5 !text-white"
            >
              Confirm
            </Button>
            <Button
              onClick={() => setCheckInDialog(false)}
              className="!rounded-full !bg-slate-600 !px-4 !text-white hover:!bg-slate-500"
            >
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
        </>

      ) : scanPass ? (
        <div className="w-full max-w-[420px]">
          <div className="relative mx-auto w-full overflow-hidden rounded-2xl border border-white/15 bg-black/20 p-3 sm:p-4">
            <div className="absolute left-1/2 top-1/2 z-10 h-[2px] w-[72%] -translate-x-1/2 -translate-y-1/2 bg-red-400/90"></div>
              <Scanner onScan={(result) =>{handleResult(result)}} />
          </div>

          <Button
            onClick={() => {
              setScanPass(false);
              setError(null);
              setData(null);
            }}
            className="!mt-4 !w-full !rounded-full !border !border-slate-400/60 !bg-slate-700/40 !px-5 !py-2.5 !text-xs !font-semibold !tracking-[0.08em] !text-slate-100 hover:!bg-slate-600/50"
          >
            Go Back
          </Button>
        </div>
      ) : (
        <div className="w-full max-w-xl space-y-4">
          <Button onClick={()=>setScanPass(true)} className="!w-full !rounded-full !bg-gradient-to-r !from-cyan-500 !to-sky-600 !px-6 !py-2.5 !text-sm !font-semibold !tracking-[0.08em] !text-white">
            <QrCodeScannerOutlined />
            <span className="ml-2">Scan Pass</span>
          </Button>

          <div className="rounded-2xl border border-white/15 bg-black/20 p-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-cyan-200">Fetch by Booking ID</p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                value={bookingIdInput}
                onChange={(e) => setBookingIdInput(e.target.value.toUpperCase())}
                placeholder="Enter Booking ID (e.g. EVT101)"
                className="w-full rounded-full border border-cyan-500/40 bg-slate-900/60 px-4 py-2.5 text-sm font-medium text-slate-100 placeholder-slate-400 transition-all duration-300 focus:border-cyan-500 focus:bg-slate-900/80 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
              />
              <Button
                onClick={fetchPassDataByBookingId}
                className="!rounded-full !border !border-cyan-400/70 !bg-cyan-500/10 !px-5 !text-xs !font-semibold !tracking-[0.08em] !text-cyan-200"
              >
                Fetch Pass
              </Button>
            </div>
          </div>
        </div>
      )}

      {error && (
        <p className="mt-5 rounded-xl border border-red-400/40 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-200">
          {error}
        </p>
      )}

      {passData && (
        <Button
          onClick={() => {
            setPassData(null);
            setData(null);
            setScanPass(false);
          }}
          className="!mt-5 !rounded-full !border !border-cyan-400/60 !bg-cyan-500/10 !px-5 !py-2 !text-xs !font-semibold !tracking-[0.08em] !text-cyan-200"
        >
          <RestartAlt fontSize="small" />
          <span className="ml-1"> 
          Scan Another Pass
          </span>
        </Button>
      )}

      {!loading && !passData && data && (
        <p className="mt-5 text-xs text-slate-400">Scanned Data: {data}</p>
      )}
    </div>
    </div>
    ) : null;
};

export default PassScan;
