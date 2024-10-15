'use client'
import { Flex, Alert } from "antd";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";

import ViewTable from "../components/view-table";
import { Filter, DataTableState, initialListParams } from "../lib/definitions";
import { filterByText } from "../lib/utils";
import { fetchBlogs } from "../lib/service/blogsService";
import { ROUTE_PATH } from "../lib/constant";

const initialState: DataTableState = {
	loading: false,
	data: [],
	totalRecord: 0,
};

const Blogs = () => {

	const [state, setState] = useState(initialState);
	const [params, setParams] = useState(initialListParams);

	const t = useTranslations("Blog");
	const router = useRouter();

	const onPageChange = (current: number, pageSize: number) => {
		const newParams = {
			...params,
			_pageNo: current - 1,
			_pageSize: pageSize,
		}
		setParams(newParams);
	}

	useEffect(() => {
		setState({ ...state, loading: true });
		fetchBlogs(params).then(({ data, totalRecords }) => {
			setState({ ...state, data, totalRecord: totalRecords });
		}).finally(() => {
			setState(prevState => ({ ...prevState, loading: false }));
		});
	}, [params]);

	const onSearchPosts = (value: string) => {
		const filters: Filter = filterByText(value, 'title');
		const newParams = {
			...initialListParams,
			filters: [filters]
		};
		setParams(newParams);
	}

	const onViewBlog = (id: React.Key) => {
		router.push(`${ROUTE_PATH.BLOG}/${id}`);
	};

	return (
		<Flex vertical className='blog-page scroll-animate' gap={30}>
			<Alert
				type='success'
				className="animation-alert"
				message={t('message')}
				description={t('description')}
				showIcon
			/>
			<ViewTable
				mode='Blog'
				onReadDetail={(id) => onViewBlog(id)}
				pageIndex={params.pageNo}
				pageSize={params.pageSize}
				dataSource={state.data}
				onPageChange={onPageChange}
				onSearch={onSearchPosts}
				total={state.totalRecord}
				loading={state.loading}
			/>
		</Flex>
	)
}

export default Blogs;
