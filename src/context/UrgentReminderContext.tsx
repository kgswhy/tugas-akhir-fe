'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { deleteCookie } from 'cookies-next';

interface UrgentReminderContextType {
    hasUrgentReminders: boolean;
    checkUrgentReminders: () => Promise<void>;
}

const UrgentReminderContext = createContext<UrgentReminderContextType>({
    hasUrgentReminders: false,
    checkUrgentReminders: async () => {},
});

export const useUrgentReminders = () => useContext(UrgentReminderContext);

export function UrgentReminderProvider({ children }: { children: React.ReactNode }) {
    const [hasUrgentReminders, setHasUrgentReminders] = useState(false);
    const router = useRouter();

    const checkUrgentReminders = async () => {
        try {
            const response = await fetch('/api/reminder/check-urgent');
            const data = await response.json();

            if (data.code === '00') {
                setHasUrgentReminders(data.data.hasUrgentReminders);
            } else if (data.code === 'AUT_001') {
                deleteCookie('auth_token');
                localStorage.removeItem('user_data');
                router.push('/login');
            }
        } catch (error) {
            console.error('Error checking urgent reminders:', error);
        }
    };

    useEffect(() => {
        checkUrgentReminders();
        
        // Check every minute for new urgent reminders
        const interval = setInterval(checkUrgentReminders, 60000);
        
        return () => clearInterval(interval);
    }, []);

    return (
        <UrgentReminderContext.Provider value={{ hasUrgentReminders, checkUrgentReminders }}>
            {children}
        </UrgentReminderContext.Provider>
    );
} 