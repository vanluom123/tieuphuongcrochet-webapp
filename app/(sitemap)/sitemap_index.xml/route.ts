import { NextResponse } from 'next/server';
import { fetchProducts } from '@/app/lib/service/productService';
import { fetchFreePatterns } from '@/app/lib/service/freePatternService';
import { PARAMS_FOR_SITEMAP, ROUTE_PATH } from '@/app/lib/constant';
import { fetchBlogs } from '@/app/lib/service/blogsService';

// Calculate and output sitemap URLs ex sitemap/1.xml
async function generateSitemaps({ totalRecords, pathname }: { totalRecords: number, pathname: string }) {

    // Fetch the total number of products
    // Calculate the number of sitemaps needed (10 products per sitemap)
    const productsPerSitemap = PARAMS_FOR_SITEMAP.pageSize;
    const numberOfSitemaps = Math.ceil(totalRecords / productsPerSitemap);

    // Generate an array of sitemap objects
    const productSitemaps = Array.from({ length: numberOfSitemaps }, (_, index) => ({
        id: index,
        url: `${process.env.NEXT_PUBLIC_URL}${pathname}/${ROUTE_PATH.SITEMAP}/${index}.xml`
    }));

    return productSitemaps
}

const generateProductSitemaps = async () => {
    const { totalRecords } = await fetchProducts(PARAMS_FOR_SITEMAP);
    return generateSitemaps({ totalRecords, pathname: ROUTE_PATH.SHOP });
}

const generateFreePatternSitemaps = async () => {
    const { totalRecords } = await fetchFreePatterns(PARAMS_FOR_SITEMAP);
    return generateSitemaps({ totalRecords, pathname: ROUTE_PATH.FREEPATTERNS });
}

const generateBlogSitemaps = async () => {
    const { totalRecords } = await fetchBlogs(PARAMS_FOR_SITEMAP);
    return generateSitemaps({ totalRecords, pathname: ROUTE_PATH.BLOG });
}

// cache test
export async function GET() {
    try {
        // Generate sitemaps
        const productSitemaps = await generateProductSitemaps();
        const freePatternSitemaps = await generateFreePatternSitemaps();
        const blogSitemaps = await generateBlogSitemaps();

        // Combine static and dynamic sitemaps
        const sitemaps = [
            `${process.env.NEXT_PUBLIC_URL}/sitemap.xml`,
            ...productSitemaps.map(sitemap => sitemap.url),
            ...freePatternSitemaps.map(sitemap => sitemap.url),
            ...blogSitemaps.map(sitemap => sitemap.url)
        ];

        console.log('Generated sitemaps:', sitemaps);

        const sitemapIndexXML = await buildSitemapIndex(sitemaps);

        return new NextResponse(sitemapIndexXML, {
            headers: {
                "Content-Type": "application/xml",
                "Content-Length": Buffer.byteLength(sitemapIndexXML).toString(),
            },
        });
    } catch (error) {
        console.error('Error generating sitemap index:', error);
        return NextResponse.error();
    }
}

async function buildSitemapIndex(sitemaps: string[]) {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>';
    xml += '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

    for (const sitemapURL of sitemaps) {
        xml += "<sitemap>";
        xml += `<loc>${sitemapURL}</loc>`;
        xml += "</sitemap>";
    }

    xml += "</sitemapindex>";
    return xml;
}