"use client";

import React from "react";
import Link from "next/link";
import { useLocale } from "next-intl";

import { ROUTE_PATH } from "@/app/lib/constant";
import { Post } from "@/app/lib/definitions";
import ReadMoreBtn from "../read-more";
import CustomNextImage from "../next-image";
import "../../ui/components/blogCard.scss";

interface BlogCardProps {
  item: Post;
  onReadDetail?: () => void;
}

const BlogCard = ({ item, onReadDetail }: BlogCardProps) => {
  const locale = useLocale();
  const { createdDate, title, src, id } = item;
  const detailPath = `${ROUTE_PATH.BLOG}/${id}`;

  const date = createdDate ? new Date(createdDate) : null;
  const isValidDate = date && !isNaN(date.getTime());
  const dateLocale = locale === "vi" ? "vi-VN" : "en-US";
  const month = isValidDate
    ? new Intl.DateTimeFormat(dateLocale, { month: "short" }).format(date)
    : "";
  const day = isValidDate
    ? new Intl.DateTimeFormat(dateLocale, { day: "2-digit" }).format(date)
    : "";

  return (
    <article className="card-article blog-editorial-card" onClick={onReadDetail}>
      <div className="artice-image">
        <CustomNextImage
          className="blog-card__img"
          src={src}
          alt={title}
          aspectRatio="62.5%"
        />
        {isValidDate && (
          <time className="artice-date" dateTime={date.toISOString()}>
            <span className="artice-date__day">{day}</span>
            <span className="artice-date__month">{month}</span>
          </time>
        )}
      </div>

      <div className="blog-editorial-card__body">
        <h3 className="blog-editorial-card__title">
          <Link
            href={detailPath}
            className="card-title"
            onClick={(e) => {
              e.stopPropagation();
              if (onReadDetail) onReadDetail();
            }}
          >
            {title}
          </Link>
        </h3>

        <div
          className="blog-editorial-card__footer"
          onClick={(e) => e.stopPropagation()}
        >
          <ReadMoreBtn path={detailPath} />
        </div>
      </div>
    </article>
  );
};

export default BlogCard;
