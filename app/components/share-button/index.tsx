"use client";
import { Button, FloatButton, Modal, Input, Space, Flex } from "antd";
import Image from "next/image";
import { useState } from "react";

import { message } from "@/app/lib/notify";
import share from "@/public/share.png";
import facebook from "@/public/facebook.png";
import twitter from "@/public/twitter.png";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";

const ShareButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const t = useTranslations("ShareButton");
  const pathname = usePathname();
  const url = `${process.env.NEXT_PUBLIC_URL}${pathname}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      message.success(t("copySuccess"));
      setIsModalOpen(false);
    } catch (err) {
      message.error(t("copyError"));
    }
  };

  const handleShareFacebook = () => {
    const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(
      facebookShareUrl,
      "_blank",
      "noopener,noreferrer,width=600,height=400"
    );
  };

  const handleShareTwitter = () => {
    const twitterShareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`;
    window.open(
      twitterShareUrl,
      "_blank",
      "noopener,noreferrer,width=600,height=400"
    );
  };

  return (
    <>
      <FloatButton
        shape="circle"
        className="float-share-button"
        onClick={() => setIsModalOpen(true)}
        icon={<Image width={20} height={20} src={share} alt="Share icon" />}
      />
      <Modal
        title={t('modalTitle')}
        open={isModalOpen}
        width={400}
        footer={
          <Space.Compact style={{ width: "100%" }}>
            <Input readOnly value={url} style={{ width: "100%" }} />
            <Button onClick={handleCopyLink}>{t("copyText")}</Button>
          </Space.Compact>
        }
        onCancel={() => setIsModalOpen(false)}
      >
        <Flex align="center" justify="center">
          <Button
            type="text"
            onClick={handleShareFacebook}
            className="share-social-button"
          >
            <Flex vertical justify="center" align="center" gap="small">
              <Image
                width={32}
                height={32}
                src={facebook}
                alt="Share to facebook"
              />
              <span>Facebook</span>
            </Flex>
          </Button>
          <Button
            type="text"
            onClick={handleShareTwitter}
            className="share-social-button"
          >
            <Flex vertical justify="center" align="center" gap="small">
              <Image
                width={32}
                height={32}
                src={twitter}
                alt="Share to twitter"
              />
              <span>Twitter</span>
            </Flex>
          </Button>
        </Flex>
      </Modal>
    </>
  );
};

export default ShareButton;
