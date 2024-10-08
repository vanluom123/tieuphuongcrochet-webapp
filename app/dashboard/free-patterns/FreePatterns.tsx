'use client'
import { Tag } from 'antd';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { DataTableState, initialListParams, SearchParams, TTranslationStatus } from '@/app/lib/definitions';
import { getFilters, getStatusColor } from '@/app/lib/utils';
import { SegmentedValue } from 'antd/es/segmented';
import DataTable from '@/app/components/data-table';
import SearchTable from '@/app/components/data-table/SearchTable';
import { deleteFreePattern, fetchFreePatterns } from '@/app/lib/service/freePatternService';
import { ROUTE_PATH } from '@/app/lib/constant';


const initialState: DataTableState = {
	loading: false,
	data: [],
	totalRecord: 0,
};

const FreePatterns = () => {

    const [state, setState] = useState(initialState);
    const [params, setParams] = useState(initialListParams)

    const t = useTranslations('FreePattern');
    const router = useRouter();

    useEffect(() => {
        setState({ ...state, loading: true });
		fetchFreePatterns(params).then(({ data, totalRecords }) => {
			setState({ ...state, data, totalRecord: totalRecords });

		}).finally(() => {
			setState(prevState => ({ ...prevState, loading: false }));
		});
    }, [params]);

    const onEditRecord = (id: React.Key) => {
        router.push(`${ROUTE_PATH.DASHBOARD_FREE_PATTERNS}/${id}`)
    }

    const onDeleteRecord = async (rd: React.Key) => {
        await deleteFreePattern(rd as string)
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

    const onPageChange = (pagination: any, filters: any, sorter: any) => {
        const { current, pageSize } = pagination;
        const newParams = {
            ...params,
            _pageNo: current - 1,
            _pageSize: pageSize,
        }
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
