'use client';
import { Divider, Flex, Button, Tooltip } from "antd";
import { useTranslations } from "next-intl";
import IntroductionCard from "@/app/components/introduction-card";
import ViewDetailWrapper from "@/app/components/view-detail-wrapper";
import { Pattern } from "@/app/lib/definitions";
import dynamic from "next/dynamic";
import { useBookmark } from "@/app/hooks/useBookmark";
import Image from "next/image";
import whiteBookmark from '@/public/white-bookmark.png';
import '@/app/ui/components/patternDetail.scss';
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
                <Button 
                    type="primary"
                    shape="circle"
                    className="custom-bookmark-button"
                    onClick={() => toggleBookmark(pattern?.id?.toString() || '')}
                    icon={
                        <div className="bookmark-icon-wrapper">
                            <Image 
                                width={20} 
                                height={20} 
                                src={whiteBookmark}
                                alt='bookmark'
                                priority={true}
                                style={{ 
                                    width: '20px', 
                                    height: '20px', 
                                    objectFit: 'contain',
                                    display: 'block'
                                }}
                            />
                            {isBookmarked && <span className="bookmark-dot"></span>}
                        </div>
                    }
                />
            </Tooltip>

            <CommentSection id={pattern?.id?.toString() || ''} type={"free-pattern"} />
        </ViewDetailWrapper>
    )
}

export default PatternDetail;