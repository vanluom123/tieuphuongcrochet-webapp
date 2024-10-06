"use client"
import { FloatButton, Layout } from "antd";
import { ROUTE_PATH } from "../../lib/constant";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Navigation from "../navigation";
import { Content } from "antd/es/layout/layout";
import FooterPage from "../footer-page";
import CoverPage from "../cover-page";
import { animationHeader, onScrollBody } from "@/app/lib/utils";

interface LayoutProps {
    children: React.ReactNode;
}

const LayoutPage: React.FC<LayoutProps> = ({ children }) => {
	const pathname = usePathname();
    const [currentNav, setCurrentNav] = useState(ROUTE_PATH.HOME);

    useEffect(() => {
        const navs =pathname.split('/');
        setCurrentNav(`/${navs[1]}`);
        if (pathname !== ROUTE_PATH.HOME) {
            animationHeader();
        }

        if (navs.length <= 2) {
            window.scrollTo(0, 0);
        }
        else {
            onScrollBody('.content-wrap');
        }
    }, [pathname]);

    // const currentUser = useAppSelector((state) => state.auth.currentUser);

    if (pathname === ROUTE_PATH.LOGIN || pathname.includes(ROUTE_PATH.DASHBOARD) || pathname === ROUTE_PATH.REGISTER) {
        return (
            <Layout className='layout-wrap'>
                {children}
            </Layout>
        )
    }

    return (
        <Layout className='layout-wrap'>
            {/* <HeaderPage currentNav={currentNav} setCurrentNav={setCurrentNav} /> */}
            <Navigation currentNav={currentNav} setCurrentNav={setCurrentNav} />

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
