import { Metadata } from "next";
import Products from "./Products";
import { getTranslations } from "next-intl/server";
import { ROUTE_PATH } from "../lib/constant";
import { fetchProducts } from "../lib/service/productService";
import { fetchCategories } from "../lib/service/categoryService";
import { Category, initialListParams } from "../lib/definitions";

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

async function getProducts() {
	const { data, totalRecords } = await fetchProducts(initialListParams);
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

	return (
		<Products initialData={{
			data: products.data,
			totalRecord: products.totalRecords,
		}} categories={categories as Category[]} />
	)
}