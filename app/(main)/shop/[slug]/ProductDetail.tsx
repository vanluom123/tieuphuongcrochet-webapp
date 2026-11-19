"use client";
import { Divider } from "antd";
import { useTranslations } from "next-intl";

import IntroductionCard from "@/app/components/introduction-card";
import ViewDetailWrapper from "@/app/components/view-detail-wrapper";
import ShareButton from "@/app/components/share-button";
import { Product } from "@/app/lib/definitions";
import dynamic from "next/dynamic";
import CommentSection from "@/app/components/comment/CommentSection";

const ViewImagesList = dynamic(
  () => import("@/app/components/view-image-list"),
  { ssr: false }
);

export default function ProductDetail({ product }: { product: Product }) {
  const t = useTranslations("Shop");

  return (
    <ViewDetailWrapper
      isShowAlert
      alertMessage={t("note")}
      alertType="info"
    >
      <IntroductionCard
        isPreviewAvatar={false}
        data={product}
        actions={<ShareButton variant="inline" />}
      />
      <Divider />
      <ViewImagesList
        images={product?.images}
        name="product"
        contentTitle={t("detail")}
        content={product?.content}
      />
      <CommentSection id={product?.id?.toString() || ""} type={"product"} />
    </ViewDetailWrapper>
  );
}
