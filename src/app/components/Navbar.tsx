"use client";
import React from "react";
import Link from "next/link";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@mui/material";

const Navbar = () => {
  const router = useRouter();

  const handleSignOut = () => {
    // Clear token logic here, e.g., removing cookies
    document.cookie = "token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    router.push("/signin");
  };


  return (
    <nav className="flex items-center justify-between p-4 bg-badge h-max text-[#f96982] shadow-md">
      <div className="flex gap-20">
        {/* Left Section: Logo */}
      
        <Link href="/" className="h-12">
            <Image src="/logo/logo.png" alt="Logo" width={100} height={100} />
        </Link>

      {/* Middle Section: Navigation Links */}
      <ul className="flex items-center gap-6 text-lg font-semibold">
        <li className="border-b-2 border-transparent hover:border-[#f96982] mt-2 cursor-pointer">
          <Link href="/create-event">
            Create Event
          </Link>
        </li>
        <li className="border-b-2 border-transparent hover:border-[#f96982] mt-2 cursor-pointer">
          <Link href="/bookings">
            Bookings
          </Link>
        </li>
        <li className="border-b-2 border-transparent hover:border-[#f96982] mt-2 cursor-pointer">
          <Link href="/pass-scan">
            Scan Pass
          </Link>
        </li>
      </ul>
      </div>

      {/* Right Section: User Info and Sign Out */}
      <div className="flex items-center gap-4">
        {/* User Info Dropdown */}
        {/* <Menu>
          <MenuButton className="flex items-center gap-2 cursor-pointer">
            <img
              src="/user-avatar.png" 
              alt="User Avatar"
              className="w-8 h-8 rounded-full border border-white"
            />
            <span className="hidden sm:inline">John Doe</span> 
          </MenuButton>
          <MenuItem onClick={() => router.push("/profile")}>Profile</MenuItem>
          <MenuItem onClick={handleSignOut}>Sign Out</MenuItem>
        </Menu> */}
        <Button onClick={()=>{
            // remove token from cookies and redirect to signin page
            handleSignOut();
        }}>
            Sign Out
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;