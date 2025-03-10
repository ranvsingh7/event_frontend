"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { apiRequest } from "../../../utils/api";
import { TextField, Button, MenuItem, Select, InputLabel, FormControl, SelectChangeEvent, Typography } from "@mui/material";
import toast from "react-hot-toast";

interface FormData {
    name: string;
    email: string;
    mobile: string;
    password: string;
    username: string;
    userType: "user" | "admin";
}

export default function Signup() {
    const [formData, setFormData] = useState<FormData>({
        name: "",
        email: "",
        mobile: "",
        password: "",
        username: "",
        userType: "user",
    });

    // handleChange to accept both input and select changes
    const handleChange = (
        e: ChangeEvent<HTMLInputElement | { name?: string; value: unknown }> | SelectChangeEvent<"user" | "admin">
    ) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name as string]: value });
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        try {
            const result = await apiRequest<{ message: string }>("/api/auth/signup", "POST", formData);
            toast.success(result.message);
            window.location.href = "/signin"; // Redirect to signin page
            // clear form data
            setFormData({
                name: "",
                email: "",
                mobile: "",
                password: "",
                username: "",
                userType: "user",
            });
        } catch (err: any) {
            toast.error(err.message);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4 w-96">
                <h2 className="text-xl font-bold text-center text-slate-700">Signup</h2>
                
                <TextField
                    label="Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    fullWidth
                    required
                />
                
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
                    label="Mobile"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    fullWidth
                    required
                />
                
                <TextField
                    label="Username"
                    name="username"
                    value={formData.username}
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

                <FormControl fullWidth>
                    <InputLabel>User Type</InputLabel>
                    <Select
                        name="userType"
                        value={formData.userType}
                        onChange={handleChange}
                        label="User Type"
                    >
                        <MenuItem value="user">User</MenuItem>
                        <MenuItem value="admin">Admin</MenuItem>
                    </Select>
                </FormControl>

                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 2 }}
                >
                    Sign Up
                </Button>

                <Typography variant="body2" className="text-center text-slate-700">
                    Already have an account? <a href="/signin" className="text-blue-500">Sign In</a>
                </Typography>
            </form>
        </div>
    );
}
