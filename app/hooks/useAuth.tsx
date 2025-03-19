'use client'
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { ROUTE_PATH } from '@/app/lib/constant';

export function useAuth(requireAdmin = false) {
    const { data: session, status } = useSession();
    const [showLoginModal, setShowLoginModal] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (status === 'unauthenticated') {
            if (pathname.startsWith(ROUTE_PATH.DASHBOARD)) {
                setShowLoginModal(true);
            }
        } else if (status === 'authenticated') {
            if (requireAdmin && session?.user?.role !== 'ADMIN') {
                router.push(ROUTE_PATH.HOME);
            }
        }
    }, [status, session, pathname, requireAdmin, router]);

    return {
        session,
        status,
        showLoginModal,
        setShowLoginModal
    };
}