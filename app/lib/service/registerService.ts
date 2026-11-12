import { API_ROUTES } from '../constant'
import { User } from '@/app/lib/definitions'
import apiService, { ApiError } from './apiService'

export interface AuthResult {
  status: boolean
  statusCode?: number
  data?: any
}

function toAuthResult(error: unknown): AuthResult {
  if (error instanceof ApiError) {
    return {
      status: false,
      statusCode: error.statusCode,
      data: error.data ?? { message: error.message },
    }
  }
  return { status: false, statusCode: 500, data: { message: 'Network error' } }
}

export const registerService = async (data: User): Promise<AuthResult> => {
  try {
    await apiService({
      endpoint: API_ROUTES.SIGNUP,
      method: 'POST',
      data,
    })
    return { status: true }
  } catch (error) {
    return toAuthResult(error)
  }
}

export const passwordResetRequest = async (email: string): Promise<AuthResult> => {
  try {
    const res = await apiService({
      endpoint: API_ROUTES.RESET_PASSWORD,
      method: 'GET',
      queryParams: { email },
      retry: 0,
    })
    return { status: true, data: res }
  } catch (error) {
    return toAuthResult(error)
  }
}

export const resetPassword = async (token: string, newPassword: string): Promise<AuthResult> => {
  try {
    const res = await apiService({
      endpoint: API_ROUTES.RESET_PASSWORD_SUBMIT,
      method: 'POST',
      queryParams: { passwordResetToken: token },
      data: { newPassword },
    })
    return { status: true, data: res }
  } catch (error) {
    return toAuthResult(error)
  }
}

export const resendVerificationEmail = async (email: string): Promise<AuthResult> => {
  try {
    const res = await apiService({
      endpoint: API_ROUTES.RESEND_VERIFICATION,
      method: 'GET',
      queryParams: { email: email.trim().toLowerCase() },
      retry: 0,
    })
    return { status: true, data: res }
  } catch (error) {
    return toAuthResult(error)
  }
}
