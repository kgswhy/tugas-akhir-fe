import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(
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

        const { userId, merchantId } = JSON.parse(userData);
        const targetUserId = params.id;
        const { currentPassword, newPassword } = await request.json();

        // Dummy response for now
        return NextResponse.json({
            code: '00',
            message: 'Password changed successfully'
        });
    } catch (error) {
        console.error('Error changing password:', error);
        return NextResponse.json(
            { code: 'ERR_001', message: 'Internal server error' },
            { status: 500 }
        );
    }
} 