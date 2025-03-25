'use client';
import {Divider, Flex } from "antd";
import { useTranslations } from "next-intl";
import IntroductionCard from "@/app/components/introduction-card";
import ViewDetailWrapper from "@/app/components/view-detail-wrapper";
import { Pattern } from "@/app/lib/definitions";
import dynamic from "next/dynamic";

// Lazy load ViewImagesList component
const ViewImagesList = dynamic(
    () => import("@/app/components/view-image-list"),
    { ssr: false } // Disable server-side rendering
);

const PatternDetail = ({ pattern }: { pattern: Pattern }) => {

    const t = useTranslations("FreePattern");

    return (
        <ViewDetailWrapper
            isShowAlert
            alertMessage={t("note")}
            alertType="warning">

            {/* Introducing the free pattern */}
            <div className="pattern-header">
                <Flex vertical gap="small">
                    <IntroductionCard isPreviewAvatar data={pattern} isShowThumbnail />
                </Flex>
            </div>

            <Divider />

            {/* ViewImagesList sẽ chỉ được render ở client side */}
            <ViewImagesList
                isPattern
                name='free-patterns'
                contentTitle={t("detail")}
                content={pattern?.content}
                images={pattern?.files} />
        </ViewDetailWrapper>
    )
}

export default PatternDetail;