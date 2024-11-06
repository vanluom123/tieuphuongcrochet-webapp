import { Metadata } from "next";
import { JsonLd } from "react-schemaorg";
import { WebPage } from "schema-dts";
import { getTranslations } from "next-intl/server";

import Products from "./Products";
import { ROUTE_PATH } from '@/app/lib/constant';
import { fetchProducts } from '@/app/lib/service/productService';
import { fetchCategories } from '@/app/lib/service/categoryService';
import { Category, DataType, FileUpload, initialListParams } from '@/app/lib/definitions';

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations("Shop");
	return {
		title: t("title"),
		description: t("description"),

		openGraph: {
			title: t("title"),
			description: t("description"),
			url: `${process.env.NEXT_PUBLIC_URL}${ROUTE_PATH.SHOP}`,
		},
	};
}

async function getProducts() {
	const { data, totalRecords } = await fetchProducts(initialListParams, {
		revalidate: 3600,
		tags: ['products'],
	});
	return { data, totalRecords };
}

async function getCategories() {
	return await fetchCategories();
}

export default async function Shop() {
	const [products, categories] = await Promise.all([
		getProducts(),
		getCategories(),
	]);
	const t = await getTranslations();

	return (
		<>
		<JsonLd<WebPage>
				item={{
					"@context": "https://schema.org",
					"@type": "WebPage",
					name: t("Shop.title"),
					description: t("Shop.description"),
					url: `${process.env.NEXT_PUBLIC_URL}${ROUTE_PATH.SHOP}`,
					breadcrumb: {
						"@type": "BreadcrumbList",
						name: t("Shop.title"),
						itemListElement: [
							{
								"@type": "ListItem",
								position: 1,
								name: t("MenuNav.home"),
								item: process.env.NEXT_PUBLIC_URL,
							},
							{
								"@type": "ListItem",
								position: 2,
								name: t("MenuNav.shop"),
								item: `${process.env.NEXT_PUBLIC_URL}${ROUTE_PATH.SHOP}`,
							},
						],
					},
					mainEntity: {
						"@type": "ItemList",
						itemListElement: products.data.map((product: DataType, index: number) => ({
							"@type": "ListItem",
							position: index + 1,
							item: {
								"@type": "Product",
								name: product.name,
								image: product.images?.map((image: FileUpload) => image.fileContent),
								description: product.description,
								url: `${process.env.NEXT_PUBLIC_URL}${ROUTE_PATH.SHOP}/${product.key}`,
								offers: {
									"@type": "Offer",
									price: product.price,
									priceCurrency: product.currency_code || "VND",
									availability: "https://schema.org/PreOrder"
								}
							},
						})),
					},
				}}
			/>
		<Products initialData={{
			data: products.data,
			totalRecord: products.totalRecords,
			loading: false
		}} categories={categories as Category[]} />
		</>
	)
}