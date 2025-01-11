import { ROUTE_PATH } from "@/app/lib/constant";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next/types";
import Login from "./Login"

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations("Login");
	return {
		title: t("title"),
		description: t("description"),

		openGraph: {
			title: t("title"),
			description: t("description"),
			url: `${process.env.NEXT_PUBLIC_URL}${ROUTE_PATH.LOGIN}`,
			type: 'website',
			images: [   
				{
					url: `${process.env.NEXT_PUBLIC_URL}/opengraph-image.jpg`,
					width: 1200,
					height: 630,
					alt: 'Login Tieu Phuong Crochet',
				},
			],
		},
	}
}

const LoginPage = () => {
    return (
        <Login />
    )
}

export default LoginPage;