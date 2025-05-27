// src/app/(admin)/page.tsx
'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { deleteCookie } from 'cookies-next';
import React from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { UserIcon, UsersIcon, BellIcon } from '@heroicons/react/24/outline';

interface DashboardStats {
  totalCustomers: number;
  totalUsers: number;
  totalReminders: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalCustomers: 0,
    totalUsers: 0,
    totalReminders: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/dashboard/stats');
        const data = await response.json();

        if (data.code === '00') {
          setStats(data.data);
          setError(null);
        } else if (data.code === 'AUT_001') {
          deleteCookie('auth_token');
          localStorage.removeItem('user_data');
          router.push('/login');
        } else {
          setError(data.message || 'Failed to fetch dashboard statistics');
        }
      } catch (error) {
        setError('An error occurred while fetching dashboard statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div>
      <PageBreadcrumb pageTitle="Dashboard" />
      
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        {/* Left Column - Main Content */}
        <div className="col-span-12 space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 md:gap-6">
            {/* Customers Card */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl dark:bg-blue-900">
                <UsersIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex items-end justify-between mt-5">
                <div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Total Customers
                  </span>
                  <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                    {loading ? '...' : stats.totalCustomers.toLocaleString()}
                  </h4>
                </div>
              </div>
            </div>

            {/* Users Card */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-xl dark:bg-green-900">
                <UserIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex items-end justify-between mt-5">
                <div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Total Users
                  </span>
                  <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                    {loading ? '...' : stats.totalUsers.toLocaleString()}
                  </h4>
                </div>
              </div>
            </div>

            {/* Reminders Card */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
              <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-xl dark:bg-purple-900">
                <BellIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="flex items-end justify-between mt-5">
                <div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Total Reminders
                  </span>
                  <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                    {loading ? '...' : stats.totalReminders.toLocaleString()}
                  </h4>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity Section */}
          {/*<div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">*/}
          {/*  <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">*/}
          {/*    Recent Activity*/}
          {/*  </h3>*/}
          {/*  <div className="mt-4">*/}
          {/*    {loading ? (*/}
          {/*      <div className="flex justify-center items-center h-32">*/}
          {/*        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600"></div>*/}
          {/*      </div>*/}
          {/*    ) : (*/}
          {/*      <p className="text-gray-500 dark:text-gray-400">*/}
          {/*        No recent activity*/}
          {/*      </p>*/}
          {/*    )}*/}
          {/*  </div>*/}
          {/*</div>*/}
        </div>

        {/* Right Column - Side Content */}
        {/*<div className="col-span-12 xl:col-span-5">*/}
        {/*  /!* Quick Stats *!/*/}
        {/*  <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">*/}
        {/*    <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">*/}
        {/*      Quick Stats*/}
        {/*    </h3>*/}
        {/*    <div className="mt-4 space-y-4">*/}
        {/*      /!* Add your stats here *!/*/}
        {/*      <div className="flex items-center justify-between">*/}
        {/*        <span className="text-gray-500 dark:text-gray-400">Active Users</span>*/}
        {/*        <span className="font-medium text-gray-800 dark:text-white/90">245</span>*/}
        {/*      </div>*/}
        {/*      <div className="flex items-center justify-between">*/}
        {/*        <span className="text-gray-500 dark:text-gray-400">Total Revenue</span>*/}
        {/*        <span className="font-medium text-gray-800 dark:text-white/90">$12,345</span>*/}
        {/*      </div>*/}
        {/*    </div>*/}
        {/*  </div>*/}
        {/*</div>*/}
      </div>
    </div>
  );
}
