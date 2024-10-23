'use client'
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import HeaderPart from "../components/header-part";
import { ALL_ITEM, FILTER_LOGIC, FILTER_OPERATION, ROUTE_PATH } from "../lib/constant";
import { Filter, initialListParams, ListParams, DataTableState, Category, DataType } from "../lib/definitions";
import { filterByText, mapNameFilters } from "../lib/utils";
import ViewTable from "../components/view-table";
import { fetchProducts } from "../lib/service/productService";

interface ProductsProps {
	initialData: DataTableState	;
	categories: Category[];
}

const Products = ({ initialData, categories }: ProductsProps) => {
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
		if (params !== initialListParams) {
			setState({ ...state, loading: true });
			fetchProducts(params).then(({ data, totalRecords }) => {
				setState({ ...state, data, totalRecord: totalRecords });
			}).finally(() => {
				setState(prevState => ({ ...prevState, loading: false }));
			});
		}
	}, [params]);

	const onSearchProducts = (value: string) => {
		const prodFilter: Filter = filterByText(value, 'name', 'description');
		const tempFilters = mapNameFilters(params.filters as Filter[], 'searchText', prodFilter);

		const newParams = {
			...initialListParams,
			filters: tempFilters
		};
		setParams(newParams);
	}

	const onViewProduct = (id: React.Key) => {
		router.push(`${ROUTE_PATH.SHOP}/${id}`);
	};

	const onTabChange = (key: React.Key) => {
		const categoryFilter: Filter = key === ALL_ITEM.key ? {} as Filter :
			{
				name: 'category',
				filterLogic: FILTER_LOGIC.ALL,
				filterCriteria: [
					{
						key: 'category.id',
						value: [`${key}`],
						operation: FILTER_OPERATION.IN
					}
				],
			}
			;

		const tempFilters = mapNameFilters(params.filters as Filter[], 'category', categoryFilter);

		const newParams: ListParams = {
			...initialListParams,
			filters: tempFilters
		};

		setParams(newParams);
	}

	return (
		<div className='shop-page scroll-animate'>
			<HeaderPart titleId='Shop.title' descriptionId='Shop.description' />
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