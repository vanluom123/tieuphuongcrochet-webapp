'use client';

import React from 'react';
import Link from 'next/link';
import { Card, Image } from 'antd';

import { ROUTE_PATH } from '@/app/lib/constant';
import { Post } from '@/app/lib/definitions';
import ReadMoreBtn from '../read-more';
import '../../ui/components/blogCard.scss';

interface BlogCardProps {
		item: Post,
		onReadDetail?: () => void;
	}

const BlogCard = ({ item, onReadDetail }: BlogCardProps) => {
	const { Meta } = Card;
	const { createdDate, title, src, id } = item;
	const detailPath = `${ROUTE_PATH.BLOG}/${id}`;

	const date = new Date(createdDate);
	const month = new Intl.DateTimeFormat('en', { month: 'short' }).format(date);
	const day = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(date);

	return (
		<Card
			className='card-article card-item'
			bordered={false}
			cover={
				<div className='artice-image'>
					<Image src={src} alt={title} />
					<div className='artice-date'>
						{/* <time > */}
						<time >
							{month}
							<span>{day}</span>
						</time>
					</div>
				</div>
			}
		>
			<Meta title={<Link href={detailPath} tabIndex={1} className='card-title' onClick={onReadDetail}>{title}</Link>}

			/>
			<ReadMoreBtn path={detailPath} />
		</Card>
	)
}

export default BlogCard;
