// import { Alert, Divider, Space, Spin } from "antd";
'use client'
import IntroductionCard from "@/app/components/introduction-card";
import ViewDetailWrapper from "@/app/components/view-detail-wrapper";
import ViewImagesList from "@/app/components/view-image-list";
import { Product } from "@/app/lib/definitions";
import { fetchProductDetail } from "@/app/lib/service/productService";
import {Divider } from "antd";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
export default function Page({ params }: { params: { slug: string } }) {
    const id = params.slug;
    const [state, setState] = useState({
        product: { name: '' } as Product,
        loading: false,
    });

    const t = useTranslations("Shop");

    useEffect(() => {
        setState({ ...state, loading: true });

        fetchProductDetail(id as string).then(product => {
            setState({ ...state, product: product })
        }).finally(() => {			
			setState(prevState => ({ ...prevState, loading: false }));
		});
    }, [id])

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