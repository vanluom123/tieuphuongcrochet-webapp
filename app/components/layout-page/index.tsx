"use client";
import { Content } from "antd/es/layout/layout";
import { App, FloatButton, Layout, Tooltip } from "antd";
import { usePathname } from "next/navigation";
import { useState, useEffect, useCallback, useMemo } from "react";
import { GiftOutlined } from "@ant-design/icons";
import { useTranslations } from "next-intl";
import DonateModal from "../donate-modal";

import { ROUTE_PATH } from "../../lib/constant";
import Navigation from "../navigation";
import FooterPage from "../footer-page";
import CoverPage from "../cover-page";
import { onScrollBody } from "@/app/lib/utils";
import Notify from "@/app/lib/notify";

interface LayoutProps {
  children: React.ReactNode;
}

const LayoutPage: React.FC<LayoutProps> = ({ children }) => {
  const pathname = usePathname();
  const tDonate = useTranslations("DonateModal");
  const [currentNav, setCurrentNav] = useState(ROUTE_PATH.HOME);
  const [isDonateModalOpen, setIsDonateModalOpen] = useState(false);

  const toggleDonateModal = useCallback(() => {
    setIsDonateModalOpen((prev) => !prev);
  }, []);

  const setCurrentNavCallback = useCallback((newNav: string) => {
    setCurrentNav(newNav);
  }, []);

  const isDashboardRoute = useMemo(() => {
    return pathname.includes(ROUTE_PATH.DASHBOARD);
  }, [pathname]);

  const isProfileRoute = useMemo(() => {
    return pathname.includes(ROUTE_PATH.PROFILE);
  }, [pathname]);

  useEffect(() => {
    const navs = pathname.split("/");
    const newCurrentNav = `/${navs[1]}`;
    setCurrentNavCallback(newCurrentNav);

    if (navs.length <= 2 || pathname.includes(ROUTE_PATH.PROFILE)) {
      window.scrollTo(0, 0);
    } else {
      onScrollBody(".content-wrap");
    }
  }, [pathname, setCurrentNavCallback]);

  const donationNode = (
    <Tooltip title={tDonate("title")} placement="left">
      <FloatButton
        icon={<GiftOutlined />}
        type="primary"
        aria-label={tDonate("title")}
        onClick={toggleDonateModal}
        className="float-btn-donate"
      />
    </Tooltip>
  );

  if (isDashboardRoute) {
    return (
      <>
        <Layout className="layout-wrap">
          <App notification={{ placement: "topRight" }}>
            <Notify />
          </App>
          {children}
          {donationNode}
        </Layout>
        <DonateModal isOpen={isDonateModalOpen} onClose={toggleDonateModal} />
      </>
    );
  }

  return (
    <Layout className="layout-wrap">
      <App notification={{ placement: "topRight" }}>
        <Notify />
      </App>
      <Navigation
        currentNav={currentNav}
        setCurrentNav={setCurrentNavCallback}
      />

      {isProfileRoute ? (
        <Content className="profile-layout-content">{children}</Content>
      ) : (
        <>
          <CoverPage />
          <Content className="content-wrap container">{children}</Content>
        </>
      )}

      <FooterPage currentNav={currentNav} />
      <FloatButton.BackTop
        className="float-btn-back-top"
        visibilityHeight={280}
      />
      {donationNode}
      <DonateModal isOpen={isDonateModalOpen} onClose={toggleDonateModal} />
    </Layout>
  );
};

export default LayoutPage;
