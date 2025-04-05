import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ROUTE_PATH } from '@/app/lib/constant';
import NotificationsPage from "./Notification";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Notification");
  return {
    title: t("title"),
    description: t("description"),

    openGraph: {
      title: t("title"),
      description: t("description"),
      url: `${process.env.NEXT_PUBLIC_URL}${ROUTE_PATH.NOTIFICATIONS}`,
    },
  };
}


const Notifications = () => {
  return (
    <NotificationsPage />
  )
}

export default Notifications;