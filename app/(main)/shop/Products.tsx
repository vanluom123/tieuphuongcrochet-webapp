'use client'
import {useEffect, useState, useCallback} from "react";
import {useRouter} from "next/navigation";
import HeaderPart from '@/app/components/header-part';
import {ALL_ITEM, ROUTE_PATH} from '@/app/lib/constant';
import {Category, DataTableState, DataType, initialListParams} from '@/app/lib/definitions';
import ViewTable from '@/app/components/view-table';
import {fetchProducts} from '@/app/lib/service/productService';
import {sfLike, sfOr} from "spring-filter-query-builder";
import {debounce} from '@/app/lib/utils';

interface ProductsProps {
    initialData: DataTableState;
    categories: Category[];
}

const Products = ({initialData, categories}: ProductsProps) => {
    const [state, setState] = useState(initialData);
    const [params, setParams] = useState(initialListParams);

    const router = useRouter();

    const onPageChange = (current: number, pageSize: number) => {
        const newParams = {
            ...params,
            pageNo: current - 1,
            pageSize: pageSize,
        }
        setParams(newParams)
    }

    useEffect(() => {
        setState(prevState => ({...prevState, loading: true}));
        fetchProducts(params)
            .then(({data, totalRecords}) => {
                setState(prevState => ({...prevState, data, totalRecord: totalRecords}));
            }).finally(() => {
            setState(prevState => ({...prevState, loading: false}));
        });
    }, [params]);

    const onSearchProducts = (value: string) => {
        setParams(prevParams => {
            const newFilter = sfOr([
                sfLike('name', value),
                sfLike('description', value)
            ]).toString();
            return {
                ...prevParams,
                filter: newFilter
            }
        })
    }

    const onViewProduct = (id: React.Key) => {
        router.push(`${ROUTE_PATH.SHOP}/${id}`);
    };

    const onTabChange = (key: React.Key) => {
        setParams(prevParams => ({
            ...prevParams,
            categoryId: key === ALL_ITEM.key ? '' : key as string
        }));
    }

    return (
        <div className='shop-page scroll-animate'>
            <HeaderPart titleId='Shop.title' descriptionId='Shop.description'/>
            <ViewTable
                mode='Product'
                onReadDetail={(id) => onViewProduct(id)}
                dataSource={state.data}
                total={state.totalRecord}
                loading={state.loading}
                isShowTabs
                itemsTabs={categories as DataType[]}
                pageIndex={params.pageNo}
                pageSize={params.pageSize}
                onPageChange={onPageChange}
                onSearch={onSearchProducts}
                onTabChange={onTabChange}
            />
        </div>
    )
}

export default Products;