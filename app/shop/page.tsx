import { Metadata } from "next";
import Products from "./Products";
import { getTranslations } from "next-intl/server";
import { ROUTE_PATH } from "../lib/constant";

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations("Shop");
	return {
		title: t("title"),
		description: t("description"),

		openGraph: {
			title: t("title"),
			description: t("description"),
			url: `${process.env.NEXT_PUBLIC_URL}/${ROUTE_PATH.SHOP}`,
		},
	};
}

export default function Shop() {
	return (
		<Products />
	)
}