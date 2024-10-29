import { BREADCRUMB, ROUTE_PATH } from "@/app/lib/constant";
import { Banner, BreadCrumbItem, TBannerType } from "@/app/lib/definitions";
import { ReactNode, useCallback, useMemo } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Breadcrumb } from "antd";
import { AnyObject } from "antd/es/_util/type";

import { getBannersByType } from "@/app/lib/utils";
import breadcrumb_background from '@/public/breadcrumb.jpg';
import { BreadcrumbItemType, BreadcrumbSeparatorType } from "antd/es/breadcrumb/Breadcrumb";

interface BreadCrumbsProps {
    pathname: string;
    banners?: Banner[];
}

const BreadCrumbs = ({ pathname = '', banners = [] }: BreadCrumbsProps) => {
    const t = useTranslations("MenuNav");
    console.log('BreadCrumbs',pathname);
    

    const { crumbs, titlePage, bannerType } = useMemo(() => {
        const pathSegments = pathname.split('/');
        console.log('pathSegments',pathSegments);
        
        const crumbs = pathSegments.reduce((acc, crumb) => {
            if (crumb === '') {
                acc.push({ path: ROUTE_PATH.HOME, title: 'home' });
            } else {
                const link = BREADCRUMB.find(nav => nav.path.includes(crumb));
                console.log('link',link);
                
                if (link) {
                    acc.push({ path: link.path, title: link.name });
                } else if(crumb){
                    acc.push({ path: crumb, title: 'Breadcrumb.detail' });
                }
            }
            return acc;
        }, [] as BreadCrumbItem[]);

        const titlePage = crumbs[crumbs.length - 1]?.title || 'home';
        const bannerType = BREADCRUMB.find(br => br.path.includes(pathSegments[1]))?.key || '';

        return { crumbs, titlePage, bannerType };
    }, [pathname]);

    const backgroundImage = useMemo(() => {
        const bcrBanners = getBannersByType(banners, bannerType as TBannerType);
        return bcrBanners[0]?.fileContent || breadcrumb_background.src;
    }, [banners, bannerType]);

    const itemRender = useCallback((route: BreadCrumbItem, _: unknown, items: unknown[]) => {
        const last = items.indexOf(route) === items.length - 1;
        return last ? <span>{t(route.title)}</span> : <Link href={route.path}>{t(route.title)}</Link>;
    }, [t]);

    console.log('crumbs',crumbs);
    
    
    return (
        <div className="bread-crumbs-wrap" style={{ backgroundImage: `url(${backgroundImage})` }}>
            <div className="container">
                <div className="bread-crumbs-title">
                    <h3 className="title-page">{t(titlePage)}</h3>
                    <Breadcrumb
                        items={crumbs}
                        itemRender={itemRender as (route: Partial<BreadcrumbItemType & BreadcrumbSeparatorType>, params: AnyObject, routes: Partial<BreadcrumbItemType & BreadcrumbSeparatorType>[], paths: string[]) => ReactNode}
                    />
                </div>
            </div>
        </div>
    );
};

export default BreadCrumbs;

