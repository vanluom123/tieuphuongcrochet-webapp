import type { Metadata, ResolvingMetadata } from 'next';
import { fetchFreePatternDetail } from "@/app/lib/service/freePatternService";
import { ROUTE_PATH } from '@/app/lib/constant';

type Props = {
  params: { slug: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const slug = params.slug;
  const pattern = await fetchFreePatternDetail(slug).then((res) => res);
  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: pattern.name,
    openGraph: {
      title: pattern.name,
      description: pattern.description,
      images: [pattern.src, ...previousImages],
      url: `${process.env.NEXT_PUBLIC_URL}/${ROUTE_PATH.FREEPATTERNS}/${slug}`,
      authors: [pattern.author || ''],
    },
  };
}
