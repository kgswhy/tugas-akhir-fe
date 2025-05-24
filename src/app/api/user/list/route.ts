import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const page = searchParams.get('page') || '0';
        const size = searchParams.get('size') || '6';

        const cookieStore = await cookies();
        const authToken = cookieStore.get('auth_token');
        const userData = cookieStore.get('user_data');

        if (!authToken || !userData) {
            return NextResponse.json(
                { code: 'AUT_001', message: 'Authentication required' },
                { status: 401 }
            );
        }

        const userDataParsed = JSON.parse(userData.value);
        const { userId, merchantId } = userDataParsed;

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_HOST_URL}/user/list?page=${page}&size=${size}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'userId': userId.toString(),
                    'merchantId': merchantId.toString(),
                    'authToken': authToken.value
                },
            }
        );

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error in user list proxy:', error);
        return NextResponse.json(
            { error: 'Failed to fetch user list' },
            { status: 500 }
        );
    }
} 