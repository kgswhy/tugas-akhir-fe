'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/hooks/useUser';

interface CreateActivityFormData {
  type: string;
  description: string;
  activityDate: string;
  files: File[];
}

interface CreateActivityFormProps {
  customerId: number;
  onBack: () => void;
  onSuccess: () => void;
}

export default function CreateActivityForm({ customerId, onBack, onSuccess }: CreateActivityFormProps) {
  const router = useRouter();
  const userData = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<CreateActivityFormData>({
    type: '',
    description: '',
    activityDate: '',
    files: [],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData(prev => ({
      ...prev,
      files: files,
    }));
  };

  const removeFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index),
    }));
  };

  const formatDateForBackend = (dateTimeLocal: string) => {
    const date = new Date(dateTimeLocal);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (!userData?.merchantId) {
        throw new Error('Merchant ID not found');
      }

      const formDataToSend = new FormData();
      formDataToSend.append('customerId', customerId.toString());
      formDataToSend.append('type', formData.type);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('activityDate', formatDateForBackend(formData.activityDate));

      // Append files
      formData.files.forEach((file) => {
        formDataToSend.append('files', file);
      });

      const response = await fetch('/api/activity/create', {
        method: 'POST',
        body: formDataToSend,
      });

      const data = await response.json();

      if (data.code === '00') {
        onSuccess();
      } else {
        setError(data.message || 'Failed to create activity');
      }
    } catch (err) {
      setError('An error occurred while creating the activity');
      console.error('Error creating activity:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const activityTypes = [
    'Permohonan',
    'Konsultasi',
    'Pengaduan',
    'Informasi',
    'Pelayanan',
    'Tindak Lanjut',
    'Verifikasi',
    'Evaluasi',
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-6">
      <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-gray-100">Create Activity</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <div className="space-y-4">
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Activity Type
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 dark:text-gray-100 dark:border-gray-700 dark:bg-gray-800 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            >
              <option value="">Select activity type</option>
              {activityTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 dark:text-gray-100 dark:border-gray-700 dark:bg-gray-800 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Describe the activity in detail..."
              required
            />
          </div>

          <div>
            <label htmlFor="activityDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Activity Date & Time
            </label>
            <input
              type="datetime-local"
              id="activityDate"
              name="activityDate"
              value={formData.activityDate}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 dark:text-gray-100 dark:border-gray-700 dark:bg-gray-800 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>

          <div>
            <label htmlFor="files" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Attach Files (optional)
            </label>
            <input
              type="file"
              id="files"
              multiple
              onChange={handleFileChange}
              className="mt-1 block w-full text-sm text-gray-500 dark:text-gray-400
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-medium
                file:bg-indigo-50 file:text-indigo-700
                hover:file:bg-indigo-100
                dark:file:bg-indigo-900/20 dark:file:text-indigo-400
                dark:hover:file:bg-indigo-900/30"
              accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Supported formats: Images, PDF, Word, Excel files
            </p>
            
            {formData.files.length > 0 && (
              <div className="mt-3 space-y-2">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Selected files ({formData.files.length}):
                </p>
                {formData.files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 rounded-md px-3 py-2">
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm text-gray-700 dark:text-gray-300">{file.name}</span>
                      <span className="text-xs text-gray-500">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
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
            {isLoading ? 'Creating...' : 'Create Activity'}
          </button>
        </div>
      </form>
    </div>
  );
} 