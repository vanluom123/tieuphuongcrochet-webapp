import { ApiResponse } from "../lib/definitions";

async function fetchApi<T>(
  endpoint: string,
  method: string = 'GET',
  data?: any,
): Promise<ApiResponse<T>> {

  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  const config: RequestInit = {
    method,
    headers: defaultHeaders,
  };

  if (data) {
    config.body = JSON.stringify(data);
  }

  try {
    const url = `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`;
    const response = await fetch(url, config);
    const responseData = await response.json();

    if (!response.ok) {
      throw {
        data: responseData,
        status: response.status,
        statusText: response.statusText,
      };
    }

    return {
      data: responseData,
      status: response.status,
      statusText: response.statusText,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unexpected error occurred');
  }
}

export default fetchApi;