import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

interface CreateCustomerRequest {
  merchantId: number;
  identityId: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  detail: string;
  dateOfBirth: string;
}

interface CreateCustomerResponse {
  code: string;
  message: string;
  data?: {
    customerId: number;
    merchantId: number;
    identityId: number;
    name: string;
    email: string;
    phone: string;
    address: string;
    detail: string;
    dateOfBirth: string;
    createdDate: string;
    updatedDate: string | null;
  };
}

export async function POST(request: Request) {
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
    const body: CreateCustomerRequest = await request.json();

    // Validate identityId is a positive integer
    if (!Number.isInteger(body.identityId) || body.identityId <= 0) {
      return NextResponse.json(
        { code: 'VAL_001', message: 'Identity ID must be a positive integer' },
        { status: 400 }
      );
    }

    // Check if identity already exists
    const checkResponse = await fetch(
      `${process.env.NEXT_PUBLIC_HOST_URL}/customer/list?identityId=${body.identityId}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'userId': userId.toString(),
          'merchantId': merchantId.toString(),
          'authToken': authToken.value,
        },
      }
    );

    const checkData = await checkResponse.json();
    if (checkData.code === '00' && checkData.data?.customers?.length > 0) {
      return NextResponse.json(
        { code: 'VAL_002', message: 'Identity ID already exists' },
        { status: 400 }
      );
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_HOST_URL}/customer/create`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'userId': userId.toString(),
          'merchantId': merchantId.toString(),
          'authToken': authToken.value,
        },
        body: JSON.stringify(body),
      }
    );

    const data: CreateCustomerResponse = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error creating customer:', error);
    return NextResponse.json(
      { code: 'ERR_001', message: 'Internal server error' },
      { status: 500 }
    );
  }
} 