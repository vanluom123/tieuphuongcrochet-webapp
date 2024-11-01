import { MetadataRoute } from "next"
import { PARAMS_FOR_SITEMAP, ROUTE_PATH } from "../lib/constant"
import { DataType } from "../lib/definitions"
import { fetchFreePatterns } from "../lib/service/freePatternService"

export const revalidate = 3600; // revalidate at most every hour

// Calculate and output sitemap URLs ex sitemap/1.xml
export async function generateSitemaps() {
    // Fetch the total number of free patterns
    const { totalRecords } = await fetchFreePatterns(PARAMS_FOR_SITEMAP);
    
    // Calculate the number of sitemaps needed (350 products per sitemap)
    const freePatternsPerSitemap = PARAMS_FOR_SITEMAP.pageSize

    const numberOfSitemaps = Math.ceil(totalRecords / freePatternsPerSitemap);

    // Generate an array of sitemap objects
    const sitemaps = Array.from({ length: numberOfSitemaps }, (_, index) => ({ id: index }));

    return sitemaps;
}

export default async function sitemap({ id }: { id: number }): Promise<MetadataRoute.Sitemap> {
    // Google's limit is 50,000 URLs per sitemap
    // Dynamic routes for free patterns
    const freePatterns = await fetchFreePatterns({ ...PARAMS_FOR_SITEMAP, pageNo: id });

    const patternRoutes = freePatterns.data.map((pattern: DataType) => ({
        url: `${process.env.NEXT_PUBLIC_URL}${ROUTE_PATH.FREEPATTERNS}/${pattern.key}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 0.9,
    }))

    return [...patternRoutes]
}   
