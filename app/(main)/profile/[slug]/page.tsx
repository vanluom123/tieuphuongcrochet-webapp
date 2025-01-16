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

const ProfilePage = ({params}: { params: { slug: string } }) => {

    return (
        <ProfileDetail params={params}/>
    );
};

export default ProfilePage;