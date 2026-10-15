'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { ROUTE_PATH } from '@/app/lib/constant';
import { AuthView } from '@/app/lib/auth/types';

interface AuthRouteRedirectProps {
  auth: AuthView;
}

const AuthRouteRedirect: React.FC<AuthRouteRedirectProps> = ({ auth }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const params = new URLSearchParams();
    params.set('auth', auth);
    const callbackUrl = searchParams.get('callbackUrl');
    if (callbackUrl) {
      params.set('callbackUrl', callbackUrl);
    }
    router.replace(`${ROUTE_PATH.HOME}?${params.toString()}`);
  }, [auth, router, searchParams]);

  return null;
};

export default AuthRouteRedirect;
