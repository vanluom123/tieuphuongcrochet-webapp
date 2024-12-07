import { useSession, signOut } from 'next-auth/react'
import { useEffect } from 'react'
import * as jwtDecode from 'jsonwebtoken'
import { JwtPayload } from 'jsonwebtoken'
import { ROUTE_PATH } from './constant'
import { notification } from 'antd'
import refreshAccessToken from '../api/refreshToken'

const REFRESH_TIME = 5 * 60 * 1000; // 5 minutes before expiration
const WARNING_TIME = 5 * 60 * 1000; // Warning 5 minutes before expiration

export const useSessionExpiration = () => {
  const { data: session, update } = useSession()

  useEffect(() => {
    if (session?.user?.accessToken) {
      const decoded = jwtDecode.decode(session.user.accessToken) as JwtPayload

      if (decoded?.exp) {
        const expirationTime = decoded.exp * 1000
        const timeUntilExpiration = expirationTime - Date.now()

        // If expired
        if (timeUntilExpiration <= 0) {
          signOut({ redirect: true, callbackUrl: ROUTE_PATH.LOGIN })
          notification.error({
            message: 'Session expired',
            description: 'Please login again'
          })
          return
        }

        // Warning about to expire
        if (timeUntilExpiration <= WARNING_TIME) {
          notification.warning({
            message: 'Session is about to expire',
            description: 'Please save your work and login again'
          })
        }

        // Auto refresh token
        const refreshTimer = setTimeout(async () => {
          if (timeUntilExpiration <= REFRESH_TIME) {
            try {
              const newToken = await refreshAccessToken({
                ...session.user,
                accessToken: session.user.accessToken,
                refreshToken: session.user.refreshToken
              })

              // Update session with new token
              if (!newToken.error) {
                await update({
                  ...session,
                  user: {
                    ...session.user,
                    accessToken: newToken.accessToken,
                    refreshToken: newToken.refreshToken
                  }
                })
              } else {
                throw new Error('Cannot refresh token')
              }
            } catch (error) {
              signOut({ redirect: true, callbackUrl: ROUTE_PATH.LOGIN })
              notification.error({
                message: 'Session expired',
                description: 'Please login again'
              })
            }
          }
        }, timeUntilExpiration - REFRESH_TIME)

        // Logout timer still ensures safety
        const logoutTimer = setTimeout(() => {
          signOut({ redirect: true, callbackUrl: ROUTE_PATH.LOGIN })
          notification.error({
            message: 'Session expired',
            description: 'Please login again'
          })
        }, timeUntilExpiration)

        return () => {
          clearTimeout(refreshTimer)
          clearTimeout(logoutTimer)
        }
      }
    }
  }, [session, update])
} 