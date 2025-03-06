import { apiRequest } from '@/utils/api';
import { SelectChangeEvent, TextField } from '@mui/material';
import React, { ChangeEvent, FormEvent, useState } from 'react'
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
    onSuccess: ()=> void
}

const Signup: React.FC<SignupProps> = ({onSuccess}) => {
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
            setLoading(false)
            // setActive(false);
            onSuccess()
            // clear form data
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
    <div className="form-box register">
          <form onSubmit={handleSubmitSignup} >
                <h1 className="font-semibold">Register</h1>
                <div className="input-box">
                <TextField
                    label="Name"
                    name="name"
                    value={formDataSignup.name}
                    onChange={handleChangeSignup}
                    fullWidth
                    required
                />
                </div>
                <div className="input-box">
                <TextField
                    label="Email"
                    name="email"
                    type="email"
                    value={formDataSignup.email}
                    onChange={handleChangeSignup}
                    fullWidth
                    required
                />
                </div>
                <div className="input-box">
                <TextField
                    label="Mobile"
                    name="mobile"
                    value={formDataSignup.mobile}
                    onChange={handleChangeSignup}
                    fullWidth
                    required
                />
                </div>
                <div className="input-box">
                <TextField
                    label="Password"
                    name="password"
                    type="password"
                    value={formDataSignup.password}
                    onChange={handleChangeSignup}
                    fullWidth
                    required
                />
                </div>
                <button type="submit" disabled={loading} className="btn">Register</button>
            </form>
          </div>
  )
}

export default Signup