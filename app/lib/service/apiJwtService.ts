import type { Session } from 'next-auth'
import { getSession, signOut } from 'next-auth/react'

import { isAccessTokenFresh } from '@/app/lib/auth/jwt'
import apiService from './apiService'
import { ROUTE_PATH } from '../constant'

let cachedAccessToken: string | null = null
let sessionPromise: Promise<Session | null> | null = null

async function getSharedSession(): Promise<Session | null> {
  if (!sessionPromise) {
    sessionPromise = getSession().finally(() => {
      sessionPromise = null
    })
  }
  return sessionPromise
}

function clearCachedAccessToken() {
  cachedAccessToken = null
}

export async function getValidAccessToken(): Promise<string | null> {
  if (cachedAccessToken && isAccessTokenFresh(cachedAccessToken)) {
    return cachedAccessToken
  }

  const session = await getSharedSession()

  if (session?.error === 'RefreshAccessTokenError') {
    console.error('Session error: RefreshAccessTokenError detected.')
    clearCachedAccessToken()
    await signOutOnAuthFailure()
    return null
  }

  const accessToken = session?.user?.accessToken
  if (!accessToken) {
    console.warn('No session or access token found.')
    clearCachedAccessToken()
    return null
  }

  if (!isAccessTokenFresh(accessToken)) {
    console.error('Access token expired after server-side refresh attempt.')
    clearCachedAccessToken()
    await signOutOnAuthFailure()
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
  const accessToken = await getValidAccessToken()

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

export async function signOutOnAuthFailure() {
  clearCachedAccessToken()
  await signOut({
    redirect: true,
    callbackUrl: ROUTE_PATH.LOGIN,
  })
}

export default apiJwtService
