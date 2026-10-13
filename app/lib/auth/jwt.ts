export const ACCESS_TOKEN_EXPIRY_BUFFER_SECONDS = 30

export function decodeJwtPayload(token: string): { exp?: number } | null {
  try {
    const segment = token.split('.')[1]
    if (!segment) return null
    const base64 = segment.replace(/-/g, '+').replace(/_/g, '/')
    const json =
      typeof atob === 'function'
        ? atob(base64)
        : Buffer.from(segment, 'base64url').toString('utf8')
    return JSON.parse(json)
  } catch {
    return null
  }
}

export function isAccessTokenFresh(
  token: string,
  bufferSeconds = ACCESS_TOKEN_EXPIRY_BUFFER_SECONDS
): boolean {
  const payload = decodeJwtPayload(token)
  if (!payload?.exp) return false
  return Date.now() < (payload.exp - bufferSeconds) * 1000
}

export function isAccessTokenExpired(
  token: string,
  bufferSeconds = ACCESS_TOKEN_EXPIRY_BUFFER_SECONDS
): boolean {
  return !isAccessTokenFresh(token, bufferSeconds)
}
