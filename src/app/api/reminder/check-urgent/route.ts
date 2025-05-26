import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

interface Reminder {
    reminderId: number;
    title: string;
    description: string;
    remindAt: string;
    isActive: boolean;
    isUrgent: boolean;
    userId: number;
    activityId: number;
    createdDate: string;
    updatedDate: string;
}

interface ReminderListResponse {
    code: string;
    message: string;
    data?: {
        page: number;
        size: number;
        totalData: number;
        totalPages: number;
        reminders: Reminder[];
    };
}

export async function GET() {
    try {
        const cookieStore = await cookies();
        const authToken = cookieStore.get('auth_token');
        const userData = cookieStore.get('user_data')?.value;

        if (!authToken || !userData) {
            return NextResponse.json(
                { code: 'AUT_001', message: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { userId, merchantId } = JSON.parse(userData);

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_HOST_URL}/reminder/list?page=0&size=100`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'userId': userId.toString(),
                    'merchantId': merchantId.toString(),
                    'authToken': authToken.value
                },
            }
        );

        const data: ReminderListResponse = await response.json();
        
        // Check if there are any active and urgent reminders
        const hasUrgentReminders = data.code === '00' && 
            data.data?.reminders.some(reminder => reminder.isActive && reminder.isUrgent);
        
        return NextResponse.json({
            code: '00',
            data: {
                hasUrgentReminders
            }
        });
    } catch (error) {
        console.error('Error checking urgent reminders:', error);
        return NextResponse.json(
            { code: 'ERR_001', message: 'Internal server error' },
            { status: 500 }
        );
    }
} 