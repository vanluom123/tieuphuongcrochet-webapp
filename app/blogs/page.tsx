
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ROUTE_PATH } from "../lib/constant";
import Blogs from "./Blogs";
import { fetchBlogs } from "../lib/service/blogsService";
import { initialListParams } from "../lib/definitions";


export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations("Blog");
	return {
		title: t("title"),
		description: t("description"),

		openGraph: {
			title: t("title"),
			description: t("description"),
			url: `${process.env.NEXT_PUBLIC_URL}/${ROUTE_PATH.BLOG}`,
		},
	};
}

async function getBlogs() {
	const { data, totalRecords } = await fetchBlogs(initialListParams);
	return { data, totalRecords };
}

const Blog = async () => {
	const initialData = await getBlogs();
	return (
		<Blogs initialData={{
			loading: false,
			data: initialData.data,
			totalRecord: initialData.totalRecords,
		}} />
    )
}

export default Blog;