import { getSession, signOut } from 'next-auth/react'

import apiService from './apiService'
import { ROUTE_PATH } from '../constant'

// With expiration buffer
const EXPIRATION_BUFFER_SECONDS = 30 // 30 seconds before actual expiration

export interface JwtTokenPayload {
  exp?: number
  [key: string]: any
}

// Lightweight JWT payload parser without Node.js dependencies/bundle bloat
export function decodeJwtPayload(token: string): JwtTokenPayload | null {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null
    const base64Url = parts[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const binaryStr =
      typeof atob === 'function'
        ? atob(base64)
        : Buffer.from(base64, 'base64').toString('binary')
    const jsonPayload = decodeURIComponent(
      binaryStr
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    return JSON.parse(jsonPayload)
  } catch {
    return null
  }
}

function isTokenValid(token: string): boolean {
  const decoded = decodeJwtPayload(token)
  if (!decoded || !decoded.exp) return false
  return Date.now() < (decoded.exp - EXPIRATION_BUFFER_SECONDS) * 1000
}

let cachedAccessToken: string | null = null
let sessionPromise: Promise<any> | null = null

async function getSharedSession() {
  if (!sessionPromise) {
    sessionPromise = getSession().finally(() => {
      sessionPromise = null
    })
  }
  return sessionPromise
}

export function clearCachedAccessToken() {
  cachedAccessToken = null
}

export async function handleTokenRefresh(): Promise<string | null> {
  // If we already have a valid token in memory, reuse it immediately (0 network calls)
  if (cachedAccessToken && isTokenValid(cachedAccessToken)) {
    return cachedAccessToken
  }

  // getSession() hits /api/auth/session, which runs the NextAuth jwt callback
  // server-side; the jwt callback refreshes the backend access token there.
  // The refresh token is never exposed to the client.
  const session = await getSharedSession()

  if (session?.error === 'RefreshAccessTokenError') {
    console.error('Session error: RefreshAccessTokenError detected.')
    clearCachedAccessToken()
    await handleTokenRefreshFailure()
    return null
  }

  const accessToken = session?.user?.accessToken
  if (!accessToken) {
    console.warn('No session or access token found.')
    clearCachedAccessToken()
    return null
  }

  if (!isTokenValid(accessToken)) {
    // Server-side refresh failed or no refresh token exists
    console.error('Access token expired after server-side refresh attempt.')
    clearCachedAccessToken()
    await handleTokenRefreshFailure()
    return null
  }

  cachedAccessToken = accessToken
  return cachedAccessToken
}

async function apiJwtService({
  baseUrl = process.env.NEXT_PUBLIC_API_URL,
  endpoint = '',
  method = 'GET',
  data = null,
  headers = {},
  queryParams = {},
  formData,
  next,
}: {
  baseUrl?: string
  endpoint?: string
  method?: string
  data?: any | null
  headers?: Record<string, string>
  queryParams?: Record<string, string>
  formData?: FormData
  next?: NextFetchRequestConfig
}): Promise<any> {
  const accessToken = await handleTokenRefresh()

  const computedHeaders: Record<string, string> = {
    ...headers,
  }
  if (accessToken) {
    computedHeaders['Authorization'] = `Bearer ${accessToken}`
  }

  return apiService({
    baseUrl,
    endpoint,
    method,
    data,
    headers: computedHeaders,
    queryParams,
    formData,
    next,
  })
}

export async function handleTokenRefreshFailure() {
  clearCachedAccessToken()
  // Logout the user and redirect to login page
  await signOut({
    redirect: true,
    callbackUrl: ROUTE_PATH.LOGIN,
  })
}

export default apiJwtService
