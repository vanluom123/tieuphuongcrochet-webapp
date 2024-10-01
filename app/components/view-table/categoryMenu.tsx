import { TabsItem } from "@/app/lib/definitions";
import { Menu, MenuProps } from "antd";
import { useState } from "react";

interface CategoryMenuProps {
    items: TabsItem[];
    currentTab: string;
    onClickMenu: (key: string) => void;
    tabsProps: MenuProps;
}

const CategoryMenu = ({ items, currentTab, onClickMenu, tabsProps }: CategoryMenuProps) => {
    const [openKeys, setOpenKeys] = useState<string[]>([]);

    const onOpenChange = (keys: string[]) => {
        setOpenKeys(keys);
    };

    const renderMenuItem = ({ label, key, icon, children }: TabsItem) => {
        if (children && children.length > 0) {
            return (
                <Menu.SubMenu key={key} title={label} icon={icon}>
                    {children.map(renderMenuItem)}
                </Menu.SubMenu>
            );
        }
        return (
            <Menu.Item key={key} icon={icon}>
                {label}
            </Menu.Item>
        );
    };

    return (
        <Menu
            className='tabs-menu'
            selectedKeys={[currentTab]}
            mode="horizontal"
            openKeys={openKeys}
            onOpenChange={onOpenChange}
            onClick={({ key }) => onClickMenu(key)}
            {...tabsProps}
        >
            {items.map(renderMenuItem)}
        </Menu>
    );
};

export default CategoryMenu;