'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/hooks/useUser';

interface CreateCustomerFormData {
  identityId: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  detail: string;
  dateOfBirth: string;
}

interface CreateCustomerFormProps {
  onBack: () => void;
  onSuccess: () => void;
}

export default function CreateCustomerForm({ onBack, onSuccess }: CreateCustomerFormProps) {
  const router = useRouter();
  const userData = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [identityError, setIdentityError] = useState<string | null>(null);

  const [formData, setFormData] = useState<CreateCustomerFormData>({
    identityId: 0,
    name: '',
    email: '',
    phone: '',
    address: '',
    detail: '',
    dateOfBirth: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'identityId') {
      const numValue = parseInt(value) || 0;
      if (numValue <= 0) {
        setIdentityError('Identity ID must be a positive number');
      } else {
        setIdentityError(null);
      }
      setFormData(prev => ({
        ...prev,
        [name]: numValue,
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.identityId <= 0) {
      setIdentityError('Identity ID must be a positive number');
      return;
    }

    setIsLoading(true);
    setError(null);
    setIdentityError(null);

    try {
      if (!userData?.merchantId) {
        throw new Error('Merchant ID not found');
      }

      const response = await fetch('/api/customer/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          merchantId: userData.merchantId,
        }),
      });

      const data = await response.json();

      if (data.code === '00') {
        onSuccess();
      } else if (data.code === 'VAL_002') {
        setIdentityError('This Identity ID is already in use');
      } else {
        setError(data.message || 'Failed to create customer');
      }
    } catch (err) {
      setError('An error occurred while creating the customer');
      console.error('Error creating customer:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto p-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="identityId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Identity ID
          </label>
          <input
            type="number"
            id="identityId"
            name="identityId"
            value={formData.identityId || ''}
            onChange={handleChange}
            min="1"
            className={`mt-1 block w-full rounded-md border ${
              identityError ? 'border-red-500' : 'border-gray-300'
            } px-3 py-2 text-gray-900 dark:text-gray-100 dark:border-gray-700 dark:bg-gray-800 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
            required
          />
          {identityError && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {identityError}
            </p>
          )}
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
        <div className="text-red-600 dark:text-red-400 text-sm mt-2">
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
          disabled={isLoading || !!identityError}
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Creating...' : 'Create Customer'}
        </button>
      </div>
    </form>
  );
} 