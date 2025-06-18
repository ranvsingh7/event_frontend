// "use client";
// import Link from "next/link";
// import React, { useEffect, useState } from "react";

// const Home = () => {
//     const [activeIndex, setActiveIndex] = useState(1); // Start with the middle box active

//   useEffect(() => {
//     const Interval = setInterval(() => {
//       setActiveIndex((prevIndex) => (prevIndex % 3) + 1); // Cycle through 1, 2, 3
//     }, 3000);

//     return () => clearInterval(Interval); // Cleanup interval on component unmount
//   }, []);

//   const boxClasses = (index:number) =>
//     `transform transition-all duration-500 w-full max-w-md ${
//       activeIndex === index
//         ? "scale-99 opacity-100 translate-x-0"
//         : "scale-95 opacity-50 translate-x-8"
//     }`;
//   return (
//     <div className="bg-black h-screen">
//       <div className="h-full flex flex-col xl:flex-row items-center justify-center xl:justify-between max-w-7xl mx-auto !px-6">
//         <div className="w-full xl:w-[45%] text-center xl:text-left space-y-6">
//           <h1 className="text-3xl xs:text-4xl md:text-6xl font-extrabold leading-tight">
//             <span className="bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent">
//               Plan, Participate,
//             </span>
//             <br />
//             <span className="text-white">And Vote with Ease</span>
//           </h1>
//           <p className="text-gray-300 text-lg md:text-xl leading-relaxed">
//             Discover and engage with events like never before! Join Event-Pulse
//             and be part of the action.
//           </p>
//           <div className="flex flex-wrap xs:flex-nowrap mt-8 justify-center xl:justify-start gap-4 xs:gap-6">
//               <Link href="/events">
//             <button
//               type="button"
//               className="transition px-3 ease-in-out duration-150 text-center py-1 bg-pink-500 border hover:bg-pink-400 font-extrabold text-lg px-8 w-full sm:w-auto xs:px-2 sm:px-9 relative overflow-hidden transition rounded ease-in-out duration-150 text-center py-3"
//             >
//               <span className="relative z-10 text-white">Explore Events</span>
//               <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-pink-400 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
//             </button>
//               </Link>
//             <Link
//               className="transition px-3 rounded ease-in-out duration-150 text-center py-1 bg-transparent border border-white hover:bg-blue-600 font-extrabold text-lg px-8 w-full sm:w-auto xs:px-2 sm:px-9 relative overflow-hidden transition rounded ease-in-out duration-150 text-center py-2"
//               href="/auth"
//             >
//               <button
//                 type="button"
//                 className="transition px-3 ease-in-out duration-150 text-center py-1 "
//               >
//                 <span className="relative z-10 text-white">Host Events</span>
//                 <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-400 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
//               </button>
//             </Link>
//           </div>
//           <div className="xs:block text-5xl md:text-6xl font-extrabold mt-12">
//             <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-violet-500 bg-clip-text text-transparent animate-pulse">
//               GET STARTED
//             </span>
//           </div>
//         </div>
//         <div className="hidden xl:flex flex-col justify-center items-end w-[45%] gap-4 -mt-3 mr-7">
//       {/* Box 1 */}
//       <div className={boxClasses(1)}>
//         <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20 hover:border-pink-500/50 transition-colors">
//           <div className="flex items-center gap-5">
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               width="24"
//               height="24"
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="2"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               className="lucide lucide-calendar w-10 h-10 text-pink-500"
//             >
//               <path d="M8 2v4"></path>
//               <path d="M16 2v4"></path>
//               <rect width="18" height="18" x="3" y="4" rx="2"></rect>
//               <path d="M3 10h18"></path>
//             </svg>
//             <div>
//               <h3 className="text-white text-xl font-semibold">Events Hosted</h3>
//               <p className="text-xl font-bold text-pink-500">10+</p>
//             </div>
//           </div>
//           <p className="text-white/80 mt-3 text-lg">
//             Successful events organized
//           </p>
//         </div>
//       </div>

//       {/* Box 2 */}
//       <div className={boxClasses(2)}>
//         <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20 hover:border-pink-500/50 transition-colors">
//           <div className="flex items-center gap-5">
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               width="24"
//               height="24"
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="2"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               className="lucide lucide-users w-10 h-10 text-pink-500"
//             >
//               <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
//               <circle cx="9" cy="7" r="4"></circle>
//               <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
//               <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
//             </svg>
//             <div>
//               <h3 className="text-white text-xl font-semibold">Active Users</h3>
//               <p className="text-xl font-bold text-pink-500">10+</p>
//             </div>
//           </div>
//           <p className="text-white/80 mt-3 text-lg">Growing community</p>
//         </div>
//       </div>

//       {/* Box 3 */}
//       <div className={boxClasses(3)}>
//         <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20 hover:border-pink-500/50 transition-colors">
//           <div className="flex items-center gap-5">
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               width="24"
//               height="24"
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="2"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               className="lucide lucide-award w-10 h-10 text-pink-500"
//             >
//               <path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526"></path>
//               <circle cx="12" cy="8" r="6"></circle>
//             </svg>
//             <div>
//               <h3 className="text-white text-xl font-semibold">Success Rate</h3>
//               <p className="text-xl font-bold text-pink-500">98%</p>
//             </div>
//           </div>
//           <p className="text-white/80 mt-3 text-lg">
//             Satisfaction guaranteed
//           </p>
//         </div>
//       </div>
//     </div>
//       </div>
//     </div>
//   );
// };

// export default Home;
"use client";
import Link from "next/link";
import React from "react";

const Home = () => {
  return (
    <div className="h-screen bg-gradient-to-b from-gray-900 to-black text-white flex items-center justify-center">
      <div className="text-center max-w-lg space-y-8 p-6">
        <h1 className="text-5xl font-extrabold">
          Welcome to <span className="text-yellow-400">Paperless Ticket</span>.
        </h1>
        <p className="text-gray-300 text-lg">
          Seamlessly manage and explore events with our platform. Whether you're here to discover exciting events or host your own, we've got you covered!
        </p>
        <div className="flex justify-center space-x-6">
          <Link href="/events">
            <button
              type="button"
              className="bg-pink-500 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-pink-600 transition-all duration-200"
            >
              Explore Events
            </button>
          </Link>
          <Link href="/auth">
            <button
              type="button"
              className="bg-blue-500 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-blue-600 transition-all duration-200"
            >
              Host Events
            </button>
          </Link>
        </div>
        <div className="mt-8">
          <p className="text-gray-400 text-sm">
            Need help?{" "}
            <Link href="/contact-us">
              <span className="text-yellow-400 font-semibold cursor-pointer hover:underline">
                Contact Support
              </span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;


