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
import { SubMenuType } from "antd/es/menu/interface";
import Link from "next/link";

const items = [
    {
        key: ROUTE_PATH.DASHBOARD,
        icon: <AppstoreOutlined />,
        label: 'Dashboard',
    },
    {
        key: ROUTE_PATH.DASHBOARD_CATEGORY,
        icon: <UnorderedListOutlined />,
        label: 'Categories list'
    }, {
        key: ROUTE_PATH.DASHBOARD_FREE_PATTERNS,
        icon: <ReadOutlined />,
        label: 'Free Patterns',

        children: [
            {
                key: `${ROUTE_PATH.DASHBOARD_FREE_PATTERNS}/${ROUTE_PATH.CREATE}`,
                label: 'Add pattern'
            },
            {
                key: ROUTE_PATH.DASHBOARD_FREE_PATTERNS,
                label: 'Free patterns list'
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
                label: 'Add product'
            },
            {
                key: ROUTE_PATH.DASHBOARD_PRODUCTS,
                label: 'Products list'
            }
        ]
    },
    {
            key: ROUTE_PATH.DASHBOARD_POSTS,
        icon: <FileOutlined />,
        label: 'Posts',
        children: [
            {
                key: ROUTE_PATH.DASHBOARD_POSTS,
                label: 'Posts'
            },
            {
                key: `${ROUTE_PATH.DASHBOARD_POSTS}/${ROUTE_PATH.CREATE}`,
                label: 'Add post'
            }
        ]
    },
    {
        key: ROUTE_PATH.DASHBOARD_USERS,
        icon: <TeamOutlined />,
        label: 'Users',
    },
    {
        key: ROUTE_PATH.DASHBOARD_SETTING,
        icon: <SettingOutlined />,
        label: 'Setting',
    },
];

const getMenuItems = (navlinks: SubMenuType[]) => {
    return navlinks.map((item, index) => {
        const { label, key, icon, children } = item;
        if (children && children.length > 0) {
            return (
                <Menu.SubMenu
                    title={<span>{icon} <span>{label}</span></span>}
                    key={`${key}_${index}`}>
                    {getMenuItems(children as SubMenuType[])}
                </Menu.SubMenu>
            )
        }
        return (
            <Menu.Item key={`${key}_${index}`} icon={icon}>
                <Link href={key}>
                    <span>{label}</span>
                </Link>
            </Menu.Item>)
    })
}

const NavLinks = () => {
    return (
        <Menu
            mode="inline"
            defaultSelectedKeys={[ROUTE_PATH.DASHBOARD]}
        >
            {getMenuItems(items as SubMenuType[])}
        </Menu>
    )
}

export default NavLinks;
