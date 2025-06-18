import { Button, Dialog, DialogContent, Typography } from "@mui/material";
import { toPng } from "html-to-image";
import Image from "next/image";
import { QRCodeSVG } from "qrcode.react";
import React, { useCallback, useEffect, useRef, useState } from "react";

interface PassProps {
  open: boolean;
  passData: any;
  dialogClose: () => void;
  demoPass?: boolean;
}

const Pass: React.FC<PassProps> = ({ open, passData, dialogClose, demoPass }) => {
  const [digitalPassOpen, setDigitalPassOpen] = useState<boolean>(false);
  const [passDetails, setPassDetails] = useState<any>(null);

  useEffect(() => {
    setDigitalPassOpen(open);
    setPassDetails(passData);
  }, [open, passData]);

  const ref = useRef<HTMLDivElement>(null);

  const onButtonClick = useCallback(() => {
    if (ref.current === null) return;

    toPng(ref.current, { cacheBust: true })
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.download = "my-pass.png";
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => console.log(err));
  }, [ref]);

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

  const handleClose = () => {
    setDigitalPassOpen(false);
    dialogClose();
  };

  return (
    <Dialog open={digitalPassOpen} onClose={handleClose} maxWidth="lg">
      <DialogContent>
        {passDetails ? (
          <>
            <div
              className="w-full max-w-[900px] h-[400px] rounded-lg overflow-hidden flex bg-gradient-to-b from-gray-900 to-black shadow-lg"
              ref={ref}
            >
              {/* Left Accent Bar */}
              <div className="flex flex-col">
                <div className="w-[18px] h-1/4 bg-yellow-500"></div>
                <div className="w-[18px] h-1/4 bg-blue-500"></div>
                <div className="w-[18px] h-1/4 bg-pink-500"></div>
                <div className="w-[18px] h-1/4 bg-gray-800"></div>
              </div>

              {/* Main Content */}
              <div className="relative flex-1 p-6">
                <Image
                  src="/logo/bg1.jpg"
                  alt="Background"
                  layout="fill"
                  objectFit="cover"
                  className="absolute inset-0 opacity-10"
                />
                <div className="relative">
                  {/* Header */}
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h1 className="text-3xl font-bold text-yellow-500">
                        {passDetails.eventName || "Event Name"}
                      </h1>
                      <p className="text-sm text-gray-400">
                        {passDetails.eventDesc || "Event Description"}
                      </p>
                    </div>
                    <Image
                      src="/logo/logo.png"
                      alt="Logo"
                      width={100}
                      height={100}
                      className="opacity-90"
                    />
                  </div>

                  {/* Ticket Info Section */}
                  <div className="grid grid-cols-2 gap-4 mt-4 border border-pink-500 rounded-lg p-4 bg-gray-900">
                    <div>
                      <p className="text-sm font-medium text-gray-300">
                        Name: <span className="font-normal">{demoPass ? "John Doe" : passDetails.name}</span>
                      </p>
                      <p className="text-sm font-medium text-gray-300">
                        ID: <span className="font-normal">{demoPass ? "DEMO1001" : passDetails.bookingId}</span>
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-300">
                        Date: <span className="font-normal">{demoPass ? "20-10-2024" : formatDate(passDetails.eventDate)}</span>
                      </p>
                      <p className="text-sm font-medium text-gray-300">
                        Entry: <span className="font-normal">{demoPass ? "4" : passDetails.passCount}</span>
                      </p>
                    </div>
                  </div>

                  {/* QR Code */}
                  <div className="absolute bottom-4 right-4 border border-yellow-500 p-2 rounded-md bg-gray-800">
                    <QRCodeSVG
                      value={demoPass ? "DEMO PASS" : JSON.stringify(passDetails._id)}
                      size={120}
                    />
                  </div>
                </div>
              </div>

              {/* Right Accent Section */}
              <div className="flex flex-col w-[180px] bg-blue-500 text-white justify-center items-center">
                <p className="text-xs -rotate-90">Please present this ticket at the entrance</p>
                <hr className="w-8 my-2" />
                <p className="text-xs -rotate-90">Contact: 7877763051</p>
              </div>
            </div>

            {/* Download Button */}
            <div className="w-full mt-6 flex justify-center">
              <Button variant="contained" style={{ backgroundColor: "#FACC15", color: "#000" }} onClick={onButtonClick}>
                {demoPass ? "Download Demo Pass" : "Download Pass"}
              </Button>
            </div>
          </>
        ) : (
          <Typography className="text-gray-300">Loading pass details...</Typography>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default Pass;
