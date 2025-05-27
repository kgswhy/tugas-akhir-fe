"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { deleteCookie } from "cookies-next";
import Button from "../ui/button/Button";
import Badge from "../ui/badge/Badge";
import ChangePasswordForm from "../form/ChangePasswordForm";

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

interface UserDetailsProps {
  user: User;
  onBack: () => void;
}

export default function UserDetails({ user, onBack }: UserDetailsProps) {
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const getLevelBadge = (level: number) => {
    switch (level) {
      case 1:
        return <Badge size="sm" color="success">Admin</Badge>;
      case 2:
        return <Badge size="sm" color="warning">Manager</Badge>;
      case 3:
        return <Badge size="sm" color="info">Staff</Badge>;
      default:
        return <Badge size="sm" color="primary">User</Badge>;
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/user/${user.userId}/delete`, {
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
        onBack();
      } else {
        setError(data.message || 'Failed to delete user');
      }
    } catch (error) {
      setError('An error occurred while deleting user');
    }
  };

  if (showChangePassword) {
    return (
      <ChangePasswordForm
        userId={user.userId}
        onBack={() => setShowChangePassword(false)}
      />
    );
  }

  return (
    <div className="dark:border-white/[0.05] dark:bg-white/[0.03]rounded-lg shadow p-6">
      <div className="mb-6">
        <Button
          variant="outline"
          onClick={onBack}
          className="mb-4"
        >
          ← Back to Users List
        </Button>
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white/90">User Details</h2>
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
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="mb-6 rounded-lg bg-red-50 p-4">
          <h3 className="mb-2 text-lg font-semibold text-red-800">
            Confirm Delete
          </h3>
          <p className="mb-4 text-red-700">
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-500">User ID</label>
            <p className="mt-1 text-gray-900 dark:text-white">{user.userId}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Merchant ID</label>
            <p className="mt-1 text-gray-900 dark:text-white">{user.merchantId}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Name</label>
            <p className="mt-1 text-gray-900 dark:text-white">{user.name}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Email</label>
            <p className="mt-1 text-gray-900 dark:text-white">{user.email}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-500">Phone</label>
            <p className="mt-1 text-gray-900 dark:text-white">{user.phone}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Level</label>
            <div className="mt-1">{getLevelBadge(user.level)}</div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Created Date</label>
            <p className="mt-1 text-gray-900 dark:text-white">{new Date(user.createdDate).toLocaleDateString()}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Last Updated</label>
            <p className="mt-1 text-gray-900 dark:text-white">{new Date(user.updatedDate).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
} 