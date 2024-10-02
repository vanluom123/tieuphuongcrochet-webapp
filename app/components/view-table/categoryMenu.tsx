import { TabsItem } from "@/app/lib/definitions";
import { Menu, MenuProps } from "antd";

interface CategoryMenuProps {
    items: TabsItem[];
    currentTab: string;
    onClickMenu: (key: string) => void;
    tabsProps: MenuProps;
}

const CategoryMenu = ({ items, currentTab, onClickMenu, tabsProps }: CategoryMenuProps) => {

    const renderMenuItem = ({ label, key, icon, children }: TabsItem) => {
        if (children && children.length > 0) {
            return (
                <Menu.SubMenu onTitleClick={({ key }) => onClickMenu(key)} key={key} title={label} icon={icon} >
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
            onClick={({ key }) => onClickMenu(key)}
            {...tabsProps}
        >
            {items.map(renderMenuItem)}
        </Menu>
    );
};

export default CategoryMenu;