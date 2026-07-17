import { API_ROUTES } from '../constant'
import { User } from '@/app/lib/definitions'

export const registerService = async (data: User) => {
  try {
    const url = new URL(API_ROUTES.SIGNUP, process.env.NEXT_PUBLIC_API_URL)

    const response = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    return {
      status: response.ok,
      statusCode: response.status,
    }
  } catch (error: any) {}
}

export const passwordResetRequest = async (email: string) => {
  try {
    const url = new URL(API_ROUTES.RESET_PASSWORD, process.env.NEXT_PUBLIC_API_URL)
    url.searchParams.append('email', email)

    const response = await fetch(url.toString(), {
      method: 'GET',
    })

    const data = await response.json()
    return {
      status: response.ok,
      data
    }
  } catch (error: any) {
    return { status: false, data: null }
  }
}

export const resetPassword = async (token: string, newPassword: string) => {
  try {
    const url = new URL(API_ROUTES.RESET_PASSWORD_SUBMIT, process.env.NEXT_PUBLIC_API_URL)
    url.searchParams.append('passwordResetToken', token)

    const response = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ newPassword }),
    })

    const data = await response.json()
    return {
      status: response.ok,
      data
    }
  } catch (error: any) {
    return { status: false, data: null }
  }
}