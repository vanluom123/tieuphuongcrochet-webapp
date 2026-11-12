'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  Suspense,
} from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { getSession } from 'next-auth/react';

import { ROUTE_PATH, USER_ROLES } from '@/app/lib/constant';
import {
  AuthIntent,
  AuthView,
  OpenAuthOptions,
  parseAuthIntent,
  parseAuthView,
} from '@/app/lib/auth/types';
import AuthModal from '@/app/components/auth/AuthModal';

interface AuthModalContextValue {
  open: boolean;
  view: AuthView;
  callbackUrl?: string;
  intent?: AuthIntent;
  prefillEmail?: string;
  openAuth: (view: AuthView, options?: OpenAuthOptions) => void;
  closeAuth: () => void;
  setAuthView: (view: AuthView, options?: OpenAuthOptions) => void;
  handleLoginSuccess: () => Promise<void>;
}

const AuthModalContext = createContext<AuthModalContextValue | null>(null);

function AuthModalUrlBridge({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const parsedView = parseAuthView(searchParams.get('auth'));
  const open = !!parsedView;
  const view: AuthView = parsedView ?? 'login';
  const callbackUrl = searchParams.get('callbackUrl') ?? undefined;
  const intent = parseAuthIntent(searchParams.get('intent'));
  const prefillEmail = searchParams.get('email') ?? undefined;

  const replaceAuthParams = useCallback(
    (nextView: AuthView | null, options?: OpenAuthOptions) => {
      const params = new URLSearchParams(searchParams.toString());

      if (nextView) {
        params.set('auth', nextView);
      } else {
        params.delete('auth');
        params.delete('callbackUrl');
        params.delete('intent');
        params.delete('email');
      }

      if (options?.callbackUrl !== undefined) {
        if (options.callbackUrl) {
          params.set('callbackUrl', options.callbackUrl);
        } else {
          params.delete('callbackUrl');
        }
      }

      if (options?.intent !== undefined) {
        if (options.intent) {
          params.set('intent', options.intent);
        } else {
          params.delete('intent');
        }
      }

      if (options?.email !== undefined) {
        if (options.email) {
          params.set('email', options.email);
        } else {
          params.delete('email');
        }
      } else if (nextView && nextView !== 'resend_verification') {
        params.delete('email');
      }

      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  const openAuth = useCallback(
    (nextView: AuthView, options?: OpenAuthOptions) => {
      replaceAuthParams(nextView, options);
    },
    [replaceAuthParams]
  );

  const closeAuth = useCallback(() => {
    replaceAuthParams(null);
  }, [replaceAuthParams]);

  const setAuthView = useCallback(
    (nextView: AuthView, options?: OpenAuthOptions) => {
      replaceAuthParams(nextView, options);
    },
    [replaceAuthParams]
  );

  const handleLoginSuccess = useCallback(async () => {
    const session = await getSession();
    const targetCallback = searchParams.get('callbackUrl') ?? undefined;

    closeAuth();

    if (targetCallback) {
      router.push(targetCallback);
      return;
    }

    if (session?.user?.role === USER_ROLES.ADMIN) {
      router.push(ROUTE_PATH.DASHBOARD);
    }
  }, [closeAuth, router, searchParams]);

  const value = useMemo(
    () => ({
      open,
      view,
      callbackUrl,
      intent,
      prefillEmail,
      openAuth,
      closeAuth,
      setAuthView,
      handleLoginSuccess,
    }),
    [
      open,
      view,
      callbackUrl,
      intent,
      prefillEmail,
      openAuth,
      closeAuth,
      setAuthView,
      handleLoginSuccess,
    ]
  );

  return (
    <AuthModalContext.Provider value={value}>
      {children}
      <AuthModal />
    </AuthModalContext.Provider>
  );
}

export function AuthModalProvider({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={null}>
      <AuthModalUrlBridge>{children}</AuthModalUrlBridge>
    </Suspense>
  );
}

export function useAuthModal(): AuthModalContextValue {
  const ctx = useContext(AuthModalContext);
  if (!ctx) {
    throw new Error('useAuthModal must be used within AuthModalProvider');
  }
  return ctx;
}
