'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react';
import BookmarkModal from '@/app/components/BookmarkModal';

interface BookmarkModalContextType {
    openBookmarkModal: (patternId: string) => void;
    closeBookmarkModal: () => void;
    bookmarkModalState: {
        open: boolean;
        patternId: string;
    };
    handleBookmarkSuccess: () => void;
}

const BookmarkModalContext = createContext<BookmarkModalContextType | undefined>(undefined);

export const BookmarkModalProvider = ({ children }: { children: ReactNode }) => {
    const [bookmarkModalState, setBookmarkModalState] = useState({
        open: false,
        patternId: ''
    });

    const [bookmarkedPatterns, setBookmarkedPatterns] = useState<Record<string, boolean>>({});

    const openBookmarkModal = (patternId: string) => {
        setBookmarkModalState({
            open: true,
            patternId
        });
    };

    const closeBookmarkModal = () => {
        const currentPatternId = bookmarkModalState.patternId;
        
        setBookmarkModalState(prev => ({
            open: false,
            patternId: currentPatternId
        }));
        
        setTimeout(() => {
            setBookmarkModalState(prev => ({
                ...prev,
                patternId: ''
            }));
        }, 100);
    };

    const handleBookmarkSuccess = () => {
        setBookmarkedPatterns(prev => ({
            ...prev,
            [bookmarkModalState.patternId]: true
        }));
    };

    return (
        <BookmarkModalContext.Provider
            value={{
                openBookmarkModal,
                closeBookmarkModal,
                bookmarkModalState,
                handleBookmarkSuccess
            }}
        >
            {children}
            <BookmarkModal
                open={bookmarkModalState.open}
                onClose={closeBookmarkModal}
                patternId={bookmarkModalState.patternId}
                onSuccess={handleBookmarkSuccess}
            />
        </BookmarkModalContext.Provider>
    );
};

export const useBookmarkModal = () => {
    const context = useContext(BookmarkModalContext);
    if (context === undefined) {
        throw new Error('useBookmarkModal must be used within a BookmarkModalProvider');
    }
    return context;
}; 