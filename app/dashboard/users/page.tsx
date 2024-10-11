import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Users from "./Users";

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations('User');
    return {
        title: t('title'),
        description: t('description')
    };
}

const User = () => {
    
    return(
        <Users />
    )
}

export default User;