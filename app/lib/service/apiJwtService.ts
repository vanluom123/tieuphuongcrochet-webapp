import { getSession, signOut } from 'next-auth/react'
import * as jwtDecode from 'jsonwebtoken'
import { JwtPayload } from 'jsonwebtoken'

import apiService from './apiService'
import refreshAccessToken from '@/app/lib/service/refreshTokenService'
import { ROUTE_PATH } from '../constant'

// With expiration buffer
const EXPIRATION_BUFFER_SECONDS = 30 // 30 seconds before actual expiration

export async function handleTokenRefresh() {
  const session = await getSession()

  if (!session || !session.user || !session.user.accessToken) {
    console.warn('No session or access token found.')
    return null
  }

  let accessToken = session.user.accessToken

  // Decode the access token
  const decoded = jwtDecode.decode(accessToken as string) as JwtPayload
  const isTokenExpired =
    !decoded ||
    (decoded.exp && Date.now() >= ((decoded.exp as number) - EXPIRATION_BUFFER_SECONDS) * 1000)

  if (isTokenExpired) {
    try {
      if (!session.user.refreshToken) {
        console.warn('No refresh token available.')
        await handleTokenRefreshFailure()
        return null
      }

      const refreshToken = session.user.refreshToken

      const res = await refreshAccessToken(refreshToken as string)
      if (!res.success) {
        console.error('Failed to refresh access token.')
        await handleTokenRefreshFailure()
        return null
      }

      accessToken = res.data.accessToken
      session.user.accessToken = res.data.accessToken
      session.user.refreshToken = res.data.refreshToken

      return accessToken
    } catch (e) {
      console.error('Error during token refresh:', e)
      await handleTokenRefreshFailure()
      return null
    }
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
