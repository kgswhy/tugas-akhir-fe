'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { deleteCookie } from 'cookies-next';
import Button from '../ui/button/Button';
import Input from './input/InputField';
import { EyeCloseIcon, EyeIcon } from '@/icons';

interface ChangePasswordFormProps {
    userId: number;
    onBack: () => void;
}

export default function ChangePasswordForm({ userId, onBack }: ChangePasswordFormProps) {
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
    });
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`/api/user/${userId}/change-password`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    oldPassword: formData.currentPassword,
                    newPassword: formData.newPassword,
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
                setError(data.message || 'Failed to change password');
            }
        } catch (error) {
            setError('An error occurred while changing password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6">
            <div className="mb-6">
                <Button variant="outline" onClick={onBack}>
                    ← Back
                </Button>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-white/[0.05] dark:bg-white/[0.03]">
                <h2 className="mb-6 text-2xl font-semibold text-gray-800 dark:text-white/90">
                    Change Password
                </h2>

                {error && (
                    <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded relative" role="alert">
                        <span className="block sm:inline">{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Current Password
                        </label>
                        <div className="relative">
                            <Input
                                type={showCurrentPassword ? "text" : "password"}
                                defaultValue={formData.currentPassword}
                                onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            >
                                {/* {showCurrentPassword ? <EyeCloseIcon /> : <EyeIcon />} */}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                            New Password
                        </label>
                        <div className="relative">
                            <Input
                                type={showNewPassword ? "text" : "password"}
                                defaultValue={formData.newPassword}
                                onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                            >
                                {/* {showNewPassword ? <EyeCloseIcon /> : <EyeIcon />} */}
                            </button>
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
                            {loading ? 'Changing Password...' : 'Change Password'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
} 