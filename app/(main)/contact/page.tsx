import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ROUTE_PATH } from '@/app/lib/constant';
import Contact from "./Contact";


export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations("Contact");
	return {
		title: t("title"),
		description: t("description"),

		openGraph: {
			title: t("title"),
			description: t("description"),
			url: `${process.env.NEXT_PUBLIC_URL}${ROUTE_PATH.CONTACT}`,
		},
	};
}

const Page = () => {
    return (
      <Contact/>
    )
}

export default Page;