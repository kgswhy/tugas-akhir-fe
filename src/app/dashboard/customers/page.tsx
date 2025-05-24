'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { deleteCookie } from 'cookies-next';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import CustomersTable from '@/components/tables/CustomersTable';
import CustomerHistory from '@/components/tables/CustomerHistory';
import Button from '@/components/ui/button/Button';

interface Customer {
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

interface CustomerListResponse {
    code: string;
    message: string;
    data?: {
        page: number;
        size: number;
        totalData: number;
        totalPage: number;
        customers: Customer[];
    };
}

export default function CustomersPage() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [pagination, setPagination] = useState({
        page: 0,
        size: 2,
        totalData: 0,
        totalPage: 0
    });
    const router = useRouter();

    const fetchCustomers = async (page: number = 0) => {
        try {
            setLoading(true);
            const response = await fetch(`/api/customer/list?page=${page}&size=${pagination.size}&identityId=10002`);
            const data: CustomerListResponse = await response.json();

            if (data.code === '00' && data.data) {
                setCustomers(data.data.customers);
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
                setError(data.message || 'Failed to fetch customers');
            }
        } catch (error) {
            setError('An error occurred while fetching customers');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    const handlePageChange = (newPage: number) => {
        fetchCustomers(newPage);
    };

    const handleViewDetails = (customer: Customer) => {
        setSelectedCustomer(customer);
    };

    const handleBackToList = () => {
        setSelectedCustomer(null);
    };

    return (
        <div>
            <PageBreadcrumb pageTitle="Customers" />
            
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
                    ) : selectedCustomer ? (
                        <CustomerHistory 
                            customerId={selectedCustomer.customerId} 
                            onBack={handleBackToList} 
                        />
                    ) : (
                        <>
                            <CustomersTable customers={customers} onViewDetails={handleViewDetails} />

                            {/* Pagination */}
                            <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-4 dark:border-gray-700">
                                <div className="text-sm text-gray-700 dark:text-gray-300">
                                    Showing {customers.length} of {pagination.totalData} results
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