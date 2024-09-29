'use client'
import { useState } from "react";
import HeaderPart from "../components/header-part";
import { ALL_ITEM, FILTER_LOGIC, FILTER_OPERATION } from "../lib/constant";
import { initialViewTableParams, Filter, ListParams, DataType } from "../lib/definitions";
import { filterByText, mapNameFilters } from "../lib/utils";
import ViewTable from "../components/view-table";
import { useTranslations } from "next-intl";

const mockProductData: DataType[] = [
	{
		key: '1',
		name: 'Sample Product 1',
		price: 19.99,
		description: 'This is a sample product description.',
		images: [{ fileContent: 'base64encodedimage', fileName: 'product1.jpg', url: 'https://example.com/product1.jpg' }],
		src: 'https://example.com/product1.jpg',
		author: 'John Doe',
		currency_code: 'USD',
		imagesPreview: [{ src: 'https://example.com/product1.jpg', alt: 'Product 1' }],
		link: 'https://example.com/product/1',
		content: 'Detailed content about the product goes here.'
	},
	{
		key: '2',
		name: 'Sample Product 2',
		price: 29.99,
		description: 'Another sample product description.',
		images: [{ fileContent: 'base64encodedimage', fileName: 'product2.jpg', url: 'https://example.com/product2.jpg' }],
		src: 'https://example.com/product2.jpg',
		author: 'Jane Smith',
		currency_code: 'EUR',
		imagesPreview: [{ src: 'https://example.com/product2.jpg', alt: 'Product 2' }],
		link: 'https://example.com/product/2',
		content: 'More detailed content about this product.'
	}
];

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
	// const navigate = useNavigate();
	// const dispatch = useAppDispatch();
	// const productList: DataType[] = useAppSelector(selectProducts);
	// const totalRecords = useAppSelector(selectTotalRecords);
	// const loading = useAppSelector(selectLoading);
	// const categories = useAppSelector(state => state.category.data);

	const [params, setParams] = useState(initialViewTableParams);

	const t = useTranslations("Shop");

	const onPageChange = (current: number, pageSize: number) => {
		const newParams = {
			...params,
			_pageNo: current - 1,
			_pageSize: pageSize,
		}
		setParams(newParams)
	}


	// useEffect(() => {
	// 	dispatch(productAction.fetchData(params));
	// }, [params]);

	// useEffect(() => {
	// 	if (categories.length <= 0) {
	// 		dispatch(categoryAction.fetchData());
	// 	}
	// }, [categories.length, dispatch]);

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
				dataSource={mockProductData as DataType[]}
				total={48}
				loading={false}
				isShowTabs
				itemsTabs={mockCategories}
				pageIndex={params._pageNo}
				pageSize={params._pageSize}
				onPageChange={onPageChange}
				// onSeach={onSearchProducts}
				onTabChange={onTabChange}
			/>
		</div>
	)
}

export default Shop;