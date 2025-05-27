'use client';

import { useEffect, useState } from 'react';

interface UserData {
  userId: number;
  merchantId: number;
  authToken: string;
  level: number;
  createdDate: string;
  expiredDate: string;
  name?: string;
  email?: string;
  phone?: string;
}

export function useUser() {
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    // Get user data from localStorage on component mount
    const storedUserData = localStorage.getItem('user_data');
    if (storedUserData) {
      try {
        const parsedUserData = JSON.parse(storedUserData);
        setUserData(parsedUserData);

        // Fetch additional user details
        fetch('/api/user/detail')
          .then((res) => res.json())
          .then((response) => {
            if (response.code === '00' && response.data) {
              const updatedUserData = {
                ...parsedUserData,
                name: response.data.name,
                email: response.data.email,
                phone: response.data.phone,
              };
              setUserData(updatedUserData);
              localStorage.setItem('user_data', JSON.stringify(updatedUserData));
            }
          })
          .catch((error) => {
            console.error('Error fetching user details:', error);
          });
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  return userData;
} 