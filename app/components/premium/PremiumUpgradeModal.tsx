"use client";

import React, { useState, useEffect } from "react";
import { Modal, Button, Typography, Space, message, Spin } from "antd";
import { CheckCircleFilled } from "@ant-design/icons";
import { useTranslations } from "next-intl";
import { paymentService } from "@/app/lib/service/paymentService";
import '../../ui/components/premiumUpgradeModal.scss';


const { Title, Text, Paragraph } = Typography;

interface PremiumUpgradeModalProps {
  open: boolean;
  onClose: () => void;
}

const PremiumUpgradeModal: React.FC<PremiumUpgradeModalProps> = ({
  open,
  onClose,
}) => {
  const t = useTranslations("Premium");
  const [loading, setLoading] = useState(false);
  const [planType, setPlanType] = useState<"MONTHLY" | "YEARLY">("MONTHLY");
  const [prices, setPrices] = useState<{ MONTHLY: number; YEARLY: number }>({
    MONTHLY: 9.99,
    YEARLY: 99.99,
  });

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const data = await paymentService.getPrices();
        if (data) {
          setPrices(data);
        }
      } catch (error) {
        console.error("Failed to fetch prices:", error);
      }
    };
    if (open) {
      fetchPrices();
    }
  }, [open]);

  const discount = prices.MONTHLY && prices.YEARLY 
    ? Math.round((1 - (prices.YEARLY / (prices.MONTHLY * 12))) * 100) 
    : 16;

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      const returnUrl = `${window.location.origin}/premium/capture`;
      const cancelUrl = `${window.location.origin}`;

      const response = await paymentService.createPayment({
        planType,
        returnUrl,
        cancelUrl,
      });

      if (response && response.approveUrl) {
        // Redirect to PayPal
        window.location.href = response.approveUrl;
      } else {
        message.error(t("payment_error"));
      }
    } catch (error) {
      console.error("Payment initiation error:", error);
      message.error(t("payment_error_generic"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      closable={false}
      width={480}
      className="premium-upgrade-modal"
      modalRender={(modal) => (
        <div className="premium-modal-container">
          {modal}
        </div>
      )}
      styles={{
        content: {
          background: "transparent",
          boxShadow: "none",
          padding: 0,
        },
        body: {
          padding: 0,
        },
      }}
    >
      <Title
        level={2}
        className="premium-modal-title"
      >
        {t("title")}
      </Title>

      <Paragraph
        className="premium-modal-description"
      >
        {t("description")}
      </Paragraph>

      <Space
        direction="vertical"
        size="large"
        className="premium-modal-features"
      >
        <div className="feature-item">
          <CheckCircleFilled className="feature-icon" />
          <div>
            <Text className="feature-title">{t("features.ad_free.title")}</Text>
            <Text className="feature-desc">{t("features.ad_free.description")}</Text>
          </div>
        </div>
        <div className="feature-item">
          <CheckCircleFilled className="feature-icon" />
          <div>
            <Text className="feature-title">{t("features.exclusive_patterns.title")}</Text>
            <Text className="feature-desc">{t("features.exclusive_patterns.description")}</Text>
          </div>
        </div>
        <div className="feature-item">
          <CheckCircleFilled className="feature-icon" />
          <div>
            <Text className="feature-title">{t("features.priority_support.title")}</Text>
            <Text className="feature-desc">{t("features.priority_support.description")}</Text>
          </div>
        </div>
      </Space>

      {/* Plan Selection */}
      <div className="plan-selection-container">
        <div 
          onClick={() => setPlanType('MONTHLY')}
          className={`plan-card ${planType === 'MONTHLY' ? 'active' : ''}`}
        >
          <Text className="plan-card-title">{t("plans.monthly")}</Text>
          <Text className="plan-card-price">${prices.MONTHLY}</Text>
          <Text className="plan-card-billing">{t("plans.monthly_billing")}</Text>
        </div>
        <div 
          onClick={() => setPlanType('YEARLY')}
          className={`plan-card ${planType === 'YEARLY' ? 'active' : ''}`}
        >
          {discount > 0 && <span className="save-badge">{t("plans.save", { discount })}</span>}
          <Text className="plan-card-title">{t("plans.yearly")}</Text>
          <Text className="plan-card-price">${prices.YEARLY}</Text>
          <Text className="plan-card-billing">{t("plans.yearly_billing")}</Text>
        </div>
      </div>

      <Space direction="vertical" className="premium-modal-actions">
        <Button
          type="primary"
          size="large"
          block
          onClick={handleUpgrade}
          disabled={loading}
          className="upgrade-button"
        >
          {loading ? <Spin size="small" /> : t("upgrade_button")}
        </Button>
        <Button
          type="text"
          block
          onClick={onClose}
          disabled={loading}
          className="cancel-button"
        >
          {t("cancel_button")}
        </Button>
      </Space>
    </Modal>
  );
};

export default PremiumUpgradeModal;
