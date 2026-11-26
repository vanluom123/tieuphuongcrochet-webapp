import React from 'react';
import ProfileDetail from "@/app/(main)/profile/Profile";
import {Metadata} from "next";
import {getTranslations} from "next-intl/server";
import {ROUTE_PATH} from "@/app/lib/constant";

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

const ProfilePage = async ({params}: { params: Promise<{ slug: string }> }) => {
    const resolvedParams = await params;

    return (
        <ProfileDetail params={resolvedParams}/>
    );
};

export default ProfilePage;