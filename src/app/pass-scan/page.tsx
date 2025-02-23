"use client";

import { PassData } from "@/types/types";
import { apiRequest } from "@/utils/api";
import { Add, Remove } from "@mui/icons-material";
import { Button, Card, CardContent, CircularProgress, Dialog, IconButton, TextField, Typography } from "@mui/material";
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
    const token = localStorage.getItem("token");

    try {
      const response = await apiRequest<PassData>(`/api/bookings/pass/${passId}`, "GET",undefined, token||"");
      setPassData(response);
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

    return isClient ? (
        <div style={{ padding: "20px" }}>
      <Typography variant="h4" gutterBottom>
        SCAN PASS
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : passData ? (
        <>
        <Card>
          <CardContent>
            <Typography variant="h6">Pass Details</Typography>
            <Typography variant="body2">Name: {passData.name}</Typography>
            <Typography variant="body2">Email: {passData.email}</Typography>
            <Typography variant="body2">Total Entry: {passData.passCount}</Typography>
            <Typography variant="body2">Checked Entry: {passData.checkedCount}</Typography>
            <Typography variant="body2">Remaining Entry: {passData.remainingCount}</Typography>
            <Typography variant="body2">Entry Type: {passData.entryType}</Typography>
            <Typography variant="body2">
              Date: {new Date(passData.date).toLocaleString()}
            </Typography>
            <Button onClick={handleCheckInDialog}>
                Check In
            </Button>
          </CardContent>
        </Card>

        <Dialog open={checkInDialog} onClose={() => setCheckInDialog(false)}>
            <Typography variant="h6">Check In</Typography>
            <Typography variant="body2">Are you sure you want to check in this pass?</Typography>
            {/* number input with increment and decrement and mac button  also */}
            <div className="flex items-center">
                <IconButton disabled={checkPassCount<=0} onClick={()=>{checkPassCount > 0 &&setCheckPassCount(checkPassCount-1)}}>
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
                <IconButton disabled={passData.remainingCount <= checkPassCount} onClick={()=>{setCheckPassCount(checkPassCount+1)}}>
                    <Add color="primary"/>
                </IconButton>

                <Button variant="outlined" color="primary" onClick={()=>{setCheckPassCount(passData.remainingCount)}}>
                    Max
                </Button>
            </div>

            <Button variant="contained" color="primary" onClick={handleCheckIn}>
                Confirm
            </Button>
            <Button onClick={() => setCheckInDialog(false)}>
                Cancel
            </Button>
        </Dialog>
        </>

      ) : scanPass ? (
        <div className="w-[400px] h-[400px]">
            <Scanner onScan={(result) =>{handleResult(result)}} />
        </div>
      ) : <Button onClick={()=>setScanPass(true)}>Scan Pass</Button>}

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
