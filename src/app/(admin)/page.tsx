// src/app/(admin)/page.tsx
import type { Metadata } from "next";
import React from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";

export const metadata: Metadata = {
  title: "Dashboard | Your App Name",
  description: "Your dashboard description",
};

export default function Dashboard() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Dashboard" />
      
      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        {/* Left Column - Main Content */}
        <div className="col-span-12 space-y-6 xl:col-span-7">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
            {/* Card 1 */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
              <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
                {/* Add your icon here */}
              </div>
              <div className="flex items-end justify-between mt-5">
                <div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Total Customers
                  </span>
                  <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                    1,234
                  </h4>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
              <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
                {/* Add your icon here */}
              </div>
              <div className="flex items-end justify-between mt-5">
                <div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Recent Orders
                  </span>
                  <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                    56
                  </h4>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity Section */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Recent Activity
            </h3>
            <div className="mt-4">
              {/* Add your activity list here */}
              <p className="text-gray-500 dark:text-gray-400">
                No recent activity
              </p>
            </div>
          </div>
        </div>

        {/* Right Column - Side Content */}
        <div className="col-span-12 xl:col-span-5">
          {/* Quick Stats */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Quick Stats
            </h3>
            <div className="mt-4 space-y-4">
              {/* Add your stats here */}
              <div className="flex items-center justify-between">
                <span className="text-gray-500 dark:text-gray-400">Active Users</span>
                <span className="font-medium text-gray-800 dark:text-white/90">245</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 dark:text-gray-400">Total Revenue</span>
                <span className="font-medium text-gray-800 dark:text-white/90">$12,345</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
