import type { Metadata, ResolvingMetadata } from 'next';
import { ROUTE_PATH } from '@/app/lib/constant';
import { fetchProductDetail } from '@/app/lib/service/productService';
import StructuredData from '@/app/components/StructuredData';
import ProductDetail from "./ProductDetail";

type Props = {
  params: { slug: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const slug = params.slug;
  const product = await fetchProductDetail(slug, 3600).then((res) => res);
  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: product.name,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [...(product.images?.map(image => image.fileContent) || []), ...previousImages],
      url: `${process.env.NEXT_PUBLIC_URL}${ROUTE_PATH.SHOP}/${slug}`,
      authors: [product.author || ''],
    },
  };
}

// Generate Product Detail Page
export default async function Page({ params }: { params: { slug: string } }) {

    const product = await fetchProductDetail(params.slug, 3600);

    return (
        <>
            <StructuredData
                type='Product'
                title={product.name}
                description={product.description || ''}
                url={`${process.env.NEXT_PUBLIC_URL}${ROUTE_PATH.SHOP}/${params.slug}`}
                image={product.src}
                offers={{
                    price: product.price || 0,
                    priceCurrency: product.currency_code || 'VND',
                    availability: "https://schema.org/PreOrder",
                    url: `${process.env.NEXT_PUBLIC_URL}${ROUTE_PATH.SHOP}/${params.slug}`
                }}
            />
            <ProductDetail product={product} />
        </>
    )
}