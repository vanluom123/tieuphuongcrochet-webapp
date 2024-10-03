"use client"
import { useState, useEffect } from "react";
import { SegmentedValue } from "antd/es/segmented";
import { useRouter } from "next/navigation";

import HeaderPart from "../components/header-part";
import ViewTable from "../components/view-table";
import { ALL_ITEM, FILTER_LOGIC, FILTER_OPERATION, ROUTE_PATH, TRANSLATION_STATUS } from "../lib/constant";
import { initialListParams, Filter, ListParams, DataTableState } from "../lib/definitions";
import { fetchCategories } from "../lib/service/categoryService";
import { filterByText, mapNameFilters } from "../lib/utils";
import { fetchFreePatterns } from "../lib/service/freePatternService";

const initialState: DataTableState = {
    loading: false,
    data: [],
    totalRecord: 0,
};

const FreePattern = () => {
	const [state, setState] = useState(initialState);
	const [params, setParams] = useState(initialListParams);
	const [categories, setCategories] = useState<any[]>([]);

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
		setState({ ...state, loading: true });
		fetchFreePatterns(params).then(({ data, totalRecords }) => {
			setState({ ...state, data, totalRecord: totalRecords });
			
		}).finally(() => {			
			setState(prevState => ({ ...prevState, loading: false }));
		});
	}, [params]);

	useEffect(() => {
		fetchCategories().then((data) => {
			setCategories(data);
		});
	}, []);

	const onSearchFreePatterns = (value: string) => {
		const prodFilter: Filter = filterByText(value, 'name', 'description');
		const tempFilters = mapNameFilters(params.filters as Filter[], 'searchText', prodFilter);

		const newParams = {
			...initialListParams,
			filters: tempFilters
		};
		setParams(newParams);
	}

	const onViewFreePattern = (id: React.Key) => {
		router.push(`${ROUTE_PATH.FREEPATTERNS}/${id}`);
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

    const onStatusFilter = (value: SegmentedValue) => {
		const statusFilter: Filter = value === TRANSLATION_STATUS.ALL ? {} as Filter :
			{
				name: 'statusFilter',
				filterLogic: FILTER_LOGIC.ALL,
				filterCriteria: [
					{
						key: 'status',
						value,
						operation: FILTER_OPERATION.EQUAL
					}
				],
			}
			;

		const tempFilters = mapNameFilters(params.filters as Filter[], 'statusFilter', statusFilter);

		const newParams: ListParams = {
			...initialListParams,
			filters: tempFilters
		};

		setParams(newParams);
	}

	return (
		<div className='shop-page scroll-animate'>
			<HeaderPart titleId='FreePattern.title' descriptionId='FreePattern.description' />
			<ViewTable
				mode='Pattern'
				onReadDetail={(id) => onViewFreePattern(id)}
				dataSource={state.data}
				total={state.totalRecord}
				loading={state.loading}
				isShowTabs
				itemsTabs={categories}
				pageIndex={params.pageNo}
				pageSize={params.pageSize}
				onPageChange={onPageChange}
				onSearch={onSearchFreePatterns}
				onTabChange={onTabChange}
				onStatusFilter={onStatusFilter}
				isShowStatusFilter
			/>
		</div>
	)
}

export default FreePattern;