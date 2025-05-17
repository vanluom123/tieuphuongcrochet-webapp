import { useEffect } from 'react';
import { incrementViewCount } from '@/app/lib/service/freePatternService';

export const useViewCount = (id: string) => {
    useEffect(() => {
        const trackView = async () => {
            try {
                await incrementViewCount(id);
            } catch (error) {
                console.error('Error tracking view:', error);
            }
        };

        trackView();
    }, [id]);
}; 