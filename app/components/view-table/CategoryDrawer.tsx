import React, { useCallback, useMemo } from 'react';
import { Button, Col, Drawer, Dropdown, Row } from 'antd';
import { useTranslations } from 'next-intl';

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
    onClickItem: (key: React.Key, childKey?: React.Key) => void;
}

const CategoryDrawer = ({ open, setOpen, items, itemSelected, onClickItem }: CategoryDrawerProps) => {
    const t = useTranslations('CategoryMenu');

    const onClose = useCallback(() => {
        setOpen(false);
    }, [setOpen]);

    const onClickItemBtn = useCallback(
        (key: React.Key, childKey?: React.Key) => {
            onClickItem(key, childKey);
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
        >
            <Row gutter={[10, 10]}>
                {items?.length > 0 && items.map((item, index) => {
                    const menuItems = item.children?.map((i) => ({
                        key: i.key,
                        label: (
                            <a onClick={() => onClickItemBtn(item.key, i.key)}>
                                {t(`${item.label}.${i.label}`)}
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
                                        onClick={() => onClickItemBtn(item.key)}
                                        className={`${itemSelected.key === item.key ? 'active' : ''}`}
                                    >
                                        <span>{t(`${item.label}.title`)}</span>
                                    </Button>
                                </Dropdown>
                            ) : (
                                <Button
                                    onClick={() => onClickItemBtn(item.key)}
                                    type="default"
                                    className={`${itemSelected.key === item.key ? 'active' : ''}`}
                                >
                                    {t(item.label)}
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
