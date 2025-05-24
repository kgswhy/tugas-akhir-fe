'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { deleteCookie } from 'cookies-next';
import Button from '@/components/ui/button/Button';
import ChangePasswordForm from '@/components/form/ChangePasswordForm';

interface User {
    userId: number;
    merchantId: number;
    name: string;
    email: string;
    phone: string;
    level: string;
    createdDate: string;
    updatedDate: string;
}

interface UserDetailsResponse {
    code: string;
    message: string;
    data: User;
}

export default function UserDetails({ params }: { params: { id: string } }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const router = useRouter();

    useEffect(() => {
        fetchUserDetails();
    }, [params.id]);

    const fetchUserDetails = async () => {
        try {
            const response = await fetch(`/api/user/${params.id}`);
            const data: UserDetailsResponse = await response.json();

            if (data.code === 'AUT_001') {
                deleteCookie('auth_token');
                localStorage.removeItem('user_data');
                router.push('/login');
                return;
            }

            if (data.code === '00') {
                setUser(data.data);
            } else {
                setError(data.message || 'Failed to fetch user details');
            }
        } catch (error) {
            setError('An error occurred while fetching user details');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        try {
            const response = await fetch(`/api/user/${params.id}/delete`, {
                method: 'DELETE',
            });

            const data = await response.json();

            if (data.code === 'AUT_001') {
                deleteCookie('auth_token');
                localStorage.removeItem('user_data');
                router.push('/login');
                return;
            }

            if (data.code === '00') {
                router.push('/dashboard/users');
            } else {
                setError(data.message || 'Failed to delete user');
            }
        } catch (error) {
            setError('An error occurred while deleting user');
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="text-center">
                    <h2 className="mb-4 text-2xl font-semibold text-red-600">Error</h2>
                    <p className="text-gray-600">{error}</p>
                    <Button
                        variant="primary"
                        onClick={() => router.push('/dashboard/users')}
                        className="mt-4"
                    >
                        Back to Users
                    </Button>
                </div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    if (showChangePassword) {
        return (
            <ChangePasswordForm
                userId={user.userId}
                onBack={() => setShowChangePassword(false)}
            />
        );
    }

    return (
        <div className="p-6">
            <div className="mb-6">
                <Button variant="outline" onClick={() => router.push('/dashboard/users')}>
                    ← Back to Users
                </Button>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-white/[0.05] dark:bg-white/[0.03]">
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
                        User Details
                    </h2>
                    <div className="space-x-4">
                        <Button
                            variant="outline"
                            onClick={() => setShowChangePassword(true)}
                        >
                            Change Password
                        </Button>
                        <Button
                            variant="danger"
                            onClick={() => setShowDeleteConfirm(true)}
                        >
                            Delete User
                        </Button>
                    </div>
                </div>

                {showDeleteConfirm && (
                    <div className="mb-6 rounded-lg bg-red-50 p-4 dark:bg-red-900/20">
                        <h3 className="mb-2 text-lg font-semibold text-red-800 dark:text-red-200">
                            Confirm Delete
                        </h3>
                        <p className="mb-4 text-red-700 dark:text-red-300">
                            Are you sure you want to delete this user? This action cannot be undone.
                        </p>
                        <div className="flex space-x-4">
                            <Button
                                variant="outline"
                                onClick={() => setShowDeleteConfirm(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="danger"
                                onClick={handleDelete}
                            >
                                Delete User
                            </Button>
                        </div>
                    </div>
                )}

                <div className="grid gap-6 md:grid-cols-2">
                    <div>
                        <h3 className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                            Name
                        </h3>
                        <p className="text-lg text-gray-800 dark:text-white/90">{user.name}</p>
                    </div>
                    <div>
                        <h3 className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                            Email
                        </h3>
                        <p className="text-lg text-gray-800 dark:text-white/90">{user.email}</p>
                    </div>
                    <div>
                        <h3 className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                            Phone
                        </h3>
                        <p className="text-lg text-gray-800 dark:text-white/90">{user.phone}</p>
                    </div>
                    <div>
                        <h3 className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                            Level
                        </h3>
                        <p className="text-lg text-gray-800 dark:text-white/90">{user.level}</p>
                    </div>
                    <div>
                        <h3 className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                            Created Date
                        </h3>
                        <p className="text-lg text-gray-800 dark:text-white/90">
                            {new Date(user.createdDate).toLocaleString()}
                        </p>
                    </div>
                    <div>
                        <h3 className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                            Last Updated
                        </h3>
                        <p className="text-lg text-gray-800 dark:text-white/90">
                            {new Date(user.updatedDate).toLocaleString()}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
} 