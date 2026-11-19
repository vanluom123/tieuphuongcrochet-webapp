import { BREADCRUMB, ROUTE_PATH } from "@/app/lib/constant";
import { Banner, BreadCrumbItem, TBannerType } from "@/app/lib/definitions";
import { ReactNode, useCallback, useMemo } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Breadcrumb } from "antd";
import { AnyObject } from "antd/es/_util/type";

import { getBannersByType } from "@/app/lib/utils";
import breadcrumb_background from "@/public/breadcrumb.jpg";
import {
  BreadcrumbItemType,
  BreadcrumbSeparatorType,
} from "antd/es/breadcrumb/Breadcrumb";
import "../../ui/components/banner-style.scss";

interface BreadCrumbsProps {
  pathname: string;
  banners?: Banner[];
}

const ROUTE_TITLE_FALLBACKS: Record<string, string> = {
  notifications: "Notification.title",
  "forgot-password": "ForgotPassword.title",
  "reset-password": "ResetPassword.title",
  "resend-verification": "ResendVerification.title",
  premium: "Premium.title",
};

const BreadCrumbs = ({ pathname = "", banners = [] }: BreadCrumbsProps) => {
  const tMenu = useTranslations("MenuNav");
  const tAll = useTranslations();

  const { crumbs, titleKey, isRawKey, bannerType } = useMemo(() => {
    const pathSegments = pathname.split("/");
    let resolvedRawKey = false;

    const crumbs = pathSegments.reduce((acc, crumb) => {
      if (crumb === "") {
        acc.push({ path: ROUTE_PATH.HOME, title: "home" });
      } else {
        const link = BREADCRUMB.find((nav) => nav.path.includes(crumb));
        if (link) {
          acc.push({ path: link.path, title: link.name });
        } else if (ROUTE_TITLE_FALLBACKS[crumb]) {
          acc.push({ path: `/${crumb}`, title: ROUTE_TITLE_FALLBACKS[crumb] });
          resolvedRawKey = true;
        } else if (crumb) {
          acc.push({ path: crumb, title: "Breadcrumb.detail" });
          resolvedRawKey = false;
        }
      }
      return acc;
    }, [] as BreadCrumbItem[]);

    const lastCrumb = crumbs[crumbs.length - 1];
    const titleKey =
      typeof lastCrumb?.title === "string" ? lastCrumb.title : "home";
    const bannerType =
      BREADCRUMB.find((br) => br.path.includes(pathSegments[1]))?.key || "";

    return {
      crumbs,
      titleKey,
      isRawKey: resolvedRawKey && titleKey.includes("."),
      bannerType,
    };
  }, [pathname]);

  const backgroundImage = useMemo(() => {
    const bcrBanners = getBannersByType(banners, bannerType as TBannerType);
    return bcrBanners[0]?.fileContent || breadcrumb_background.src;
  }, [banners, bannerType]);

  const getLabel = useCallback(
    (key: string) => {
      if (key.includes(".") && key !== "Breadcrumb.detail") {
        return tAll(key);
      }
      return tMenu(key);
    },
    [tAll, tMenu]
  );

  const itemRender = useCallback(
    (route: BreadCrumbItem, _: unknown, items: unknown[]) => {
      const last = items.indexOf(route) === items.length - 1;
      const label =
        typeof route.title === "string" ? getLabel(route.title) : route.title;
      return last ? <span>{label}</span> : <Link href={route.path}>{label}</Link>;
    },
    [getLabel]
  );

  return (
    <div
      className="bread-crumbs-wrap"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="bread-crumbs-veil" aria-hidden="true" />
      <div className="container bread-crumbs-inner">
        <div className="bread-crumbs-title">
          <Breadcrumb
            items={crumbs}
            itemRender={
              itemRender as (
                route: Partial<BreadcrumbItemType & BreadcrumbSeparatorType>,
                params: AnyObject,
                routes: Partial<BreadcrumbItemType & BreadcrumbSeparatorType>[],
                paths: string[]
              ) => ReactNode
            }
          />
          <p className="title-page">
            {isRawKey ? tAll(titleKey) : getLabel(titleKey)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BreadCrumbs;
