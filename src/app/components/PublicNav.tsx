"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";

const PublicNav = () => {

  return (
    <div className="bg-black h-16 shadow-inner md:h-20 flex items-center justify-between px-4 md:pl-7">
      <div className="flex-shrink-0 !h-11">
        <Link href="/">
          {/* <img
            src="/public/logo/logo.png"
            alt="Event Pulse Logo"
            className="object-scale-down h-8 w-[8.8rem] xs:h-12 xs:w-[13.1rem]
                    transition-all duration-300 hover:scale-110 "
          /> */}
          <Image src="/logo/logo.png" alt="Logo" width={80} height={80} />
        </Link>
      </div>
      <div className="block md:hidden">
        <button className="text-white text-2xl">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
      </div>
      <div className="hidden md:flex space-x-8 text-white">
        <Link
          className="inline-flex items-center px-1 pt-1 border-b-2 leading-5 transition duration-150 ease-in-out focus:outline-none border-white focus:border-[#001858] "
          href="https://www.event-pulse.com/"
        >
          Home
        </Link>
        <Link
          className="inline-flex items-center px-1 pt-1 border-b-2 leading-5 transition duration-150 ease-in-out focus:outline-none border-transparent focus:text-gray-700 focus:border-gray-300 "
          href="/about-us"
        >
          About Us
        </Link>
        <Link
          className="inline-flex items-center px-1 pt-1 border-b-2 leading-5 transition duration-150 ease-in-out focus:outline-none border-transparent focus:text-gray-700 focus:border-gray-300 "
          href="/contact-us"
        >
          Contact Us
        </Link>
      </div>
      <Link
        className="inline-flex items-center px-1 pt-1 border-b-2 leading-5 transition duration-150 ease-in-out focus:outline-none border-transparent focus:text-gray-700 focus:border-gray-300 hidden md:block"
        href="/auth"
      >
        <button
          type="submit"
          className="transition px-3 ease-in-out duration-150 text-center py-1 bg-blue-900 hover:bg-pink-400 text-white border-[2px] border-white py-1.5 px-8 rounded-md"
        >
          Partner Login
        </button>
      </Link>
    </div>
  );
};

export default PublicNav;
