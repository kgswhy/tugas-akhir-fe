"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteCookie } from "cookies-next";
import Button from "../ui/button/Button";
import DatePicker from '@/components/form/date-picker';
import Label from './Label';
import Input from './input/InputField';
import TextArea from "./input/TextArea";
import Select from './Select';
import { ChevronDownIcon, EyeCloseIcon, EyeIcon, TimeIcon } from '@/icons';

interface ReminderFormProps {
    onBack: () => void;
    activityId: number;
}

export default function ReminderForm({ onBack, activityId }: ReminderFormProps) {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        date: null as Date | null,
        time: "",
        files: [] as File[],
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFormData({
                ...formData,
                files: Array.from(e.target.files),
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (!formData.date || !formData.time) {
            setError("Please select both date and time");
            setLoading(false);
            return;
        }

        try {
            // Combine date and time
            const date = formData.date;
            const [hours, minutes] = formData.time.split(':');
            date.setHours(parseInt(hours), parseInt(minutes));

            const response = await fetch('/api/reminder/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: formData.title,
                    description: formData.description,
                    remindAt: date.toISOString().slice(0, 19).replace('T', ' '),
                    activityId: activityId
                }),
            });

            const data = await response.json();

            if (data.code === 'AUT_001') {
                deleteCookie('auth_token');
                localStorage.removeItem('user_data');
                router.push('/login');
                return;
            }

            if (data.code === '00') {
                onBack();
            } else {
                setError(data.message || 'Failed to create reminder');
            }
        } catch (error) {
            setError('An error occurred while creating reminder');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6">
            <div className="mb-6">
                <Button size="sm" variant="outline" onClick={onBack}>
                    ← Back to Details
                </Button>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-white/[0.05] dark:bg-white/[0.03]">
                <h2 className="mb-6 text-2xl font-semibold text-gray-800 dark:text-white/90">
                    Create Reminder
                </h2>

                {error && (
                    <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded relative" role="alert">
                        <span className="block sm:inline">{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label
                            htmlFor="title"
                            className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                            Reminder Title
                        </label>
                        <input
                            type="text"
                            id="title"
                            value={formData.title}
                            onChange={(e) =>
                                setFormData({ ...formData, title: e.target.value })
                            }
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                            required
                        />
                    </div>

                    <div>
                        <Label>Description</Label>
                        <TextArea
                            value={formData.description}
                            onChange={(value) => setFormData({ ...formData, description: value })}
                            rows={6}
                        />
                    </div>

                    <div>
                        <DatePicker
                            id="date-picker"
                            label="Date"
                            placeholder="Select a date"
                            onChange={(dates: Date[]) => {
                                setFormData({ ...formData, date: dates[0] });
                            }}
                        />
                    </div>

                    <div>
                        <Label htmlFor="time">Time</Label>
                        <div className="relative">
                            <Input
                                type="time"
                                id="time"
                                name="time"
                                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end space-x-4">
                        <Button
                            size="md"
                            variant="outline"
                            onClick={onBack}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button 
                            size="md" 
                            variant="primary"
                            disabled={loading}
                            type="submit"
                        >
                            {loading ? 'Creating Reminder...' : 'Create Reminder'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
} 