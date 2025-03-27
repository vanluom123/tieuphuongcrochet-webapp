'use client'

import { BookmarkModalProvider } from '@/app/context/BookmarkModalContext';
import { ReactNode } from 'react';

export default function FreePatternDetailLayout({ children }: { children: ReactNode }) {
    return (
        <BookmarkModalProvider>
            {children}
        </BookmarkModalProvider>
    );
}