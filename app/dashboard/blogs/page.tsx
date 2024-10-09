import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Blogs from "./Blogs";

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations('Blogs');
	return {
		title: t('title'),
		description: t('description')
	};
}

export const Blog = () => {
    return(
        <Blogs />
    )
}

export default Blog;