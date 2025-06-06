'use client'
import {SearchProps} from 'antd/es/input';
import {DataTableState, DataType, initialListParams} from '@/app/lib/definitions';
import {useEffect, useState, useCallback} from 'react';
import DataTable from '@/app/components/data-table';
import SearchTable from '@/app/components/data-table/SearchTable';
import {deleteUser, fetchUsers} from '@/app/lib/service/userService';
import {useRouter} from 'next/navigation';
import {ROUTE_PATH} from '@/app/lib/constant';
import {sfLike, sfOr} from "spring-filter-query-builder";
import {debounce} from '@/app/lib/utils';
import Link from "next/link";

const initialState: DataTableState = {
    loading: false,
    data: [],
    totalRecord: 0,
};

const Users = () => {
    const [params, setParams] = useState(initialListParams)
    const router = useRouter();
    const [state, setState] = useState(initialState);
    useEffect(() => {
        setState(prevState => ({...prevState, loading: true}));
        fetchUsers(params)
            .then(({data, totalRecords}) => {
                setState(prevState => ({...prevState, data: data as DataType[], totalRecord: totalRecords}));
            }).finally(() => {
            setState(prevState => ({...prevState, loading: false}));
        });
    }, [params]);

    const onEditRecord = (id: React.Key) => {
        router.push(`${ROUTE_PATH.DASHBOARD_USERS}/${id}`);
    }

    const onDeleteRecord = (id: React.Key) => {
        deleteUser(id as string);
    }

    const debouncedSearch = useCallback(
        debounce((value: string) => {
            setParams(prev => {
                const newFilter = sfOr([
                    sfLike('name', value),
                    sfLike('email', value)
                ]).toString();
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

    const columns = [
        {
            title: 'Id',
            dataIndex: 'id',
            render: (value: string) => (
                <Link href={`${ROUTE_PATH.PROFILE}/${value}`}>{value}</Link>
            )
        },
        {
            title: 'Email',
            dataIndex: 'email'
        },
        {
            title: 'Role',
            dataIndex: 'role',
        },
        {
            title: 'Created date',
            dataIndex: 'createdDate',
        },
        {
            title: 'Last modified date',
            dataIndex: 'lastModifiedDate',
        },
    ]
    return (
        <>
            <div className='users-admin'>
                <SearchTable isShowAddNew={false} onSearch={onSearch} loading={state.loading} onAddNew={() => {
                }}/>
                <div className='admin-table'>
                    <DataTable
                        loading={state.loading}
                        dataSource={state.data}
                        onDeleteRecord={onDeleteRecord}
                        onEditRecord={onEditRecord}
                        customColumns={columns}
                        totalPageSize={state.totalRecord}
                        pageSize={params.pageSize}
                        pageIndex={params.pageNo}
                        visiblePagination
                        onTableChange={onPageChange}
                    />
                </div>
            </div>
        </>
    )
}

export default Users;
