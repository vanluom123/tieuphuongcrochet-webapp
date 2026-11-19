import React from "react";
import Image, { StaticImageData } from "next/image";
import { InstagramOutlined } from "@ant-design/icons";

import logo from "@/public/logo.png";
import facebookImg from "@/public/facebook.png";
import { SOCIAL_LINKS } from "@/app/lib/constant";

import "../../ui/components/socialBox.scss";

interface SocialBoxProps {
  textColor?: string;
  src?: StaticImageData;
  social: string;
  url?: string;
  description?: string;
}

const CHANNEL_HANDLES: Record<string, string> = {
  Shopee: "littlegirl.crochet",
  Facebook: "tieuconuong.tiemlen",
  Instagram: "@little_girl.crochet",
  Tiktok: "@xiao.fang_96",
};

const TikTokBadgeIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.87a8.16 8.16 0 0 0 4.76 1.52v-3.4a4.85 4.85 0 0 1-1-.3Z" />
  </svg>
);

const SocialBox = ({
  textColor,
  src,
  social,
  url,
  description,
}: SocialBoxProps) => {
  const subtitle = description || CHANNEL_HANDLES[social] || "Tiểu Phương Crochet";

  const renderEmblem = () => {
    if (src?.src) {
      return (
        <Image
          width={46}
          height={46}
          alt={social || "Tiểu Phương Crochet"}
          src={src.src}
        />
      );
    }
    if (social === "Facebook") {
      return (
        <Image
          width={46}
          height={46}
          alt="Facebook"
          src={facebookImg.src}
        />
      );
    }
    if (social === "Instagram") {
      return <InstagramOutlined style={{ fontSize: 22, color: "#e42a81" }} />;
    }
    if (social === "Tiktok") {
      return <TikTokBadgeIcon />;
    }
    return (
      <Image
        width={46}
        height={46}
        alt={social || "Tiểu Phương Crochet"}
        src={logo.src}
      />
    );
  };

  return (
    <a
      href={url || SOCIAL_LINKS.FACEBOOK}
      target="_blank"
      rel="noopener noreferrer"
      className="card-social"
    >
      <div className="card-social__emblem">{renderEmblem()}</div>
      <div className="card-social__info">
        <span
          className="card-social__name"
          style={textColor ? { color: textColor } : undefined}
        >
          {social}
        </span>
        <span className="card-social__handle">{subtitle}</span>
      </div>
    </a>
  );
};

export default SocialBox;
