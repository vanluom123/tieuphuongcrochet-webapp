export function isSafeCtaUrl(value: string): boolean {
  try {
    const url = new URL(value, 'http://localhost')
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}
