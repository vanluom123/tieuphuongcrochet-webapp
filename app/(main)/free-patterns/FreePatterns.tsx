"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import { SegmentedValue } from "antd/es/segmented";
import { useRouter } from "next/navigation";

import HeaderPart from '@/app/components/header-part';
import ViewTable from '@/app/components/view-table';
import { ALL_ITEM, FILTER_LOGIC, FILTER_OPERATION, ROUTE_PATH, TRANSLATION_STATUS } from '@/app/lib/constant';
import { initialListParams, Filter, ListParams, DataTableState, Category, DataType } from '@/app/lib/definitions';
import { filterByText, mapNameFilters } from '@/app/lib/utils';
import { fetchFreePatterns } from '@/app/lib/service/freePatternService';

interface FreePatternProps {
	categories: Category[];
}

const FreePatterns = ({ categories }: FreePatternProps) => {
	const [state, setState] = useState<DataTableState>({
		loading: false,
		data: [],
		totalRecord: 0,
	});

	const [params, setParams] = useState(initialListParams);

	const router = useRouter();

	const memoizedParams = useMemo(() => params, [params]);

	const onPageChange = useCallback((current: number, pageSize: number) => {
		setParams(prev => ({
			...prev,
			pageNo: current - 1,
			pageSize,
		}));
	}, []);

	const onSearchFreePatterns = useCallback((value: string) => {
		const prodFilter: Filter = filterByText(value, 'name', 'description', 'author');
		const tempFilters = mapNameFilters(params.filters as Filter[], 'searchText', prodFilter);
		setParams(prev => ({
			...prev,
			filters: tempFilters,
		}));
	}, [params.filters]);

	const onTabChange = useCallback((key: React.Key) => {
		const categoryFilter: Filter = key === ALL_ITEM.key ? {} as Filter : {
			name: 'category',
			filterLogic: FILTER_LOGIC.ALL,
			filterCriteria: [
				{
					key: 'category.id',
					value: [`${key}`],
					operation: FILTER_OPERATION.IN
				}
			],
		};
		const tempFilters = mapNameFilters(params.filters as Filter[], 'category', categoryFilter);
		setParams(prev => ({
			...prev,
			filters: tempFilters,
		}));
	}, [params.filters]);

	const onStatusFilter = useCallback((value: SegmentedValue) => {
		const statusFilter: Filter = value === TRANSLATION_STATUS.ALL ? {} as Filter : {
			name: 'statusFilter',
			filterLogic: FILTER_LOGIC.ALL,
			filterCriteria: [
				{
					key: 'status',
					value,
					operation: FILTER_OPERATION.EQUAL
				}
			],
		};
		const tempFilters = mapNameFilters(params.filters as Filter[], 'statusFilter', statusFilter);
		setParams(prev => ({
			...prev,
			filters: tempFilters,
		}));
	}, [params.filters]);

	useEffect(() => {
		let isMounted = true;
		setState(prev => ({ ...prev, loading: true }));

		fetchFreePatterns(memoizedParams)
			.then(response => {
				if (!isMounted) return;
				if (!response) throw new Error('No response from server');

				setState({
					loading: false,
					data: response.data || [],
					totalRecord: response.totalRecords || 0
				});
			})
			.catch(error => {
				console.error('Error fetching free patterns:', error);
				if (isMounted) {
					setState({ loading: false, data: [], totalRecord: 0 });
				}
			});

		return () => { isMounted = false; };
	}, [memoizedParams]);

	return (
		<div className='shop-page scroll-animate'>
			<HeaderPart titleId='FreePattern.title' descriptionId='FreePattern.description' />
			<ViewTable
				mode='Pattern'
				onReadDetail={id => router.push(`${ROUTE_PATH.FREEPATTERNS}/${id}`)}
				dataSource={state.data}
				total={state.totalRecord}
				loading={state.loading}
				isShowTabs
				itemsTabs={categories as DataType[]}
				pageIndex={params.pageNo}
				pageSize={params.pageSize}
				onPageChange={onPageChange}
				onSearch={onSearchFreePatterns}
				onTabChange={onTabChange}
				onStatusFilter={onStatusFilter}
				isShowStatusFilter
			/>
		</div>
	);
}

export default FreePatterns;
