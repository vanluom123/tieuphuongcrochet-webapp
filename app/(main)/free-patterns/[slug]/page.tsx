import type { Metadata, ResolvingMetadata } from 'next';
import { fetchFreePatternDetail } from "@/app/lib/service/freePatternService";
import PatternDetail from "./PatternDetail";
import StructuredData from "@/app/components/StructuredData";
import { ROUTE_PATH } from '@/app/lib/constant';

// Define metadata props
type Props = {
  params: { slug: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

// Generate metadata
export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const slug = params.slug;
  const pattern = await fetchFreePatternDetail(slug, 3600).then((res) => res);
  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: pattern.name,
    openGraph: {
      title: pattern.name,
      description: pattern.description,
      images: [...(pattern.images?.map(image => image.fileContent) || []), ...previousImages],
      url: `${process.env.NEXT_PUBLIC_URL}${ROUTE_PATH.FREEPATTERNS}/${slug}`,
      authors: [pattern.author || ''],
    },
  };
}

// Generate Pattern Detail Page
export default async function Page({ params }: { params: { slug: string } }){

    const pattern = await fetchFreePatternDetail(params.slug, 3600);

    return (
        <>
            <StructuredData
                type='CreativeWork'
                title={pattern.name}
                description={pattern.description || ''}
                url={`${process.env.NEXT_PUBLIC_URL}${ROUTE_PATH.FREEPATTERNS}/${params.slug}`}
                image={pattern.src}
            />
            <PatternDetail pattern={pattern} />
        </>
    )

}