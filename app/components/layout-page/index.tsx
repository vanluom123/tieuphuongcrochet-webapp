"use client"
import { Content } from "antd/es/layout/layout";
import { App, FloatButton, Layout, Tooltip } from "antd";
import { usePathname } from "next/navigation";
import { useState, useEffect, useCallback, useMemo } from 'react';
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
    
    // Kiểm tra xem đã hiển thị donate modal ngày hôm nay chưa và hiển thị tự động
    useEffect(() => {
        // Lấy ngày hiện tại dạng YYYY-MM-DD
        const today = new Date().toISOString().split('T')[0];
        // Lấy ngày đã hiển thị donate modal gần nhất
        const lastSeenDate = localStorage.getItem('lastSeenDonateModalDate');
        
        // Chỉ hiển thị popup nếu chưa hiển thị ngày hôm nay
        if (lastSeenDate !== today) {
            // Đợi 1 giây sau khi trang load xong để hiển thị modal
            const timer = setTimeout(() => {
                setIsDonateModalOpen(true);
                
                // Tự động đóng sau 8 giây
                setTimeout(() => {
                    setIsDonateModalOpen(false);
                }, 8000);
                
                // Đánh dấu là đã hiển thị ngày hôm nay
                localStorage.setItem('lastSeenDonateModalDate', today);
            }, 1000);
            
            return () => clearTimeout(timer);
        }
    }, []);
    
    const toggleDonateModal = useCallback(() => {
        setIsDonateModalOpen(prev => !prev);
    }, []);

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
               pathname.includes(ROUTE_PATH.PROFILE);
    }, [pathname]);
        
    if (isSpecialRoute) {
        return (
            <Layout className='layout-wrap'>
                <App notification={{ placement: 'topRight' }}>
                    <Notify />
                </App>
                {children}
                <Tooltip title="Ủng hộ website" placement="left">
                    <FloatButton 
                        icon={<HeartOutlined />} 
                        type="primary" 
                        style={{ backgroundColor: '#ff4d4f' }}
                        onClick={toggleDonateModal}
                        className='float-btn-donate'
                    />
                </Tooltip>
                <DonateModal isOpen={isDonateModalOpen} onClose={toggleDonateModal} />
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
            <Tooltip title="Ủng hộ website" placement="left">
                <FloatButton 
                    icon={<HeartOutlined />} 
                    type="primary" 
                    style={{backgroundColor: '#ff4d4f' }}
                    onClick={toggleDonateModal}
                    className='float-btn-donate'
                />
            </Tooltip>
            <FloatButton.BackTop 
                className='float-btn-back-top' 
                visibilityHeight={0} 
            />
            <DonateModal isOpen={isDonateModalOpen} onClose={toggleDonateModal} />
        </Layout>
    )
}

export default LayoutPage;
