'use client';

import { ROUTE_PATH } from '@/app/lib/constant';
import {
    ReadOutlined,
    TeamOutlined,
    ShoppingCartOutlined,
    AppstoreOutlined,
    FileOutlined,
    UnorderedListOutlined,
    SettingOutlined
} from '@ant-design/icons';
import { Menu } from "antd";
import { usePathname } from 'next/navigation';
import Link from "next/link";
import { useMemo } from 'react';

export const sidebarItems = [
    {
        key: ROUTE_PATH.DASHBOARD,
        icon: <AppstoreOutlined />,
        label: <Link href={ROUTE_PATH.DASHBOARD}>Dashboard</Link>,
    },
    {
        key: ROUTE_PATH.DASHBOARD_CATEGORY,
        icon: <UnorderedListOutlined />,
        label: <Link href={ROUTE_PATH.DASHBOARD_CATEGORY}>Categories list</Link>,
    }, {
        key: 'free-patterns',
        icon: <ReadOutlined />,
        label: 'Free Patterns',
        children: [
            {
                key: `${ROUTE_PATH.DASHBOARD_FREE_PATTERNS}/${ROUTE_PATH.CREATE}`,
                label: <Link href={`${ROUTE_PATH.DASHBOARD_FREE_PATTERNS}/${ROUTE_PATH.CREATE}`}>Add pattern</Link>
            },
            {
                key: ROUTE_PATH.DASHBOARD_FREE_PATTERNS,
                label: <Link href={ROUTE_PATH.DASHBOARD_FREE_PATTERNS}>Free patterns list</Link>
            }
        ]
    },

    {
        key: 'products',
        icon: <ShoppingCartOutlined />,
        label: 'Products',
        children: [
            {
                key: `${ROUTE_PATH.DASHBOARD_PRODUCTS}/${ROUTE_PATH.CREATE}`,
                label: <Link href={`${ROUTE_PATH.DASHBOARD_PRODUCTS}/${ROUTE_PATH.CREATE}`}>Add product</Link>
            },
            {
                key: ROUTE_PATH.DASHBOARD_PRODUCTS,
                label: <Link href={ROUTE_PATH.DASHBOARD_PRODUCTS}>Products list</Link>
            }
        ]
    },
    {
        key: 'posts',
        icon: <FileOutlined />,
        label: 'Posts',
        children: [
            {
                key: `${ROUTE_PATH.DASHBOARD_POSTS}/${ROUTE_PATH.CREATE}`,
                label: <Link href={`${ROUTE_PATH.DASHBOARD_POSTS}/${ROUTE_PATH.CREATE}`}>Add post</Link>    
            },
            {
                key: ROUTE_PATH.DASHBOARD_POSTS,
                label: <Link href={ROUTE_PATH.DASHBOARD_POSTS}>Posts</Link>
            }
        ]
    },
    {
        key: ROUTE_PATH.DASHBOARD_USERS,
        icon: <TeamOutlined />,
        label: <Link href={ROUTE_PATH.DASHBOARD_USERS}>Users</Link>,
    },
    {
        key: ROUTE_PATH.DASHBOARD_SETTING,
        icon: <SettingOutlined />,
        label: <Link href={ROUTE_PATH.DASHBOARD_SETTING}>Setting</Link>,
    },
];


const NavLinksDashboard = () => {
    const pathname = usePathname();
    const selectedKeys = useMemo(() => [pathname], [pathname]);


    return (
        <Menu
            mode="inline"
            items={sidebarItems}
            selectedKeys={selectedKeys}
        />
    )
}

export default NavLinksDashboard;
