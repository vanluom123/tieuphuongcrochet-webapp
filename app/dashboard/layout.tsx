'use client';

import React, { useCallback, useEffect, useState } from 'react';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
} from '@ant-design/icons';
import Link from 'next/link';
import { redirect, useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

import logo from '@/public/logo.png';

import { Button, Layout, Menu, theme } from 'antd';
import { ROUTE_PATH, USER_ROLES } from '../lib/constant';
import NavLinksDashboard, { sidebarItems } from '../components/nav-link-dashboard';
import '../ui/dashboard.scss'

const LayoutAdmin: React.FC<{ children: React.ReactNode }> = ({ children }) => {

    const { Header, Sider, Content, Footer } = Layout;
    const [collapsed, setCollapsed] = useState(false);
    const { token: { colorBgContainer, borderRadiusLG } } = theme.useToken();
    const toggleCollapsed = useCallback(() => setCollapsed(prev => !prev), []);

    const { data: session, status } = useSession();
    const pathname = usePathname();
    const router = useRouter();
    // Sử dụng useEffect để thay đổi state sau khi đã hydrate
    useEffect(() => {
        setCollapsed(true);
    }, []);

    if (status === 'unauthenticated') {
        redirect(`${ROUTE_PATH.LOGIN}?callbackUrl=${ROUTE_PATH.DASHBOARD}`)
    }

    if (status === 'authenticated' && session?.user.role !== USER_ROLES.ADMIN) {
        redirect(ROUTE_PATH.HOME);
    }

    const getTitle = () => {
        const pathnameArr = pathname.split('/');
        const title = pathnameArr[pathnameArr.length - 1];
        return title;
    }

    const onSelectItem = ({ key }: any) => {
        router.push(key);
    }
    return (
        <Layout className='admin-page-layout'>
            <Header className='admin-page-layout__header' style={{ display: 'flex', alignItems: 'center', padding: 0, background: colorBgContainer, height: 76 }}>
                <div className="logo-sidebar" >
                    <Link href={ROUTE_PATH.HOME}>
                        <Image width={75} height={75} priority src={logo} alt='Tiệm len Tiểu Phương' />
                    </Link>
                </div>
                <Button
                    className='siderbar-large-screen'
                    type="text"
                    icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                    onClick={toggleCollapsed}
                    style={{
                        fontSize: '16px',
                        width: 40
                    }}
                />
                <span className='table-title'>{getTitle()}</span>
            </Header>

            <Layout className='admin-page-layout__content'>
                <Sider
                    trigger={null}
                    collapsible
                    collapsed={collapsed}
                    theme='light'
                    className='siderbar-large-screen'
                >

                    <NavLinksDashboard />
                </Sider>
                <Content
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                    }}
                >
                    {children}
                </Content>

            </Layout>
            <Footer className='admin-page-layout__footer siderbar-small-screen'>
                <Menu
                    mode="horizontal"
                    defaultSelectedKeys={[ROUTE_PATH.DASHBOARD]}
                    items={sidebarItems}
                    onSelect={onSelectItem}
                />
            </Footer>
        </Layout>
    )
}

export default LayoutAdmin;
