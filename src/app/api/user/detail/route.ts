import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

interface UserDetailResponse {
    code: string;
    message: string;
    data?: {
        userId: number;
        merchantId: number;
        name: string;
        email: string;
        phone: string;
        level: number;
        createdDate: string;
        updatedDate: string;
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
            `${process.env.NEXT_PUBLIC_HOST_URL}/user/${userId}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'userId': userId.toString(),
                    'merchantId': merchantId.toString(),
                    'authToken': authToken.value
                },
            }
        );

        const data: UserDetailResponse = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching user details:', error);
        return NextResponse.json(
            { code: 'ERR_001', message: 'Internal server error' },
            { status: 500 }
        );
    }
} 