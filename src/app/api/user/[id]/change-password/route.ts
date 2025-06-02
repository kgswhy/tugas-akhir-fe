import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const cookieStore = await cookies();
        const authToken = cookieStore.get('auth_token')?.value;
        const userData = cookieStore.get('user_data')?.value;

        if (!authToken || !userData) {
            return NextResponse.json(
                { code: 'AUT_001', message: 'Unauthorized' },
                { status: 401 }
            );
        }

        const user = JSON.parse(userData);
        const { userId, merchantId } = user;
        const targetUserId = params.id;
        const { oldPassword, newPassword } = await request.json();

        // Validate required fields
        if (!oldPassword || !newPassword) {
            return NextResponse.json(
                { code: 'ERR_003', message: 'oldPassword and newPassword are required' },
                { status: 400 }
            );
        }

        // Prepare external API call
        const externalApiUrl = `${process.env.NEXT_PUBLIC_HOST_URL}/user/change-password`;
        const headers = {
            'Content-Type': 'application/json',
            'userId': userId.toString(),
            'merchantId': merchantId.toString(),
            'authToken': authToken,
        };
        const body = {
            targetUserId: targetUserId.toString(),
            oldPassword: oldPassword,
            newPassword: newPassword,
        };

        // Call external API
        const response = await fetch(externalApiUrl, {
            method: 'PUT',
            headers: headers,
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const errorText = await response.text();
            return NextResponse.json(
                { code: 'ERR_002', message: `External API error: ${response.status}`, details: errorText },
                { status: response.status }
            );
        }

        const data = await response.json();

        return NextResponse.json(data);
    } catch (error) {
        console.error('Change Password API - Error:', error);
        return NextResponse.json(
            { code: 'ERR_001', message: 'Internal server error' },
            { status: 500 }
        );
    }
} 