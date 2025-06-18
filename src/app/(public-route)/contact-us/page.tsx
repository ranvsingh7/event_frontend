"use client";
import React from 'react';
import { useRouter } from 'next/navigation';

const ContactUs = () => {
  const router = useRouter(); // Next.js App Router navigation hook

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex items-center justify-center p-6">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-lg w-full max-w-3xl space-y-6">
        <button
          onClick={() => router.back()} // Use Next.js App Router's back method
          className="bg-yellow-400 text-black font-semibold px-4 py-2 rounded-md shadow-md hover:bg-yellow-500 transition-all duration-300"
        >
          ← Back
        </button>
        <div className="text-center">
          <h1 className="text-4xl font-extrabold mb-2">Contact Us</h1>
          <p className="text-gray-300 text-sm">Last updated on 10-03-2025 17:17:33</p>
        </div>

        <div className="space-y-6">
          <div className="flex justify-between items-start border-b border-gray-700 pb-4">
            <h2 className="text-lg font-semibold text-gray-200">Merchant Legal Entity Name:</h2>
            <p className="text-gray-400">RANVEER</p>
          </div>

          <div className="flex justify-between items-start border-b border-gray-700 pb-4">
            <h2 className="text-lg font-semibold text-gray-200">Registered Address:</h2>
            <p className="text-gray-400">
              Plot No.109, Prem Nagar, Digadi Kallan, Jodhpur, Rajasthan, PIN: 342001
            </p>
          </div>

          <div className="flex justify-between items-start border-b border-gray-700 pb-4">
            <h2 className="text-lg font-semibold text-gray-200">Operational Address:</h2>
            <p className="text-gray-400">
              Plot No.109, Prem Nagar, Digadi Kallan, Jodhpur, Rajasthan, PIN: 342001
            </p>
          </div>

          <div className="flex justify-between items-start border-b border-gray-700 pb-4">
            <h2 className="text-lg font-semibold text-gray-200">Telephone No:</h2>
            <p className="text-gray-400">7877763051</p>
          </div>

          <div className="flex justify-between items-start">
            <h2 className="text-lg font-semibold text-gray-200">E-Mail ID:</h2>
            <p className="text-gray-400">ranvsingh7@gmail.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
