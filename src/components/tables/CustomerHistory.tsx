"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { deleteCookie } from 'cookies-next';
import Button from '../ui/button/Button';
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from '../ui/table';
import Badge from '../ui/badge/Badge';
import ReminderForm from '../form/ReminderForm';
import EditCustomerForm from '../form/EditCustomerForm';
import CreateActivityForm from '../form/CreateActivityForm';

interface CustomerDetails {
    customerId: number;
    merchantId: number;
    identityId: number;
    name: string;
    email: string;
    phone: string;
    address: string;
    detail: string;
    dateOfBirth: string;
    createdDate: string;
    updatedDate: string | null;
}

interface Activity {
    activityId: number;
    userId: number;
    userName: string;
    type: string;
    description: string;
    activityDate: string;
    createdDate: string;
    updatedDate: string;
    files: {
        fileName: string;
        fileUrl: string;
    }[];
}

interface CustomerHistoryProps {
    customerId: number;
    onBack: () => void;
}

export default function CustomerHistory({ customerId, onBack }: CustomerHistoryProps) {
    const [customerDetails, setCustomerDetails] = useState<CustomerDetails | null>(null);
    const [activities, setActivities] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedActivityId, setSelectedActivityId] = useState<number | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isCreatingActivity, setIsCreatingActivity] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const router = useRouter();

    const fetchCustomerData = async () => {
        try {
            setLoading(true);
            // Fetch customer details
            const detailsResponse = await fetch(`/api/customer/${customerId}`);
            const detailsData = await detailsResponse.json();

            if (detailsData.code === 'AUT_001') {
                deleteCookie('auth_token');
                localStorage.removeItem('user_data');
                router.push('/login');
                return;
            }

            if (detailsData.code === '00' && detailsData.data) {
                setCustomerDetails(detailsData.data);
            } else {
                setError(detailsData.message || 'Failed to fetch customer details');
                return;
            }

            // Fetch customer activities
            const activitiesResponse = await fetch(`/api/customer/${customerId}/activities`);
            const activitiesData = await activitiesResponse.json();

            if (activitiesData.code === '00' && activitiesData.data) {
                setActivities(activitiesData.data.activities || []);
            } else {
                setError(activitiesData.message || 'Failed to fetch customer activities');
                setActivities([]); // Set empty array as fallback
            }
        } catch (error) {
            setError('An error occurred while fetching customer data');
            setActivities([]); // Ensure activities is always an array
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCustomerData();
    }, [customerId, router]);

    const handleCreateReminder = (activityId: number) => {
        console.log("Activity ID:", activityId);
        setSelectedActivityId(activityId);
    };

    const handleBackFromReminder = () => {
        setSelectedActivityId(null);
    };

    const handleEditCustomer = () => {
        setIsEditing(true);
    };

    const handleBackFromEdit = () => {
        setIsEditing(false);
    };

    const handleEditSuccess = () => {
        setIsEditing(false);
        setSuccessMessage('Customer updated successfully!');
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(null), 3000);
        
        // Refresh customer data
        fetchCustomerData();
    };

    const handleCreateActivity = () => {
        setIsCreatingActivity(true);
    };

    const handleBackFromCreateActivity = () => {
        setIsCreatingActivity(false);
    };

    const handleCreateActivitySuccess = () => {
        setIsCreatingActivity(false);
        setSuccessMessage('Activity created successfully!');
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(null), 3000);
        
        // Refresh customer data to show new activity
        fetchCustomerData();
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded relative" role="alert">
                <span className="block sm:inline">{error}</span>
            </div>
        );
    }

    if (selectedActivityId) {
        return <ReminderForm activityId={selectedActivityId} onBack={handleBackFromReminder} />;
    }

    if (isEditing && customerDetails) {
        return <EditCustomerForm customer={customerDetails} onBack={handleBackFromEdit} onSuccess={handleEditSuccess} />;
    }

    if (isCreatingActivity) {
        return <CreateActivityForm customerId={customerId} onBack={handleBackFromCreateActivity} onSuccess={handleCreateActivitySuccess} />;
    }

    return (
        <div>
            <div className="mb-6 flex justify-between items-center">
                <Button variant="outline" onClick={onBack}>
                    Back to List
                </Button>
                <div className='space-x-4'>
                    <Button variant="outline" onClick={handleEditCustomer}>
                        Edit Customer
                    </Button>
                    <Button variant="primary" onClick={handleCreateActivity}>
                        Create Activity
                    </Button>
                </div>
            </div>

            {successMessage && (
                <div className="mb-4 bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded relative dark:bg-green-900/20 dark:border-green-700 dark:text-green-400" role="alert">
                    <span className="block sm:inline">{successMessage}</span>
                </div>
            )}

            {customerDetails && (
                <div className="mb-8 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] rounded-lg shadow p-6 dark:text-white">
                    <h2 className="text-2xl font-semibold mb-4">Customer Details</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-gray-500 dark:text-gray-400">Name</p>
                            <p className="font-medium">{customerDetails.name || 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-gray-500 dark:text-gray-400">Email</p>
                            <p className="font-medium">{customerDetails.email || 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-gray-500 dark:text-gray-400">Phone</p>
                            <p className="font-medium">{customerDetails.phone || 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-gray-500 dark:text-gray-400">Date of Birth</p>
                            <p className="font-medium">
                                {customerDetails.dateOfBirth 
                                    ? new Date(customerDetails.dateOfBirth).toLocaleDateString() 
                                    : 'N/A'
                                }
                            </p>
                        </div>
                        <div className="col-span-2">
                            <p className="text-gray-500 dark:text-gray-400">Address</p>
                            <p className="font-medium">{customerDetails.address || 'N/A'}</p>
                        </div>
                        <div className="col-span-2">
                            <p className="text-gray-500 dark:text-gray-400">Details</p>
                            <p className="font-medium">{customerDetails.detail || 'N/A'}</p>
                        </div>
                    </div>
                </div>
            )}

            <ol className="relative border-s border-gray-200 dark:border-gray-700">
                {activities && activities.length > 0 ? (
                    [...activities]
                        .sort((a, b) => new Date(b.activityDate).getTime() - new Date(a.activityDate).getTime())
                        .map((activity, index) => (
                            <li key={activity.activityId} className="mb-10 ms-6">
                                <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -start-3 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900">
                                    <svg className="w-2.5 h-2.5 text-blue-800 dark:text-blue-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                                    </svg>
                                </span>

                                <h3 className="flex items-center justify-between mb-1 text-lg font-semibold text-gray-900 dark:text-white">
                                    <span className="flex items-center gap-2">
                                        {activity.type || 'Unknown Activity'}
                                        {index === 0 && (
                                            <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-sm dark:bg-blue-900 dark:text-blue-300">
                                                Latest
                                            </span>
                                        )}
                                    </span>

                                    <Button 
                                        size="sm" 
                                        variant="primary"
                                        onClick={() => handleCreateReminder(activity.activityId)}
                                    >
                                        Create Reminder
                                    </Button>
                                </h3>

                                <div className="flex items-center gap-4 mb-2">
                                    <time className="text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
                                        {activity.activityDate ? new Date(activity.activityDate).toLocaleDateString() : 'No date available'}
                                    </time>
                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                        Created by: <span className="font-medium text-gray-700 dark:text-gray-300">{activity.userName || 'Unknown User'}</span>
                                    </span>
                                </div>

                                <p className="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">
                                    {activity.description || 'No description available'}
                                </p>

                                {activity.files && activity.files.length > 0 && (
                                    <div className="space-y-2">
                                        {activity.files.map((file, fileIndex) => (
                                            <a
                                                key={fileIndex}
                                                href={file.fileUrl}
                                                download
                                                className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:outline-none focus:ring-gray-100 focus:text-blue-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-700"
                                            >
                                                <svg className="w-3.5 h-3.5 me-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M14.707 7.793a1 1 0 0 0-1.414 0L11 10.086V1.5a1 1 0 0 0-2 0v8.586L6.707 7.793a1 1 0 1 0-1.414 1.414l4 4a1 1 0 0 0 1.416 0l4-4a1 1 0 0 0-.002-1.414Z" />
                                                    <path d="M18 12h-2.55l-2.975 2.975a3.5 3.5 0 0 1-4.95 0L4.55 12H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2Zm-3 5a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z" />
                                                </svg>
                                                Download {file.fileName || 'Unknown file'}
                                            </a>
                                        ))}
                                    </div>
                                )}
                            </li>
                        ))
                ) : (
                    <li className="mb-10 ms-6">
                        <span className="absolute flex items-center justify-center w-6 h-6 bg-gray-100 rounded-full -start-3 ring-8 ring-white dark:ring-gray-900 dark:bg-gray-700">
                            <svg className="w-2.5 h-2.5 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                            </svg>
                        </span>
                        <div className="text-center py-8">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Activities Found</h3>
                            <p className="text-gray-500 dark:text-gray-400 mb-4">This customer doesn't have any activities yet.</p>
                            <Button 
                                variant="primary"
                                onClick={handleCreateActivity}
                            >
                                Create First Activity
                            </Button>
                        </div>
                    </li>
                )}
            </ol>
        </div>
    );
}