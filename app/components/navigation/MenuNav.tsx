import { Menu } from "antd";
import Link from "next/link";
import { MENU_NAV } from "@/app/lib/constant";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { MenuProps } from "antd";

type MenuType = 'vertical' | 'horizontal' | 'inline';

interface MenuNavProps {
    mode: MenuType;
    onClickNav: (e: { key: string }) => void;
    currentNav: string;
}

const MenuNav = ({ mode, onClickNav, currentNav }: MenuNavProps) => {
    const t = useTranslations('MenuNav');
    
    const menuItems: MenuProps['items'] = useMemo(() => MENU_NAV.map((item) => ({
        key: item.path,
        label: (
            <Link href={item.path} rel="noreferrer">
                {t(item.name)}
            </Link>
        ),
    })), [t]);

    return (
        <Menu
            className='header-sidebar'
            mode={mode}
            onClick={onClickNav}
            selectedKeys={[currentNav]}
            items={menuItems}
        />
    );
}

export default MenuNav;