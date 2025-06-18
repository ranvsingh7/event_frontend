"use client";

import { PassData } from "@/types/types";
import { apiRequest } from "@/utils/api";
import { Add, QrCodeScannerOutlined, Remove } from "@mui/icons-material";
import { Button, Card, CardContent, CircularProgress, Dialog, DialogActions, DialogContent, IconButton, TextField, Typography } from "@mui/material";
import { Scanner } from "@yudiel/react-qr-scanner";
import { useEffect, useState } from "react";


const PassScan = () => {
    const [isClient, setIsClient] = useState(false);
    const [checkPassCount, setCheckPassCount] = useState(0);
    const [scanPass, setScanPass] = useState(false);

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
    setCheckInDialog(true);
}

const handleCheckIn = async () => {
    setError(null);
    const token = localStorage.getItem("token");

    try {
         await apiRequest<{ message: string }>(
            `/api/bookings/check-in/${passData?._id}`,
            "PUT",
            { checkPassCount: checkPassCount },
            token||""
        );
        setCheckPassCount(0);
        setPassData(null);
        setCheckInDialog(false);
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
        <div className="p-5 w-max m-auto flex flex-col items-center">
      <Typography variant="h4" className="text-green-600" gutterBottom>
        SCAN PASS
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : passData ? (
        <>
        <Card className="bg-white shadow-lg rounded-xl p-6 w-full max-w-md mx-auto">
  <CardContent className="flex flex-col gap-4">
    <Typography variant="h5" className="font-bold text-gray-800 border-b pb-2">
      Pass Details
    </Typography>
    <div className="grid grid-cols-2 gap-y-2 text-sm">
      <Typography className="text-gray-600 font-medium">Name:</Typography>
      <Typography className="text-gray-800">{passData.name}</Typography>

      <Typography className="text-gray-600 font-medium">Email:</Typography>
      <Typography className="text-gray-800">{passData.email}</Typography>

      <Typography className="text-gray-600 font-medium">Total Entry:</Typography>
      <Typography className="text-gray-800">{passData.passCount}</Typography>

      <Typography className="text-gray-600 font-medium">Checked Entry:</Typography>
      <Typography className="text-gray-800">{passData.checkedCount}</Typography>

      <Typography className="text-gray-600 font-medium">Remaining Entry:</Typography>
      <Typography className="text-gray-800">{passData.remainingCount}</Typography>

      <Typography className="text-gray-600 font-medium">Entry Type:</Typography>
      <Typography className="text-gray-800">{passData.entryTitle}</Typography>

      <Typography className="text-gray-600 font-medium">Date:</Typography>
      <Typography className="text-gray-800">{formatDate(passData.eventDate)}</Typography>
    </div>
    <Button
      onClick={handleCheckInDialog}
      variant="contained"
      color="primary"
      className="w-full mt-4"
    >
      Check In
    </Button>
  </CardContent>
</Card>


        <Dialog open={checkInDialog} maxWidth="sm" onClose={() => setCheckInDialog(false)}>
  <DialogContent className="p-6"> {/* Add padding */}
    <Typography variant="h6">Check In</Typography>
    <Typography variant="body2" className="mb-4">
      Are you sure you want to check in this pass?
    </Typography>
    <div className="flex items-center gap-2">
      <IconButton
        disabled={checkPassCount <= 0}
        onClick={() => checkPassCount > 0 && setCheckPassCount(checkPassCount - 1)}
      >
        <Remove color="error" />
      </IconButton>
      <TextField
        label="Count"
        type="number"
        disabled
        value={checkPassCount}
        onChange={(e) => setCheckPassCount(parseInt(e.target.value))}
        className="max-w-[100px]"
        margin="normal"
      />
      <IconButton
        disabled={passData.remainingCount <= checkPassCount}
        onClick={() => setCheckPassCount(checkPassCount + 1)}
      >
        <Add color="primary" />
      </IconButton>
      <Button variant="outlined" color="primary" onClick={() => setCheckPassCount(passData.remainingCount)}>
        Max
      </Button>
    </div>
  </DialogContent>
  <DialogActions className="p-4 border-t">
    <Button variant="contained" color="primary" onClick={handleCheckIn}>
      Confirm
    </Button>
    <Button onClick={() => setCheckInDialog(false)} color="error">Cancel</Button>
  </DialogActions>
</Dialog>
        </>

      ) : scanPass ? (
        <div className="w-[400px] h-[400px] relative">
          <div className="border border-red-500 w-full w-[300px] top-[200px] left-[50px] z-10 absolute"></div>
            <Scanner onScan={(result) =>{handleResult(result)}} />
        </div>
      ) : <Button onClick={()=>setScanPass(true)} variant="contained">
        <QrCodeScannerOutlined />
        Scan Pass
        </Button>}

      {error && (
        <Typography color="error" style={{ marginTop: "20px" }}>
          {error}
        </Typography>
      )}

      {passData && (
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            setPassData(null);
            setData(null);
          }}
          style={{ marginTop: "20px" }}
        >
          Scan Another Pass
        </Button>
      )}

      {!loading && !passData && data && (
        <Typography style={{ marginTop: "20px" }}>Scanned Data: {data}</Typography>
      )}
    </div>
    ) : null;
};

export default PassScan;
