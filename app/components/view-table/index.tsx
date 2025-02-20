'use client'
import { Input, Flex, Col, Pagination, MenuProps, Empty, Row, Spin, Affix } from 'antd';
import React, { useCallback, useMemo, useState } from 'react';
import { SegmentedValue } from 'antd/es/segmented';
import { useTranslations } from 'next-intl';
import { ALL_ITEM, TRANSLATION_STATUS, TRANSLATION_OPTIONS } from '@/app/lib/constant';
import { DataType, Pattern, Post, Product, TabsItem, TDirection } from '@/app/lib/definitions';
import { mapTabsData, onScrollBody } from '@/app/lib/utils';
import ProductCard from '../product-card';
import FreePatternStatus from '../free-pattern-status';
import BlogCard from '../blog-card';
import FreePatternCard from '../free-pattern-card';
import CategoryMenu from './categoryMenu';
import DirectionGroup from './DirectionGroup';
import ListViewItem from '../list-view-item';
import '../../ui/components/viewTable.scss';


export interface ViewTableProps {
    dataSource: DataType[];
    mode: 'Pattern' | 'Product' | 'Blog';
    total?: number;
    pageSize?: number;
    onPageChange: (page: number, pageSize: number) => void;
    onSearch?: (value: string) => void;
    pageIndex?: number;
    loading?: boolean;
    onReadDetail: (key: React.Key) => void;
    isShowTabs?: boolean;
    itemsTabs?: DataType[];
    onTabChange?: (key: React.Key) => void;
    onStatusFilter?: (value: SegmentedValue) => void;
    isShowStatusFilter?: boolean;
}

const ViewTable = (
    { dataSource,
        total = 0,
        pageSize = 12,
        onPageChange,
        onSearch,
        pageIndex = 0,
        itemsTabs = [],
        isShowTabs,
        mode,
        loading,
        isShowStatusFilter,
        onTabChange,
        onReadDetail,
        onStatusFilter,
    }: ViewTableProps) => {

    const [direction, setDirection] = useState<TDirection>('horizontal');
    const { Search } = Input;

    const t = useTranslations("Btn");

    const onSearchBtn = (value: string) => {
        if (onSearch instanceof Function) {
            onSearch(value);
            onScrollBody('.data-list');
        }
    };

    const onChangeStatus = (value: SegmentedValue) => {
        if (onStatusFilter instanceof Function) {
            onStatusFilter(value);
        }
    };

    const onChange = (page: number, pageSize: number) => {
        if (onPageChange instanceof Function) {
            onPageChange(page, pageSize);
            onScrollBody('.data-list');
        }
    };

    const memoizedOnClickMenu = useCallback((key: React.Key) => {
        if (onTabChange instanceof Function) {
            onTabChange(key);
        }
    }, []);

    const items = useMemo(() => [
        {
            label: t("all"),
            key: ALL_ITEM.key
        },
        ...mapTabsData(itemsTabs || [])
    ], [t, itemsTabs]);

    const getCardItem = useMemo(() => (item: DataType) => {
        switch (mode) {
            case 'Product':
                return <ProductCard loading={loading} product={item as Product} onReadDetail={() => onReadDetail(item.key)} />;
            case 'Pattern':
                return <FreePatternCard loading={loading} pattern={item as Pattern} onReadDetail={() => onReadDetail(item.key)} />;
            default:
                return <BlogCard item={item as Post} onReadDetail={() => onReadDetail(item.key)} />;
        }
    }, [mode, loading, onReadDetail]);

    return (
        <div className='data-list'>
            <Affix offsetTop={0} className='affix-search-area'>
                <div>
                    {/* search area */}
                    <Flex className='search-wrap' justify='space-between'>
                        {/* Search */}
                        <Search
                            allowClear
                            placeholder="Search by name, description, or author"
                            style={{ width: 304 }}
                            onSearch={onSearchBtn}
                        />

                        {/* Translation status on large-screen*/}
                        {isShowStatusFilter &&
                            <FreePatternStatus
                                className='large-screen'
                                defaultValue={TRANSLATION_STATUS.ALL}
                                onChange={onChangeStatus}
                                options={TRANSLATION_OPTIONS}
                            />
                        }

                        {/* direction icon */}
                        <DirectionGroup direction={direction} setDirection={setDirection} />

                    </Flex>

                    {/* Translation status on small-screen*/}
                    {isShowStatusFilter &&
                        <FreePatternStatus
                            className='small-screen'
                            defaultValue={TRANSLATION_STATUS.ALL}
                            onChange={onChangeStatus}
                            options={TRANSLATION_OPTIONS}
                        />
                    }

                    {/* Tabs categories */}
                    {isShowTabs && items &&
                        <CategoryMenu
                            items={items as TabsItem[]}
                            onClickMenu={(key) => memoizedOnClickMenu(key)}
                        />
                    }
                </div>
            </Affix>

            <Spin spinning={loading} tip="Loading...">
                {/* Data source */}
                {
                    direction === 'vertical' ?
                        <Flex vertical className='list-view' >
                            {
                                dataSource && dataSource.map((item, index) =>
                                    <div className='list-view-item' key={`list-view-item-${index}`}>
                                        <ListViewItem
                                            data={item}
                                            onReadDetail={() => onReadDetail(item.key)}
                                        />
                                    </div>
                                )
                            }
                        </Flex> :

                        <Row gutter={[{ xs: 8, sm: 16, xl: 24 }, { xs: 12, sm: 16, xl: 24 }]}>
                            {
                                dataSource && dataSource.map((item, index) =>

                                    <Col className='col-data' key={`freepattern_${index}`} xs={12} sm={8} lg={6} >
                                        {getCardItem(item)}
                                    </Col>
                                )
                            }
                        </Row>
                }

                {/* Pagination area */}
                {dataSource?.length > 0 ?
                    <Pagination
                        className='pagination'
                        responsive
                        total={total}
                        // if not use value = -1}
                        {
                        ...(pageIndex !== - 1 ? { current: pageIndex + 1 } : {})
                        }
                        pageSize={pageSize}
                        showSizeChanger
                        showQuickJumper
                        showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
                        onChange={onChange}
                    />
                    :
                    <Empty
                        imageStyle={{ height: 80 }}
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                    />
                }
            </Spin>
        </div>
    )
}

export default ViewTable;
