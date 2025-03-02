
interface ApiServiceParams {
    baseUrl?: string;
    endpoint?: string;
    method?: string;
    data?: any;
    headers?: Record<string, string>;
    cache?: RequestCache;
    next?: NextFetchRequestConfig;
    queryParams?: Record<string, string>;
    formData?: FormData;
}

async function apiService({
    baseUrl = process.env.NEXT_PUBLIC_API_URL,
    endpoint = '',
    method = 'GET',
    data = null,
    headers = {},
    cache,
    next,
    queryParams = {},
    formData
}: ApiServiceParams): Promise<any> {
    const url = new URL(endpoint, baseUrl);

    Object.entries(queryParams).forEach(([key, value]) => {
        url.searchParams.append(key, value);
    });

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
            cache,
            next
        });

        if (!response.ok) {
            throw new Error(await response.text());
        }

        return await response.json();
    } catch (error) {
        throw error;
    }
}

export default apiService;