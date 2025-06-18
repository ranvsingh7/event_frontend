"use client";
import React, { useState } from "react";
import Link from "next/link";
import Logo from "@/../public/new-logo.png"

import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button, IconButton, Menu, MenuItem } from "@mui/material";
import {
  Close,
  ExpandMore,
  Menu as MenuIcon,
} from "@mui/icons-material";

const Navbar = () => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSignOut = () => {
    // Clear token logic here, e.g., removing cookies
    document.cookie = "token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    router.push("/signin");
  };

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <nav
      className={`flex items-center justify-between bg-gray-900 p-4 h-max text-[#f96982] shadow-md sticky top-0 z-[1000] bg-gray-900 ${
        !isMenuOpen && "overflow-hidden"
      }`}
    >
      <div className="flex gap-20">
        {/* Left Section: Logo */}

        <Link href="/dashboard" className="h-12">
          <Image src={Logo} alt="Logo" width={100} height={50} className="h-[50px]" />
        </Link>

        {/* Middle Section: Navigation Links */}
        <ul className="flex items-center gap-6 text-lg font-semibold max-[880px]:hidden">
          <li className="border-b-2 border-transparent hover:border-[#f96982] mt-2 cursor-pointer">
            <Link href="/dashboard">Dashboard</Link>
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
          <div>
            <Button
            sx={{ textTransform: 'none' }}
              id="basic-button"
              variant="text"
              disableRipple
              aria-controls={open ? "basic-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={handleClick}
              size="large"
              style={{
                color: "#f96982",
                marginTop: "6px",
                fontWeight:600,
                fontSize:"18px"
              }}
            >
              More <ExpandMore />
            </Button>
            
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
            >
              <MenuItem onClick={handleClose}><Link href="/contact-us">Contact Us</Link></MenuItem>
              <MenuItem onClick={handleClose}><Link href="/terms-and-condition">Terms and Condition</Link></MenuItem>
              <MenuItem onClick={handleClose}><Link href="/refund-and-cancellation">Refund and Cancellation</Link></MenuItem>
            </Menu>
          </div>
        </ul>
      </div>

      {/* Right Section: User Info and Sign Out */}
      <div className="flex items-center gap-4">
        <div className="max-[880px]:hidden">
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
        <div className="min-[880px]:hidden">
          <IconButton
            onClick={() => {
              setIsMenuOpen(true);
            }}
            className="min-[880px]:hidden"
            color="secondary"
          >
            <MenuIcon />
          </IconButton>
        </div>
      </div>
      <div className="absolute top-0 right-0 ">
        <div
          className={`${
            isMenuOpen ? "flex" : "hidden"
          }  transition-all duration-100 w-screen opacity-30 absolute top-0 h-screen bg-red-900 right-0`}
        ></div>
        <div
          className={`${
            isMenuOpen ? "right-0" : "right-[-300px]"
          } z-10 absolute top-0 transition-all duration-300 bg-white w-[270px] h-screen !opacity-100 p-4`}
        >
          {/* close button  */}
          <div className="flex justify-between">
            <div className="flex items-center gap-4">
              {/* <Person />
              <span className="hidden sm:inline">John Doe</span> */}
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
            <li className="border-b-2 border-transparent mt-2 cursor-pointer">
              <Link href="/contact-us">Contact Us</Link>
            </li>
            <li className="border-b-2 border-transparent mt-2 cursor-pointer">
              <Link href="/terms-and-condition">Terms and Condition</Link>
            </li>
            <li className="border-b-2 border-transparent mt-2 cursor-pointer">
              <Link href="/refund-and-cancellation">Refund and Cancellation</Link>
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
