'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/hooks/useUser';

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

interface EditCustomerFormData {
  identityId: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  detail: string;
  dateOfBirth: string;
}

interface EditCustomerFormProps {
  customer: CustomerDetails;
  onBack: () => void;
  onSuccess: () => void;
}

export default function EditCustomerForm({ customer, onBack, onSuccess }: EditCustomerFormProps) {
  const router = useRouter();
  const userData = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<EditCustomerFormData>({
    identityId: customer.identityId,
    name: customer.name,
    email: customer.email,
    phone: customer.phone,
    address: customer.address,
    detail: customer.detail,
    dateOfBirth: customer.dateOfBirth.split('T')[0], // Format date for input
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'identityId' ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (!userData?.merchantId) {
        throw new Error('Merchant ID not found');
      }

      // Validate identityId
      if (!Number.isInteger(formData.identityId) || formData.identityId <= 0) {
        setError('Identity ID must be a positive integer');
        setIsLoading(false);
        return;
      }

      const response = await fetch('/api/customer/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          customerId: customer.customerId,
        }),
      });

      const data = await response.json();

      if (data.code === '00') {
        onSuccess();
      } else {
        setError(data.message || 'Failed to update customer');
      }
    } catch (err) {
      setError('An error occurred while updating the customer');
      console.error('Error updating customer:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-6">
      <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-gray-100">Edit Customer</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <div className="space-y-4">
          <div>
            <label htmlFor="identityId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Identity ID
            </label>
            <input
              type="number"
              id="identityId"
              name="identityId"
              value={formData.identityId}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 dark:text-gray-100 dark:border-gray-700 dark:bg-gray-800 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
              min="1"
            />
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 dark:text-gray-100 dark:border-gray-700 dark:bg-gray-800 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 dark:text-gray-100 dark:border-gray-700 dark:bg-gray-800 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Phone
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 dark:text-gray-100 dark:border-gray-700 dark:bg-gray-800 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Address
            </label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows={3}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 dark:text-gray-100 dark:border-gray-700 dark:bg-gray-800 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>

          <div>
            <label htmlFor="detail" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Details
            </label>
            <textarea
              id="detail"
              name="detail"
              value={formData.detail}
              onChange={handleChange}
              rows={3}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 dark:text-gray-100 dark:border-gray-700 dark:bg-gray-800 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Date of Birth
            </label>
            <input
              type="date"
              id="dateOfBirth"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 dark:text-gray-100 dark:border-gray-700 dark:bg-gray-800 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>
        </div>

        {error && (
          <div className="text-red-600 dark:text-red-400 text-sm mt-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-md">
            {error}
          </div>
        )}

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onBack}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Updating...' : 'Update Customer'}
          </button>
        </div>
      </form>
    </div>
  );
} 