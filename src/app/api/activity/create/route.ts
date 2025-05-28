import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

interface CreateActivityResponse {
  code: string;
  message: string;
  data?: {
    activityId: number;
    merchantId: number;
    userId: number;
    customerId: number;
    type: string;
    description: string;
    totalFiles: number;
    activityDate: string;
    createdDate: string;
    updatedDate: string;
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
    const formData = await request.formData();

    // Create a new FormData object for the backend request
    const backendFormData = new FormData();
    
    // Add required fields
    backendFormData.append('userId', userId.toString());
    backendFormData.append('merchantId', merchantId.toString());
    
    // Get form fields
    const customerId = formData.get('customerId');
    const type = formData.get('type');
    const description = formData.get('description');
    const activityDate = formData.get('activityDate');

    if (!customerId || !type || !description || !activityDate) {
      return NextResponse.json(
        { code: 'VAL_001', message: 'Missing required fields' },
        { status: 400 }
      );
    }

    backendFormData.append('customerId', customerId.toString());
    backendFormData.append('type', type.toString());
    backendFormData.append('description', description.toString());
    backendFormData.append('activityDate', activityDate.toString());

    // Handle file uploads
    const files = formData.getAll('files');
    files.forEach((file) => {
      if (file instanceof File) {
        backendFormData.append('files', file);
      }
    });

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_HOST_URL}/activity/create`,
      {
        method: 'POST',
        headers: {
          'authToken': authToken.value,
        },
        body: backendFormData,
      }
    );

    const data: CreateActivityResponse = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error creating activity:', error);
    return NextResponse.json(
      { code: 'ERR_001', message: 'Internal server error' },
      { status: 500 }
    );
  }
} 