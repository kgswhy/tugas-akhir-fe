import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

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
        const headers = {
            'Content-Type': 'application/json',
            'userId': userId.toString(),
            'merchantId': merchantId.toString(),
            'authToken': authToken.value
        };

        // Fetch all stats in parallel
        const [customersResponse, usersResponse, remindersResponse] = await Promise.all([
            fetch(`${process.env.NEXT_PUBLIC_HOST_URL}/customer/list?page=0&size=1`, { headers }),
            fetch(`${process.env.NEXT_PUBLIC_HOST_URL}/user/list?page=0&size=1`, { headers }),
            fetch(`${process.env.NEXT_PUBLIC_HOST_URL}/reminder/list?page=0&size=10`, { headers })
        ]);

        const [customersData, usersData, remindersData] = await Promise.all([
            customersResponse.json(),
            usersResponse.json(),
            remindersResponse.json()
        ]);

        return NextResponse.json({
            code: '00',
            data: {
                totalCustomers: customersData.data?.totalData || 0,
                totalUsers: usersData.data?.totalData || 0,
                totalReminders: remindersData.data?.totalData || 0
            }
        });
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        return NextResponse.json(
            { code: 'ERR_001', message: 'Internal server error' },
            { status: 500 }
        );
    }
} 