import { ALL_ITEM } from "@/app/lib/constant";
import { TabsItem } from "@/app/lib/definitions";
import { scrollHorizional } from "@/app/lib/utils";
import { Button, Dropdown } from "antd";
import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { DownOutlined } from '@ant-design/icons';
import CategoryDrawer from "./CategoryDrawer";
import { useTranslations } from "next-intl";

interface CategoryMenuProps {
    items: TabsItem[];
    onClickMenu: (key: React.Key) => void;
}

const CategoryMenu = ({ items, onClickMenu }: CategoryMenuProps) => {
    const scrollHorizionalRef = useRef(scrollHorizional);
    const [itemSelected, setItemSelected] = useState({
        key: '' as React.Key,
        childKey: '' as React.Key,
    });
    const [open, setOpen] = useState(false);
    const t = useTranslations('CategoryMenu');


    useEffect(() => {
        setItemSelected({ key: ALL_ITEM.key, childKey: '' });
        scrollHorizionalRef.current();
    }, [])

    const onClickItem = useCallback((key: React.Key, childKey?: React.Key) => {
        setItemSelected({ key, childKey: childKey || '' });

        onClickMenu(childKey || key);
    }, [onClickMenu]);

    const categoriesTabNode = (
        <ul className="tabs-menu menu-horizional ul-menu-overflow horizontal-scroll">
            {items.map((c) => {
                if (c?.children && c.children.length > 0) {
                    const menuItems = c.children?.map((i) => ({
                        key: i.key,
                        label: (
                            <a
                                onClick={() => onClickItem(c.key, i.key)}
                                className='menu-title-content'>
                                {t(`${c.label}.${i.label}`)}
                            </a>
                        )
                    })) || [];

                    return (
                        <li key={c.key}

                            className={`menu-overflow-item menu-submenu ${c.key === itemSelected.key && 'menu-item-selected'}`}
                        >
                            <Dropdown menu={{
                                items: menuItems,
                                selectable: true,
                                selectedKeys: [(itemSelected.childKey || itemSelected.key) as string]
                            }}>
                                <a onClick={() => onClickItem(c.key)}>
                                    <span className="menu-title-content">{t(`${c.label}.title`)}</span>
                                </a>
                            </Dropdown>
                        </li>
                    );
                }
                return (
                    <li key={c.key}
                        onClick={() => onClickItem(c.key)}
                        className={`menu-overflow-item menu-item-only-child ${c.key === itemSelected.key && 'menu-item-selected'}`}
                    >
                        <span className="menu-title-content"> {t(c.label)}</span>
                    </li>
                );
            })}
        </ul>
    );

    return (
        <>
            <div className="menu-horizional-wrappper">
                {categoriesTabNode}
                <Button
                    className={`${open ? "expanded" : "collapsed"}`}
                    onClick={() => setOpen(!open)} icon={<DownOutlined />} />
            </div>
            <CategoryDrawer
                items={items}
                itemSelected={itemSelected}
                onClickItem={onClickItem}
                open={open}
                setOpen={setOpen}
            />
        </>
    );
};

export default memo(CategoryMenu);