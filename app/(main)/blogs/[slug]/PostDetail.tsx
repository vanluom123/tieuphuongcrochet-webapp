'use client';

import ViewDetailWrapper from "@/app/components/view-detail-wrapper";
import { Post } from "@/app/lib/definitions";
import { Col, Flex, Row } from "antd";
import { getDateFormatted } from "@/app/lib/utils";
import { useLocale } from "use-intl";
import { LANGUAGES } from "@/app/lib/constant";
import CustomNextImage from "@/app/components/next-image";

export default function PostDetail({ post }: { post: Post }) {

	const locale = useLocale();

	const { title, content, createdDate, src } = post;

	return (
		<ViewDetailWrapper>
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
					<CustomNextImage src={src} alt={title} />
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