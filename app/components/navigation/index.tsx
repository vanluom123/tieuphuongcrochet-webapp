"use client";

import React, { useEffect, useState } from "react";
import { Button, Layout } from "antd";
import Image from "next/image";
import { MenuOutlined } from "@ant-design/icons";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "next-intl";

import logo from "@/public/logo.png";
import { ROUTE_PATH } from "@/app/lib/constant";

import Languages from "./Languages";
import SidebarNav from "./Sidebar";
import MenuNav from "./MenuNav";
import "../../ui/navigation.scss";
import UserAccount from "./UserAccount";
import NotificationBell from "../notification/NotificationBell";

interface NavigationProps {
  currentNav: string;
  setCurrentNav: (nav: string) => void;
}

const Navigation = ({ currentNav, setCurrentNav }: NavigationProps) => {
  const [isOpenSidebar, setIsOpenSidebar] = useState(false);
  const tApp = useTranslations("App");

  const { Header } = Layout;
  const pathname = usePathname();

  useEffect(() => {
    const nav = pathname.split("/")[1] || "";
    setCurrentNav(`/${nav}`);
  }, [pathname, setCurrentNav]);

  const onClickNav = (e: { key: string }) => {
    const key = e.key;
    if (key) {
      setCurrentNav(key);
      if (isOpenSidebar) {
        setIsOpenSidebar(false);
      }
    }
  };

  const onHome = () => {
    setCurrentNav(ROUTE_PATH.HOME);
  };

  return (
    <>
      <Header className="header-wrap">
        <div className="header-inner container">
          <div className="header-left">
            <Button
              type="text"
              className="sidebar-menu-icon"
              aria-label="Open menu"
              onClick={() => setIsOpenSidebar(true)}
              icon={<MenuOutlined style={{ fontSize: 19 }} />}
            />
            <Link href={ROUTE_PATH.HOME} onClick={onHome} className="header-logo">
              <span className="logo-wrapper">
                <Image
                  className="image-logo"
                  fill
                  priority
                  src={logo.src}
                  sizes="40px"
                  alt={tApp("title_mobile")}
                />
              </span>
              <span className="header-brand-name">{tApp("title_mobile")}</span>
            </Link>
          </div>

          <nav className="header-nav-desktop" aria-label="Main navigation">
            <MenuNav
              mode="horizontal"
              onClickNav={onClickNav}
              currentNav={currentNav}
            />
          </nav>

          <div className="header-right">
            <Languages />
            <NotificationBell />
            <UserAccount />
          </div>
        </div>
      </Header>

      <SidebarNav
        isOpenSidebar={isOpenSidebar}
        setIsOpenSidebar={setIsOpenSidebar}
      >
        <MenuNav
          mode="inline"
          onClickNav={onClickNav}
          currentNav={currentNav}
        />
      </SidebarNav>
    </>
  );
};

export default Navigation;
