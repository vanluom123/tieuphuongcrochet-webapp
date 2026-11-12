const INTERNAL_PATH = /^\/[^/\\]/

export function formatCtaLink(value: string): string {
  return value.trim()
}

export function isSafeCtaUrl(value: string): boolean {
  const link = formatCtaLink(value)
  if (!link) return false
  // A single leading slash is a same-origin path; `//host` and `/\host` are not.
  if (INTERNAL_PATH.test(link)) return true
  try {
    const url = new URL(link)
    return (url.protocol === 'http:' || url.protocol === 'https:') && url.hostname !== ''
  } catch {
    return false
  }
}