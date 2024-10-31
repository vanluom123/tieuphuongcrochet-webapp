import type { MetadataRoute } from 'next'
import { ROUTE_PATH } from './lib/constant';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {

  try {
    // Fetch all free patterns

    const staticRoutes: MetadataRoute.Sitemap = [
      {
        url: `${process.env.NEXT_PUBLIC_URL}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 1,
      },
      {
        url: `${process.env.NEXT_PUBLIC_URL}${ROUTE_PATH.FREEPATTERNS}`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.8,
      },
      {
        url: `${process.env.NEXT_PUBLIC_URL}${ROUTE_PATH.SHOP}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.5,
      },
      {
        url: `${process.env.NEXT_PUBLIC_URL}${ROUTE_PATH.BLOG}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.5,
      },
      {
        url: `${process.env.NEXT_PUBLIC_URL}${ROUTE_PATH.CONTACT}`,
        lastModified: new Date(),
        changeFrequency: 'yearly',
        priority: 0.5,
      },
      {
        url: `${process.env.NEXT_PUBLIC_URL}${ROUTE_PATH.ABOUT}`,
        lastModified: new Date(),
        changeFrequency: 'yearly',
        priority: 0.5,
      }
    ]


    // // Dynamic routes for free patterns
    // const patternRoutes = freePatterns.data.map((pattern: DataType) => ({
    //   url: `${process.env.NEXT_PUBLIC_URL}${ROUTE_PATH.FREEPATTERNS}/${pattern.key}`,
    //   lastModified: new Date(),
    //   changeFrequency: 'weekly' as const,
    //   priority: 0.9,
    // }))

    // const productRoutes = products.data.map((product: Product) => ({
    //   url: `${process.env.NEXT_PUBLIC_URL}${ROUTE_PATH.SHOP}/${product.id}`,
    //   lastModified: new Date(),
    //   changeFrequency: 'weekly' as const,
    //   priority: 0.9,
    // }));
    return [...staticRoutes]
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return [];
  }
}
