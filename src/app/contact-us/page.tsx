import React from 'react';

const ContactUs = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="p-6 rounded-2xl shadow-md w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Contact Us</h1>
        <p className="text-sm text-gray-500 mb-6">Last updated on 10-03-2025 17:17:33</p>

        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-700">Merchant Legal Entity Name:</h2>
            <p className="text-gray-600">RANVEER</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-700">Registered Address:</h2>
            <p className="text-gray-600">Plot No.109, Prem Nagar, Digadi Kallan, Jodhpur, Rajasthan, PIN: 342001</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-700">Operational Address:</h2>
            <p className="text-gray-600">Plot No.109, Prem Nagar, Digadi Kallan, Jodhpur, Rajasthan, PIN: 342001</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-700">Telephone No:</h2>
            <p className="text-gray-600">7877763051</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-700">E-Mail ID:</h2>
            <p className="text-gray-600">ranvsingh7@gmail.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
