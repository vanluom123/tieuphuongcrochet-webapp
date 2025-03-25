'use client'

import {SearchProps} from 'antd/es/input';
import {useEffect, useState, useCallback} from 'react';
import {DataTableState, initialListParams} from '@/app/lib/definitions';
import {deletePost, fetchBlogs} from '@/app/lib/service/blogsService';
import SearchTable from '@/app/components/data-table/SearchTable';
import DataTable from '@/app/components/data-table';
import {ROUTE_PATH} from '@/app/lib/constant';
import {useRouter} from 'next/navigation';
import {sfLike} from "spring-filter-query-builder";
import {debounce} from '@/app/lib/utils';

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
        setState(prevState => ({...prevState, loading: true}));
        fetchBlogs(params)
            .then(({data, totalRecords}) => {
                setState(prevState => ({...prevState, data, totalRecord: totalRecords}));
            })
            .finally(() => {
                setState(prevState => ({...prevState, loading: false}));
            });
    }, [params]);

    const onEditRecord = (id: React.Key) => {
        router.push(`${ROUTE_PATH.DASHBOARD_POSTS}/${id}`)
    }

    const onDeleteRecord = (id: React.Key) => {
        deletePost(id as string)
    }

    const debouncedSearch = useCallback(
        debounce((value: string) => {
            setParams(prev => {
                const newFilter = sfLike('title', value).toString();
                return {
                    ...prev,
                    filter: newFilter
                }
            })
        }, 500),
        []
    );

    const onSearch: SearchProps['onSearch'] = (value) => {
        debouncedSearch(value);
    }

    const onPageChange = (pagination: any) => {
        const {current, pageSize} = pagination;
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
                <SearchTable onAddNew={onAddNew} onSearch={onSearch}/>
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
