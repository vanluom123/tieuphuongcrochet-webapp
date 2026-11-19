"use client";
import { Button, FloatButton, Modal, Input, Space, Flex } from "antd";
import { ShareAltOutlined } from "@ant-design/icons";
import { useState } from "react";

import { message } from "@/app/lib/notify";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import SharePopupButton from "./SharePopupButton";

interface ShareButtonProps {
  variant?: "floating" | "inline";
  label?: string;
}

const ShareButton = ({ variant = "floating", label }: ShareButtonProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const t = useTranslations("ShareButton");
  const pathname = usePathname();
  const baseUrl = process.env.NEXT_PUBLIC_URL || "";
  const url = `${baseUrl}${pathname}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      message.success(t("copySuccess"));
      setIsModalOpen(false);
    } catch {
      message.error(t("copyError"));
    }
  };

  return (
    <>
      {variant === "inline" ? (
        <Button
          type="default"
          icon={<ShareAltOutlined />}
          onClick={() => setIsModalOpen(true)}
          className="inline-share-button"
        >
          {label || t("modalTitle")}
        </Button>
      ) : (
        <FloatButton
          shape="circle"
          className="float-share-button"
          aria-label={t("modalTitle")}
          onClick={() => setIsModalOpen(true)}
          icon={<ShareAltOutlined />}
        />
      )}

      <Modal
        title={t("modalTitle")}
        open={isModalOpen}
        width={400}
        centered
        footer={
          <Space.Compact style={{ width: "100%" }}>
            <Input readOnly value={url} style={{ width: "100%" }} />
            <Button type="primary" onClick={handleCopyLink}>
              {t("copyText")}
            </Button>
          </Space.Compact>
        }
        onCancel={() => setIsModalOpen(false)}
      >
        <Flex align="center" justify="center" gap={12} style={{ padding: "8px 0" }}>
          <SharePopupButton platform="facebook" />
          <SharePopupButton platform="zalo" />
        </Flex>
      </Modal>
    </>
  );
};

export default ShareButton;
