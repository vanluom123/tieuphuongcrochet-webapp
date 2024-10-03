'use client'
import ViewDetailWrapper from "@/app/components/view-detail-wrapper";
import { Post } from "@/app/lib/definitions";
import { Col, Flex, Row, Image } from "antd";
import { useEffect, useState } from "react";
import { getDateFormatted } from "@/app/lib/utils";
import { fetchPostDetail } from "@/app/lib/service/blogsService";
import { useLocale } from "use-intl";
import { LANGUAGES } from "@/app/lib/constant";

export default function ViewPost({ params }: { params: { slug: string } }) {
	const [state, setState] = useState({
		post: {} as Post,
		loading: false,
	});

	const locale = useLocale();

	useEffect(() => {
		if (params.slug) {
			setState({ ...state, loading: true });

			fetchPostDetail(params.slug).then(post => {
				setState({ ...state, post: post })
			}).finally(() => {
				setState(prevState => ({ ...prevState, loading: false }));
			});
		}
	}, [params.slug])

	const { post, loading } = state;
	const { title, content, createdDate, src } = post;

	return (
		<ViewDetailWrapper
			loading={loading}
		>
			<Row gutter={[30, 30]}>
				<Col xs={24} sm={12} className="text-box">
					<h1>{title}</h1>
					{createdDate &&
						<Flex justify="flex-end">
							{getDateFormatted(createdDate, locale === LANGUAGES.VN ? 'vi' : 'en')}
						</Flex>
					}
				</Col>
				<Col xs={24} sm={12}>
					<Image preview={false} src={src} alt={title} />
				</Col>
				<Flex style={{ width: '100%' }} justify="center">
					<hr />
				</Flex>
				<Col>
					<div className="editor-view text-box" dangerouslySetInnerHTML={{ __html: content }} />
				</Col>
			</Row>
		</ViewDetailWrapper>
	)
}