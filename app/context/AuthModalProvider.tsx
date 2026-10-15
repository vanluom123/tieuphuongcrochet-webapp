'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
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
  openAuth: (view: AuthView, options?: OpenAuthOptions) => void;
  closeAuth: () => void;
  setAuthView: (view: AuthView) => void;
  handleLoginSuccess: () => Promise<void>;
}

const AuthModalContext = createContext<AuthModalContextValue | null>(null);

function AuthModalUrlBridge({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [open, setOpen] = useState(false);
  const [view, setView] = useState<AuthView>('login');
  const [callbackUrl, setCallbackUrl] = useState<string | undefined>();
  const [intent, setIntent] = useState<AuthIntent | undefined>();

  useEffect(() => {
    const authView = parseAuthView(searchParams.get('auth'));
    if (authView) {
      setView(authView);
      setOpen(true);
      setCallbackUrl(searchParams.get('callbackUrl') ?? undefined);
      setIntent(parseAuthIntent(searchParams.get('intent')));
    } else {
      setOpen(false);
    }
  }, [searchParams]);

  const replaceAuthParams = useCallback(
    (nextView: AuthView | null, options?: OpenAuthOptions) => {
      const params = new URLSearchParams(searchParams.toString());

      if (nextView) {
        params.set('auth', nextView);
      } else {
        params.delete('auth');
        params.delete('callbackUrl');
        params.delete('intent');
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

      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  const openAuth = useCallback(
    (nextView: AuthView, options?: OpenAuthOptions) => {
      setView(nextView);
      setOpen(true);
      if (options?.callbackUrl !== undefined) {
        setCallbackUrl(options.callbackUrl);
      }
      if (options?.intent !== undefined) {
        setIntent(options.intent);
      }
      replaceAuthParams(nextView, options);
    },
    [replaceAuthParams]
  );

  const closeAuth = useCallback(() => {
    replaceAuthParams(null);
  }, [replaceAuthParams]);

  const setAuthView = useCallback(
    (nextView: AuthView) => {
      setView(nextView);
      replaceAuthParams(nextView);
    },
    [replaceAuthParams]
  );

  const handleLoginSuccess = useCallback(async () => {
    const session = await getSession();
    const targetCallback = callbackUrl;

    closeAuth();

    if (targetCallback) {
      router.push(targetCallback);
      return;
    }

    if (session?.user?.role === USER_ROLES.ADMIN) {
      router.push(ROUTE_PATH.DASHBOARD);
    }
  }, [callbackUrl, closeAuth, router]);

  const value = useMemo(
    () => ({
      open,
      view,
      callbackUrl,
      intent,
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
