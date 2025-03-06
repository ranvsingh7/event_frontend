import { Button, Dialog, DialogContent, Typography } from '@mui/material'
import { toPng } from 'html-to-image';
import Image from 'next/image';
import { QRCodeSVG } from 'qrcode.react'
import React, { useCallback, useEffect, useRef, useState } from 'react'

interface PassProps {
    open:boolean,
    passData:any
    dialogClose: ()=>void;
    demoPass?:boolean
}

const Pass: React.FC<PassProps> = ({open,passData, dialogClose, demoPass})=>{
    useEffect(()=>{
        setDigitalPassOpen(open);
        setPassDetails(passData)
    },[open,passData])
    const [digitalPassOpen, setDigitalPassOpen] = useState<boolean>(false);
    const [passDetails, setPassDetails] = useState<any>(null);

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

      const handleClose =()=>{
        setDigitalPassOpen(false)
        dialogClose();
      }
    
      

    const ref = useRef<HTMLDivElement>(null);
    
      const onButtonClick = useCallback(() => {
        if (ref.current === null) {
          return;
        }
    
        toPng(ref.current, { cacheBust: true })
          .then((dataUrl) => {
            const link = document.createElement("a");
            link.download = "my-pass.png";
            link.href = dataUrl;
            link.click();
          })
          .catch((err) => {
            console.log(err);
          });
      }, [ref]);
  return (
    <Dialog
        open={digitalPassOpen}
        onClose={handleClose}
        maxWidth="lg"
      >
        <DialogContent>
          {passDetails ? (
            <>
              <div
                className="border w-[900px] h-[350px] rounded-md overflow-hidden flex"
                ref={ref}
              >
                <div>
                  <div className="w-[18px] h-[87.5px] bg-[#f6c549]"></div>
                  <div className="w-[18px] h-[87.5px] bg-[#41924a]"></div>
                  <div className="w-[18px] h-[87.5px] bg-[#e73431]"></div>
                  <div className="w-[18px] h-[87.5px] bg-[#3473bf]"></div>
                </div>

                <div className="w-full p-6 relative bg-white">
                  <div className="w-[120px] h-[120px] bottom-10 right-10 absolute z-10">
                    <QRCodeSVG
                      value={demoPass ? "DEMO PASS" : JSON.stringify(passDetails._id)}
                      size={120}
                    />
                  </div>
                  <Image src="/logo/bg1.jpg" className='absolute top-0 left-0 mix-blend-color-budrn opacity-10' alt="Logo" width={800} height={800} />
                  <Image src="/logo/logo.png" className='absolute top-6 right-6 mix-blend-color-budrn' alt="Logo" width={150} height={150} />
                  {/* <div className='w-[150px] h-[150px] border absolute top-0 right-0 '></div> */}
                  <div className='z-10 absolute'>
                  <p className="text-3xl font-bold">{passDetails.eventName ? passDetails.eventName : "Event Name"}</p>
                  <p className="text-wrap max-w-[410px] text-md leading-[22px] mt-2">
                    {passDetails.eventDesc ? passDetails.eventDesc : "Event Description"}
                  </p>
                  </div>

                  <div className="flex w-[400px] h-[90px] absolute bottom-[100px] border border-black mt-4">
                    <div className="w-[40%] h-full">
                      <div className="flex justify-center items-center h-[60%] border-r border-black text-lg font-semibold">
                        E-Ticket
                      </div>
                      <div className="h-[40%] border-t border-r border-black flex justify-center items-center text-sm">
                        {demoPass ? "20-10-2024" :formatDate(passDetails.eventDate)}
                      </div>
                    </div>
                    <div className="w-[60%]">
                      <div className="flex flex-col justify-center pl-4 h-[60%]">
                        <p className="text-sm font-semibold">
                          Name:{" "}
                          <span className="font-normal">
                            {demoPass ? "Jhon Doe" : passDetails.name}
                          </span>
                        </p>
                        <p className="text-sm font-semibold">
                          Id: <span className="font-normal">{demoPass ? "DEMO1001" : passDetails.bookingId}</span>
                        </p>
                      </div>
                      <div className="h-[40%] border-t border-black flex pl-4 items-center text-sm">
                        <p>
                          <span className="font-semibold">Entry:</span>{" "}
                          {demoPass ? "4" : passDetails.passCount} |{" "}
                          <span className="font-semibold">Available:</span>{" "}
                          {demoPass ? "4" : passDetails.remainingCount}
                        </p>
                      </div>
                      <p className="text-xs absolute top-110px] left-[636px] w-max -rotate-90">{new Date(passDetails.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className='absolute bottom-4 left-6'>
                    <p className='font-medium text-gray-700 mb-2'>Event Partners:</p>
                    <div className=' flex gap-2'>
                      <div className="border w-16 h-10 bg-red-200"></div>
                      <div className="border w-16 h-10 bg-red-200"></div>
                      <div className="border w-16 h-10 bg-red-200"></div>
                      <div className="border w-16 h-10 bg-red-200"></div>
                      <div className="border w-16 h-10 bg-red-200"></div>
                    </div>
                  </div>
                </div>
                <div className="h-full w-[180px] bg-[#3473bf] relative">
                  <div className="-rotate-90 text-white w-[150px] absolute bottom-[48px] left-[-16px] text-sm">
                    <p className="w-[164px]">
                      Please present this ticket at the entrance
                    </p>
                    <hr className="my-2" />
                    <p>Contact: 7877763051</p>
                    <div className="w-[50px] h-[50px] bg-white absolute rounded-full top-[92px] left-[82px]"></div>
                    {/* <div className='w-[100px] h-[100px] border absolute top-0 left-0'></div> */}
                    {/* <Image src="/logo/logo.png" className='absolute top-6 right-10' alt="Logo" width={100} height={100} /> */}
                  </div>
                </div>
              </div>
              <div className="w-full mt-6 flex">
                <Button variant="contained" onClick={onButtonClick}>
                  {demoPass? "Download Demo Pass" : "Download Pass"}
                </Button>
              </div>
            </>
          ) : (
            <Typography>Loading pass details...</Typography>
          )}
        </DialogContent>
      </Dialog>
  )
}

export default Pass