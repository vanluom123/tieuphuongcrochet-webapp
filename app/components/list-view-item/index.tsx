import React from "react";
import { Button, Col, Flex, Image, Row } from "antd";
import { ShoppingCartOutlined, UserOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useTranslations } from "next-intl";

import { DataType } from "@/app/lib/definitions";
import { IMAGE_FALLBACK, SOCIAL_LINKS } from "@/app/lib/constant";
import FormattedCurrency from "../forrmat-currency";
import "../../ui/components/list-view-item.scss";

interface ListViewItemProps {
  data: DataType;
  onPreview?: () => void;
  onShopping?: () => void;
  onReadDetail?: () => void;
  isListView?: boolean;
}

const ListViewItem = ({
  data,
  onPreview,
  onReadDetail,
  onShopping,
}: ListViewItemProps) => {
  const {
    price,
    name,
    src,
    author,
    link,
    description,
    currency_code,
    imagesPreview,
  } = data;
  const displayTitle = name || (data as unknown as { title?: string }).title || "";
  const t = useTranslations("ListViewItem");

  const onClickBtn = () => {
    if (onReadDetail instanceof Function) {
      onReadDetail();
    }
    if (onPreview instanceof Function) {
      onPreview();
    }
    if (onShopping instanceof Function) {
      onShopping();
    }
  };

  return (
    <Row gutter={[20, 16]} align="middle" className="list-card-item">
      <Col xs={24} sm={7} lg={5} className="image">
        <div className="list-card-item__thumb">
          <Image.PreviewGroup items={imagesPreview}>
            <Image
              alt={displayTitle}
              src={src}
              fallback={IMAGE_FALLBACK}
            />
          </Image.PreviewGroup>
        </div>
      </Col>

      <Col xs={24} sm={17} lg={19}>
        <div className="item-infor">
          <div className="information">
            <Button className="title" type="link" onClick={onClickBtn}>
              {displayTitle}
            </Button>
            {author && (
              <p className="author">
                <UserOutlined /> {t("intro_author")}: {author}
              </p>
            )}
            {description && <p className="list-card-item__desc">{description}</p>}
          </div>

          {price && (
            <Flex
              align="center"
              justify="space-between"
              wrap="wrap"
              gap={12}
              className="shopping"
            >
              <FormattedCurrency
                price={price}
                currency_code={currency_code}
              />
              <div className="action">
                <Link
                  target="_blank"
                  rel="noopener noreferrer"
                  href={link || SOCIAL_LINKS.FACEBOOK}
                >
                  <Button type="primary" icon={<ShoppingCartOutlined />}>
                    {t("btn_buy")}
                  </Button>
                </Link>
              </div>
            </Flex>
          )}
        </div>
      </Col>
    </Row>
  );
};

export default ListViewItem;
