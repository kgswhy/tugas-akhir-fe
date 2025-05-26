'use client';

import { useEffect } from 'react';
import { useUrgentReminders } from '@/context/UrgentReminderContext';

export default function DashboardTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  const { checkUrgentReminders } = useUrgentReminders();

  useEffect(() => {
    // Check for urgent reminders when dashboard is accessed
    checkUrgentReminders();
  }, []);

  return children;
} 