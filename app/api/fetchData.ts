async function fetchData<T = any>({
    baseUrl = '',
    endpoint = '',
    method = 'GET',
    data = null,
    headers = {},
    timeout = 5000,
    queryParams = {},
    retries = 3,
    logRequests = false
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
}) {
    const controller = new AbortController();
    const signal = controller.signal;

    // Construct full URL with query parameters
    const url = new URL(endpoint, baseUrl);
    Object.keys(queryParams).forEach(key => url.searchParams.append(key, queryParams[key]));

    const options: RequestInit = {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            ...headers, // Merge default headers with custom headers
        },
        signal,
    };

    if (data) {
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
        } catch (error: any) {
            if (attempt <= retries && (error.name === 'AbortError' || error.message.includes('Server error'))) {
                console.warn(`Retrying request... Attempt ${attempt} failed`);
                return makeRequest(attempt + 1);
            } else {
                console.error('Fetch operation failed:', error);
                throw error;
            }
        }
    };

    return makeRequest(1);
}

export default fetchData;