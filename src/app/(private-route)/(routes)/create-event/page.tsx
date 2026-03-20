"use client";

import {  useState } from "react";
import { Button } from "@mui/material";
import { apiRequest } from "@/utils/api";
import toast from "react-hot-toast";
import { Add, Remove } from "@mui/icons-material";
import Pass from "@/app/components/Pass";
import CustomInput from "@/app/components/CustomInput";

const CreateEvent = () => {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        date: "",
        location: "",
        entryTypes: [{ name: "", amount: "", count: "" }],
    });

    const [loading, setLoading] = useState(false);
    const [demoPassOpen, setDemoPassOpen] = useState(false)

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleEntryTypeChange = (index: number, field: string, value: string) => {
        const updatedEntryTypes = [...formData.entryTypes];
        updatedEntryTypes[index] = { ...updatedEntryTypes[index], [field]: value };
        setFormData((prev) => ({ ...prev, entryTypes: updatedEntryTypes }));
    };

    const addEntryType = () => {
        setFormData((prev) => ({
            ...prev,
            entryTypes: [...prev.entryTypes, { name: "", amount: "", count: "" }],
        }));
    };

    const removeEntryType = (index: number) => {
        if(formData.entryTypes.length === 1){
            return
        }
        const updatedEntryTypes = formData.entryTypes.filter((_, i) => i !== index);
        setFormData((prev) => ({ ...prev, entryTypes: updatedEntryTypes }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const today = new Date();
    const selectedDate = new Date(formData.date);

    // Reset time for comparison
    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);

    console.log("Selected Date:", selectedDate);
    console.log("Today's Date:", today);

    if (selectedDate < today) {
        toast.error("Event date cannot be in the past.");
        setLoading(false);
        return;
    }

    try {
        // Retrieve the token from localStorage (or another secure location)
        const token = document.cookie.replace(
            /(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/,
            "$1"
        );
        if (!token) {
            throw new Error("You must be logged in to create an event.");
        }

        // Use the `apiRequest` function to send the request
        const response = await apiRequest<{ message: string }>(
            "/api/events/create-event",
            "POST",
            formData,
            token
        );
        toast.success(response.message);
        setFormData({
            name: "",
            description: "",
            date: "",
            location: "",
            entryTypes: [{ name: "", amount: "", count: "" }],
        });
    } catch (err: any) {
        toast.error(err.message);
    } finally {
        setLoading(false);
    }
};
    

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-[#060a15] via-[#0b1220] to-[#1a1230] px-4 py-6 sm:px-6 sm:py-8">
            <div className="mx-auto w-full max-w-4xl overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-br from-[#0b1220] via-[#101a2f] to-[#1a1230] p-5 text-white shadow-[0_25px_70px_rgba(0,0,0,0.45)] sm:p-8">
                <div className="mb-7 text-center">
                    <p className="inline-flex rounded-full border border-cyan-300/30 bg-cyan-300/10 px-3 py-1 text-xs font-semibold tracking-[0.16em] text-cyan-100">
                        EVENT BUILDER
                    </p>
                    <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">Create New Event</h1>
                </div>

                <Button
                    onClick={() => setDemoPassOpen(true)}
                    className="!mb-6 !rounded-full !bg-gradient-to-r !from-cyan-500 !to-sky-600 !px-5 !py-2 !text-xs !font-semibold !tracking-[0.1em] !text-white"
                >
                    Show Demo Pass
                </Button>

                <Pass
                    open={demoPassOpen}
                    dialogClose={() => {
                        setDemoPassOpen(false);
                    }}
                    passData={{
                        eventName: formData.name,
                        eventDesc: formData.description,
                    }}
                    demoPass
                />

                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                    <CustomInput
                        label="Event Name"
                        value={formData.name}
                        onChange={(e) =>
                            setFormData((prev) => ({ ...prev, name: e.target.value }))
                        }
                    />

                    <div>
                        <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-300">
                            Description
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            rows={4}
                            className="w-full rounded-2xl border border-cyan-500/40 bg-slate-900/60 px-4 py-3 text-sm font-medium text-slate-100 transition-all duration-300 placeholder-slate-400 focus:border-cyan-500 focus:bg-slate-900/80 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="min-w-0">
                            <CustomInput
                                label="Event Date"
                                type="date"
                                value={formData.date}
                                onChange={(e) =>
                                    setFormData((prev) => ({ ...prev, date: e.target.value }))
                                }
                            />
                        </div>

                        <div className="min-w-0">
                            <CustomInput
                                label="Location"
                                value={formData.location}
                                onChange={(e) =>
                                    setFormData((prev) => ({ ...prev, location: e.target.value }))
                                }
                            />
                        </div>
                    </div>

                    <div className="pt-1">
                        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-fuchsia-200">Entry Types</p>

                        <div className="space-y-3">
                            {formData?.entryTypes.map((entryType, index) => (
                                <div
                                    key={index}
                                    className="rounded-2xl border border-white/10 bg-slate-900/30 p-3 sm:p-4"
                                >
                                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-12 sm:items-end">
                                        <div className="sm:col-span-5">
                                            <p className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-300">Name</p>
                                            <input
                                                value={entryType.name}
                                                onChange={(e) =>
                                                    handleEntryTypeChange(index, "name", e.target.value)
                                                }
                                                className="w-full rounded-full border border-cyan-500/40 bg-slate-900/60 px-4 py-2.5 text-sm font-medium text-slate-100 transition-all duration-300 focus:border-cyan-500 focus:bg-slate-900/80 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                                            />
                                        </div>

                                        <div className="sm:col-span-3">
                                            <p className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-300">Amount</p>
                                            <input
                                                type="number"
                                                value={entryType.amount}
                                                onChange={(e) =>
                                                    handleEntryTypeChange(index, "amount", e.target.value)
                                                }
                                                className="w-full rounded-full border border-cyan-500/40 bg-slate-900/60 px-4 py-2.5 text-sm font-medium text-slate-100 transition-all duration-300 focus:border-cyan-500 focus:bg-slate-900/80 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                                            />
                                        </div>

                                        <div className="sm:col-span-3">
                                            <p className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-300">Count</p>
                                            <input
                                                type="number"
                                                value={entryType.count}
                                                onChange={(e) =>
                                                    handleEntryTypeChange(index, "count", e.target.value)
                                                }
                                                className="w-full rounded-full border border-cyan-500/40 bg-slate-900/60 px-4 py-2.5 text-sm font-medium text-slate-100 transition-all duration-300 focus:border-cyan-500 focus:bg-slate-900/80 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                                            />
                                        </div>

                                        <div className="sm:col-span-1">
                                            <Button
                                                onClick={() => removeEntryType(index)}
                                                className="!min-w-0 !rounded-full !border !border-red-400/60 !px-3 !py-2 !text-red-300"
                                            >
                                                <Remove />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <Button
                            onClick={addEntryType}
                            className="!mt-3 !rounded-full !border !border-emerald-400/60 !bg-emerald-500/10 !px-4 !py-2 !text-emerald-200"
                        >
                            <Add /> Add Entry Type
                        </Button>
                    </div>

                    <Button
                        type="submit"
                        disabled={loading}
                        className="!mt-2 !w-full !rounded-full !bg-gradient-to-r !from-cyan-500 !to-sky-600 !py-3 !text-sm !font-semibold !tracking-[0.08em] !text-white"
                    >
                        {loading ? "Creating..." : "Create Event"}
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default CreateEvent;
