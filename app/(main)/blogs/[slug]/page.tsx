import { ROUTE_PATH } from "@/app/lib/constant";
import { fetchPostDetail } from "@/app/lib/service/blogsService";
import type { Metadata, ResolvingMetadata } from "next";
import { getTranslations } from "next-intl/server";

import PostDetail from "./PostDetail";
import StructureData, {
  createArticleSchema,
  createBreadcrumbSchema,
} from "@/app/components/StructureData";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;
  const blog = await fetchPostDetail(slug, {
    revalidate: 86400,
    tags: [`blog-${slug}`],
  }).then((res) => res);
  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: blog.title,
    openGraph: {
      title: blog.title,
      images: [blog.src || "", ...previousImages],
      url: `${process.env.NEXT_PUBLIC_URL}${ROUTE_PATH.BLOG}/${slug}`,
    },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await fetchPostDetail(slug, {
    revalidate: 86400,
    tags: [`blog-${slug}`],
  });
  const t = await getTranslations("MenuNav");

  return (
    <>
      <StructureData
        data={createBreadcrumbSchema([
          {
            name: t("home"),
            url: `${process.env.NEXT_PUBLIC_URL}`,
          },
          {
            name: t("blog"),
            url: `${process.env.NEXT_PUBLIC_URL}/${ROUTE_PATH.BLOG}`,
          },
          {
            name: post.title,
            url: `${process.env.NEXT_PUBLIC_URL}/${ROUTE_PATH.BLOG}/${slug}`,
          },
        ])}
      />
      <StructureData
        data={createArticleSchema({
          title: post.title,
          url: `${process.env.NEXT_PUBLIC_URL}${ROUTE_PATH.BLOG}/${slug}`,
          image: post.src,
          datePublished: post.createdDate,
          articleBody: post.content,
        })}
      />
      <PostDetail post={post} />
    </>
  );
}
