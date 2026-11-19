import React from "react";
import { Button, Carousel } from "antd";
import Image from "next/image";
import Link from "next/link";
import { map } from "lodash";
import { useTranslations } from "next-intl";

import BannerItem from "./BannerItem";
import { getBannersByType } from "@/app/lib/utils";
import { Banner } from "@/app/lib/definitions";
import { ROUTE_PATH } from "@/app/lib/constant";
import aboutImg from "@/public/about.jpg";
import "../../ui/components/banner-style.scss";

interface BannersListProps {
  banners: Banner[];
}

const BannersList = ({ banners }: BannersListProps) => {
  const tApp = useTranslations("App");
  const tMenu = useTranslations("MenuNav");
  const homeBanners = getBannersByType(banners, "Home");

  if (!homeBanners || homeBanners.length === 0) {
    return (
      <section className="hero-shell container" aria-label={tApp("title_mobile")}>
        <div className="craft-hero">
          <div className="craft-hero__content">
            <h1 className="craft-hero__title">{tApp("title_mobile")}</h1>
            <p className="craft-hero__desc">{tApp("description")}</p>
            <div className="craft-hero__actions">
              <Link href={ROUTE_PATH.FREEPATTERNS}>
                <Button type="primary" size="large" className="craft-hero__primary-btn">
                  {tMenu("freePattern")}
                </Button>
              </Link>
              <Link href={ROUTE_PATH.SHOP}>
                <Button size="large" className="craft-hero__secondary-btn">
                  {tMenu("shop")}
                </Button>
              </Link>
            </div>
          </div>
          <div className="craft-hero__media">
            <Image
              src={aboutImg}
              alt={tApp("title_mobile")}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 480px"
              style={{ objectFit: "cover" }}
            />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="hero-shell container" aria-label={tApp("title_mobile")}>
      <div className="banner-wrap">
        <Carousel
          autoplay
          fade
          waitForAnimate
          dots={{ className: "dots-custom" }}
        >
          {map(homeBanners, (b, index) => (
            <BannerItem
              key={b.id || `banner_${index}`}
              banner={b}
              classNames="hero-banner-item"
            />
          ))}
        </Carousel>
      </div>
    </section>
  );
};

export default BannersList;
