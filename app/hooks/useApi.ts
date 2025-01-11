import { useState, useCallback } from 'react';
import { handleApiError } from '@/app/lib/utils/apiErrorHandler';

export function useApi<T>() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<T | null>(null);

    const execute = useCallback(async (apiCall: () => Promise<T>) => {
        try {
            setLoading(true);
            setError(null);
            const result = await apiCall();
            setData(result);
            return result;
        } catch (err) {
            const errorResult = handleApiError(err);
            setError(errorResult.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return { loading, error, data, execute };
} 