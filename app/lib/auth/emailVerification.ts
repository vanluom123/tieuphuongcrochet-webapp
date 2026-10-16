type ApiLike = { code?: number; message?: string }

export function isEmailNotVerified(payload: ApiLike | null | undefined): boolean {
  if (!payload) return false
  return payload.code === 6 || Boolean(payload.message?.includes('not verified'))
}
