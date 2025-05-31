'use client';
import { Divider, Flex, Button, Tooltip, FloatButton } from "antd";
import { useTranslations } from "next-intl";
import IntroductionCard from "@/app/components/introduction-card";
import ViewDetailWrapper from "@/app/components/view-detail-wrapper";
import { Pattern } from "@/app/lib/definitions";
import dynamic from "next/dynamic";
import { useBookmark } from "@/app/hooks/useBookmark";
import Image from "next/image";
import primaryBookmark from '@/public/primary-bookmark.png';
import bookmark from '@/public/bookmark.png';
import CommentSection from "@/app/components/comment/CommentSection";

// Lazy load ViewImagesList component
const ViewImagesList = dynamic(
    () => import("@/app/components/view-image-list"),
    { ssr: false } // Disable server-side rendering
);

const PatternDetail = ({ pattern }: { pattern: Pattern }) => {

    const t = useTranslations("FreePattern");
    const { isBookmarked, toggleBookmark } = useBookmark(pattern?.id?.toString());

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

            {/* Custom bookmark button for both desktop and mobile */}
            <Tooltip title={isBookmarked ? t("remove_from_collection") : t("save")}>
                <FloatButton
                    shape="circle"
                    className="custom-bookmark-button"
                    onClick={() => toggleBookmark(pattern?.id?.toString() || '')}
                    icon={
                        <Image
                            width={20}
                            height={20}
                            src={isBookmarked ? primaryBookmark : bookmark}
                            alt='bookmark'
                            priority={true}
                        />
                    }
                    style={{ zIndex: 10 }}
                />
            </Tooltip>

            <CommentSection id={pattern?.id?.toString() || ''} type={"free-pattern"} />
        </ViewDetailWrapper>
    )
}

export default PatternDetail;