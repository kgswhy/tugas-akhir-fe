import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const merchantId = searchParams.get('merchantId');
        const merchantSecret = searchParams.get('merchantSecret');

        if (!merchantId || !merchantSecret) {
            return NextResponse.json(
                { error: 'Missing required parameters' },
                { status: 400 }
            );
        }
        const url = `${process.env.NEXT_PUBLIC_HOST_URL}/merchant/subscription?merchantId=${merchantId}&merchantSecret=${merchantSecret}`;
        console.log(url);
        const response = await fetch(
            url,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error in merchant subscription proxy:', error);
        return NextResponse.json(
            { error: 'Failed to fetch merchant subscription' },
            { status: 500 }
        );
    }
} 