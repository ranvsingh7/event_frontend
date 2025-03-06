"use client";

import { useState } from "react";
import "./signin.css";
import Login from "./components/Login";
import Signup from "./components/Signup";

export default function Signin() {
    const [active, setActive] = useState<boolean>(false);


    return (
        <div className={`container ${active ? "active" : ""}`}>
            <Login />
            <Signup onSuccess={()=>setActive(false)}/>

          <div className="toggle-box">
              <div className="toggle-panel toggle-left">
                  <h1>Hello, Welcome!</h1>
                  <p>Don't have an account?</p>
                  <button className="btn register-btn" onClick={()=>setActive(true)}>Register</button>
              </div>

              <div className="toggle-panel toggle-right">
                  <h1>Welcome Back!</h1>
                  <p>Already have an account?</p>
                  <button className="btn login-btn" onClick={()=>setActive(false)}>Login</button>
              </div>
          </div>

        </div>
    );
}
