"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { apiRequest } from "../../utils/api";
import { TextField, Button, CircularProgress, Typography } from "@mui/material";
import toast from "react-hot-toast";

interface FormData {
    email: string;
    password: string;
}

export default function Signin() {
    const [formData, setFormData] = useState<FormData>({
        email: "",
        password: "",
    });
    const [loading, setLoading] = useState<boolean>(false);

    // handleChange to update formData state
    const handleChange = (e: ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name as string]: value });
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const result = await apiRequest<{ message: string; token: string }>("/api/auth/signin", "POST", formData);
            toast.success(result.message);
            document.cookie = `token=${result.token}; path=/;`;
            window.location.href = "/"; // Redirect to homepage
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4 w-96">
                <h2 className="text-xl text-center font-bold text-slate-700">Sign-In</h2>
                {/* {error && <p className="text-red-500">{error}</p>} */}
                {/* {success && <p className="text-green-500">{success}</p>} */}
                
                <TextField
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    fullWidth
                    required
                />
                
                <TextField
                    label="Password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    fullWidth
                    required
                />
                
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 2 }}
                    disabled={loading}
                >
                    {loading ? <CircularProgress size={24} /> : "Sign In"}
                </Button>
                <Typography variant="body2" className="text-center text-slate-700">
                    Don't have an account? <a href="/signup" className="text-blue-500">Sign Up</a>
                </Typography>
            </form>
        </div>
    );
}
