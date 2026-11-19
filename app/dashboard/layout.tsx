"use client";

import React, { useCallback, useEffect, useState } from "react";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import Link from "next/link";
import { redirect, useRouter, usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";

import logo from "@/public/logo.png";

import { Button, Layout, Menu, theme } from "antd";
import { ROUTE_PATH, USER_ROLES } from "../lib/constant";
import NavLinksDashboard, {
  sidebarItems,
} from "../components/nav-link-dashboard";
import "../ui/dashboard.scss";

const LayoutAdmin: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { Header, Sider, Content, Footer } = Layout;
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const toggleCollapsed = useCallback(() => setCollapsed((prev) => !prev), []);

  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setCollapsed(true);
  }, []);

  if (status === "unauthenticated") {
    redirect(`${ROUTE_PATH.LOGIN}?callbackUrl=${ROUTE_PATH.DASHBOARD}`);
  }

  if (status === "authenticated" && session?.user.role !== USER_ROLES.ADMIN) {
    redirect(ROUTE_PATH.HOME);
  }

  const getTitle = () => {
    const pathnameArr = pathname.split("/");
    const title = pathnameArr[pathnameArr.length - 1];
    return title || "dashboard";
  };

  const onSelectItem = ({ key }: { key: string }) => {
    router.push(key);
  };

  return (
    <Layout className="admin-page-layout">
      <Header
        className="admin-page-layout__header"
        style={{ background: colorBgContainer }}
      >
        <div className="logo-sidebar">
          <Link href={ROUTE_PATH.HOME} aria-label="Tiểu Phương Crochet">
            <Image
              width={40}
              height={40}
              priority
              src={logo}
              alt="Tiệm len Tiểu Phương"
            />
          </Link>
        </div>
        <Button
          className="siderbar-large-screen"
          type="text"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={toggleCollapsed}
          style={{
            fontSize: "16px",
            width: 40,
          }}
        />
        <span className="table-title">{getTitle()}</span>
      </Header>

      <Layout className="admin-page-layout__content">
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          theme="light"
          className="siderbar-large-screen admin-sider"
        >
          <NavLinksDashboard />
        </Sider>
        <Content
          className="admin-workspace-content"
          style={{
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          {children}
        </Content>
      </Layout>

      <Footer className="admin-page-layout__footer siderbar-small-screen">
        <Menu
          mode="horizontal"
          defaultSelectedKeys={[ROUTE_PATH.DASHBOARD]}
          items={sidebarItems}
          onSelect={onSelectItem}
        />
      </Footer>
    </Layout>
  );
};

export default LayoutAdmin;
