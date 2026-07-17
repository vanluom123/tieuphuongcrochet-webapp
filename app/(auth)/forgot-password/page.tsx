import { ROUTE_PATH } from "@/app/lib/constant";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next/types";
import ForgotPassword from "./ForgotPassword";

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations("ForgotPassword");
	return {
		title: t("title"),
		description: t("description"),
		openGraph: {
			title: t("title"),
			description: t("description"),
			url: `${process.env.NEXT_PUBLIC_URL}/forgot-password`,
			type: 'website',
			images: [   
				{
					url: `${process.env.NEXT_PUBLIC_URL}/opengraph-image.jpg`,
					width: 1200,
					height: 630,
					alt: 'Forgot Password Tieu Phuong Crochet',
				},
			],
		},
	}
}

const ForgotPasswordPage = () => {
    return (
        <ForgotPassword />
    )
}

export default ForgotPasswordPage;
