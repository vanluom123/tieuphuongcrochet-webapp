'use client';
import { Divider } from "antd";
import { useTranslations } from "next-intl";
import IntroductionCard from "@/app/components/introduction-card";
import ViewDetailWrapper from "@/app/components/view-detail-wrapper";
import ViewImagesList from "@/app/components/view-image-list";
import { Pattern } from "@/app/lib/definitions";
 
const PatternDetail = ({pattern}: {pattern: Pattern}) => {

    const t = useTranslations("FreePattern");
    
    return (
        <ViewDetailWrapper
            isShowAlert
            alertMessage={t("note")}
            alertType="warning">

            {/* Introducing the free pattern */}
            <IntroductionCard isPreviewAvatar={false} data={pattern} isShowThumbnail />
            <Divider />
            <ViewImagesList
                name='free-patterns'
                contentTitle={t("detail")}
                content={pattern?.content}
                images={pattern?.files} />
        </ViewDetailWrapper>
    )
}

export default PatternDetail;