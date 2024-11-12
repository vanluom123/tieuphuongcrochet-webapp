import { MetadataRoute } from "next"
import { PARAMS_FOR_SITEMAP, ROUTE_PATH } from '@/app/lib/constant';
import { DataType } from '@/app/lib/definitions';
import { fetchProducts } from '@/app/lib/service/productService';
import { requestQueue } from "@/app/lib/requestQueue";

// Calculate and output sitemap URLs ex sitemap/1.xml
export async function generateSitemaps() {
    // Fetch the total number of free patterns
    const { totalRecords } = await requestQueue.add(() => fetchProducts(PARAMS_FOR_SITEMAP, {
        revalidate: 86400,
        tags: ['products-sitemap'],
    }));
    
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
    const products = await requestQueue.add(() => fetchProducts({ ...PARAMS_FOR_SITEMAP, pageNo: id }, {
        revalidate: 86400,
        tags: ['products-sitemap'],
    }));

    const productRoutes = products.data.map((product: DataType) => ({
        url: `${process.env.NEXT_PUBLIC_URL}${ROUTE_PATH.SHOP}/${product.key}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 0.9,
    }))

    return [...productRoutes]
}   
