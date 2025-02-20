import { ALL_ITEM } from "@/app/lib/constant";
import { TabsItem } from "@/app/lib/definitions";
import { scrollHorizional } from "@/app/lib/utils";
import { Dropdown, MenuProps } from "antd";
import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";

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

    useEffect(() => {
        setItemSelected({ key: ALL_ITEM.key, childKey: '' });
        scrollHorizionalRef.current();
    }, [])

    const onClickItem = useCallback((key: React.Key, childKey?: React.Key) => {
        setItemSelected({ key, childKey: childKey || '' });
        onClickMenu(childKey || key);
    }, [onClickMenu]);

    return (
        <ul className="tabs-menu menu-horizional ul-menu-overflow horizontal-scroll">
            {
                items.map((c) => {
                    if (c?.children && c.children.length > 0) {
                        const menuItems = useMemo(() =>
                            c.children?.map((i) => ({
                                key: i.key,
                                label: (
                                    <a onClick={() => onClickItem(c.key, i.key)} className="menu-title-content">
                                        {i.label}
                                    </a>
                                )
                            })) || [],
                            [c.children]);

                        return (
                            <li key={c.key}

                                className={`menu-overflow-item menu-submenu ${c.key === itemSelected.key && 'menu-item-selected'}`}
                            >
                                <Dropdown menu={{
                                    items: menuItems,
                                    selectable: true,
                                }}>
                                    <a onClick={() => onClickItem(c.key)}>
                                        <span className="menu-title-content">{c.label}</span>
                                    </a>
                                </Dropdown>
                            </li>
                        )
                    }
                    return (
                        <li key={c.key}
                            onClick={() => onClickItem(c.key)}
                            className={`menu-overflow-item menu-item-only-child ${c.key === itemSelected.key && 'menu-item-selected'}`}
                        >
                            <span className="menu-title-content">{c.label}</span>
                        </li>
                    )
                })
            }
        </ul>
    );
};

export default memo(CategoryMenu);