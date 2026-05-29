import { NextRequest, NextResponse } from 'next/server'
import { redis } from '@/app/lib/redis'

const SALT = process.env.UPSTASH_REDIS_VIEW_SALT || 'default-salt'
const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL

export async function POST(request: NextRequest) {
  try {
    const { id, type = 'FREE_PATTERN' } = await request.json()

    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 })
    }

    // 1. Bot detection
    const userAgent = request.headers.get('user-agent') || ''
    const isBot = /bot|crawl|spider|slurp|lynx|wget|headless/i.test(userAgent)
    if (isBot) {
      return NextResponse.json({ success: true, bot: true }, { status: 200 })
    }

    // 2. Get reliable IP from headers
    const forwarded = request.headers.get('x-forwarded-for')
    const realIp = request.headers.get('x-real-ip')
    const ip = forwarded?.split(',')[0]?.trim() || realIp || 'unknown'

    // 3. Hash (ip + salt + userAgent) to avoid rainbow table attacks
    const hashInput = `${ip}:${SALT}:${userAgent}`
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(hashInput))
    const hash = Array.from(new Uint8Array(buf))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')

    // 4. Rate limit (max 10 requests per minute per IP)
    const rateKey = `ratelimit:views:${hash}`
    const current = await redis.incr(rateKey)
    if (current === 1) {
      await redis.expire(rateKey, 60)
    }
    if (current > 10) {
      return NextResponse.json({ error: 'Rate limited' }, { status: 429 })
    }

    // 5. Deduplicate (once per 24h for same IP + pattern)
    const dedupKey = `dedup:views:${type}:${id}:${hash}`
    const isNew = await redis.set(dedupKey, '1', { nx: true, ex: 24 * 60 * 60 })
    if (!isNew) {
      return NextResponse.json({ success: true, dedup: true }, { status: 200 })
    }

    // 6. Call Java API to increment view count in DB
    const javaApiUrl = `${NEXT_PUBLIC_API_URL}/api/v1/interactions/view/${type}/${id}`
    const res = await fetch(javaApiUrl, { method: 'POST', cache: 'no-store' })
    if (!res.ok) {
      // Rollback dedup if Java API fails
      await redis.del(dedupKey)
      return NextResponse.json({ error: 'Backend error' }, { status: 502 })
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('View tracking error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
