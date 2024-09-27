'use client';

import React, { useState } from 'react';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
} from '@ant-design/icons';
import { ROUTE_PATH } from '../lib/constant';
import Link from 'next/link';
import Image from 'next/image';
import { Button, Flex, Layout, theme } from 'antd';
import NavLinks from '../ui/admin/nav-links';
import logo from '../public/logo.png'

const LayoutAdmin = (
    { children }: Readonly<{
        children: React.ReactNode;
    }>) => {
    const { Header, Sider, Content } = Layout;

    const [collapsed, setCollapsed] = useState(true);

    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    return (
        <Layout className='admin-layout'>
            <Sider
                trigger={null}
                collapsible
                collapsed={collapsed}
                theme='light'>
                <div className="logo-sidebar">
                    <Link key='/' href={ROUTE_PATH.HOME}>
                        <Image width={75} src={logo} alt='Tiệm len Tiểu Phương' />
                    </Link>
                </div>
                <NavLinks />
            </Sider>
            <Layout>
                <Header style={{ padding: 0, background: colorBgContainer }}>
                    <Flex align='center'>
                        <Button
                            type="text"
                            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                            onClick={() => setCollapsed(!collapsed)}
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
