import { ApiError } from '../utils/apiErrorHandler';

interface ApiServiceParams {
    baseUrl?: string;
    endpoint?: string;
    method?: string;
    data?: any;
    headers?: Record<string, string>;
    timeout?: number;
    retries?: number;
    signal?: AbortSignal;
    cache?: RequestCache;
    next?: NextFetchRequestConfig;
    queryParams?: Record<string, string>;
    formData?: FormData;
}

const DEFAULT_TIMEOUT = 20000;
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

const shouldRetry = (error: unknown): boolean => {
    return error instanceof Error && (
        error.name === 'AbortError' ||
        error.message.includes('network') ||
        error.message.includes('failed to fetch') ||
        error.message.includes('connection')
    );
};

async function apiService({
    baseUrl = process.env.NEXT_PUBLIC_API_URL,
    endpoint = '',
    method = 'GET',
    data = null,
    headers = {},
    timeout = DEFAULT_TIMEOUT,
    retries = MAX_RETRIES,
    signal,
    cache,
    next,
    queryParams = {},
    formData
}: ApiServiceParams): Promise<any> {
    const url = new URL(endpoint, baseUrl);

    Object.entries(queryParams).forEach(([key, value]) => {
        url.searchParams.append(key, value);
    });

    const controller = signal ? undefined : new AbortController();
    const timeoutId = setTimeout(() => controller?.abort(), timeout);

    try {
        const response = await fetch(url.toString(), {
            method,
            headers: formData ? {
                ...headers
            } : {
                'Content-Type': 'application/json',
                ...headers
            },
            body: formData || (data ? JSON.stringify(data) : undefined),
            signal: signal || controller?.signal,
            cache,
            next
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new ApiError(response.status, await response.text());
        }

        return await response.json();
    } catch (error) {
        if (retries > 0 && shouldRetry(error)) {
            await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
            return apiService({
                baseUrl,
                endpoint,
                method,
                data,
                headers,
                timeout,
                retries: retries - 1,
                signal,
                cache,
                next,
                queryParams,
                formData
            });
        }
        throw error;
    }
}

export default apiService;