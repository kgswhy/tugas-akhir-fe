'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { deleteCookie } from 'cookies-next';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import TableUsers from '@/components/tables/TableUsers';
import UserDetails from '@/components/tables/UserDetails';
import CreateUserForm from '@/components/tables/CreateUserForm';
import Button from '@/components/ui/button/Button';

interface User {
    userId: number;
    merchantId: number;
    name: string;
    email: string;
    phone: string;
    level: number;
    createdDate: string;
    updatedDate: string;
}

interface UserListResponse {
    code: string;
    message: string;
    data?: {
        page: number;
        size: number;
        totalData: number;
        totalPage: number;
        users: User[];
    };
}

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [pagination, setPagination] = useState({
        page: 0,
        size: 2,
        totalData: 0,
        totalPage: 0
    });
    const router = useRouter();

    const fetchUsers = async (page: number = 0) => {
        try {
            setLoading(true);
            const response = await fetch(`/api/user/list?page=${page}&size=${pagination.size}`);
            const data: UserListResponse = await response.json();

            if (data.code === '00' && data.data) {
                setUsers(data.data.users);
                setPagination({
                    page: data.data.page,
                    size: data.data.size,
                    totalData: data.data.totalData,
                    totalPage: data.data.totalPage
                });
                setError(null);
            } else if (data.code === 'AUT_001') {
                // Handle expired token
                deleteCookie('auth_token');
                localStorage.removeItem('user_data');
                router.push('/login');
            } else {
                setError(data.message || 'Failed to fetch users');
            }
        } catch (error) {
            setError('An error occurred while fetching users');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handlePageChange = (newPage: number) => {
        fetchUsers(newPage);
    };

    const handleViewDetails = (user: User) => {
        setSelectedUser(user);
    };

    const handleBackToList = () => {
        setSelectedUser(null);
        setShowCreateForm(false);
    };

    const handleCreateSuccess = () => {
        setShowCreateForm(false);
        fetchUsers(pagination.page); // Refresh the current page
    };

    return (
        <div>
            <PageBreadcrumb pageTitle="Users" />
            
            {error && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded relative" role="alert">
                    <span className="block sm:inline">{error}</span>
                </div>
            )}

            <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
                <div className="p-6">
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                        </div>
                    ) : showCreateForm ? (
                        <CreateUserForm onBack={handleBackToList} onSuccess={handleCreateSuccess} />
                    ) : selectedUser ? (
                        <UserDetails user={selectedUser} onBack={handleBackToList} />
                    ) : (
                        <>
                            <div className="mb-6 flex justify-end">
                                <Button
                                    variant="primary"
                                    onClick={() => setShowCreateForm(true)}
                                >
                                    Create User
                                </Button>
                            </div>

                            <TableUsers users={users} onViewDetails={handleViewDetails} />

                            {/* Pagination */}
                            <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-4 dark:border-gray-700">
                                <div className="text-sm text-gray-700 dark:text-gray-300">
                                    Showing {users.length} of {pagination.totalData} results
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