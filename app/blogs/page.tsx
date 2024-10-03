
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ROUTE_PATH } from "../lib/constant";
import Blogs from "./Blogs";


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

const Page = () => {
	return (
		<Blogs />
	)
}

export default Page;