"use client";
import { memo, useEffect, useRef, useState } from "react";
import {
  Avatar,
  Button,
  Col,
  Divider,
  Flex,
  Row,
  Tag,
} from "antd";
import {
  EyeOutlined,
  HeartOutlined,
  LeftOutlined,
  RightOutlined,
  UserOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { findIndex, map } from "lodash";
import { useTranslations } from "next-intl";

import { FileUpload, Product, Pattern } from "@/app/lib/definitions";
import { DragScroll, getStatusColor } from "@/app/lib/utils";
import DownloadImage from "../custom-image";
import {
  ROUTE_PATH,
  SOCIAL_LINKS,
  TRANSLATION_STATUS,
} from "@/app/lib/constant";
import FormattedCurrency from "../forrmat-currency";
import "../../ui/components/introduction-card.scss";
import ShareButton from "../share-button";

interface IntroductionCardProps {
  data: Pattern | Product;
  isShowThumbnail?: boolean;
  isPreviewAvatar?: boolean;
  viewCount?: number;
  likeCount?: number;
  actions?: React.ReactNode;
  showFloatingShare?: boolean;
}

const IntroductionCard = ({
  data,
  isShowThumbnail,
  isPreviewAvatar,
  viewCount,
  likeCount,
  actions,
  showFloatingShare = false,
}: IntroductionCardProps) => {
  const { src, name, author, description, images, link, price, currency_code } =
    data;
  const { status, userId, userAvatar, username } = data as Pattern;
  const currentViewCount = viewCount !== undefined ? viewCount : data.viewCount;
  const currentLikeCount =
    likeCount !== undefined ? likeCount : (data as Pattern).likeCount;
  const [activeThumbnail, setActiveThumbnail] = useState({ index: 0, src });
  const t = useTranslations("IntroductionCard");
  const sliderRef = useRef<HTMLDivElement>(null);

  const onClickThumbnail = (index: number, url: string) => {
    setActiveThumbnail({ index, src: url });
  };

  useEffect(() => {
    return () => {
      setActiveThumbnail({ src: "", index: -1 });
    };
  }, []);

  useEffect(() => {
    if (src) {
      const index = findIndex(
        images,
        (img: FileUpload) => img.fileContent === src
      );
      if (index !== -1) {
        setActiveThumbnail({ index, src });
      } else {
        setActiveThumbnail({ index: 0, src });
      }
    }
    if (isShowThumbnail && images && images.length > 1) {
      const outerEl = document.querySelector(".images-outer");
      if (outerEl) {
        DragScroll(".images-outer");
      }
    }
  }, [data.name, src, images, isShowThumbnail]);

  const getScrollStep = () => {
    const container = sliderRef.current;
    if (!container) return 220;
    return Math.max(180, container.clientWidth * 0.75);
  };

  const onClickPrev = () => {
    const container = sliderRef.current;
    if (!container) return;
    container.scrollLeft = Math.max(0, container.scrollLeft - getScrollStep());
  };

  const onClickNext = () => {
    const container = sliderRef.current;
    if (!container) return;
    container.scrollLeft = Math.min(
      container.scrollWidth,
      container.scrollLeft + getScrollStep()
    );
  };

  const hasThumbnails = Boolean(images && images.length > 1 && isShowThumbnail);

  return (
    <section className="introduction-card">
      <Row gutter={[28, 24]} align="top">
        <Col xs={24} md={11} lg={10}>
          <div className="introduction-card__media">
            <DownloadImage
              width="100%"
              src={activeThumbnail.src}
              preview={isPreviewAvatar}
              alt={name}
            />
          </div>

          {hasThumbnails && (
            <div
              className={`thumbnail-photos ${
                images && images.length > 4 ? "show-prev-next" : ""
              }`}
            >
              {images && images.length > 4 && (
                <Button
                  onClick={onClickPrev}
                  shape="circle"
                  size="small"
                  aria-label="Previous thumbnails"
                  className="thumb-nav prev"
                  icon={<LeftOutlined />}
                />
              )}
              <div ref={sliderRef} className="images-outer">
                <div className="images">
                  {map(images, (image, index) => (
                    <div
                      key={`intro_img_${index}`}
                      className={`thumbnail-slot ${
                        activeThumbnail.index === index ? "is-active" : ""
                      }`}
                    >
                      <DownloadImage
                        onClick={() =>
                          onClickThumbnail(
                            index,
                            image.url || image.fileContent
                          )
                        }
                        className={`thumbnail-item ${
                          activeThumbnail.index === index
                            ? "active-thumbnail"
                            : ""
                        }`}
                        src={image?.fileContent}
                        preview={false}
                        alt={`${name} ${index + 1}`}
                      />
                    </div>
                  ))}
                </div>
              </div>
              {images && images.length > 4 && (
                <Button
                  onClick={onClickNext}
                  shape="circle"
                  size="small"
                  aria-label="Next thumbnails"
                  className="thumb-nav next"
                  icon={<RightOutlined />}
                />
              )}
            </div>
          )}
        </Col>

        <Col xs={24} md={13} lg={14}>
          <div className="text-box introduction-card__info">
            {username && (
              <div className="introduction-card_creator">
                <Link
                  href={`${ROUTE_PATH.PROFILE}/${userId}`}
                  className="creator"
                >
                  {userAvatar ? (
                    <Avatar size={28} src={userAvatar} />
                  ) : (
                    <Avatar
                      size={28}
                      icon={<UserOutlined />}
                      className="creator-fallback"
                    />
                  )}
                  <span className="creator-link">{username}</span>
                </Link>
              </div>
            )}

            <h1 className="card-title mt-0">{name}</h1>

            <Flex
              align="center"
              gap={12}
              wrap="wrap"
              className="introduction-card__meta"
            >
              {status && status !== TRANSLATION_STATUS.NONE && (
                <Tag
                  className={`status-tag status-${status.toLowerCase()}`}
                  color={getStatusColor(status || "NONE")}
                >
                  {t(`status.${status}`)}
                </Tag>
              )}
              {typeof currentViewCount === "number" && (
                <span className="meta-stat">
                  <EyeOutlined />
                  <span>
                    {currentViewCount} {t("views")}
                  </span>
                </span>
              )}
              {typeof currentLikeCount === "number" && (
                <span className="meta-stat">
                  <HeartOutlined />
                  <span>{currentLikeCount}</span>
                </span>
              )}
            </Flex>

            {author && (
              <p className="author">
                {t("author")}: <span>{author}</span>
              </p>
            )}

            {description && <p className="description">{description}</p>}

            {price && (
              <>
                <Divider />
                <Flex
                  align="center"
                  justify="space-between"
                  wrap="wrap"
                  gap={16}
                  className="introduction-card__commerce"
                >
                  <FormattedCurrency
                    price={price}
                    currency_code={currency_code}
                  />
                  {(price || link) && (
                    <Link
                      href={link || SOCIAL_LINKS.FACEBOOK}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button className="btn-border" type="primary">
                        {t("btn_order")}
                      </Button>
                    </Link>
                  )}
                </Flex>
              </>
            )}

            {actions && (
              <div className="introduction-card__actions">{actions}</div>
            )}
          </div>
        </Col>
      </Row>

      {showFloatingShare && <ShareButton />}
    </section>
  );
};

export default memo(IntroductionCard);
