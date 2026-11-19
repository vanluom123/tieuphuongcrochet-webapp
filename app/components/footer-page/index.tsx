import React, { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";

import CopyRight from "../copy-right";
import { FOOTER_LINK, ROUTE_PATH, SOCIAL_LINKS } from "@/app/lib/constant";
import logo from "@/public/logo.png";

interface FooterProps {
  currentNav: string;
}

const FooterPage: React.FC<FooterProps> = ({ currentNav }) => {
  const t = useTranslations("MenuNav");
  const tApp = useTranslations("App");
  const tSocial = useTranslations("Home.Social");

  const getActiveClass = useMemo(
    () => (path: string) => {
      if (currentNav === ROUTE_PATH.HOME) {
        return path === currentNav ? "actived" : "";
      }
      return path.includes(currentNav) ? "actived" : "";
    },
    [currentNav]
  );

  return (
    <footer className="footer-wrap">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link href={ROUTE_PATH.HOME} className="footer-brand__head">
              <Image
                className="footer-brand__logo"
                src={logo}
                alt={tApp("title_mobile")}
                width={52}
                height={52}
              />
              <span className="footer-brand__name">{tApp("title_mobile")}</span>
            </Link>
            <p className="footer-brand__desc">{tApp("description")}</p>
          </div>

          <nav className="footer-nav" aria-label="Footer navigation">
            {FOOTER_LINK.map(({ name, path }, index) => (
              <div
                className={getActiveClass(path)}
                key={`${name}_${index}`}
              >
                <Link className="footer-link" href={path}>
                  {t(name)}
                </Link>
              </div>
            ))}
          </nav>

          <div className="footer-community">
            <p className="footer-community__label">{tSocial("title")}</p>
            <Link href={SOCIAL_LINKS.FACEBOOK} target="_blank" rel="noopener noreferrer" className="footer-link">
              Facebook Fanpage
            </Link>
            <Link href={SOCIAL_LINKS.SOPEE} target="_blank" rel="noopener noreferrer" className="footer-link">
              Shopee Store
            </Link>
          </div>
        </div>

        <CopyRight />
      </div>
    </footer>
  );
};

export default React.memo(FooterPage);
