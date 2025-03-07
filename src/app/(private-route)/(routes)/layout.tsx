import React from "react";
import Navbar from "../../components/Navbar";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
      <main className="bg-gradient-to-r from-[#e78af7] via-[#fdefff] to-[#ffb8b8] h-screen">
        <Navbar />
        {/* <img className="absolute inset-0 w-full h-full object-cover" alt="background"  src="https://res.cloudinary.com/dsluib7tj/image/upload/f_auto/q_auto/v1/event-pulse/bg_eventabout_dxvzgf?_a=DAJCwlWIZAA0" /> */}
      {/* <div className="absolute inset-0 bg-gradient-to-r from-[#e78af7] via-[#fdefff] to-[#ffb8b8]"></div> */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/60 to-blue-900/60"></div>
            <div className="absolute inset z-10 w-full">
            {children}
            </div>
      </main>
  );
};

export default Layout;
