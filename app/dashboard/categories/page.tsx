import { ROUTE_PATH } from "@/app/lib/constant";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import CategoriesList from "./Categories";

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations("Category");
	return {
		title: t("title"),
		description: t("description"),

		openGraph: {
			title: t("title"),
			description: t("description"),
			url: `${process.env.NEXT_PUBLIC_URL}${ROUTE_PATH.DASHBOARD_CATEGORY}`,
		},
	};
}

const Page = () => {
	return (
		<CategoriesList />
	)
}

export default Page;