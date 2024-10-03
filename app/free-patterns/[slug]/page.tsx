// import { Alert, Divider, Space, Spin } from "antd";
'use client'
import IntroductionCard from "@/app/components/introduction-card";
import ViewDetailWrapper from "@/app/components/view-detail-wrapper";
import ViewImagesList from "@/app/components/view-image-list";
import { Pattern } from "@/app/lib/definitions";
import { Divider } from "antd";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { fetchFreePatternDetail } from "@/app/lib/service/freePatternService";

export default function Page({ params }: { params: { slug: string } }) {
    const id = params.slug;
    const [state, setState] = useState({
        pattern: { name: '' } as Pattern,
        loading: false,
    });

    const t = useTranslations("FreePattern");

    useEffect(() => {
        setState({ ...state, loading: true });

        fetchFreePatternDetail(id as string).then(pattern => {
            setState({ ...state, pattern: pattern })
        }).finally(() => {			
			setState(prevState => ({ ...prevState, loading: false }));
		});
    }, [id])

    const { pattern, loading } = state;

    return (
        <ViewDetailWrapper
            loading={loading}
            isShowAlert
            alertMessage={t("note")}
            alertType="warning">

            {/* Introducing the free pattern */}
            <IntroductionCard isPreviewAvatar={false} data={pattern} />
            <Divider />
            <ViewImagesList
                name='free-patterns'
                contentTitle={t("detail")}
                content={pattern.content}
                images={pattern.files}            />
        </ViewDetailWrapper>
    )
}