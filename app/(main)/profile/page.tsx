import { ROUTE_PATH } from "@/app/lib/constant";
import Profile from "@/app/(main)/profile/Profile";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations("Profile");
	return {
		title: t("title"),
		description: t("description"),

		openGraph: {
			title: t("title"),
			description: t("description"),
			url: `${process.env.NEXT_PUBLIC_URL}${ROUTE_PATH.PROFILE}`,
		},
	};
}

export default async function ProfilePage() {

    return (
        <div className="profile-container">
            <Profile/>
        </div>
    );
}