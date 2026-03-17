"use client";

import CloseIcon from "@mui/icons-material/Close";
import { Button, Dialog, DialogContent, IconButton, Typography } from "@mui/material";
import { toCanvas, toPng } from "html-to-image";
import Image from "next/image";
import { QRCodeSVG } from "qrcode.react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

interface PassProps {
  open: boolean;
  passData: any;
  dialogClose: () => void;
  demoPass?: boolean;
}

const Pass: React.FC<PassProps> = ({ open, passData, dialogClose, demoPass }) => {
  const [digitalPassOpen, setDigitalPassOpen] = useState<boolean>(false);
  const [passDetails, setPassDetails] = useState<any>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    setDigitalPassOpen(open);
    setPassDetails(passData);
  }, [open, passData]);

  const ref = useRef<HTMLDivElement>(null);

  const onButtonClick = useCallback(async () => {
    if (ref.current === null || isDownloading) return;

    try {
      setIsDownloading(true);
      const node = ref.current;

      if (typeof document !== "undefined" && "fonts" in document) {
        await (document as Document & { fonts: FontFaceSet }).fonts.ready;
      }

      await new Promise((resolve) => requestAnimationFrame(() => resolve(true)));

      let dataUrl: string;
      try {
        dataUrl = await toPng(node, {
          cacheBust: true,
          pixelRatio: 2,
          backgroundColor: "#0b1220",
          width: node.scrollWidth,
          height: node.scrollHeight,
        });
      } catch {
        const canvas = await toCanvas(node, {
          cacheBust: true,
          pixelRatio: 2,
          backgroundColor: "#0b1220",
          width: node.scrollWidth,
          height: node.scrollHeight,
        });
        dataUrl = canvas.toDataURL("image/png", 1);
      }

      const link = document.createElement("a");
      link.download = `${passDetails?.bookingId || "event-pass"}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Pass downloaded");
    } catch (err) {
      console.error("Pass download failed:", err);
      toast.error("Could not download pass. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  }, [isDownloading, passDetails?.bookingId]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(date);
  };

  const handleClose = () => {
    setDigitalPassOpen(false);
    dialogClose();
  };

  return (
    <Dialog
      open={digitalPassOpen}
      onClose={handleClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          width: "100%",
          maxWidth: "1100px",
          margin: { xs: 1, sm: 2 },
        },
      }}
    >
      <DialogContent className="relative overflow-x-auto bg-[#060a15] p-3 sm:p-6">
        <IconButton
          onClick={handleClose}
          aria-label="close"
          className="!absolute right-3 top-3 z-20 !text-white/85 hover:!text-white"
        >
          <CloseIcon />
        </IconButton>
        {passDetails ? (
          <>
            <div className="w-full overflow-x-auto pb-1">
              <div
                className="relative mx-auto w-full max-w-[980px] min-w-[320px] overflow-hidden rounded-2xl border border-white/20 bg-gradient-to-br from-[#0b1220] via-[#101a2f] to-[#1a1230] text-white shadow-[0_20px_80px_rgba(0,0,0,0.65)]"
                ref={ref}
              >
                <div className="pointer-events-none absolute inset-0">
                  <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-fuchsia-500/30 blur-3xl" />
                  <div className="absolute -left-20 bottom-0 h-56 w-56 rounded-full bg-cyan-400/25 blur-3xl" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.12),transparent_38%)]" />
                </div>

                <div className="relative grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_240px]">
                  <div className="min-w-0 border-b border-white/10 p-5 sm:p-7 lg:border-b-0 lg:border-r">
                  <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="mb-2 inline-flex items-center rounded-full border border-cyan-300/35 bg-cyan-300/10 px-3 py-1 text-xs font-medium tracking-wide text-cyan-100">
                        ENTRY PASS • DIGITAL TICKET
                      </p>
                      <h1 className="break-words text-2xl font-bold leading-tight text-white sm:text-4xl">
                        {passDetails.eventName || "Event Name"}
                      </h1>
                      <p className="mt-2 max-w-2xl break-words text-sm text-slate-300 sm:text-base">
                        {passDetails.eventDesc || "Event Description"}
                      </p>
                    </div>

                    <div className="rounded-xl border border-white/20 bg-black/25 p-3 backdrop-blur-sm">
                      <Image
                        src="/logo/logo.png"
                        alt="Logo"
                        width={68}
                        height={68}
                        className="opacity-95"
                        unoptimized
                        priority
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Attendee</p>
                      <p className="mt-1 text-base font-semibold text-white sm:text-lg">
                        {demoPass ? "John Doe" : passDetails.name || "Guest"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Booking ID</p>
                      <p className="mt-1 break-all text-base font-semibold text-white sm:text-lg">
                        {demoPass ? "DEMO1001" : passDetails.bookingId || "N/A"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Event Date</p>
                      <p className="mt-1 text-base font-semibold text-white sm:text-lg">
                        {demoPass ? "20-10-2024" : formatDate(passDetails.eventDate)}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Entry Count</p>
                      <p className="mt-1 text-base font-semibold text-white sm:text-lg">
                        {demoPass ? "4" : passDetails.passCount || "1"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Event Time</p>
                      <p className="mt-1 text-base font-semibold text-white sm:text-lg">
                        {demoPass ? "07:30 PM" : formatTime(passDetails.eventDate)}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Venue</p>
                      <p className="mt-1 text-base font-semibold text-white sm:text-lg">
                        {passDetails?.location || "Main Arena"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 border-t border-dashed border-white/20 pt-4 text-xs text-slate-300 sm:text-sm">
                    Present this pass at the entrance. This pass can be scanned multiple times until all entries in
                    your booking are used.
                  </div>
                </div>

                  <div className="flex flex-col items-center justify-center gap-4 p-6 sm:p-7">
                  <div className="rounded-2xl border border-white/20 bg-white p-4 shadow-2xl">
                    <QRCodeSVG value={demoPass ? "DEMO PASS" : JSON.stringify(passDetails._id)} size={170} />
                  </div>

                  <div className="text-center">
                    <p className="text-xs uppercase tracking-[0.2em] text-cyan-200/80">Scan for entry</p>
                    <p className="mt-1 text-sm text-slate-300">Remaining people can use the same pass to check in</p>
                  </div>

                  <div className="w-full rounded-xl border border-white/20 bg-black/25 p-3 text-center text-xs text-slate-300 backdrop-blur-sm">
                    Need help? Contact support
                    <br />
                    <span className="font-semibold text-white">+91 78777 63051</span>
                  </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex w-full justify-center">
              <Button
                variant="contained"
                onClick={onButtonClick}
                disabled={isDownloading}
                style={{
                  background: "linear-gradient(90deg, #22d3ee 0%, #a855f7 100%)",
                  color: "#ffffff",
                  borderRadius: "999px",
                  paddingInline: "24px",
                  paddingBlock: "10px",
                  fontWeight: 700,
                  textTransform: "none",
                }}
              >
                {isDownloading ? "Preparing..." : demoPass ? "Download Demo Pass" : "Download Pass"}
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
