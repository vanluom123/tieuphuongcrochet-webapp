"use client"
import { Content } from "antd/es/layout/layout";
import { App, FloatButton, Layout } from "antd";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

import { ROUTE_PATH } from "../../lib/constant";
import Navigation from "../navigation";
import FooterPage from "../footer-page";
import CoverPage from "../cover-page";
import { animationHeader, onScrollBody } from "@/app/lib/utils";
import Notify from "@/app/lib/notify";
import { useSessionExpiration } from '@/app/lib/useSessionExpiration'

interface LayoutProps {
    children: React.ReactNode;
}

const LayoutPage: React.FC<LayoutProps> = ({ children }) => {
    const pathname = usePathname();
    const [currentNav, setCurrentNav] = useState(ROUTE_PATH.HOME);

    const setCurrentNavCallback = useCallback((newNav: string) => {
        setCurrentNav(newNav);
        if (newNav !== ROUTE_PATH.HOME) {
            animationHeader();
        }
    }, []);
    
    useEffect(() => {
        const navs = pathname.split('/');

        const newCurrentNav = `/${navs[1]}`;
        setCurrentNavCallback(newCurrentNav);

        if (navs.length <= 2) {
            window.scrollTo(0, 0);
        }
        else {
            onScrollBody('.content-wrap');
        }
    }, [pathname, setCurrentNavCallback]);

    const isSpecialRoute = useMemo(() => {
        return pathname === ROUTE_PATH.LOGIN || 
               pathname.includes(ROUTE_PATH.DASHBOARD) || 
               pathname === ROUTE_PATH.REGISTER ||
               pathname === ROUTE_PATH.PROFILE;
    }, [pathname]);
        
    useSessionExpiration()

    if (isSpecialRoute) {
        return (
            <Layout className='layout-wrap'>
                <App notification={{ placement: 'topRight' }}>
                    <Notify />
                </App>
                {children}
            </Layout>
        )
    }

    return (
        <Layout className='layout-wrap'>
            <Navigation currentNav={currentNav} setCurrentNav={setCurrentNavCallback} />

            {/* Cover image - banner - breadcrumbs */}
            <CoverPage />
            <Content className='content-wrap container'>
                {children}
            </Content>
            <FooterPage currentNav={currentNav} />
            <FloatButton.BackTop visibilityHeight={0} />
        </Layout>
    )
}

export default LayoutPage;
