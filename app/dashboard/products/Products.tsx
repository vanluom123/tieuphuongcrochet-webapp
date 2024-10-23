'use client'
import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { Category, DataTableState, initialListParams, SearchParams } from '@/app/lib/definitions';
import DataTable from '@/app/components/data-table';
import SearchTable from '@/app/components/data-table/SearchTable';
import { deleteProduct, fetchProducts } from '@/app/lib/service/productService';
import { ROUTE_PATH } from '@/app/lib/constant';
import { fetchCategories } from '@/app/lib/service/categoryService';
import { DefaultOptionType } from 'antd/es/select';

const initialState: DataTableState = {
    loading: false,
    data: [],
    totalRecord: 0,
};

const Products = () => {
    const [state, setState] = useState(initialState);
    const [params, setParams] = useState(initialListParams)
	const categories = useRef<Category[]>([]);

    const t = useTranslations('Product');
    const router = useRouter();

    useEffect(() => {
        setState({ ...state, loading: true });
        Promise.all([
            fetchProducts(params),
            fetchCategories()
        ])
        .then(([{ data, totalRecords }, categoriesData]) => {
            setState({ ...state, data, totalRecord: totalRecords });
            categories.current = categoriesData as Category[];
        })
        .finally(() => {
            setState(prevState => ({ ...prevState, loading: false }));
        });
    }, [params]);

    const onEditRecord = (id: React.Key) => {
        router.push(`${ROUTE_PATH.DASHBOARD_PRODUCTS}/${id}`)
    }

    const onDeleteRecord = async (rd: React.Key) => {
        await deleteProduct(rd as string)
    }

    const columns = [
        {
            title: t('Fields.name'),
            dataIndex: 'name',
        },
        {
            title: t('Fields.price'),
            dataIndex: 'price',
        },
        {
            title: t('Fields.currency_code'),
            dataIndex: 'currency_code',
        },
    ]

    const onAddNew = () => {
        router.push(`${ROUTE_PATH.DASHBOARD_PRODUCTS}/${ROUTE_PATH.CREATE}`)
    }

    const onPageChange = (pagination: any) => {
        const { current, pageSize } = pagination;
        const newParams = {
            ...params,
            pageNo: current - 1,
            pageSize: pageSize,
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
            <div className='products-admin'>
                <SearchTable
                    isShowFilter
                    onAddNew={onAddNew}
                    onSearchChange={onSearchChange}
                    loading={state.loading}
                    searchFields={['name', 'description']}
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

export default Products;
