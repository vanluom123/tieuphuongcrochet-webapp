import { Metadata } from "next";
import Products from "./Products";
import { getTranslations } from "next-intl/server";
import { ROUTE_PATH } from '@/app/lib/constant';
import { fetchProducts } from '@/app/lib/service/productService';
import { fetchCategories } from '@/app/lib/service/categoryService';
import { Category, initialListParams } from '@/app/lib/definitions';

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

	return (
		<Products initialData={{
			data: products.data,
			totalRecord: products.totalRecords,
			loading: false
		}} categories={categories as Category[]} />
	)
}