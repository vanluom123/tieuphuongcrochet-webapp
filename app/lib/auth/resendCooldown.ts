/** Shared localStorage key for login alert + resend-verification modal (same email). */
export function getResendCooldownStorageKey(email: string): string {
  const normalized = email.trim().toLowerCase();
  return normalized ? `login_${normalized}` : 'login_default';
}
