import type { Metadata, ResolvingMetadata } from "next";
import { ROUTE_PATH } from "@/app/lib/constant";
import { fetchProductDetail } from "@/app/lib/service/productService";
import ProductDetail from "./ProductDetail";
import StructureData, {
  createBreadcrumbSchema,
  createProductSchema,
} from "@/app/components/StructureData";
import { getTranslations } from "next-intl/server";

type Props = {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const slug = params.slug;
  const product = await fetchProductDetail(slug, 3600).then((res) => res);
  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: product.name,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [
        ...(product.images?.map((image) => image.fileContent) || []),
        ...previousImages,
      ],
      url: `${process.env.NEXT_PUBLIC_URL}${ROUTE_PATH.SHOP}/${slug}`,
      authors: [product.author || ""],
    },
  };
}

// Generate Product Detail Page
export default async function Page({ params }: { params: { slug: string } }) {
  const product = await fetchProductDetail(params.slug, 3600);
  const t = await getTranslations("MenuNav");

  return (
    <>
      <StructureData
        data={createBreadcrumbSchema([
          {
            name: t("home"),
            url: `${process.env.NEXT_PUBLIC_URL}`,
          },          {
            name: t('shop'),
            url: `${process.env.NEXT_PUBLIC_URL}/${ROUTE_PATH.SHOP}`,
          },
          {
            name: product.name,
            url: `${process.env.NEXT_PUBLIC_URL}/${ROUTE_PATH.SHOP}/${params.slug}`,
          },
        ])}
      />
      <StructureData
        data={createProductSchema({
          name: product.name,
          price: product.price || "",
          inStock: false,
          images: [
            product.src ||
              `${process.env.NEXT_PUBLIC_URL}/opengraph-image.jpg}`,
          ],
          description: product?.description,
          url: `${process.env.NEXT_PUBLIC_URL}${ROUTE_PATH.SHOP}/${params.slug}`,
        })}
      />
      <ProductDetail product={product} />
    </>
  );
}
