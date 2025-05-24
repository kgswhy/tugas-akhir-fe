'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { setCookie } from 'cookies-next';

interface MerchantSubscription {
    merchantId: number;
    name: string;
    endContractDate: string;
    active: boolean;
}

interface ApiResponse {
    code: string;
    message: string;
    data: MerchantSubscription;
}

interface LoginResponse {
    code: string;
    message: string;
    data?: {
        userId: number;
        merchantId: number;
        authToken: string;
        level: number;
        createdDate: string;
        expiredDate: string;
    };
}

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [loginError, setLoginError] = useState<string | null>(null);
    const [merchantStatus, setMerchantStatus] = useState<{
        isActive: boolean;
        message?: string;
    }>({ isActive: false });
    const router = useRouter();

    useEffect(() => {
        const checkMerchantStatus = async () => {
            try {
                console.log("ASELOLE");
                const response = await fetch(
                    `/api/merchant/subscription?merchantId=${process.env.NEXT_PUBLIC_MERCHANT_ID}&merchantSecret=${process.env.NEXT_PUBLIC_MERCHANT_SECRET}`
                );
                const data: ApiResponse = await response.json();

                if (data.code === '00' && data.data.active) {
                    setMerchantStatus({ isActive: true });
                } else {
                    setMerchantStatus({
                        isActive: false,
                        message: 'Merchant not active'
                    });
                }
            } catch (error) {
                setMerchantStatus({
                    isActive: false,
                    message: 'Failed to check merchant status'
                });
            } finally {
                setIsLoading(false);
            }
        };

        checkMerchantStatus();
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoggingIn(true);
        setLoginError(null);

        try {
            const response = await fetch('/api/user/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    merchantId: process.env.NEXT_PUBLIC_MERCHANT_ID,
                    email,
                    password,
                }),
            });

            const data: LoginResponse = await response.json();

            if (data.code === '00' && data.data) {
                // Store the auth token and user data
                setCookie('auth_token', data.data.authToken, {
                    maxAge: 30 * 24 * 60 * 60, // 30 days
                    path: '/',
                });

                setCookie('user_data', JSON.stringify(data.data), {
                    maxAge: 30 * 24 * 60 * 60, // 30 days
                    path: '/',
                });
                
                // Store user data in localStorage for easy access
                localStorage.setItem('user_data', JSON.stringify(data.data));
                
                // Redirect to dashboard
                window.location.href = '/dashboard';
            } else if (data.code === 'AUT_003') {
                setLoginError('Invalid email or password');
            } else {
                setLoginError(data.message || 'Login failed');
            }
        } catch (error) {
            setLoginError('An error occurred during login');
        } finally {
            setIsLoggingIn(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Checking merchant status...</p>
                </div>
            </div>
        );
    }

    if (!merchantStatus.isActive) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg text-center">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">
                        {merchantStatus.message || 'Merchant not active'}
                    </h2>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Sign in to your account
                    </h2>
                </div>
                {loginError && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded relative" role="alert">
                        <span className="block sm:inline">{loginError}</span>
                    </div>
                )}
                <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="email" className="sr-only">
                                Email address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isLoggingIn}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoggingIn ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Signing in...
                                </>
                            ) : (
                                'Sign in'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
} 