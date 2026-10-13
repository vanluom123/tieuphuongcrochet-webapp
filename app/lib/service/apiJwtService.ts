import { getSession, signOut } from 'next-auth/react'
import * as jwtDecode from 'jsonwebtoken'
import { JwtPayload } from 'jsonwebtoken'

import apiService from './apiService'
import { ROUTE_PATH } from '../constant'

// With expiration buffer
const EXPIRATION_BUFFER_SECONDS = 30 // 30 seconds before actual expiration

export async function handleTokenRefresh() {
  // getSession() hits /api/auth/session, which runs the NextAuth jwt callback
  // server-side; the jwt callback refreshes the backend access token there.
  // The refresh token is never exposed to the client.
  const session = await getSession()

  const accessToken = session?.user?.accessToken
  if (!accessToken) {
    console.warn('No session or access token found.')
    return null
  }

  // Decode the access token
  const decoded = jwtDecode.decode(accessToken as string) as JwtPayload
  const isTokenExpired =
    !decoded ||
    (decoded.exp && Date.now() >= ((decoded.exp as number) - EXPIRATION_BUFFER_SECONDS) * 1000)

  if (isTokenExpired) {
    // Server-side refresh failed or no refresh token exists
    console.error('Access token expired after server-side refresh attempt.')
    await handleTokenRefreshFailure()
    return null
  }

  return accessToken
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
  // Logout the user and redirect to login page
  await signOut({
    redirect: true,
    callbackUrl: ROUTE_PATH.LOGIN,
  })
}

export default apiJwtService
