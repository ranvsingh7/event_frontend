import { apiRequest } from '@/utils/api';
import { SelectChangeEvent, TextField } from '@mui/material';
import React, { ChangeEvent, FormEvent, useState } from 'react';
import toast from 'react-hot-toast';

interface FormDataSignup {
    name: string;
    email: string;
    mobile: string;
    password: string;
    username: string;
    userType: "user" | "admin";
}

interface SignupProps {
    onSuccess: () => void;
}

const Signup: React.FC<SignupProps> = ({ onSuccess }) => {
    const [formDataSignup, setFormDataSignup] = useState<FormDataSignup>({
        name: "",
        email: "",
        mobile: "",
        password: "",
        username: "",
        userType: "user",
    });
    const [loading, setLoading] = useState<boolean>(false);

    const handleChangeSignup = (
        e: ChangeEvent<HTMLInputElement | { name?: string; value: unknown }> | SelectChangeEvent<"user" | "admin">
    ) => {
        const { name, value } = e.target;
        setFormDataSignup({ ...formDataSignup, [name as string]: value });
    };

    const handleSubmitSignup = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const result = await apiRequest<{ message: string }>("/api/auth/signup", "POST", formDataSignup);
            toast.success(result.message);
            setLoading(false);
            onSuccess();
            setFormDataSignup({
                name: "",
                email: "",
                mobile: "",
                password: "",
                username: "",
                userType: "user",
            });
        } catch (err: any) {
            toast.error(err.message);
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center rounded-xl bg-gray-100">
            <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
                <h1 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Register</h1>
                <form onSubmit={handleSubmitSignup} className="space-y-4">
                    <div>
                        <TextField
                            label="Name"
                            name="name"
                            value={formDataSignup.name}
                            onChange={handleChangeSignup}
                            fullWidth
                            required
                            className="border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <TextField
                            label="Email"
                            name="email"
                            type="email"
                            value={formDataSignup.email}
                            onChange={handleChangeSignup}
                            fullWidth
                            required
                            className="border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <TextField
                            label="Mobile"
                            name="mobile"
                            value={formDataSignup.mobile}
                            onChange={handleChangeSignup}
                            fullWidth
                            required
                            className="border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <TextField
                            label="Password"
                            name="password"
                            type="password"
                            value={formDataSignup.password}
                            onChange={handleChangeSignup}
                            fullWidth
                            required
                            className="border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-2 px-4 text-white font-semibold rounded-md shadow-md transition ${
                            loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                        }`}
                    >
                        {loading ? "Registering..." : "Register"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Signup;
