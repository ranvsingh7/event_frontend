"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { apiRequest } from "../../utils/api";
import { TextField, Button, CircularProgress } from "@mui/material";

interface FormData {
    email: string;
    password: string;
}

export default function Signin() {
    const [formData, setFormData] = useState<FormData>({
        email: "",
        password: "",
    });
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [success, setSuccess] = useState<string | null>(null);

    // handleChange to update formData state
    const handleChange = (e: ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name as string]: value });
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setLoading(true);

        try {
            const result = await apiRequest<{ message: string; token: string }>("/api/auth/signin", "POST", formData);
            setSuccess(result.message);
            // Optionally, redirect user or store token in localStorage
            localStorage.setItem("token", result.token);
            window.location.href = "/"; // Redirect to homepage
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4 w-96">
                <h2 className="text-xl font-bold">Signin</h2>
                {error && <p className="text-red-500">{error}</p>}
                {success && <p className="text-green-500">{success}</p>}
                
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
            </form>
        </div>
    );
}
