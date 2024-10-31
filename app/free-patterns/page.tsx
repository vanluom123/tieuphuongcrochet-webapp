import { JsonLd } from "react-schemaorg";
import { WebPage } from "schema-dts";
import { Metadata } from "next";

import FreePatterns from "./FreePatterns";
import { getTranslations } from "next-intl/server";
import { ROUTE_PATH } from "../lib/constant";
import { fetchFreePatterns } from "../lib/service/freePatternService";
import { fetchCategories } from "../lib/service/categoryService";
import { Category, DataType, initialListParams } from "../lib/definitions";

export const revalidate = 36000;

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations("FreePattern");
	return {
		title: t("title"),
		description: t("description"),

		openGraph: {
			title: t("title"),
			description: t("description"),
			url: `${process.env.NEXT_PUBLIC_URL}${ROUTE_PATH.FREEPATTERNS}`,
			type: 'website',
			images: [
				{
					url: `${process.env.NEXT_PUBLIC_URL}/opengraph-image.jpg`,
					width: 1200,
					height: 630,
					alt: t("title"),
				},
			],
		},
		keywords: [
			t("title"),
			t("Keywords.free_patterns"),
			t("Keywords.sewing_patterns"),
			t("Keywords.craft_patterns"),
			'downloadable patterns',
			'free sewing templates',
			'DIY patterns'
		],
		alternates: {
			canonical: `${process.env.NEXT_PUBLIC_URL}${ROUTE_PATH.FREEPATTERNS}`,
		},
		robots: {
			index: true,
			follow: true,
		}, // Ensure the page is indexable
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

	const t = await getTranslations("FreePattern");

	return (
		<>
			<JsonLd<WebPage>
				item={{
					"@context": "https://schema.org",
					"@type": "WebPage",
					name: t("title"),
					description: t("description"),
					url: `${process.env.NEXT_PUBLIC_URL}${ROUTE_PATH.FREEPATTERNS}`,
					breadcrumb: {
						"@type": "BreadcrumbList",
						itemListElement: [
							{
								"@type": "ListItem",
								position: 1,
								name: "Home",
								item: process.env.NEXT_PUBLIC_URL,
							},
							{
								"@type": "ListItem",
								position: 2,
								name: t("title"),
								item: `${process.env.NEXT_PUBLIC_URL}${ROUTE_PATH.FREEPATTERNS}`,
							},
						],
					},
					mainEntity: {
						"@type": "ItemList",
						itemListElement: freePatterns.data.map((pattern: DataType, index: number) => ({
							"@type": "ListItem",
							position: index + 1,
							item: {
								"@type": "Product",
								name: pattern.title,
								description: pattern.description,
								url: `${process.env.NEXT_PUBLIC_URL}${ROUTE_PATH.FREEPATTERNS}/${pattern.key}`,
							},
						})),
					},
				}}
			/>
			<FreePatterns
				initialData={{
					loading: false,
					data: freePatterns.data,
					totalRecord: freePatterns.totalRecords,
				}}
				categories={categories as Category[]}
			/>
		</>
	)
}

export default Page;