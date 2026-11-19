import { Drawer } from "antd";
import Image from "next/image";
import Link from "next/link";
import { memo } from "react";
import { useTranslations } from "next-intl";

import logo from "@/public/logo.png";
import { ROUTE_PATH } from "@/app/lib/constant";

interface SidebarNavProps {
  isOpenSidebar: boolean;
  setIsOpenSidebar: (isOpen: boolean) => void;
  children: React.ReactNode;
}

const SidebarNav = memo(
  ({ isOpenSidebar, setIsOpenSidebar, children }: SidebarNavProps) => {
    const t = useTranslations("App");
    const handleClose = () => setIsOpenSidebar(false);

    return (
      <Drawer
        width={300}
        className="drawer-menu"
        placement="left"
        open={isOpenSidebar}
        onClose={handleClose}
        title={
          <Link
            href={ROUTE_PATH.HOME}
            onClick={handleClose}
            className="drawer-menu-header__logo"
          >
            <Image
              width={40}
              height={40}
              src={logo}
              alt={t("title_mobile")}
              className="drawer-menu-header__img"
              priority
            />
            <span className="logo-text">{t("title_mobile")}</span>
          </Link>
        }
      >
        {children}
      </Drawer>
    );
  }
);

SidebarNav.displayName = "SidebarNav";

export default SidebarNav;
