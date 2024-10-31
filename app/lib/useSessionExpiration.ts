import { useSession, signOut } from 'next-auth/react'
import { useEffect } from 'react'
import * as jwtDecode from 'jsonwebtoken'
import { JwtPayload } from 'jsonwebtoken'
import { ROUTE_PATH } from './constant'

export const useSessionExpiration = () => {
  const { data: session } = useSession()

  useEffect(() => {
    if (session?.user?.accessToken) {
      const decoded = jwtDecode.decode(session.user.accessToken) as JwtPayload
      
      if (decoded?.exp) {
        const expirationTime = decoded.exp * 1000 // Convert to milliseconds
        const timeUntilExpiration = expirationTime - Date.now()

        if (timeUntilExpiration <= 0) {
          // Session đã hết hạn
          signOut({ redirect: true, callbackUrl: ROUTE_PATH.LOGIN })
        } else {
          // Set timeout để logout khi session hết hạn
          const logoutTimer = setTimeout(() => {
            signOut({ redirect: true, callbackUrl: ROUTE_PATH.LOGIN })
          }, timeUntilExpiration)

          return () => clearTimeout(logoutTimer)
        }
      }
    }
  }, [session])
} 