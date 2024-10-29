
import { getTranslations } from 'next-intl/server';
import Home from './components/home/Home';
import { fetchHomeData } from './lib/service/homeService';
import './ui/home.scss';
import StructuredData from './components/StructuredData';

export const revalidate = 86400;

export async function generateMetadata() {
	const t = await getTranslations("App");

	return {
		title: t("title"),
		description: t("description"),
		openGraph: {
			title: t("title"),
			description: t("description"),
			url: 'https://www.tieuphuongcrochet.com',
			siteName: t("title"),
			images: [
				{
					url: 'https://www.tieuphuongcrochet.com/home-og-image.jpg',
					width: 1200,
					height: 630,
					alt: t("title"),
				},
			],
			locale: 'vi_VN',
			type: 'website',
		},
	}
};

export default async function Page() {
	const { blogs, freePatterns, products } = await fetchHomeData();
	const t = await getTranslations("App");

	return (
		<>
			<StructuredData
				title={t("title")}
				description={t("description")}
				url="https://www.tieuphuongcrochet.com"
			/>
			<Home blogs={blogs} freePatterns={freePatterns} products={products} />
		</>
	);
}
