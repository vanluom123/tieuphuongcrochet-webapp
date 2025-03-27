import { BookmarkModalProvider } from '@/app/context/BookmarkModalContext';
import { ReactNode } from 'react';

export default function MainLayout({ children }: { children: ReactNode }) {
    return (
        <BookmarkModalProvider>
            {children}
        </BookmarkModalProvider>
    );
}