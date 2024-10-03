
import { Metadata } from "next";
import FreePatterns from "./FreePatterns";
import { getTranslations } from "next-intl/server";
import { ROUTE_PATH } from "../lib/constant";



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

const Page = () => {
	return (
		<FreePatterns />
	)
}

export default Page;