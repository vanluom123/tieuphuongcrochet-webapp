import { MetadataRoute } from 'next'
import { ROUTE_PATH } from './lib/constant'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_URL || 'https://www.tieuphuongcrochet.com'
  
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ROUTE_PATH.DASHBOARD
    },
    sitemap: [
      `${baseUrl}/sitemap.xml`,
    ],
  }
}
