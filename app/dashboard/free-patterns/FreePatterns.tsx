'use client'
import { Tag } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { Category, DataTableState, initialListParams, SearchParams, TTranslationStatus } from '@/app/lib/definitions';
import { getStatusColor } from '@/app/lib/utils';
import { SegmentedValue } from 'antd/es/segmented';
import DataTable from '@/app/components/data-table';
import SearchTable from '@/app/components/data-table/SearchTable';
import { deleteFreePattern, fetchFreePatterns } from '@/app/lib/service/freePatternService';
import { ROUTE_PATH } from '@/app/lib/constant';
import { fetchCategories } from '@/app/lib/service/categoryService';
import { DefaultOptionType } from 'antd/es/select';


const initialState: DataTableState = {
    loading: false,
    data: [],
    totalRecord: 0,
};

const FreePatterns = () => {

    const [state, setState] = useState(initialState);
    const [params, setParams] = useState(initialListParams);
    const categories = useRef<Category[]>([]);

    const t = useTranslations('FreePattern');
    const router = useRouter();

    useEffect(() => {
        fetchCategories().then((data) => {
            categories.current = data as Category[];
        })
    }, []);

    useEffect(() => {
        setState(prevState => ({ ...prevState, loading: true }));
        fetchFreePatterns(params).then(({ data, totalRecords }) => {
            setState(prevState => ({ ...prevState, data, totalRecord: totalRecords }));
        }).finally(() => {
            setState(prevState => ({ ...prevState, loading: false }));
        });
    }, [params]);

    const onEditRecord = (id: React.Key) => {
        router.push(`${ROUTE_PATH.DASHBOARD_FREE_PATTERNS}/${id}`)
    }

    const onDeleteRecord = async (rd: React.Key) => {
        try {
            await deleteFreePattern(rd as string);
            // Refresh the data after successful deletion
            setState(prevState => ({ ...prevState, loading: true }));
            const { data, totalRecords } = await fetchFreePatterns(params);
            setState(prevState => ({ ...prevState, data, totalRecord: totalRecords }));
        } catch (error) {
            console.error('Error deleting pattern:', error);
        } finally {
            setState(prevState => ({ ...prevState, loading: false }));
        }
    }

    const columns = [
        {
            title: t('Fields.category'),
            dataIndex: 'category',
            render: (category: any) => (
                <span>{category?.name}</span>
            )
        },
        {
            title: t('Fields.author'),
            dataIndex: 'author',
            width: '25%',
        },
        {
            title: t('Fields.is_home'),
            dataIndex: 'is_home',
            render: (value: boolean) => value ? 'Yes' : 'No'
        },
        {
            title: t('Fields.status'),
            dataIndex: 'status',
            render: (value: SegmentedValue) => (
                <Tag className='status-tag' color={getStatusColor(value as TTranslationStatus)}>
                    {
                        value ? t(`status.${value}`) :
                            t('status.NONE')
                    }
                </Tag>
            )
        },
    ]

    const onAddNew = () => {
        router.push(`${ROUTE_PATH.DASHBOARD_FREE_PATTERNS}/${ROUTE_PATH.CREATE}`)
    }

    const onPageChange = (pagination: any) => {
        const { current, pageSize } = pagination;
        const newParams = {
            ...params,
            pageNo: current - 1,
            pageSize: pageSize,
        }
        console.log("newParams", newParams);
        setParams(newParams)
    }

    const onSearchChange = (searchParams: SearchParams) => {

        const newParams = {
            ...params,
            ...searchParams
        }
        setParams(newParams)
    }

    return (
        <>
            <div className='patterns-admin'>
                <SearchTable
                    isShowFilter
                    onAddNew={onAddNew}
                    onSearchChange={onSearchChange}
                    loading={state.loading}
                    searchFields={['name', 'author', 'description']}
                    isShowStatusFilter
                    categories={categories.current as DefaultOptionType[]}
                />
                <div className='admin-table'>
                    <DataTable
                        loading={state.loading}
                        pageSize={params.pageSize}
                        pageIndex={params.pageNo}
                        isShowImage
                        visiblePagination
                        dataSource={state.data}
                        customColumns={columns}
                        totalPageSize={state.totalRecord}
                        onEditRecord={onEditRecord}
                        onTableChange={onPageChange}
                        onDeleteRecord={onDeleteRecord}
                    />
                </div>
            </div>
        </>
    )
}

export default FreePatterns;
