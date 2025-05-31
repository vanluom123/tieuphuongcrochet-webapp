"use client";
import { Content } from "antd/es/layout/layout";
import { App, FloatButton, Layout, Tooltip } from "antd";
import { usePathname } from "next/navigation";
import { useState, useEffect, useCallback, useMemo } from "react";
import { HeartOutlined } from "@ant-design/icons";
import DonateModal from "../donate-modal";

import { ROUTE_PATH } from "../../lib/constant";
import Navigation from "../navigation";
import FooterPage from "../footer-page";
import CoverPage from "../cover-page";
import { animationHeader, onScrollBody } from "@/app/lib/utils";
import Notify from "@/app/lib/notify";

interface LayoutProps {
  children: React.ReactNode;
}

const LayoutPage: React.FC<LayoutProps> = ({ children }) => {
  const pathname = usePathname();
  const [currentNav, setCurrentNav] = useState(ROUTE_PATH.HOME);
  const [isDonateModalOpen, setIsDonateModalOpen] = useState(false);

  const toggleDonateModal = useCallback(() => {
    setIsDonateModalOpen((prev) => !prev);
  }, []);

  const setCurrentNavCallback = useCallback((newNav: string) => {
    setCurrentNav(newNav);
    if (newNav !== ROUTE_PATH.HOME) {
      animationHeader();
    }
  }, []);

  useEffect(() => {
    const navs = pathname.split("/");

    const newCurrentNav = `/${navs[1]}`;
    setCurrentNavCallback(newCurrentNav);

    if (navs.length <= 2) {
      window.scrollTo(0, 0);
    } else {
      onScrollBody(".content-wrap");
    }
  }, [pathname, setCurrentNavCallback]);

  const donationNode = (
    <Tooltip title="Ủng hộ website" placement="left">
      <FloatButton
        icon={<HeartOutlined />}
        type="primary"
        style={{ backgroundColor: "#ff4d4f" }}
        onClick={toggleDonateModal}
        className="float-btn-donate"
      />
    </Tooltip>
  );

  const isSpecialRoute = useMemo(() => {
    return (
      pathname === ROUTE_PATH.LOGIN ||
      pathname.includes(ROUTE_PATH.DASHBOARD) ||
      pathname === ROUTE_PATH.REGISTER ||
      pathname.includes(ROUTE_PATH.PROFILE)
    );
  }, [pathname]);

  if (isSpecialRoute) {
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

      {/* Cover image - banner - breadcrumbs */}
      <CoverPage />
      <Content className="content-wrap container">{children}</Content>
      <FooterPage currentNav={currentNav} />
      <FloatButton.BackTop
        className="float-btn-back-top"
        visibilityHeight={0}
      />
      {donationNode}
      <DonateModal isOpen={isDonateModalOpen} onClose={toggleDonateModal} />
    </Layout>
  );
};

export default LayoutPage;
