import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        
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
            `${process.env.NEXT_PUBLIC_HOST_URL}/reminder/inactivate/${id}`,
            {
                method: 'PUT',
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
        console.error('Error inactivating reminder:', error);
        return NextResponse.json(
            { code: 'ERR_001', message: 'Internal server error' },
            { status: 500 }
        );
    }
} 