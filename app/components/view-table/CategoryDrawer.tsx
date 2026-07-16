import React, { useCallback } from 'react';
import { Button, Col, Drawer, Dropdown, Row } from 'antd';
import { useLocale, useTranslations } from 'next-intl';
import { CloseOutlined } from '@ant-design/icons';

interface ItemSelected {
    key: React.Key;
    childKey: React.Key;
}

interface TabsItem {
    key: React.Key;
    label: string;
    children?: TabsItem[];
}

interface CategoryDrawerProps {
    items: TabsItem[];
    open: boolean;
    setOpen: (open: boolean) => void;
    itemSelected: ItemSelected;
    onClickItem: (key: React.Key, childKey?: React.Key, index?: number) => void;
}

const CategoryDrawer = ({ open, setOpen, items, itemSelected, onClickItem }: CategoryDrawerProps) => {
    const t = useTranslations('CategoryMenu');
    const locale = useLocale();
    const isEn = locale === 'en';

    const getLabel = useCallback((item: TabsItem, childItem?: TabsItem) => {
        const target = childItem || item;
        if (isEn && (target as any).nameEn) return (target as any).nameEn;
        if (childItem) return t(`${item.label}.${childItem.label}`);
        return t(target.label);
    }, [isEn, t]);

    const getTitle = useCallback((item: TabsItem) => {
        if (isEn && (item as any).nameEn) return (item as any).nameEn;
        return t(`${item.label}.title`);
    }, [isEn, t]);

    const onClose = useCallback(() => {
        setOpen(false);
    }, [setOpen]);

    const onClickItemBtn = useCallback(
        (key: React.Key, childKey?: React.Key, index?: number) => {
            onClickItem(key, childKey, index);
            onClose();
        },
        [onClickItem, onClose]
    );
    return (
        <Drawer
            closable
            title={t('title')}
            width={'100%'}
            placement="top"
            open={open}
            onClose={onClose}
            className="custom-drawer-categories"
            extra={
                  <Button shape='circle' type='text' icon={<CloseOutlined />} onClick={onClose}/>
              }
        >
            <Row gutter={[10, 10]}>
                {items?.length > 0 && items.map((item, index) => {
                    const menuItems = item.children?.map((i) => ({
                        key: i.key,
                        label: (
                            <a onClick={(e) => onClickItemBtn(item.key, i.key, index)}>
                                {getLabel(item, i)}
                            </a>
                        ),
                    })) || [];

                    return (
                        <Col key={`${item.key}_index_${index}`} lg={6} md={8} xs={12}>
                            {item.children && item.children.length > 0 ? (
                                <Dropdown menu={{
                                    items: menuItems,
                                    selectable: true,
                                    selectedKeys: [(itemSelected.childKey || itemSelected.key) as string]
                                }}>
                                    <Button
                                        onClick={(e) => onClickItemBtn(item.key, undefined, index)}
                                        className={`${itemSelected.key === item.key ? 'active' : ''}`}
                                    >
                                        <span>{getTitle(item)}</span>
                                    </Button>
                                </Dropdown>
                            ) : (
                                <Button
                                    onClick={(e) => onClickItemBtn(item.key, undefined,index )}
                                    type="default"
                                    className={`${itemSelected.key === item.key ? 'active' : ''}`}
                                >
                                    {getLabel(item)}
                                </Button>
                            )}
                        </Col>
                    );
                })}
            </Row>
        </Drawer>
    );
};

export default CategoryDrawer;
