'use client'

import { useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Flex, Spin } from 'antd';
import { ROUTE_PATH } from '@/app/lib/constant';
import { notification } from '@/app/lib/notify';
import { signIn } from 'next-auth/react';

const OAuth2RedirectHandler = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleOAuthLogin = useCallback(async () => {
        const token = searchParams.get('token');
        const error = searchParams.get('error');

        try {
            if (error) {
                notification.error({
                    message: 'Login failed',
                    description: error
                });
                router.push(ROUTE_PATH.LOGIN);
                return;
            }

            if (token) {
                console.log('SignIn params:', { token: token, redirect: false });
                await signIn('custom-oauth2', { token: token, redirect: false });
                router.push(ROUTE_PATH.HOME);
            }
        } catch (err) {
            notification.error({
                message: 'Login failed',
                description: err instanceof Error ? err.message : 'An error occurred during login processing'
            });
            router.push(ROUTE_PATH.LOGIN);
        }
    }, [searchParams, router]);

    useEffect(() => {
        handleOAuthLogin();
    }, [handleOAuthLogin]);

    return (
        <Flex align="center" justify="center" style={{ minHeight: '100vh' }}>
            <Spin size="large" tip="Processing login..." />
        </Flex>
    );
};

export default OAuth2RedirectHandler;
