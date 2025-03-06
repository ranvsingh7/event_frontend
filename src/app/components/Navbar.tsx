"use client";
import React, { useState } from "react";
import Link from "next/link";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button, IconButton } from "@mui/material";
import { Close, Menu, Person } from "@mui/icons-material";

const Navbar = () => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSignOut = () => {
    // Clear token logic here, e.g., removing cookies
    document.cookie = "token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    router.push("/signin");
  };

  return (
    <nav className={`flex items-center justify-between p-4 h-max text-[#f96982] shadow-md sticky top-0 z-10 bg-white ${!isMenuOpen && "overflow-hidden"}`}>
      <div className="flex gap-20">
        {/* Left Section: Logo */}

        <Link href="/" className="h-12">
          <Image src="/logo/logo.png" alt="Logo" width={100} height={100} />
        </Link>

        {/* Middle Section: Navigation Links */}
        <ul className="flex items-center gap-6 text-lg font-semibold max-[750px]:hidden">
        <li className="border-b-2 border-transparent hover:border-[#f96982] mt-2 cursor-pointer">
            <Link href="/">Home</Link>
          </li>
          <li className="border-b-2 border-transparent hover:border-[#f96982] mt-2 cursor-pointer">
            <Link href="/create-event">Create Event</Link>
          </li>
          <li className="border-b-2 border-transparent hover:border-[#f96982] mt-2 cursor-pointer">
            <Link href="/bookings">Bookings</Link>
          </li>
          <li className="border-b-2 border-transparent hover:border-[#f96982] mt-2 cursor-pointer">
            <Link href="/pass-scan">Scan Pass</Link>
          </li>
        </ul>
      </div>

      {/* Right Section: User Info and Sign Out */}
      <div className="flex items-center gap-4">
        <div className="max-[750px]:hidden">
        <Button
            color="error"
            variant="outlined"
            onClick={() => {
              handleSignOut();
            }}
          >
            Sign Out
          </Button>
        </div>
        <div className="min-[750px]:hidden">
        <IconButton onClick={()=>{
          setIsMenuOpen(true);
        }}
        className="min-[750px]:hidden"
          color="secondary"
          >
            <Menu />
          </IconButton>
          </div>
      </div>
      <div className="absolute top-0 right-0 ">
        <div className={`${isMenuOpen ? "flex" : "hidden"}  transition-all duration-100 w-screen opacity-30 absolute top-0 h-screen bg-red-900 right-0`}></div>
        <div className={`${isMenuOpen ? "right-0" : "right-[-300px]"} z-10 absolute top-0 transition-all duration-300 bg-white w-60 h-screen !opacity-100 p-4`}>
          {/* close button  */}
          <div className="flex justify-between">
            <div className="flex items-center gap-4">
              <Person />
              <span className="hidden sm:inline">John Doe</span>
            </div>
            <div className="flex justify-end">
              <IconButton
                color="secondary"
                onClick={() => setIsMenuOpen(false)}
              >
                <Close />
              </IconButton>
            </div>
          </div>
          <hr className="my-4" />
          <ul className="text-xl font-semibold text-blue-500">
          <li className="border-b-2 border-transparent mt-2 cursor-pointer">
              <Link href="/">Home</Link>
            </li>
            <li className="border-b-2 border-transparent mt-2 cursor-pointer">
              <Link href="/create-event">Create Event</Link>
            </li>
            <li className="border-b-2 border-transparent mt-2 cursor-pointer">
              <Link href="/bookings">Bookings</Link>
            </li>
            <li className="border-b-2 border-transparent mt-2 cursor-pointer">
              <Link href="/pass-scan">Scan Pass</Link>
            </li>
          </ul>
          <div className="mt-10 flex justify-center">
          <Button
            color="error"
            variant="outlined"
            onClick={() => {
              // remove token from cookies and redirect to signin page
              handleSignOut();
            }}
          >
            Sign Out
          </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
