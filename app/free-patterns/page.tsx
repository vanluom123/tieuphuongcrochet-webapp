
import { Metadata } from "next";
import FreePatterns from "./FreePatterns";
import { getTranslations } from "next-intl/server";
import { ROUTE_PATH } from "../lib/constant";
import { fetchFreePatterns } from "../lib/service/freePatternService";
import { fetchCategories } from "../lib/service/categoryService";
import { Category, initialListParams } from "../lib/definitions";


export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations("FreePattern");
	return {
		title: t("title"),
		description: t("description"),

		openGraph: {
			title: t("title"),
			description: t("description"),
			url: `${process.env.NEXT_PUBLIC_URL}/${ROUTE_PATH.FREEPATTERNS}`,
		},
	};
}

async function getFreePatterns() {
	const { data, totalRecords } = await fetchFreePatterns(initialListParams);
	return { data, totalRecords };
}

async function getCategories() {
	return await fetchCategories();
}

const Page = async () => {
	const [freePatterns, categories] = await Promise.all([
		getFreePatterns(),
		getCategories(),
	]);

	return (
		<FreePatterns initialData={{
			loading: false,
			data: freePatterns.data,
			totalRecord: freePatterns.totalRecords,
		}} categories={categories as Category[]} />
	)
}

export default Page;