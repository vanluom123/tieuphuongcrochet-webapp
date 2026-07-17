import { getTranslations } from "next-intl/server";
import { Metadata } from "next/types";
import ResetPassword from "./ResetPassword";

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations("ResetPassword");
	return {
		title: t("title"),
		description: t("description"),
		openGraph: {
			title: t("title"),
			description: t("description"),
			url: `${process.env.NEXT_PUBLIC_URL}/reset-password`,
			type: 'website',
			images: [   
				{
					url: `${process.env.NEXT_PUBLIC_URL}/opengraph-image.jpg`,
					width: 1200,
					height: 630,
					alt: 'Reset Password Tieu Phuong Crochet',
				},
			],
		},
	}
}

interface ResetPasswordPageProps {
  searchParams: {
    token?: string;
  };
}

const ResetPasswordPage = ({ searchParams }: ResetPasswordPageProps) => {
    return (
        <ResetPassword token={searchParams?.token || ''} />
    )
}

export default ResetPasswordPage;
