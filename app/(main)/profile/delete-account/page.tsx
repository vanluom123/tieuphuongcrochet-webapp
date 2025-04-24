import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ROUTE_PATH } from "@/app/lib/constant";
import DeleteAccount from "./DeleteAccount";

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations("Profile");
    return {
        title: t("delete_account.title"),
        description: t("delete_account.description"),
        openGraph: {
            title: t("delete_account.title"), 
            description: t("delete_account.description"),
            url: `${process.env.NEXT_PUBLIC_URL}${ROUTE_PATH.PROFILE}/delete-account`,
        },
    };
}

const DeleteAccountPage = () => {
    return <DeleteAccount />;
};

export default DeleteAccountPage;