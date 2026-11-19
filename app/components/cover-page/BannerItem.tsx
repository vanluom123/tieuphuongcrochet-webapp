import { Button } from "antd";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Banner } from "@/app/lib/definitions";
import CustomNextImage from "../next-image";

interface BannerItemProps {
  banner: Banner;
  classNames?: string;
}

const BannerItem = ({ banner, classNames }: BannerItemProps) => {
  const { fileContent, title, content, url, textColor } = banner;
  const t = useTranslations("Btn");
  const isHero = classNames?.includes("hero-banner-item");

  return (
    <div className={`banner-item ${classNames ? classNames : ""}`}>
      {fileContent && (
        <div className="banner-image-container">
          <CustomNextImage
            src={fileContent}
            alt={title || "Banner"}
            className="banner-image"
            aspectRatio={isHero ? "42.85%" : "56.25%"}
            objectFit={isHero ? "cover" : "scale-down"}
          />
        </div>
      )}
      <div className="banner-item__scrim" aria-hidden="true" />
      <div className="banner-item__infor">
        {title && (
          isHero ? (
            <h2
              style={{ color: textColor || "#FFFFFF" }}
              className="title"
            >
              {title}
            </h2>
          ) : (
            <h4
              style={{ color: textColor || "#FFFFFF" }}
              className="title"
            >
              {title}
            </h4>
          )
        )}
        {content && (
          <p
            style={{ color: textColor || "#FFFFFF" }}
            className="content"
          >
            {content}
          </p>
        )}
        {url && (
          <Link href={url}>
            <Button className="btn-view" type="primary">
              {t("btn_view_detail")}
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default BannerItem;
