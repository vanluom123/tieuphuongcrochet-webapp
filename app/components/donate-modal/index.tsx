"use client";
import { Divider, Modal, Space, Typography } from "antd";
import { HeartOutlined } from "@ant-design/icons";
import { useTranslations } from "next-intl";
import PayPalDonateButton from "@/app/components/donate-modal/PayPalDonateButton";
import QRDonate from "@/app/components/donate-modal/QRDonate";

const { Title, Text } = Typography;

interface DonateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DonateModal: React.FC<DonateModalProps> = ({ isOpen, onClose }) => {
  const t = useTranslations("DonateModal");
  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={null}
      centered
      className="donate-modal"
      title={
        <div style={{ textAlign: "center" }}>
          <Title level={3} className="donate-modal-title">
            <HeartOutlined
              style={{ color: "var(--color-accent)", marginRight: 8 }}
            />
            {t("title")}
          </Title>
        </div>
      }
    >
      <div style={{ padding: "4px 4px 0" }}>
        <p className="donate-modal-message">{t("message")}</p>
        <div className="donate-modal-content">
          <Space direction="vertical" style={{ width: "100%" }}>
            <PayPalDonateButton />
            <Divider type="horizontal">
              <Text
                style={{
                  fontSize: 14,
                  color: "var(--color-ink-muted)",
                  display: "block",
                }}
              >
                {t("or")}
              </Text>
            </Divider>
            <QRDonate />
          </Space>
        </div>

        <p className="donate-modal-thanks">
          {t("thanks")}
          <br />
          <strong>{t("web_title")}</strong>
        </p>
      </div>
    </Modal>
  );
};

export default DonateModal;
