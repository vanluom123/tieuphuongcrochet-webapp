import {useState, useEffect, useCallback} from 'react';
import {Button, Col, Flex, Form, Input, Radio, RadioChangeEvent, Row, TreeSelect} from 'antd';
import {PlusOutlined, ReloadOutlined} from '@ant-design/icons';
import {SearchProps} from 'antd/es/input';

import {SegmentedValue} from 'antd/es/segmented';
import {SearchParams} from '@/app/lib/definitions';
import {ALL_ITEM, TRANSLATION_OPTIONS, TRANSLATION_STATUS} from '@/app/lib/constant';
import FreePatternStatus from '../free-pattern-status';
import {DefaultOptionType} from 'antd/es/select';
import {combineFilters} from "@/app/lib/filter-utils";
import {debounce} from '@/app/lib/utils';

interface SearchTableProps {
    onAddNew: () => void;
    onSearch?: SearchProps['onSearch'];
    onSearchChange?: (searchParams: SearchParams) => void;
    textAddNew?: string;
    loading?: boolean;
    isShowFilter?: boolean;
    isShowSearch?: boolean;
    isShowAddNew?: boolean;
    searchFields?: string[];
    isShowStatusFilter?: boolean;
    categories?: DefaultOptionType[];
}

const SearchTable = ({
                         onAddNew,
                         onSearch,
                         onSearchChange,
                         textAddNew,
                         loading,
                         isShowFilter,
                         isShowSearch = true,
                         isShowAddNew = true,
                         searchFields = ['name'],
                         isShowStatusFilter,
                         categories
                     }: SearchTableProps) => {
    const {Search} = Input;
    const [form] = Form.useForm();
    const [searchParams, setSearchParams] = useState({
        categoryId: '',
        filter: ''
    });
    const [filters, setFilters] = useState({
        status: '',
        search: '',
        categoryId: '',
        isHome: ALL_ITEM.key
    });

    const onHandleSearch = (searchParams: SearchParams) => {
        setSearchParams(searchParams);
        if (onSearchChange instanceof Function) {
            onSearchChange(searchParams);
        }
    };

    // Debounced search handlers
    const debouncedSearch = useCallback(
        debounce((value: string) => {
            if (onSearch instanceof Function) {
                onSearch(value);
                return;
            }
            setFilters(prev => {
                const newFilters = {
                    ...prev,
                    search: value
                }
                const combined = combineFilters({
                    ...newFilters,
                    searchFields
                });
                onHandleSearch({
                    categoryId: prev.categoryId,
                    filter: combined
                })
                return newFilters;
            })
        }, 500),
        [onSearch, searchFields, onHandleSearch]
    );

    const debouncedCategoryChange = useCallback(
        debounce((key: string) => {
            setFilters(prev => {
                const newFilters = {
                    ...prev,
                    categoryId: key === undefined ? '' : key
                }
                const combined = combineFilters({
                    ...newFilters,
                    searchFields
                });
                onHandleSearch({
                    categoryId: key === undefined ? '' : key,
                    filter: combined
                })
                return newFilters;
            })
        }, 500),
        [searchFields, onHandleSearch]
    );

    const debouncedStatusChange = useCallback(
        debounce((value: SegmentedValue) => {
            setFilters(prev => {
                const newFilters = {
                    ...prev,
                    status: value as string
                }
                const combined = combineFilters({
                    ...newFilters,
                    searchFields
                });
                onHandleSearch({
                    categoryId: prev.categoryId,
                    filter: combined
                })
                return newFilters;
            })
        }, 500),
        [searchFields, onHandleSearch]
    );

    const onchangeRadio = (e: RadioChangeEvent) => {
        setFilters(prev => {
            const newFilters = {
                ...prev,
                isHome: e.target.value
            }
            const combined = combineFilters({
                ...newFilters,
                searchFields
            });
            onHandleSearch({
                categoryId: prev.categoryId,
                filter: combined
            })
            return newFilters;
        })
    };

    const onSearchText: SearchProps['onSearch'] = (value) => {
        debouncedSearch(value);
    }

    const onChangeCategory = (key: string) => {
        debouncedCategoryChange(key);
    }

    const onChangeStatus = (value: SegmentedValue) => {
        debouncedStatusChange(value);
    }

    const onReset = () => {
        form.resetFields();
        const resetFilters = {
            status: '',
            search: '',
            categoryId: '',
            isHome: ALL_ITEM.key
        };
        setFilters(resetFilters);

        onHandleSearch({
            categoryId: '',
            filter: ''
        });
    }

    return (
        <Flex gap="small" wrap='wrap' className='search-table' justify='space-between'>
            {
                isShowSearch &&
                <Form
                    name='search-form'
                    layout="vertical"
                    labelWrap
                    form={form}
                    initialValues={{
                        isHome: ALL_ITEM.key,
                    }}
                    style={{flex: 'min-content'}}
                >
                    <Row style={{width: '100%'}} gutter={12} className='search'>
                        <Col xs={24} md={12} xl={12} xxl={6}>
                            <Form.Item name='searchText'>
                                <Search
                                    allowClear
                                    size='large'
                                    placeholder='Search'
                                    onSearch={onSearchText}
                                    loading={loading}
                                    enterButton
                                    className='input-search'
                                />
                            </Form.Item>
                        </Col>
                        {
                            isShowFilter && (
                                <>
                                    <Col xs={24} md={12} xl={12} xxl={4}>
                                        <Form.Item name='categoryId'>
                                            <TreeSelect
                                                allowClear
                                                placeholder='Categories'
                                                treeData={categories}
                                                onChange={onChangeCategory}
                                            />
                                        </Form.Item>
                                    </Col>
                                    {isShowStatusFilter &&
                                        <Col xs={24} lg={17} xl={13} xxl={9}>
                                            <Form.Item name='status'>


                                                {/* Translation status on large-screen*/}
                                                <FreePatternStatus
                                                    className='large-screen'
                                                    defaultValue={TRANSLATION_STATUS.ALL}
                                                    options={[
                                                        ...TRANSLATION_OPTIONS,
                                                        {
                                                            label: TRANSLATION_STATUS.NONE,
                                                            value: 'NONE',
                                                        },
                                                    ]}
                                                    onChange={onChangeStatus}
                                                />
                                            </Form.Item>
                                        </Col>
                                    }
                                    <Col xs={24} lg={7} xl={7} xxl={2}>
                                        <Form.Item
                                            name='isHome'
                                            label='Show on home:'
                                        >
                                            <Radio.Group
                                                onChange={onchangeRadio}
                                            >
                                                <Radio value={ALL_ITEM.key}>All</Radio>
                                                <Radio value={true}>Yes</Radio>
                                                <Radio value={false}>No</Radio>
                                            </Radio.Group>
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} xl={4} xxl={3}>
                                        <span>
                                            <Button
                                                style={{textAlign: 'center', width: '120px'}}
                                                danger shape="default"
                                                icon={<ReloadOutlined/>}
                                                htmlType="reset"
                                                onClick={onReset}
                                            >
                                                Reset
                                            </Button>
                                        </span>
                                    </Col>
                                </>
                            )
                        }

                    </Row>
                </Form>
            }
            {
                isShowAddNew &&
                <Button type="primary" onClick={onAddNew} icon={<PlusOutlined/>}>
                    {textAddNew || 'Add new'}
                </Button>
            }
        </Flex>
    )
}

export default SearchTable;