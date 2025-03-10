import { apiRequest } from '@/utils/api';
import { TextField } from '@mui/material';
import React, { ChangeEvent, FormEvent, useState } from 'react'
import toast from 'react-hot-toast';

interface FormData {
    email: string;
    password: string;
}

const Login = () => {
    const [formData, setFormData] = useState<FormData>({
        email: "",
        password: "",
    });
    const [loading, setLoading] = useState<boolean>(false);

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
            window.location.href = "/dashboard";
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };
  return (
    <div className="form-box login">
    <form onSubmit={handleSubmit} >
    <h1 className="font-semibold">Login</h1>
                    <div className="input-box">
                    <TextField
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        fullWidth
                        required
                    />
                    </div>
                    <div className="input-box">
                    <TextField
                        label="Password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        fullWidth
                        required
                    />
                    </div>
                    
                    <button type="submit" disabled={loading} className="btn">Login</button>
                </form>
              </div>
  )
}

export default Login