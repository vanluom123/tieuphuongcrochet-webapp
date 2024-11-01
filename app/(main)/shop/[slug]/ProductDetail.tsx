'use client';
import { Divider } from "antd";
import { useTranslations } from "next-intl";

import IntroductionCard from "@/app/components/introduction-card";
import ViewDetailWrapper from "@/app/components/view-detail-wrapper";
import ViewImagesList from "@/app/components/view-image-list";
import { Product } from "@/app/lib/definitions";

export default function ProductDetail({ product }: { product: Product }) {

    const t = useTranslations("Shop");

    return (
        <ViewDetailWrapper
            isShowAlert
            alertMessage={t("note")}
            alertType="info">

            {/* Introducing the product */}
            <IntroductionCard isPreviewAvatar={false} data={product} />
            <Divider />
            <ViewImagesList
                images={product?.images}
                name='product'
                contentTitle={t("detail")}
                content={product?.content}
            />
        </ViewDetailWrapper>
    )
}