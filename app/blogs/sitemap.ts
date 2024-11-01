import { MetadataRoute } from "next"
import { PARAMS_FOR_SITEMAP, ROUTE_PATH } from "../lib/constant"
import { DataType } from "../lib/definitions"
import { fetchBlogs } from "../lib/service/blogsService";

export const revalidate = 86400; // revalidate at most every day

// Calculate and output sitemap URLs ex sitemap/1.xml
export async function generateSitemaps() {
    // Fetch the total number of free patterns
    const { totalRecords } = await fetchBlogs(PARAMS_FOR_SITEMAP);
    
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
    const blogs = await fetchBlogs({ ...PARAMS_FOR_SITEMAP, pageNo: id });

    const blogsRoutes = blogs.data.map((blog: DataType) => ({
        url: `${process.env.NEXT_PUBLIC_URL}${ROUTE_PATH.BLOG}/${blog.key}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 0.9,
    }))

    return [...blogsRoutes]
}   
