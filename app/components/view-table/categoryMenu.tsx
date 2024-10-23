import { TabsItem } from "@/app/lib/definitions";
import { Menu, MenuProps } from "antd";
import { MenuItemType } from "antd/es/menu/interface";

interface CategoryMenuProps {
    items: TabsItem[];
    currentTab: string;
    onClickMenu: (key: string) => void;
    tabsProps: MenuProps;
}

const CategoryMenu = ({ items, currentTab, onClickMenu, tabsProps }: CategoryMenuProps) => {

    const convertToMenuItems = (items: TabsItem[]): MenuItemType[] => {
        return items.map(({ label, key, icon, children }) => {
            if (children && children.length > 0) {
                return {
                    key,
                    label,
                    icon,
                    children: convertToMenuItems(children),
                    onTitleClick: () => onClickMenu(key.toString()),
                };
            }
            return { key, label, icon };
        });
    };

    return (
        <Menu
            className='tabs-menu'
            selectedKeys={[currentTab]}
            mode="horizontal"
            onClick={({ key }) => onClickMenu(key)}
            items={convertToMenuItems(items)}
            {...tabsProps}
        />
    );
};

export default CategoryMenu;