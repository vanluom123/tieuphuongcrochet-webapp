import { BookmarkModalProvider } from '@/app/context/BookmarkModalContext';
import { ReactNode } from 'react';

export default function ProfileLayout({ children }: { children: ReactNode }) {
    return (
        <BookmarkModalProvider>
            {children}
        </BookmarkModalProvider>
    );
}