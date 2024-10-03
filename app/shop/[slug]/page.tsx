'use client'
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Divider } from "antd";

import IntroductionCard from "@/app/components/introduction-card";
import ViewDetailWrapper from "@/app/components/view-detail-wrapper";
import ViewImagesList from "@/app/components/view-image-list";
import { Product } from "@/app/lib/definitions";
import { fetchProductDetail } from "@/app/lib/service/productService";

export default function Page({ params }: { params: { slug: string } }) {
    const [state, setState] = useState({
        product: { name: '' } as Product,
        loading: false,
    });

    const t = useTranslations("Shop");

    useEffect(() => {
        if (params.slug) {
            setState({ ...state, loading: true });
            fetchProductDetail(params.slug as string).then(product => {
                setState({ ...state, product: product })
            }).finally(() => {
                setState(prevState => ({ ...prevState, loading: false }));
            });
        }
    }, [params.slug])

    const { product, loading } = state;

    return (
        <ViewDetailWrapper
            loading={loading}
            isShowAlert
            alertMessage={t("note")}
            alertType="info">

            {/* Introducing the product */}
            <IntroductionCard isPreviewAvatar={false} data={product} />
            <Divider />
            <ViewImagesList
                images={product.images}
                name='product'
                contentTitle={t("detail")}
                content={product.content}
            />
        </ViewDetailWrapper>
    )
}