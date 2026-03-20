"use client";
import React, { useState } from "react";
import Link from "next/link";
import Logo from "@/../public/new-logo.png"

import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button, IconButton, Menu, MenuItem } from "@mui/material";
import {
  AddCircleOutline,
  Close,
  ContactMail,
  Dashboard,
  EventNote,
  ExpandMore,
  Gavel,
  Home,
  Logout,
  Menu as MenuIcon,
  Public,
  QrCodeScanner,
  ReceiptLong,
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

  const primaryLinks = [
    { href: "/dashboard", label: "Dashboard", icon: <Dashboard fontSize="small" /> },
    { href: "/create-event", label: "Create Event", icon: <AddCircleOutline fontSize="small" /> },
    { href: "/bookings", label: "Bookings", icon: <EventNote fontSize="small" /> },
    { href: "/pass-scan", label: "Scan Pass", icon: <QrCodeScanner fontSize="small" /> },
    { href: "/events", label: "Explore Events", icon: <Public fontSize="small" /> },
  ];

  const moreLinks = [
    { href: "/contact-us", label: "Contact Us", icon: <ContactMail fontSize="small" /> },
    { href: "/terms-and-condition", label: "Terms & Condition", icon: <Gavel fontSize="small" /> },
    { href: "/refund-and-cancellation", label: "Refund & Cancellation", icon: <ReceiptLong fontSize="small" /> },
  ];

  return (
    <nav
      className={`sticky top-0 z-[1000] flex h-max items-center justify-between border-b border-cyan-300/20 bg-[#0b1220]/95 p-4 text-cyan-100 shadow-md backdrop-blur-md ${
        !isMenuOpen && "overflow-hidden"
      }`}
    >
      <div className="flex items-center gap-6 lg:gap-20">
        {/* Left Section: Logo */}

        <Link href="/dashboard" className="h-12">
          <Image src={Logo} alt="Logo" width={100} height={50} className="h-[50px]" />
        </Link>

        {/* Middle Section: Navigation Links */}
        <ul className="flex items-center gap-4 text-sm font-semibold max-[880px]:hidden">
          {primaryLinks.map((item) => (
            <li key={item.href} className="cursor-pointer">
              <Link
                href={item.href}
                className="inline-flex items-center gap-1.5 rounded-full border border-transparent px-3 py-1.5 tracking-[0.08em] text-slate-100 transition-all duration-200 hover:border-cyan-300/50 hover:bg-cyan-400/10 hover:text-cyan-200"
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
          <div>
            <Button
              sx={{ textTransform: "none" }}
              id="basic-button"
              variant="text"
              disableRipple
              aria-controls={open ? "basic-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={handleClick}
              size="large"
              style={{
                color: "#cbd5e1",
                marginTop: "2px",
                fontWeight: 700,
                fontSize: "14px",
                letterSpacing: "0.08em",
              }}
            >
              More <ExpandMore />
            </Button>
            
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              PaperProps={{
                sx: {
                  borderRadius: "14px",
                  border: "1px solid rgba(6,182,212,0.25)",
                  background: "linear-gradient(145deg, #0b1220 0%, #15112a 100%)",
                  color: "#e2e8f0",
                },
              }}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
            >
              {moreLinks.map((item) => (
                <MenuItem key={item.href} onClick={handleClose}>
                  <Link href={item.href} className="inline-flex items-center gap-2 text-sm font-semibold text-slate-100">
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                </MenuItem>
              ))}
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
            startIcon={<Logout fontSize="small" />}
            className="!rounded-full !border-red-400/60 !px-4 !text-xs !font-semibold !tracking-[0.1em] !text-red-300"
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
          } z-10 absolute top-0 h-screen w-[290px] bg-gradient-to-b from-[#0b1220] to-[#15112a] p-4 !opacity-100 transition-all duration-300`}
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
          <hr className="my-4 border-cyan-200/20" />
          <ul className="space-y-2 text-sm font-semibold text-slate-100">
            <li className="cursor-pointer">
              <Link href="/" className="inline-flex w-full items-center gap-2 rounded-xl px-2 py-2 tracking-[0.08em] hover:bg-cyan-400/10" onClick={() => setIsMenuOpen(false)}>
                <Home fontSize="small" /> Home
              </Link>
            </li>
            {primaryLinks
              .filter((item) => item.href !== "/dashboard")
              .map((item) => (
                <li key={item.href} className="cursor-pointer">
                  <Link href={item.href} className="inline-flex w-full items-center gap-2 rounded-xl px-2 py-2 tracking-[0.08em] hover:bg-cyan-400/10" onClick={() => setIsMenuOpen(false)}>
                    {item.icon} {item.label}
                  </Link>
                </li>
              ))}
            {moreLinks.map((item) => (
              <li key={item.href} className="cursor-pointer">
                <Link href={item.href} className="inline-flex w-full items-center gap-2 rounded-xl px-2 py-2 tracking-[0.08em] hover:bg-cyan-400/10" onClick={() => setIsMenuOpen(false)}>
                  {item.icon} {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-10 flex justify-center">
            <Button
              color="error"
              variant="outlined"
              startIcon={<Logout fontSize="small" />}
              className="!rounded-full !border-red-400/60 !px-4 !text-xs !font-semibold !tracking-[0.1em] !text-red-300"
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
