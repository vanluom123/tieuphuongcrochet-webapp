"use client";
import { Button, Divider, Flex } from "antd";
import {
  BookFilled,
  BookOutlined,
  HeartFilled,
  HeartOutlined,
} from "@ant-design/icons";
import { useTranslations } from "next-intl";
import IntroductionCard from "@/app/components/introduction-card";
import ViewDetailWrapper from "@/app/components/view-detail-wrapper";
import ShareButton from "@/app/components/share-button";
import { Pattern } from "@/app/lib/definitions";
import dynamic from "next/dynamic";
import CommentSection from "@/app/components/comment/CommentSection";
import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { removePatternFromCollection } from "@/app/lib/service/collectionService";
import CollectionPopup from "@/app/components/collection-popup";
import { useRequireAuth } from "@/app/hooks/useRequireAuth";
import {
  existInCollection,
  checkIsPatternLiked,
} from "@/app/lib/service/freePatternService";
import { toggleLike } from "@/app/lib/service/interactionService";
import { ReportView } from "@/app/components/ReportView";

const ViewImagesList = dynamic(
  () => import("@/app/components/view-image-list"),
  { ssr: false }
);

const PatternDetail = ({ pattern }: { pattern: Pattern }) => {
  const t = useTranslations("FreePattern");
  const { data: session } = useSession();
  const { requireAuth } = useRequireAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isInCollection, setIsInCollection] = useState(
    pattern?.in_collection || false
  );
  const [showCollectionPopup, setShowCollectionPopup] = useState(false);

  const [isLiked, setIsLiked] = useState(pattern?.is_liked || false);
  const [likeCount, setLikeCount] = useState(pattern?.likeCount || 0);
  const [likeLoading, setLikeLoading] = useState(false);
  const [viewCount, setViewCount] = useState(pattern?.viewCount || 0);

  useEffect(() => {
    if (pattern?.viewCount !== undefined) {
      setViewCount(pattern.viewCount);
    }
  }, [pattern?.viewCount]);

  const handleViewCounted = useCallback(() => {
    setViewCount((prev) => prev + 1);
  }, []);

  useEffect(() => {
    const fetchUserStatus = async () => {
      if (!pattern?.id) return;

      const [collectionRes, likedRes] = await Promise.all([
        existInCollection(pattern.id.toString()),
        checkIsPatternLiked(pattern.id.toString()).catch(() => ({
          data: false,
        })),
      ]);
      setIsInCollection(collectionRes.data || false);
      setIsLiked(likedRes.data || false);
    };

    if (session?.user && pattern?.id) {
      fetchUserStatus();
    }
  }, [pattern?.id, session?.user?.id]);

  const toggleBookmark = async (patternId: string) => {
    if (!patternId) return;

    if (!requireAuth("save_pattern")) {
      return;
    }

    if (isInCollection) {
      setIsLoading(true);
      try {
        await removePatternFromCollection(patternId);
        setIsInCollection(false);
      } catch (error) {
        console.error("Error removing from collection:", error);
      } finally {
        setIsLoading(false);
      }
    } else {
      setShowCollectionPopup(true);
    }
  };

  const handleSaveSuccess = () => {
    setIsInCollection(true);
  };

  const handleToggleLike = async () => {
    if (!requireAuth("like")) {
      return;
    }

    const patternId = pattern?.id?.toString() || "";
    if (!patternId) return;

    setLikeLoading(true);

    const wasLiked = isLiked;
    const optimisticIsLiked = !wasLiked;
    setIsLiked(optimisticIsLiked);
    setLikeCount((prev) => (optimisticIsLiked ? prev + 1 : prev - 1));

    try {
      const newIsLiked = await toggleLike(patternId, "FREE_PATTERN");
      if (newIsLiked !== optimisticIsLiked) {
        setIsLiked(newIsLiked);
        setLikeCount((prev) => (wasLiked ? prev + 1 : prev - 1));
      }
      setIsLiked(newIsLiked);
    } catch (error) {
      setIsLiked(wasLiked);
      setLikeCount((prev) => (wasLiked ? prev + 1 : prev - 1));
      console.error("Error toggling like:", error);
    } finally {
      setLikeLoading(false);
    }
  };

  const actionButtons = (
    <>
      <Button
        type="default"
        loading={likeLoading}
        disabled={likeLoading}
        onClick={handleToggleLike}
        className={`pattern-action-btn ${isLiked ? "is-liked" : ""}`}
        icon={isLiked ? <HeartFilled /> : <HeartOutlined />}
      >
        {isLiked ? t("unlike") : t("like")}
        {likeCount > 0 ? ` (${likeCount})` : ""}
      </Button>

      <Button
        type="default"
        loading={isLoading}
        disabled={isLoading}
        onClick={() => toggleBookmark(pattern?.id?.toString() || "")}
        className={`pattern-action-btn ${isInCollection ? "is-saved" : ""}`}
        icon={isInCollection ? <BookFilled /> : <BookOutlined />}
      >
        {isInCollection ? t("remove_from_collection") : t("save")}
      </Button>

      <ShareButton variant="inline" />
    </>
  );

  return (
    <ViewDetailWrapper
      isShowAlert
      alertMessage={t("note")}
      alertType="warning"
    >
      {pattern?.id && (
        <ReportView
          id={pattern.id.toString()}
          type="FREE_PATTERN"
          onViewCounted={handleViewCounted}
        />
      )}

      <div className="pattern-header">
        <Flex vertical gap="small">
          <IntroductionCard
            isPreviewAvatar
            data={pattern}
            isShowThumbnail
            viewCount={viewCount}
            likeCount={likeCount}
            actions={actionButtons}
          />
        </Flex>
      </div>

      <Divider />

      <ViewImagesList
        isPattern
        name="free-patterns"
        contentTitle={t("detail")}
        content={pattern?.content}
        images={pattern?.files}
      />

      <CommentSection
        id={pattern?.id?.toString() || ""}
        type={"free-pattern"}
      />

      <CollectionPopup
        isOpen={showCollectionPopup}
        onClose={() => setShowCollectionPopup(false)}
        patternId={pattern?.id?.toString() || ""}
        patternName={pattern?.name}
        onSuccess={handleSaveSuccess}
      />
    </ViewDetailWrapper>
  );
};

export default PatternDetail;
