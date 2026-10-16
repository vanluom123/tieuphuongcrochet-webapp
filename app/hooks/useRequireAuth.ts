'use client';

import { useSession } from 'next-auth/react';
import { useCallback } from 'react';

import { useAuthModal } from '@/app/context/AuthModalProvider';
import { AuthIntent } from '@/app/lib/auth/types';

export function useRequireAuth() {
  const { data: session, status } = useSession();
  const { openAuth } = useAuthModal();

  const requireAuth = useCallback(
    (intent?: AuthIntent, callbackUrl?: string): boolean => {
      if (status === 'loading') {
        return false;
      }
      if (status === 'authenticated' && session?.user) {
        return true;
      }
      openAuth('login', { intent, callbackUrl });
      return false;
    },
    [openAuth, session?.user, status]
  );

  return { requireAuth, session, status };
}
