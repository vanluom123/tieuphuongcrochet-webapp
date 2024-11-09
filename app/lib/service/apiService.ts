import { signOut } from "next-auth/react";
import { ROUTE_PATH } from "../constant";

async function apiService<T = unknown>({
    baseUrl = process.env.NEXT_PUBLIC_API_URL,
    endpoint = '',
    method = 'GET',
    data = null,
    headers = {},
    timeout = 20000,
    queryParams = {},
    retries = 3,
    logRequests = false,
    formData,
    next
}: {
    baseUrl?: string;
    endpoint?: string;
    method?: string;
    data?: T | null;
    headers?: Record<string, string>;
    timeout?: number;
    queryParams?: Record<string, string>;
    retries?: number;
    logRequests?: boolean;
    formData?: FormData;
    next?: NextFetchRequestConfig;
}) {
    const controller = new AbortController();
    const signal = controller.signal;

    // Construct full URL with query parameters
    const url = new URL(endpoint, baseUrl);
    Object.keys(queryParams).forEach(key => url.searchParams.append(key, queryParams[key]));

    const options: RequestInit = {
        method,
        signal,
        next
    };

    if(headers) {
        options.headers = {
            ...headers
        };
        if(data) {
            options.headers['Content-Type'] = 'application/json';
        }
    }

    // Handle headers based on whether we're sending FormData or JSON
    if (formData) {
        // Don't set Content-Type for FormData, browser will set it automatically
        options.body = formData;
    } else if (data) {
        // For JSON data
        options.body = JSON.stringify(data);
    }


    // Function to make the actual request with retry logic
    const makeRequest = async (attempt: number) => {
        if (logRequests) {
            console.log(`Attempt ${attempt}: ${method} ${url}`);
        }

        const timeoutId = setTimeout(() => controller.abort(), timeout);
        try {
            const response = await fetch(url.toString(), options);
            clearTimeout(timeoutId); // Clear timeout when response is received

            if (!response.ok) {
                // Handle specific status codes differently if needed
                if (response.status === 401) {
                    // Token hết hạn hoặc không hợp lệ
                    signOut({ redirect: true, callbackUrl: ROUTE_PATH.LOGIN });
                    throw new Error('Unauthorized. Please check your credentials.');
                } else if (response.status >= 500) {
                    throw new Error('Server error. Retrying...');
                } else {
                    throw new Error(`HTTP error! Status: ${response.status}, ${response.statusText}`);
                }
            }

            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                return await response.json();
            } else {
                return await response.text();
            }
        } catch (error: unknown) {
            clearTimeout(timeoutId); // Also clear timeout on error
            if (error instanceof Error) {
                if (error.name === 'AbortError') {
                    throw new Error(`Request timed out after ${timeout}ms`);
                }
                
                if (attempt <= retries && (
                    error.message.includes('Server error') ||
                    error.message.includes('Connection closed') ||
                    error.message.includes('network')
                )) {
                    console.warn(`Retrying request... Attempt ${attempt} failed`);
                    // Đợi một chút trước khi retry
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    return makeRequest(attempt + 1);
                }
            }
            throw error;
        }
    };

    return makeRequest(1);
}

export default apiService;