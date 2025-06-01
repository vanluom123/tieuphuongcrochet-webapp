"use client";

import { Button, Flex } from "antd";
import Image, { StaticImageData } from "next/image";
import React from "react";

import facebook from "@/public/facebook.png";
import messenger from "@/public/messenger.png";
import zalo from "@/public/zalo.png";
import { message } from "@/app/lib/notify";
import { checkMobile } from "@/app/lib/utils";

type SharePlatform = "facebook" | "messenger" | "zalo";

interface SharePopupButtonProps {
  platform: SharePlatform;
  appId?: string; // Messenger cần App ID
  redirectUri?: string; // Messenger cần redirect URI
}

export default function SharePopupButton({
  platform,
  appId,
  redirectUri,
}: SharePopupButtonProps) {
  const handleClick = () => {
    const currentUrl = window.location.href;
    let shareUrl = "";
    const isMobile = checkMobile() || /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    switch (platform) {
      case "facebook":
        const encodedUrl = encodeURIComponent(currentUrl);
        if (isMobile) {
          // Mở app Facebook nếu có (nếu không có thì vẫn fallback sang trình duyệt)
          shareUrl = `fb://facewebmodal/f?href=https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        } else {
          // Trên desktop thì mở popup chia sẻ
          shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        }
        break;
      case "messenger":
        if (!appId || !redirectUri) {
          message.error("Messenger cần appId và redirectUri");
          return;
        }
        shareUrl = `https://www.facebook.com/dialog/send?app_id=${appId}&link=${encodeURIComponent(
          currentUrl
        )}&redirect_uri=${encodeURIComponent(redirectUri)}`;
        break;
      case "zalo":
        // Zalo chỉ hỗ trợ trên mobile
        if (!isMobile) {
          message.warning("Zalo chỉ hỗ trợ chia sẻ trên thiết bị di động.");
          return;
        }
        break;
      default:
        return;
    }

    window.open(shareUrl, "_blank", "width=600,height=400,noopener,noreferrer");
  };

  const labelMap: Record<SharePlatform, string> = {
    facebook: "Facebook",
    messenger: "Messenger",
    zalo: "Zalo",
  };

  const logoMap: Record<SharePlatform, StaticImageData> = {
    facebook: facebook,
    messenger: messenger,
    zalo: zalo,
  };

  return (
    <Button type="text" onClick={handleClick} className="share-social-button">
      <Flex vertical justify="center" align="center" gap="small">
        <Image
          width={32}
          height={32}
          src={logoMap[platform]}
          alt={`Logo ${labelMap[platform]}`}
        />
        <span>{labelMap[platform]}</span>
      </Flex>
    </Button>
  );
}
