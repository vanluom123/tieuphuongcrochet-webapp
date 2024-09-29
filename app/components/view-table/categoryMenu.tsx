import { TabsItem } from "@/app/lib/definitions";
import { Menu, MenuProps } from "antd";

interface CategoryMenuProps {
    items: TabsItem[];
    currentTab: string;
    onClickMenu: (key: string) => void;
    tabsProps: MenuProps;
}

const CategoryMenu = ({ items, currentTab, onClickMenu, tabsProps }: CategoryMenuProps) => {
   
    const renderMenuItem = ({ label, key, icon }: TabsItem) => (
        <Menu.Item key={key} icon={icon}>
            {label}
        </Menu.Item>
    );

    const renderMenu = (items: TabsItem[]) => {
        return items.map(item => {
            const { label, key, children } = item;
            if (children && children.length > 0) {
                return <Menu.SubMenu onTitleClick={({ key }) => onClickMenu(key)} key={key} title={label}>
                    {
                        children.map(renderMenuItem)
                    }
                </Menu.SubMenu>
            }
            return renderMenuItem(item)
        })
    }

    return (
        <Menu
            className='tabs-menu'
            selectedKeys={[currentTab]}
            mode="horizontal"
            triggerSubMenuAction="click"
            onClick={({ key }) => onClickMenu(key)}
            {...tabsProps}
        >
            {renderMenu(items)}
        </Menu>
    )
}

export default CategoryMenu;