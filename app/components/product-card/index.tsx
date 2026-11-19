"use client";

import React from "react";
import { Skeleton, Tooltip } from "antd";
import { useTranslations } from "next-intl";
import { EyeOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import Link from "next/link";

import { ROUTE_PATH } from "@/app/lib/constant";
import { Product } from "@/app/lib/definitions";
import FormattedCurrency from "../forrmat-currency";
import CustomNextImage from "../next-image";

import "../../ui/components/productCard.scss";

interface ProductCardProps {
  width?: string | number;
  product: Product;
  onPreview?: () => void;
  onShopping?: () => void;
  onReadDetail?: () => void;
  parentLink?: string;
  loading?: boolean;
}

const ProductCard = ({
  width,
  product,
  onPreview,
  onReadDetail,
  onShopping,
  parentLink = `${ROUTE_PATH.SHOP}`,
  loading,
}: ProductCardProps) => {
  const t = useTranslations("Btn");
  const { currency_code, price, name, src, link, id } = product;

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

  if (loading) {
    return (
      <div
        className="card-product product-tile is-loading"
        style={{ width: width || "100%" }}
      >
        <div className="product-tile__skeleton-media">
          <Skeleton.Image active />
        </div>
        <Skeleton active title={{ width: "75%" }} paragraph={{ rows: 1 }} />
      </div>
    );
  }

  return (
    <article
      className={
        name
          ? "card-product product-tile"
          : "card-product product-tile not-title"
      }
      style={{ width: width || "100%" }}
      onClick={onClickBtn}
    >
      <div className="product-tile__media">
        <CustomNextImage
          className="product-tile__img"
          src={src}
          alt={name}
        />
      </div>

      {name && (
        <div className="product-tile__body">
          <button
            type="button"
            className="card-title product-tile__title"
            onClick={(e) => {
              e.stopPropagation();
              onClickBtn();
            }}
          >
            {name}
          </button>

          <div className="product-tile__footer">
            <FormattedCurrency
              price={price}
              currency_code={currency_code || "VND"}
            />

            <div
              className="product-tile__actions"
              onClick={(e) => e.stopPropagation()}
            >
              {link && (
                <Tooltip title={t("btn_buy")}>
                  <a
                    target="_blank"
                    href={link}
                    rel="noopener noreferrer"
                    aria-label={`${t("btn_buy")} ${name}`}
                    className="product-tile__icon-btn"
                  >
                    <ShoppingCartOutlined />
                  </a>
                </Tooltip>
              )}
              <Tooltip title={t("btn_view_detail")}>
                <Link
                  href={`${parentLink}/${id}`}
                  aria-label={`${t("btn_view_detail")} ${name}`}
                  className="product-tile__icon-btn"
                >
                  <EyeOutlined />
                </Link>
              </Tooltip>
            </div>
          </div>
        </div>
      )}
    </article>
  );
};

export default ProductCard;
