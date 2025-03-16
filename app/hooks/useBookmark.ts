'use client'

import { useState, useEffect } from 'react';
import { checkPatternInCollection } from '@/app/lib/service/collectionService';
import { useBookmarkModal } from '@/app/context/BookmarkModalContext';

export function useBookmark(patternId?: string) {
    const [isBookmarked, setIsBookmarked] = useState(false);
    const { openBookmarkModal, bookmarkModalState, closeBookmarkModal, handleBookmarkSuccess } = useBookmarkModal();

    useEffect(() => {
        if (patternId) {
            checkBookmarkStatus(patternId);
        }
    }, [patternId]);

    const checkBookmarkStatus = async (id: string) => {
        try {
            const res = await checkPatternInCollection(id);
            setIsBookmarked(res.data);
        } catch (error) {
            console.error('Error checking bookmark status:', error);
        }
    };

    return {
        isBookmarked,
        openBookmarkModal,
        bookmarkModalState,
        closeBookmarkModal,
        handleBookmarkSuccess
    };
} 