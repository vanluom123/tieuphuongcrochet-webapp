'use client'

import { SearchProps } from 'antd/es/input';
import { useEffect, useState } from 'react';
import { DataTableState, Filter, initialListParams } from '@/app/lib/definitions';
import { deletePost, fetchBlogs } from '@/app/lib/service/blogsService';
import { filterByText, mapNameFilters } from '@/app/lib/utils';
import SearchTable from '@/app/components/data-table/SearchTable';
import DataTable from '@/app/components/data-table';
import { ROUTE_PATH } from '@/app/lib/constant';
import { useRouter } from 'next/navigation';

const initialState: DataTableState = {
    loading: false,
    data: [],
    totalRecord: 0,
};

const Blogs = () => {
    const [state, setState] = useState(initialState);
    const [params, setParams] = useState(initialListParams)
    const router = useRouter();

    useEffect(() => {
        setState({ ...state, loading: true });
        fetchBlogs(params)
            .then(({ data, totalRecords }) => {
                setState({ ...state, data, totalRecord: totalRecords, loading: false });
            })
    }, [params]);

    const onEditRecord = (id: React.Key) => {
        router.push(`${ROUTE_PATH.DASHBOARD_POSTS}/${id}`)
    }

    const onDeleteRecord = (id: React.Key) => {
        deletePost(id as string)
    }

    const onSearch: SearchProps['onSearch'] = (value, _e, info) => {
        const filters: Filter = filterByText(value, 'title');
        const tempFilters = mapNameFilters(params.filters as Filter[], 'searchText', filters);

        const newParams = {
            ...params,
            filters: tempFilters
        }
        setParams(newParams);
    }

    const onPageChange = (pagination: any, filters: any, sorter: any) => {
        const { current, pageSize } = pagination;
        const newParams = {
            ...params,
            pageNo: current - 1,
            pageSize: pageSize,
        }
        setParams(newParams)
    }

    const customColumns = [
        {
            title: 'Show on home',
            dataIndex: 'is_home',
            render: (value: boolean) => value ? 'Yes' : 'No'
        },
        {
            title: 'Created Date',
            dataIndex: 'createdDate',
        }
    ];

    const onAddNew = () => {
        router.push(`${ROUTE_PATH.DASHBOARD_POSTS}/${ROUTE_PATH.CREATE}`)
    }

    return (
        <>
            <div className='blogs-admin'>
                <SearchTable onAddNew={onAddNew} onSearch={onSearch} />
                <div className='admin-table'>
                    <DataTable
                        loading={state.loading}
                        pageSize={params.pageSize}
                        pageIndex={params.pageNo}
                        isShowImage
                        visiblePagination
                        dataSource={state.data}
                        totalPageSize={state.totalRecord}
                        onEditRecord={onEditRecord}
                        onTableChange={onPageChange}
                        onDeleteRecord={onDeleteRecord}
                        customColumns={customColumns}
                    />
                </div>
            </div>
        </>
    )
}

export default Blogs;
