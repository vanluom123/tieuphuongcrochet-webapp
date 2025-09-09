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