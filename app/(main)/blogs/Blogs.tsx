'use client'
import {Alert, Flex} from "antd";
import {useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import {useTranslations} from "next-intl";

import ViewTable from '@/app/components/view-table';
import {DataTableState, initialListParams} from '@/app/lib/definitions';
import {fetchBlogs} from '@/app/lib/service/blogsService';
import {ROUTE_PATH} from '@/app/lib/constant';
import {sfLike} from "spring-filter-query-builder";

interface BlogsProps {
    initialData: DataTableState
}

const Blogs = ({initialData}: BlogsProps) => {

    const [state, setState] = useState(initialData);
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
        setState(prevState => ({...prevState, loading: true}));
        fetchBlogs(params)
            .then(({data, totalRecords}) => {
                setState(prevState => ({...prevState, data, totalRecord: totalRecords}));
            }).finally(() => {
            setState(prevState => ({...prevState, loading: false}));
        });
    }, [params]);

    const onSearchPosts = (value: string) => {
        setParams(prev => {
            const newFilter = sfLike('title', value).toString();
            return {
                ...prev,
                filter: newFilter
            }
        })
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
