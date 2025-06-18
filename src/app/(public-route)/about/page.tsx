"use client";
import React from 'react';

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex items-center justify-center p-6">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-lg w-full max-w-4xl space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold mb-4">About Us</h1>
          <p className="text-sm text-gray-300">Updated on 10-03-2025 17:25:45</p>
        </div>

        <div className="space-y-6 text-gray-300">
          <p>
            Welcome to <span className="text-yellow-400 font-bold">Paperless Ticket</span>, your ultimate destination for managing and exploring events seamlessly. 
            Our mission is to revolutionize the event experience by bringing simplicity, convenience, and efficiency to event management.
          </p>
          <p>
            Whether you're an attendee looking to discover exciting events or a host aiming to create memorable experiences, our platform offers an intuitive and comprehensive solution. 
            With Paperless Ticket, you can focus on what truly matters – the event itself.
          </p>

          <h2 className="text-xl font-semibold text-white">Our Vision:</h2>
          <p>
            We envision a world where event planning and participation are hassle-free, eco-friendly, and accessible to everyone. 
            By eliminating paper tickets and streamlining processes, we aim to contribute to a more sustainable future while enhancing the user experience.
          </p>

          <h2 className="text-xl font-semibold text-white">Our Mission:</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Provide an easy-to-use platform for both event attendees and organizers.</li>
            <li>Promote sustainability by adopting paperless solutions.</li>
            <li>Foster a community of event enthusiasts who can connect, share, and grow together.</li>
          </ul>

          <h2 className="text-xl font-semibold text-white">Why Choose Us?</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <span className="text-yellow-400 font-bold">User-Friendly Design:</span> Navigate effortlessly with our intuitive interface.
            </li>
            <li>
              <span className="text-yellow-400 font-bold">Comprehensive Features:</span> From exploring to hosting events, we cover it all.
            </li>
            <li>
              <span className="text-yellow-400 font-bold">Eco-Conscious:</span> Contribute to a sustainable future by going paperless.
            </li>
            <li>
              <span className="text-yellow-400 font-bold">Reliable Support:</span> We're here to assist you at every step of the way.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
