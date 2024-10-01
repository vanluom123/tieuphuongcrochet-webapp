'use client'
import { useEffect, useState } from "react";
import HeaderPart from "../components/header-part";
import { ALL_ITEM, API_ROUTES, FILTER_LOGIC, FILTER_OPERATION } from "../lib/constant";
import { initialViewTableParams, Filter, ListParams, DataType, FileUpload, Product } from "../lib/definitions";
import { filterByText, getAvatar, mapImagesPreview, mapNameFilters } from "../lib/utils";
import ViewTable from "../components/view-table";
import { useTranslations } from "next-intl";
import { fetchProducts } from "../lib/service/productService";
import { fetchCategories } from "../lib/service/categoryService";

const mockCategories: DataType[] = [
	{
		name: 'Electronics',
		key: 'electronics',
		children: [
			{
				id: '1-1',
				name: 'Smartphones',
				key: 'smartphones',
			},
			{
				id: '1-2',
				name: 'Laptops',
				key: 'laptops',
			}
		]
	},
	{
		name: 'Clothing',
		key: 'clothing',
		children: [
			{
				id: '2-1',
				name: 'Men\'s Wear',
				key: 'mens-wear',
			},
			{
				id: '2-2',
				name: 'Women\'s Wear',
				key: 'womens-wear',
			}
		]
	},
	{
		name: 'Books',
		key: 'books',
	}
];

const Shop = () => {
	const [products, setProducts] = useState<DataType[]>([]);
	const [loading, setLoading] = useState(false);
	const [totalRecords, setTotalRecords] = useState(0);
	const [params, setParams] = useState(initialViewTableParams);
	const [categories, setCategories] = useState<any[]>([]);
	const t = useTranslations("Shop");

	const onPageChange = (current: number, pageSize: number) => {
		const newParams = {
			...params,
			pageNo: current - 1,
			pageSize: pageSize,
		}
		setParams(newParams)
	}

	useEffect(() => {
		setLoading(true);
		fetchProducts(params).then(({ data, totalRecords }) => {
			setProducts(data);
			setTotalRecords(totalRecords);
		}).finally(() => {
			setLoading(false);
		});
	}, [params]);

	useEffect(() => {
		fetchCategories().then((data) => {
			setCategories(data);
		});
	}, []);

	const onSearchProducts = (value: string) => {
		const filters: Filter = filterByText(value, 'name', 'description');
		const tempFilters = mapNameFilters(params.filters, 'searchText', filters);

		const newParams = {
			...initialViewTableParams,
			filters: tempFilters
		};
		setParams(newParams);
	}

	const onViewProduct = (id: React.Key) => {
		// navigate(`${ROUTE_PATH.SHOP}/${ROUTE_PATH.DETAIL}/${id}`);
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

		const tempFilters = mapNameFilters(params.filters, 'category', categoryFilter);

		const newParams: ListParams = {
			...initialViewTableParams,
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
				dataSource={products}
				total={totalRecords}
				loading={loading}
				isShowTabs
				itemsTabs={categories}
				pageIndex={params.pageNo}
				pageSize={params.pageSize}
				onPageChange={onPageChange}
				// onSeach={onSearchProducts}
				onTabChange={onTabChange}
			/>
		</div>
	)
}

export default Shop;