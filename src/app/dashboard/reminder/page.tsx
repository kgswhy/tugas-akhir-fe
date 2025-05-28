'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { deleteCookie } from 'cookies-next';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import Button from '@/components/ui/button/Button';

interface Reminder {
    reminderId: number;
    title: string;
    description: string;
    remindAt: string;
    isActive: boolean;
    isUrgent: boolean;
    userId: number;
    activityId: number;
    createdDate: string;
    updatedDate: string;
}

interface ReminderListResponse {
    code: string;
    message: string;
    data?: {
        page: number;
        size: number;
        totalData: number;
        totalPages: number;
        reminders: Reminder[];
    };
}

export default function ReminderPage() {
    const [reminders, setReminders] = useState<Reminder[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [deactivatingIds, setDeactivatingIds] = useState<Set<number>>(new Set());
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [pagination, setPagination] = useState({
        page: 0,
        size: 2,
        totalData: 0,
        totalPage: 0
    });
    const router = useRouter();

    const fetchReminders = async (page: number = 0) => {
        try {
            setLoading(true);
            const response = await fetch(`/api/reminder/list?page=${page}&size=${pagination.size}`);
            const data: ReminderListResponse = await response.json();

            if (data.code === '00' && data.data) {
                // Sort reminders by isUrgent
                const sortedReminders = [...data.data.reminders].sort((a, b) => 
                    (b.isUrgent ? 1 : 0) - (a.isUrgent ? 1 : 0)
                );
                setReminders(sortedReminders);
                setPagination({
                    page: data.data.page,
                    size: data.data.size,
                    totalData: data.data.totalData || 0,
                    totalPage: data.data.totalPages
                });
                setError(null);
            } else if (data.code === 'AUT_001') {
                deleteCookie('auth_token');
                localStorage.removeItem('user_data');
                router.push('/login');
            } else {
                setError(data.message || 'Failed to fetch reminders');
            }
        } catch (error) {
            setError('An error occurred while fetching reminders');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReminders();
    }, []);

    const handlePageChange = (newPage: number) => {
        fetchReminders(newPage);
    };

    const handleDeactivateReminder = async (reminderId: number) => {
        try {
            // Add reminderId to deactivating set
            setDeactivatingIds(prev => new Set(prev).add(reminderId));
            setError(null);
            setSuccessMessage(null);

            const response = await fetch(`/api/reminder/inactivate/${reminderId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();

            if (data.code === 'REM_002') {
                // Success - refresh the reminders list
                await fetchReminders(pagination.page);
                setSuccessMessage(`Reminder "${data.data.title}" successfully inactivated`);
                
                // Clear success message after 3 seconds
                setTimeout(() => setSuccessMessage(null), 3000);
            } else if (data.code === 'AUT_001') {
                // Handle expired token
                deleteCookie('auth_token');
                localStorage.removeItem('user_data');
                router.push('/login');
            } else {
                setError(data.message || 'Failed to inactivate reminder');
            }
        } catch (error) {
            console.error('Error inactivating reminder:', error);
            setError('An error occurred while inactivating the reminder');
        } finally {
            // Remove reminderId from deactivating set
            setDeactivatingIds(prev => {
                const newSet = new Set(prev);
                newSet.delete(reminderId);
                return newSet;
            });
        }
    };

    return (
        <div>
            <PageBreadcrumb pageTitle="Reminders" />
            
            {error && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded relative" role="alert">
                    <span className="block sm:inline">{error}</span>
                </div>
            )}

            {successMessage && (
                <div className="mb-4 bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded relative" role="alert">
                    <span className="block sm:inline">{successMessage}</span>
                </div>
            )}

            <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
                <div className="p-6">
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-600">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                                    <thead>
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Activity ID</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remind At</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                                        {reminders.map((reminder) => (
                                            <tr 
                                                key={reminder.reminderId}
                                                className={reminder.isUrgent ? 'bg-red-50 dark:bg-red-900/30' : ''}
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900 dark:text-white/90">#{reminder.reminderId}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900 dark:text-white/90">{reminder.title}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm text-gray-900 dark:text-white/90">{reminder.description}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900 dark:text-white/90">
                                                        {new Date(reminder.remindAt).toLocaleString()}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                        reminder.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                    }`}>
                                                        {reminder.isActive ? 'Active' : 'Inactive'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleDeactivateReminder(reminder.reminderId)}
                                                        disabled={!reminder.isActive || deactivatingIds.has(reminder.reminderId)}
                                                    >
                                                        {deactivatingIds.has(reminder.reminderId) ? 'Deactivating...' : 'Deactivate'}
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-4 dark:border-gray-700">
                                <div className="text-sm text-gray-700 dark:text-gray-300">
                                    Showing {reminders.length} of {pagination.totalData} results
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handlePageChange(pagination.page - 1)}
                                        disabled={pagination.page === 0}
                                    >
                                        Previous
                                    </Button>
                                    <div className="text-sm text-gray-700 dark:text-gray-300">
                                        Page {pagination.page + 1} of {pagination.totalPage}
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handlePageChange(pagination.page + 1)}
                                        disabled={pagination.page >= pagination.totalPage - 1}
                                    >
                                        Next
                                    </Button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}