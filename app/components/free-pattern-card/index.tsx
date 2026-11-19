"use client";

import { Avatar, Button, Flex, Skeleton, Tooltip } from "antd";
import {
  BookFilled,
  BookOutlined,
  DeleteFilled,
  EditFilled,
  EyeOutlined,
  HeartFilled,
  HeartOutlined,
  UserOutlined,
} from "@ant-design/icons";
import React, { useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useRequireAuth } from "@/app/hooks/useRequireAuth";
import { ROUTE_PATH, TRANSLATION_STATUS } from "@/app/lib/constant";
import { Pattern } from "@/app/lib/definitions";
import CustomNextImage from "../next-image";
import { useSession } from "next-auth/react";
import { removePatternFromCollection } from "@/app/lib/service/collectionService";
import { toggleLike } from "@/app/lib/service/interactionService";
import { getIconTag } from "../free-pattern-status";
import CollectionPopup from "../collection-popup";
import "../../ui/components/freePatternCard.scss";

interface FreePatternCardProps {
  width?: string | number;
  pattern: Pattern;
  onReadDetail?: () => void;
  loading?: boolean;
  isShowActions?: boolean;
  onDelete?: () => void;
  onEdit?: () => void;
  onUnbookmark?: () => void;
}

const FreePatternCard = ({
  pattern = { name: "", author: "", src: "" },
  width,
  onReadDetail,
  loading,
  isShowActions = false,
  onDelete,
  onEdit,
  onUnbookmark,
}: FreePatternCardProps) => {
  const {
    name,
    src,
    status,
    username,
    userAvatar,
    userId,
    id,
    in_collection,
    likeCount: initialLikeCount,
    is_liked: initialIsLiked,
    viewCount,
  } = pattern;
  const t = useTranslations("FreePattern");
  const profileT = useTranslations("Profile");
  const { data: session } = useSession();
  const { requireAuth } = useRequireAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isInCollection, setIsInCollection] = useState(in_collection || false);
  const [showCollectionPopup, setShowCollectionPopup] = useState(false);

  const [isLiked, setIsLiked] = useState(initialIsLiked || false);
  const [likeCount, setLikeCount] = useState(initialLikeCount || 0);
  const [likeLoading, setLikeLoading] = useState(false);

  React.useEffect(() => {
    setIsInCollection(!!in_collection);
  }, [in_collection]);

  React.useEffect(() => {
    setIsLiked(!!initialIsLiked);
    setLikeCount(initialLikeCount || 0);
  }, [initialIsLiked, initialLikeCount]);

  const handleToggleBookmark = async (patternId: string) => {
    if (!patternId) return;

    if (!requireAuth("save_pattern")) {
      return;
    }

    if (isInCollection) {
      setIsLoading(true);
      try {
        await removePatternFromCollection(patternId);
        setIsInCollection(false);

        if (onUnbookmark) {
          onUnbookmark();
        }
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

  const handleToggleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!requireAuth("like")) {
      return;
    }

    const patternId = id?.toString() || "";
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

  if (loading) {
    return (
      <div
        className="free-pattern-card pattern-tile is-loading"
        style={{ width: width || "100%" }}
      >
        <div className="pattern-tile__skeleton-media">
          <Skeleton.Image active />
        </div>
        <Skeleton active title={{ width: "80%" }} paragraph={{ rows: 1 }} />
      </div>
    );
  }

  const bookmarkTooltip = !session?.user
    ? t("login_to_save")
    : isInCollection
    ? t("remove_from_collection")
    : t("save");

  return (
    <>
      <article
        className="free-pattern-card pattern-tile"
        style={{ width: width || "100%" }}
        onClick={onReadDetail}
      >
        <div className="pattern-tile__media card-cover-custom">
          <CustomNextImage
            className="pattern-tile__img"
            src={src}
            alt={name}
          />

          {status && status !== TRANSLATION_STATUS.NONE && (
            <span
              className={`pattern-tile__status status-${status.toLowerCase()}`}
            >
              {getIconTag(status)}
              <span>{t(`status.${status}`)}</span>
            </span>
          )}

          <Flex className="action-buttons" vertical gap={6}>
            {userId && (
              <Tooltip title={bookmarkTooltip}>
                <Button
                  type="text"
                  shape="circle"
                  loading={isLoading}
                  disabled={isLoading}
                  aria-label={bookmarkTooltip}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleBookmark(id?.toString() || "");
                  }}
                  className={`action-button ${isInCollection ? "is-saved" : ""}`}
                  icon={
                    isInCollection ? (
                      <BookFilled />
                    ) : (
                      <BookOutlined />
                    )
                  }
                />
              </Tooltip>
            )}

            {isShowActions && (
              <>
                <Tooltip title={profileT("patterns.edit")}>
                  <Button
                    type="text"
                    shape="circle"
                    aria-label={profileT("patterns.edit")}
                    icon={<EditFilled />}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onEdit) onEdit();
                    }}
                    className="action-button"
                  />
                </Tooltip>
                <Tooltip title={profileT("patterns.delete")}>
                  <Button
                    type="text"
                    shape="circle"
                    aria-label={profileT("patterns.delete")}
                    icon={<DeleteFilled />}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onDelete) onDelete();
                    }}
                    className="action-button is-danger"
                  />
                </Tooltip>
              </>
            )}
          </Flex>
        </div>

        <Skeleton loading={!name} active paragraph={{ rows: 1 }}>
          {name && (
            <div className="pattern-tile__body">
              <button
                type="button"
                className="card-title pattern-tile__title"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onReadDetail) onReadDetail();
                }}
              >
                {name}
              </button>

              <div className="pattern-tile__meta">
                <div className="creator">
                  {userAvatar ? (
                    <Avatar size={20} src={userAvatar} />
                  ) : (
                    <Avatar size={20} icon={<UserOutlined />} className="creator-fallback" />
                  )}
                  <Link
                    href={`${ROUTE_PATH.PROFILE}/${userId}`}
                    onClick={(e) => e.stopPropagation()}
                    className="creator-link"
                  >
                    {username}
                  </Link>
                </div>

                <div
                  className="pattern-tile__stats"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="pattern-tile__stat">
                    <Tooltip
                      title={
                        !session?.user
                          ? t("login_to_like")
                          : isLiked
                          ? t("unlike")
                          : t("like")
                      }
                    >
                      <Button
                        type="text"
                        size="small"
                        loading={likeLoading}
                        disabled={likeLoading}
                        aria-label={isLiked ? t("unlike") : t("like")}
                        onClick={handleToggleLike}
                        className={`like-button ${isLiked ? "liked" : ""}`}
                        icon={
                          isLiked ? (
                            <HeartFilled />
                          ) : (
                            <HeartOutlined />
                          )
                        }
                      />
                    </Tooltip>
                    {likeCount > 0 && (
                      <span className="stat-count">{likeCount}</span>
                    )}
                  </div>

                  <div className="pattern-tile__stat">
                    <EyeOutlined className="stat-eye-icon" />
                    {(viewCount || 0) > 0 && (
                      <span className="stat-count">{viewCount}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </Skeleton>
      </article>

      <CollectionPopup
        isOpen={showCollectionPopup}
        onClose={() => setShowCollectionPopup(false)}
        patternId={id?.toString() || ""}
        patternName={name}
        onSuccess={handleSaveSuccess}
      />
    </>
  );
};

export default FreePatternCard;
