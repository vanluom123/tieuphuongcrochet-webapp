'use client';

import React, { useCallback, useState } from 'react';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
} from '@ant-design/icons';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import { Button, Flex, Layout, theme } from 'antd';

import { ROUTE_PATH, USER_ROLES } from '../lib/constant';
import { signOut, useSession } from 'next-auth/react';
import logo from '@/public/logo.png';
import NavLinksDashboard from '../components/nav-link-dashboard';

const LayoutAdmin: React.FC<{ children: React.ReactNode }> = ({ children }) => {

    const { Header, Sider, Content } = Layout;
    const [collapsed, setCollapsed] = useState(true);
    const { token: { colorBgContainer, borderRadiusLG } } = theme.useToken();
    const toggleCollapsed = useCallback(() => setCollapsed(prev => !prev), []);

    const { data: session, status } = useSession();

    if (status === 'unauthenticated') {
        signOut();
    }

    if (status === 'authenticated' && session?.user.role !== USER_ROLES.ADMIN) {
        redirect(ROUTE_PATH.HOME);
    }

    return (
        <Layout className='admin-layout'>
            <Sider
                trigger={null}
                collapsible
                collapsed={collapsed}
                theme='light'>
                <div className="logo-sidebar">
                    <Link href={ROUTE_PATH.HOME}>
                        <Image width={75} src={logo} alt='Tiệm len Tiểu Phương' />
                    </Link>
                </div>
                <NavLinksDashboard />
            </Sider>
            <Layout>
                <Header style={{ padding: 0, background: colorBgContainer }}>
                    <Flex align='center'>
                        <Button
                            type="text"
                            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                            onClick={toggleCollapsed}
                            style={{
                                fontSize: '16px',
                                width: 64,
                                height: 64,
                            }}
                        />
                        <span className='table-title'>Text</span>
                    </Flex>
                </Header>
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
        </Layout>
    )
}

export default LayoutAdmin;
