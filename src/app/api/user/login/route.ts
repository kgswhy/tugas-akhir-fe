import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { merchantId, email, password } = body;

        if (!merchantId || !email || !password) {
            return NextResponse.json(
                { error: 'Missing required parameters' },
                { status: 400 }
            );
        }

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_HOST_URL}/user/login?merchantId=${merchantId}&email=${email}&password=${password}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error in login proxy:', error);
        return NextResponse.json(
            { error: 'Failed to process login' },
            { status: 500 }
        );
    }
} 