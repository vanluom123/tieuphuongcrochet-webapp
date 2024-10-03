import { ROUTE_PATH } from '@/app/lib/constant';
import { fetchPostDetail } from '@/app/lib/service/blogsService';
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
  const blog = await fetchPostDetail(slug).then((res) => res);
  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: blog.title,
    openGraph: {
      title: blog.title,
      images: [blog.src || '', ...previousImages],
      url: `${process.env.NEXT_PUBLIC_URL}/${ROUTE_PATH.FREEPATTERNS}/${slug}`,
    },
  };
}
