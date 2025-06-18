"use client";
import React from 'react';

const Services = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex items-center justify-center p-6">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-lg w-full max-w-4xl space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold mb-4">Our Services</h1>
          <p className="text-sm text-gray-300">Updated on 10-03-2025 17:30:15</p>
        </div>

        <div className="space-y-6 text-gray-300">
          <p>
            At <span className="text-yellow-400 font-bold">Paperless Ticket</span>, we offer a wide range of services tailored to enhance your event experience. 
            Whether you're an attendee, an event organizer, or a business, we provide solutions that cater to your specific needs.
          </p>

          <h2 className="text-xl font-semibold text-white">What We Offer:</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <span className="text-yellow-400 font-bold">Event Discovery:</span> Explore a variety of events near you, from concerts and conferences to workshops and meetups.
            </li>
            <li>
              <span className="text-yellow-400 font-bold">Seamless Ticketing:</span> Purchase tickets effortlessly through our platform and enjoy a hassle-free experience.
            </li>
            <li>
              <span className="text-yellow-400 font-bold">Event Hosting:</span> Create, promote, and manage your events with our comprehensive tools and features.
            </li>
            <li>
              <span className="text-yellow-400 font-bold">Analytics & Insights:</span> Gain valuable insights into event performance, attendee engagement, and ticket sales.
            </li>
            <li>
              <span className="text-yellow-400 font-bold">Custom Branding:</span> Personalize your event page with your unique branding to stand out.
            </li>
            <li>
              <span className="text-yellow-400 font-bold">Customer Support:</span> Access dedicated support to resolve any issues quickly and efficiently.
            </li>
          </ul>

          <h2 className="text-xl font-semibold text-white">Who Can Benefit?</h2>
          <p>
            Our platform is designed to serve a diverse range of users:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><span className="text-yellow-400 font-bold">Event Enthusiasts:</span> Discover exciting events and book tickets effortlessly.</li>
            <li><span className="text-yellow-400 font-bold">Event Organizers:</span> Manage your events with ease and reach a larger audience.</li>
            <li><span className="text-yellow-400 font-bold">Businesses:</span> Leverage our platform to host corporate events, workshops, and more.</li>
          </ul>

          <h2 className="text-xl font-semibold text-white">Why Choose Us?</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><span className="text-yellow-400 font-bold">Comprehensive Tools:</span> From ticketing to analytics, we've got it all.</li>
            <li><span className="text-yellow-400 font-bold">Eco-Friendly:</span> Go green with our paperless solutions.</li>
            <li><span className="text-yellow-400 font-bold">User-Centric Design:</span> Enjoy a seamless and intuitive experience.</li>
            <li><span className="text-yellow-400 font-bold">Scalable Solutions:</span> Whether it's a small meetup or a large conference, we’ve got you covered.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Services;
