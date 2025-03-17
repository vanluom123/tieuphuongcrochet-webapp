'use client'

import { useState, useEffect } from 'react';
import { checkPatternInCollection } from '@/app/lib/service/collectionService';
import { useBookmarkModal } from '@/app/context/BookmarkModalContext';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ROUTE_PATH } from '@/app/lib/constant';

export function useBookmark(patternId?: string) {
    const [isBookmarked, setIsBookmarked] = useState(false);
    const { openBookmarkModal, bookmarkModalState, closeBookmarkModal, handleBookmarkSuccess } = useBookmarkModal();
    const [currentPatternId, setCurrentPatternId] = useState<string | undefined>(patternId);
    const { data: session } = useSession();
    const router = useRouter();
    const isLoggedIn = !!session?.user;

    useEffect(() => {
        setCurrentPatternId(patternId);
        if (patternId && isLoggedIn) {
            checkBookmarkStatus(patternId);
        }
    }, [patternId, isLoggedIn]);

    useEffect(() => {
        if (bookmarkModalState.patternId === patternId && !bookmarkModalState.open && isLoggedIn) {
            if (patternId) {
                checkBookmarkStatus(patternId);
            }
        }
    }, [bookmarkModalState, patternId, isLoggedIn]);

    const checkBookmarkStatus = async (id: string) => {
        try {
            const res = await checkPatternInCollection(id);
            setIsBookmarked(res.data);
        } catch (error) {
            console.error('Error checking bookmark status:', error);
        }
    };

    const updateBookmarkStatus = (savedPatternId: string) => {
        if (currentPatternId === savedPatternId) {
            setIsBookmarked(true);
        }
    };

    const handleBookmarkClick = (id: string) => {
        if (!isLoggedIn) {
            // Chuyển hướng đến trang đăng nhập nếu chưa đăng nhập
            router.push(ROUTE_PATH.LOGIN);
            return;
        }
        
        // Nếu đã đăng nhập, mở modal bookmark bình thường
        setCurrentPatternId(id);
        openBookmarkModal(id);
    };

    return {
        isBookmarked: isLoggedIn ? isBookmarked : false, // Luôn trả về false nếu chưa đăng nhập
        openBookmarkModal: handleBookmarkClick, // Thay thế bằng hàm mới
        bookmarkModalState,
        closeBookmarkModal,
        handleBookmarkSuccess: () => {
            const savedPatternId = bookmarkModalState.patternId;
            handleBookmarkSuccess();
            updateBookmarkStatus(savedPatternId);
        }
    };
} 