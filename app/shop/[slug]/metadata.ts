import { ROUTE_PATH } from '@/app/lib/constant';
import { fetchProductDetail } from '@/app/lib/service/productService';
import type { Metadata, ResolvingMetadata } from 'next';

type Props = {
  params: { slug: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const slug = params.slug;
  const product = await fetchProductDetail(slug).then((res) => res);
  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: product.name,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [product.src || ''  , ...previousImages],
      url: `${process.env.NEXT_PUBLIC_URL}/${ROUTE_PATH.FREEPATTERNS}/${slug}`,
      authors: [product.author || ''],
    },
  };
}
