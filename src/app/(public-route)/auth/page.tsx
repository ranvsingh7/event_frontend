"use client";

import { useState } from "react";
import Login from "./components/Login";
import Signup from "./components/Signup";

export default function Signin() {
    const [isLogin, setIsLogin] = useState<boolean>(true);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-indigo-600 p-6">
            {/* Header */}
            <h1 className="text-3xl font-bold text-white mb-6">Welcome to PaperLess</h1>
            

            {/* Toggle Button */}
            <div className="flex space-x-4 mb-8">
                <button
                    className={`px-6 py-2 rounded-full text-lg font-semibold transition ${
                        isLogin
                            ? "bg-white text-blue-600 shadow-md"
                            : "bg-transparent border border-white text-white hover:bg-white hover:text-blue-600"
                    }`}
                    onClick={() => setIsLogin(true)}
                >
                    Login
                </button>
                <button
                    className={`px-6 py-2 rounded-full text-lg font-semibold transition ${
                        !isLogin
                            ? "bg-white text-blue-600 shadow-md"
                            : "bg-transparent border border-white text-white hover:bg-white hover:text-blue-600"
                    }`}
                    onClick={() => setIsLogin(false)}
                >
                    Signup
                </button>
            </div>

            {/* Form Container */}
            <div className="w-full max-w-md transform transition duration-300">
                {isLogin ? (
                    <Login />
                ) : (
                    <Signup onSuccess={() => setIsLogin(true)} />
                )}
            </div>
        </div>
    );
}
