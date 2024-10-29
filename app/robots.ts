import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_URL || 'https://www.tieuphuongcrochet.com'
  
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: [
      `${baseUrl}/sitemap.xml`,
    ],
  }
}
