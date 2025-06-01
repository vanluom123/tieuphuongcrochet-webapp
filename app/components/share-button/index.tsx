"use client";
import { Button, FloatButton, Modal, Input, Space, Flex } from "antd";
import Image from "next/image";
import { useState } from "react";

import { message } from "@/app/lib/notify";
import share from "@/public/share.png";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import SharePopupButton from "./SharePopupButton";

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

  return (
    <>
      <FloatButton
        shape="circle"
        className="float-share-button"
        onClick={() => setIsModalOpen(true)}
        icon={<Image width={20} height={20} src={share} alt="Share icon" />}
      />
      <Modal
        title={t("modalTitle")}
        open={isModalOpen}
        width={400}
        centered
        footer={
          <Space.Compact style={{ width: "100%" }}>
            <Input readOnly value={url} style={{ width: "100%" }} />
            <Button onClick={handleCopyLink}>{t("copyText")}</Button>
          </Space.Compact>
        }
        onCancel={() => setIsModalOpen(false)}
      >
        <Flex align="center" justify="center">
          <SharePopupButton platform="facebook" />
          {/* Phải cài đặt Facebook Developer Console*/}
          {/* <SharePopupButton platform="messenger" /> */}
          <SharePopupButton platform="zalo" />
        </Flex>
      </Modal>
    </>
  );
};

export default ShareButton;
