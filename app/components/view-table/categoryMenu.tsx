'use client'
import { ALL_ITEM } from "@/app/lib/constant";
import { TabsItem } from "@/app/lib/definitions";
import { Button, Dropdown } from "antd";
import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { DownOutlined } from '@ant-design/icons';
import CategoryDrawer from "./CategoryDrawer";
import { useLocale, useTranslations } from "next-intl";

interface CategoryMenuProps {
    items: TabsItem[];
    onClickMenu: (key: React.Key) => void;
}

const CategoryMenu = ({ items, onClickMenu }: CategoryMenuProps) => {
    const scrollContainerRef = useRef<HTMLUListElement>(null);
    const [itemSelected, setItemSelected] = useState({
        key: '' as React.Key,
        childKey: '' as React.Key,
    });
    const [open, setOpen] = useState(false);
    const t = useTranslations('CategoryMenu');
    const locale = useLocale();
    const isEn = locale === 'en';

    const getLabel = useCallback((item: TabsItem, childItem?: TabsItem) => {
        const target = childItem || item;
        if (target.nameEn) {
            return target.nameEn;
        }
        // Fallback to i18n key for predefined categories
        if (childItem) {
            return t(`${item.label}.${childItem.label}`);
        }
        return t(target.label);
    }, [locale, t]);

    useEffect(() => {
        setItemSelected({ key: ALL_ITEM.key, childKey: '' });
    }, []);

    const scrollToItem = useCallback((element: HTMLElement) => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const itemLeft = element.offsetLeft;
        const containerWidth = container.clientWidth;
        const itemWidth = element.offsetWidth;

        // Tính toán vị trí cuộn để căn giữa item
        const scrollPosition = itemLeft - (containerWidth / 2) + (itemWidth / 2);

        // Cuộn mượt đến vị trí
        container.scrollTo({
            left: Math.max(0, scrollPosition),
            behavior: 'smooth'
        });
    }, []);

    const onClickItem = useCallback((key: React.Key, childKey?: React.Key, element?: HTMLElement) => {
        setItemSelected({ key, childKey: childKey || '' });
        onClickMenu(childKey || key);

        // Cuộn đến item được chọn nếu có element
        if (element) {
            scrollToItem(element);
        }
    }, [onClickMenu, scrollToItem]);

    const onClickItemBtn = useCallback((key: React.Key, childKey?: React.Key, index: number = -1) => {
        setItemSelected({ key, childKey: childKey || '' });
        onClickMenu(childKey || key);

        if (index > -1) {
            const elements = document.querySelectorAll('.menu-overflow-item');
            const element = elements[index] as HTMLElement;
            if (element) {
                scrollToItem(element);
            }
        }
    }, [onClickMenu, scrollToItem]);

    const getDisplayLabel = useCallback((item: TabsItem) => {
        if (isEn && item.nameEn) return item.nameEn;
        return t(item.label);
    }, [isEn, t]);

    const getChildDisplayLabel = useCallback((parent: TabsItem, child: TabsItem) => {
        if (isEn && child.nameEn) return child.nameEn;
        return t(`${parent.label}.${child.label}`);
    }, [isEn, t]);

    const getTitleLabel = useCallback((item: TabsItem) => {
        if (isEn && item.nameEn) return item.nameEn;
        return t(`${item.label}.title`);
    }, [isEn, t]);

    const categoriesTabNode = (
        <ul
            ref={scrollContainerRef}
            className="tabs-menu menu-horizional ul-menu-overflow horizontal-scroll"
        >
            {items.map((c, index) => {
                if (c?.children && c.children.length > 0) {
                    const menuItems = c.children?.map((i) => ({
                        key: i.key,
                        label: (
                            <a
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onClickItemBtn(c.key, i.key, index);
                                }}
                                className='menu-title-content'
                            >
                                {getChildDisplayLabel(c, i)}
                            </a>
                        )
                    })) || [];

                    return (
                        <li
                            key={c.key}
                            className={`menu-overflow-item menu-submenu ${c.key === itemSelected.key && 'menu-item-selected'}`}
                            onClick={(e) => onClickItem(c.key, undefined, e.currentTarget)}
                        >
                            <Dropdown menu={{
                                items: menuItems,
                                selectable: true,
                                selectedKeys: [(itemSelected.childKey || itemSelected.key) as string]
                            }}>
                                <a>
                                    <span className="menu-title-content">{getTitleLabel(c)}</span>
                                </a>
                            </Dropdown>
                        </li>
                    );
                }
                return (
                    <li
                        key={c.key}
                        onClick={(e) => onClickItem(c.key, undefined, e.currentTarget)}
                        className={`menu-overflow-item menu-item-only-child ${c.key === itemSelected.key && 'menu-item-selected'}`}
                    >
                        <span className="menu-title-content">{getDisplayLabel(c)}</span>
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
                onClickItem={onClickItemBtn}
                open={open}
                setOpen={setOpen}
            />
        </>
    );
};

export default memo(CategoryMenu);