"use client";
import { memo, useEffect, useRef, useState } from "react";
import {
  Affix,
  Avatar,
  Button,
  Col,
  Divider,
  Flex,
  Row,
  Space,
  Tag,
} from "antd";
import { EyeOutlined, LeftOutlined, RightOutlined, UserOutlined, HeartOutlined } from "@ant-design/icons";
import Link from "next/link";
import { findIndex, map } from "lodash";
import { useTranslations } from "next-intl";

import { FileUpload, Product } from "@/app/lib/definitions";
import { Pattern } from "@/app/lib/definitions";
import { getElement, getStatusColor } from "@/app/lib/utils";
import { DragScroll } from "@/app/lib/utils";
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
}

const IMAGE_MARGIN = 10;
const IMAGE_AMOUNT = 4;

const IntroductionCard = ({
  data,
  isShowThumbnail,
  isPreviewAvatar,
  viewCount,
  likeCount,
}: IntroductionCardProps) => {
  const { src, name, author, description, images, link, price, currency_code, id } = data;
  const { status, userId, userAvatar, username } = data as Pattern;
  const currentViewCount = viewCount !== undefined ? viewCount : data.viewCount;
  const currentLikeCount = likeCount !== undefined ? likeCount : (data as any).likeCount;
  const [activeThumbnail, setActiveThumbnail] = useState({ index: 0, src });
  const t = useTranslations("IntroductionCard");
  const sliderRef = useRef(null);

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
      }
    }
    if (isShowThumbnail && images && images?.length > 1) {
      DragScroll(".images-outer");
      const widthThumbnail = getElement(".images").offsetWidth;
      const thumbnailItems = document.querySelectorAll(".thumbnail-item");
      for (let i = 0; i < thumbnailItems.length; i++) {
        const item = thumbnailItems[i] as HTMLElement;
        const size = `${widthThumbnail / IMAGE_AMOUNT - IMAGE_MARGIN}px`;
        item.style.width = size;
        item.style.height = size;
      }

      if (images.length > 4) {
        getElement(".thumbnail-photos")?.classList.add("show-prev-next");
      }
    }
  }, [data.name, src, images, isShowThumbnail]);

  const getImageWidth = () => {
    return (
      (getElement(".thumbnail-item").offsetWidth + IMAGE_MARGIN) * IMAGE_AMOUNT
    );
  };

  const onClickPrev = () => {
    onMouseClickPrev(getImageWidth());
  };

  const onClickNext = () => {
    onMouseClickNext(getImageWidth());
  };

  const onMouseClickNext = (offsetWidth: number) => {
    const container = sliderRef.current as unknown as HTMLDivElement;
    let scrollLeft = container.scrollLeft;
    scrollLeft += offsetWidth;
    if (scrollLeft >= container.scrollWidth) {
      scrollLeft = container.scrollWidth;
    }
    container.scrollLeft = scrollLeft;
  };

  const onMouseClickPrev = (offsetWidth: number) => {
    const container = sliderRef.current as unknown as HTMLDivElement;
    let scrollLeft = container.scrollLeft;
    scrollLeft -= offsetWidth;
    if (scrollLeft <= 0) {
      scrollLeft = 0;
    }
    container.scrollLeft = scrollLeft;
  };

  return (
    <div className="introduction-card">
      {username && (
        <Affix offsetTop={0}>
          <Flex
            align="center"
            justify="space-between"
            className="introduction-card_creator"
          >
            <div className="creator">
              {userAvatar ? (
                <Avatar size="default" src={userAvatar} />
              ) : (
                <UserOutlined />
              )}
              {username && (
                <Link
                  href={`${ROUTE_PATH.PROFILE}/${userId}`}
                  className="creator-link"
                >
                  {username}
                </Link>
              )}
            </div>
            <Flex align="center" gap={12}>
              {typeof currentViewCount === "number" && (
                <Flex align="center" gap={4} className="creator-views" style={{ color: "#666", fontSize: 13 }}>
                  <EyeOutlined style={{ fontSize: 15 }} />
                  <span>{currentViewCount}</span>
                </Flex>
              )}
              {typeof currentLikeCount === "number" && (
                <Flex align="center" gap={4} className="creator-likes" style={{ color: "#666", fontSize: 13 }}>
                  <HeartOutlined style={{ fontSize: 15 }} />
                  <span>{currentLikeCount}</span>
                </Flex>
              )}
            </Flex>
          </Flex>
        </Affix>
      )}

      <Row gutter={[20, 20]}>
        <Col span={24}></Col>

        <Col xs={24} md={12}>
          <DownloadImage
            width="100%"
            src={activeThumbnail.src}
            preview={isPreviewAvatar}
          />
          {images && images?.length > 1 && isShowThumbnail && (
            <div className="thumbnail-photos">
              <div ref={sliderRef} className="images-outer">
                <Flex className="images">
                  {images &&
                    map(images, (image, index) => (
                      <DownloadImage
                        onClick={() =>
                          onClickThumbnail(
                            index,
                            image.url || image.fileContent
                          )
                        }
                        className={`${
                          activeThumbnail.index === index
                            ? "active-thumbnail thumbnail-item"
                            : "thumbnail-item"
                        }`}
                        key={`intro_img_${index}`}
                        src={image?.fileContent}
                        preview={false}
                      />
                    ))}
                </Flex>
              </div>
              <div className="prev-next">
                <Button
                  onClick={onClickPrev}
                  shape="circle"
                  className="prev"
                  icon={<LeftOutlined />}
                />
                <Button
                  onClick={onClickNext}
                  shape="circle"
                  className="next"
                  icon={<RightOutlined />}
                />
              </div>
            </div>
          )}
        </Col>
        <Col xs={24} md={12}>
          <div className="text-box">
            <h1 className="card-title mt-0">{name}</h1>
            <Flex align="center" gap={12} wrap="wrap" style={{ marginTop: 8, marginBottom: 8 }}>
              {status && status !== TRANSLATION_STATUS.NONE && (
                <div>
                  <Tag
                    className="status-tag"
                    color={getStatusColor(status || "NONE")}
                  >
                    {t(`status.${status}`)}
                  </Tag>
                </div>
              )}
              {typeof currentViewCount === "number" && (
                <Flex align="center" gap={4} style={{ color: "#666", fontSize: 13 }}>
                  <EyeOutlined style={{ fontSize: 14 }} />
                  <span>{currentViewCount} {t("views")}</span>
                </Flex>
              )}
              {typeof currentLikeCount === "number" && (
                <Flex align="center" gap={4} style={{ color: "#666", fontSize: 13 }}>
                  <HeartOutlined style={{ fontSize: 14 }} />
                  <span>{currentLikeCount}</span>
                </Flex>
              )}
            </Flex>

            {author && (
              <span className="author">
                {t("author")}:&nbsp;<i>{author}</i>
              </span>
            )}
            {description && <p className="description">{description}</p>}
            {price && (
              <>
                <Divider />
                <Space direction="vertical" size="middle">
                  {price && (
                    <FormattedCurrency
                      price={price}
                      currency_code={currency_code}
                    />
                  )}
                  {(price || link) && (
                    <Link href={link || SOCIAL_LINKS.FACEBOOK} target="_blank">
                      <Button className="btn-border" type="primary">
                        {t("btn_order")}
                      </Button>
                    </Link>
                  )}
                </Space>
              </>
            )}
          </div>
        </Col>
      </Row>
      <ShareButton />
    </div>
  );
};

export default memo(IntroductionCard);
