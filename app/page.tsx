import { getTranslations } from "next-intl/server";
import Home from "./components/home/Home";
import { fetchHomeData } from "./lib/service/homeService";
import "./ui/home.scss";
import StructuredData, {
  createWebPageSchema,
} from "./components/StructureData";

export async function generateMetadata() {
  const t = await getTranslations("App");

  return {
    title: t("title"),
    description: t("description"),
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: `${process.env.NEXT_PUBLIC_URL}`,
      siteName: t("title"),
      images: [
        {
          url: `${process.env.NEXT_PUBLIC_URL}/opengraph-image.jpg`,
          width: 1200,
          height: 630,
          alt: t("title"),
        },
      ],
      locale: "vi_VN",
      type: "website",
    },
  };
}

export default async function Page() {
  const { blogs, freePatterns, products } = await fetchHomeData();
  const t = await getTranslations("App");

  return (
    <>
      <StructuredData
        data={createWebPageSchema({
          title: t("title"),
          description: t("description"),
          url:
            `${process.env.NEXT_PUBLIC_URL}` ||
            "https://www.tieuphuongcrochet.com",
        })}
      />
      <Home blogs={blogs} freePatterns={freePatterns} products={products} />
    </>
  );
}
