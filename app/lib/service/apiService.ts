interface ApiServiceParams {
  baseUrl?: string
  endpoint?: string
  method?: string
  data?: any
  headers?: Record<string, string>
  next?: NextFetchRequestConfig
  queryParams?: Record<string, string>
  formData?: FormData
  timeoutMs?: number
  retry?: number
}

export class ApiError extends Error {
  statusCode?: number
  code?: number
  data?: any

  constructor(message: string, detail: { statusCode?: number; code?: number; data?: any } = {}) {
    super(message)
    this.name = 'ApiError'
    this.statusCode = detail.statusCode
    this.code = detail.code
    this.data = detail.data
  }
}

const DEFAULT_TIMEOUT_MS = 15_000
const UPLOAD_TIMEOUT_MS = 30_000
const DEFAULT_GET_RETRIES = 2

async function parseResponse(response: Response): Promise<any> {
  const text = await response.text()
  let payload: any = null
  try {
    payload = text ? JSON.parse(text) : null
  } catch {
    payload = null
  }

  if (!response.ok) {
    const envelope = payload && typeof payload === 'object' ? payload : null
    throw new ApiError(envelope?.message || `Request failed with status ${response.status}`, {
      statusCode: response.status,
      code: envelope?.code,
      data: envelope,
    })
  }

  return payload
}

function isRetryable(error: unknown): boolean {
  if (error instanceof ApiError) {
    return error.statusCode !== undefined && [502, 503, 504].includes(error.statusCode)
  }
  if (error instanceof DOMException && (error.name === 'TimeoutError' || error.name === 'AbortError')) {
    return true
  }
  return error instanceof TypeError
}

async function apiService({
  baseUrl = process.env.NEXT_PUBLIC_API_URL,
  endpoint = '',
  method = 'GET',
  data = null,
  headers = {},
  next,
  queryParams = {},
  formData,
  timeoutMs,
  retry,
}: ApiServiceParams): Promise<any> {
  const url = new URL(endpoint, baseUrl)

  Object.entries(queryParams).forEach(([key, value]) => {
    url.searchParams.append(key, value)
  })

  const upperMethod = method.toUpperCase()
  const timeout = timeoutMs ?? (formData ? UPLOAD_TIMEOUT_MS : DEFAULT_TIMEOUT_MS)
  const maxRetries = retry ?? (upperMethod === 'GET' ? DEFAULT_GET_RETRIES : 0)
  const requestHeaders = formData
    ? { ...headers }
    : {
        'Content-Type': 'application/json',
        ...headers,
      }
  const body = formData || (data ? JSON.stringify(data) : undefined)

  let lastError: unknown

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url.toString(), {
        method: upperMethod,
        headers: requestHeaders,
        body,
        next,
        signal: AbortSignal.timeout(timeout),
      })
      return await parseResponse(response)
    } catch (error) {
      lastError = error
      if (!isRetryable(error) || attempt === maxRetries) break
      await new Promise((resolve) => setTimeout(resolve, 300 * (attempt + 1)))
    }
  }

  throw lastError
}

export default apiService
