
import { ROUTE_PATH } from '@/app/lib/constant';
import { fetchPostDetail } from '@/app/lib/service/blogsService';
import type { Metadata, ResolvingMetadata } from 'next';
import PostDetail from "./PostDetail";
import StructuredData from '@/app/components/StructuredData';

type Props = {
	params: { slug: string }
	searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata(
	{ params }: Props,
	parent: ResolvingMetadata
): Promise<Metadata> {
	const slug = params.slug;
	const blog = await fetchPostDetail(slug, {
		revalidate: 86400,
		tags: [`blog-${slug}`],
	}).then((res) => res);
	const previousImages = (await parent).openGraph?.images || [];

	return {
		title: blog.title,
		openGraph: {
			title: blog.title,
			images: [blog.src || '', ...previousImages],
			url: `${process.env.NEXT_PUBLIC_URL}${ROUTE_PATH.BLOG}/${slug}`,
		},
	};
}

export default async function Page({ params }: { params: { slug: string } }) {

	const post = await fetchPostDetail(params.slug, {
		revalidate: 86400,
		tags: [`blog-${params.slug}`],
	});

	return (
		<>
			<StructuredData
				type='Article'
				title={post?.title}
				description={post?.content || ''}
				url={`${process.env.NEXT_PUBLIC_URL}${ROUTE_PATH.BLOG}/${params.slug}`}
				image={post.src}
			/>
			<PostDetail post={post} />
		</>
	)
}