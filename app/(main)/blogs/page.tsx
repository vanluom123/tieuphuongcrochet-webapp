import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ROUTE_PATH } from "@/app/lib/constant";
import Blogs from "./Blogs";
import { fetchBlogs } from "@/app/lib/service/blogsService";
import { initialListParams } from "@/app/lib/definitions";
import StructureData, { createArticleSchemaShort } from "@/app/components/StructureData";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Blog");
  return {
    title: t("title"),
    description: t("description"),

    openGraph: {
      title: t("title"),
      description: t("description"),
      url: `${process.env.NEXT_PUBLIC_URL}${ROUTE_PATH.BLOG}`,
    },
  };
}

async function getBlogs() {
  const { data, totalRecords } = await fetchBlogs(initialListParams, {
    // Revalidate at 24 hours
    revalidate: 86400,
    tags: ["blogs"],
  });
  return { data, totalRecords };
}

const Blog = async () => {
  const initialData = await getBlogs();

  const schemaList = initialData.data.map((item) =>
    createArticleSchemaShort({
      title: item.name,
      description: item.description || "",
      image: item.src,
      url: `${process.env.NEXT_PUBLIC_URL}${ROUTE_PATH.BLOG}/${item.key}`,
    })
  );

  return (
    <>
      {/* Đưa danh sách schema vào một mảng trong <StructuredData /> */}
      <StructureData data={schemaList} />
      <Blogs
        initialData={{
          loading: false,
          data: initialData.data,
          totalRecord: initialData.totalRecords,
        }}
      />
    </>
  );
};

export default Blog;
